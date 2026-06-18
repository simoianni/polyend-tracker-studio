import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData, InstrumentPlayMode, MAX_16BIT } from '@polyend/tracker-lib';
import AudioUtils from '@/audio/utils/audioutils.ts';

let inc = 0;

export function looped(path: string, instrument: InstrumentData, pitch: ElemNode, gate: ElemNode) {
  const id = `looped-${inc}`;

  const env = AudioUtils.createVolumeAutomation(instrument, gate);

  const sampleLength = instrument.sample.length;
  const loopPoint1 = instrument.loopPoint1 * (instrument.sample.length / MAX_16BIT);
  const loopPoint2 = instrument.loopPoint2 * (instrument.sample.length / MAX_16BIT);

  const loopStart = AudioUtils.clamp(loopPoint1, 0, sampleLength - 2);
  const loopEnd = AudioUtils.clamp(loopPoint2, loopStart + 1, sampleLength - 1);
  const loopSpan = loopEnd - loopStart;

  const mode = instrument.playmode;

  // --- Note-on detection ---
  const isOn = el.geq(gate, 0.5);
  const noteOnPulse = el.max(0, el.sub(isOn, el.z(isOn)));

  // Read tables
  const left = el.mul(
    env,
    makeLoopedRead(path, 'l', pitch, noteOnPulse, sampleLength, loopStart, loopEnd, loopSpan, mode),
  );
  const right = el.mul(
    env,
    makeLoopedRead(path, 'r', pitch, noteOnPulse, sampleLength, loopStart, loopEnd, loopSpan, mode),
  );

  inc++;
  return { id, left, right };
}

function makeLoopedRead(
  name: string,
  channel: 'l' | 'r',
  pitch: ElemNode | number,
  noteOnPulse: ElemNode,
  totalLen: number,
  loopStart: number,
  loopEnd: number,
  loopSpan: number,
  mode: InstrumentPlayMode,
): ElemNode {
  // By integrating the pitch signal, we get the correct sample position even
  // when the pitch is changing over time (e.g. from an LFO).
  const rawPos = el.accum(pitch, noteOnPulse);
  const hasStartedLooping = el.geq(rawPos, loopEnd);

  // Position calculation when looping
  const rawPosInLoop = el.sub(rawPos, loopEnd);
  let loopPos: ElemNode;

  if (mode === InstrumentPlayMode.ForwardLoop) {
    const posInLoop = el.mod(rawPosInLoop, loopSpan);
    loopPos = el.add(loopStart, posInLoop);
  } else if (mode === InstrumentPlayMode.BackwardLoop) {
    const posInLoop = el.mod(rawPosInLoop, loopSpan);
    loopPos = el.sub(loopEnd, posInLoop);
  } else {
    // PingpongLoop
    const posInPingPong = el.mod(rawPosInLoop, 2 * loopSpan);
    const isForward = el.le(posInPingPong, loopSpan);
    const forwardPos = el.add(loopStart, posInPingPong);
    const backwardPos = el.sub(loopEnd, el.sub(posInPingPong, loopSpan));
    loopPos = el.select(isForward, forwardPos, backwardPos);
  }

  const finalPos = el.select(hasStartedLooping, loopPos, rawPos);
  return el.table({ path: `${name}:${channel}` }, el.div(finalPos, totalLen));
}
