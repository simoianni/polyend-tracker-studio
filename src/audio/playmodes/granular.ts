import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData, GranularType, GranularShape } from '@polyend/tracker-lib';
import AudioUtils from '@/audio/utils/audioutils.ts';

let inc = 0;

export function granular(path: string, instrument: InstrumentData, pitch: ElemNode, gate: ElemNode) {
  const id = `granular-${inc}`;
  const env = AudioUtils.createVolumeAutomation(instrument, gate);
  const sampleLength = instrument.sample.length;
  const gran = instrument.granular;
  const grainLength = gran.grainLength ?? 441;
  const basePosition = el.const({ key: `${id}-pos`, value: gran.currentPosition ?? 0 });
  const shape = gran.shape ?? GranularShape.Square;

  // Position modulation
  let modulatedPos: ElemNode = basePosition;
  if (instrument.automations[4].enabled) {
    const posAutomation = AudioUtils.createGranularAutomation(instrument, gate);
    const scaledPosAutomation = el.mul(posAutomation, sampleLength);
    modulatedPos = el.add(basePosition, scaledPosAutomation);
  }
  const clampedPos = el.max(0, el.min(sampleLength - 1, modulatedPos));

  // Note-on and elapsed time
  const isOn = el.geq(gate, 0.5);
  const noteOnPulse = el.max(0, el.sub(isOn, el.z(isOn)));
  const startTime = el.latch(noteOnPulse, el.time());
  const elapsed = el.sub(el.time(), startTime);

  // Keep your working grain timing
  const grainPos = el.mod(elapsed, grainLength);

  // BETTER boundary detection: Use a threshold approach
  const grainPhase = el.div(grainPos, grainLength);
  const prevGrainPhase = el.z(grainPhase);

  // Detect when we cross from near 1.0 back to near 0.0
  const nearEnd = el.geq(prevGrainPhase, 0.9);
  const nearStart = el.leq(grainPhase, 0.1);
  const grainWrap = el.and(nearEnd, nearStart);

  // Latch position at boundary
  const latchedPos = el.latch(grainWrap, clampedPos);

  // Direction latching
  const dirConst = el.const({ key: `${id}-dir`, value: gran.type ?? GranularType.Forward });
  const latchedDir = el.latch(grainWrap, dirConst);

  // Build directionally adjusted grainPos (for envelope timing)
  const isBackward = el.eq(latchedDir, GranularType.Backward);
  const isPingPong = el.eq(latchedDir, GranularType.PingPong);

  const backwardPos = el.sub(grainLength, grainPos);
  const tri = el.sub(1, el.abs(el.sub(el.mul(2, el.div(grainPos, grainLength)), 1)));
  const pingpongPos = el.mul(tri, grainLength);

  const forwardOrBackward = el.select(isBackward, backwardPos, grainPos);
  const directedGrainPos = el.select(isPingPong, pingpongPos, forwardOrBackward);

  // Grain envelope (uses normal grain timing)
  const t = el.div(grainPos, grainLength);
  let shapeEnv: ElemNode;
  if (shape === GranularShape.Square) {
    shapeEnv = el.const({ value: 1 });
  } else if (shape === GranularShape.Triangle) {
    shapeEnv = el.sub(1, el.abs(el.sub(el.mul(2, t), 1)));
  } else {
    shapeEnv = el.exp(el.mul(-12, el.pow(el.sub(t, 0.5), 2)));
  }

  // Apply pitch only when reading the sample
  const correctedPitch = el.mul(pitch, 0.5);
  const sampleReadPos = el.mul(directedGrainPos, correctedPitch);
  const posFrames = el.add(latchedPos, sampleReadPos);

  // Clamp to prevent out-of-bounds reading
  const safePosFrames = el.max(0, el.min(sampleLength - 1, posFrames));

  const left = el.mul(env, shapeEnv, el.table({ path: `${path}:l` }, el.div(safePosFrames, sampleLength)));
  const right = el.mul(env, shapeEnv, el.table({ path: `${path}:r` }, el.div(safePosFrames, sampleLength)));

  inc++;
  return { id, left, right };
}
