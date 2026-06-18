import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData } from '@polyend/tracker-lib';
import AudioUtils from '@/audio/utils/audioutils.ts';

let inc = 0;

export function wavetable(path: string, instrument: InstrumentData, pitch: ElemNode, gate: ElemNode) {
  const id = `wavetable-${inc}`;

  const env = AudioUtils.createVolumeAutomation(instrument, gate);

  const sampleLength = instrument.sample.length;

  const windowCount = instrument.sample.wavetable.windowCount ?? 1;
  const windowSize = instrument.sample.wavetable.windowSize ?? sampleLength;
  const baseWindow = el.const({ key: `${id}:window`, value: instrument.wavetableCurrentWindow ?? 0 });

  let smoothAutomation: ElemNode | number = 0;
  if (instrument.automations[3].enabled) {
    smoothAutomation = AudioUtils.createWavetableAutomation(instrument, gate);
  }
  const scaledAutomation = el.mul(smoothAutomation, windowCount - 1);
  const modulatedWindow = el.add(baseWindow, scaledAutomation);
  const currentWindow = el.max(0, el.min(windowCount - 1, modulatedWindow));

  const winIndex = el.floor(currentWindow);
  const frac = el.sub(currentWindow, winIndex);
  const nextIndex = el.min(el.add(winIndex, 1), windowCount - 1);

  // Note-on detection and elapsed time
  const isOn = el.geq(gate, 0.5);
  const noteOnPulse = el.max(0, el.sub(isOn, el.z(isOn)));
  const startTime = el.latch(noteOnPulse, el.time());
  const elapsed = el.sub(el.time(), startTime);

  const correctedPitch = el.mul(pitch, 6.0); // pitch correction
  const phaseFull = el.mod(el.mul(correctedPitch, elapsed), sampleLength);

  // Phase inside current windows
  const loopPosA = el.add(el.mul(winIndex, windowSize), el.mod(phaseFull, windowSize));
  const loopPosB = el.add(el.mul(nextIndex, windowSize), el.mod(phaseFull, windowSize));

  // Table reads
  const leftA = el.table({ path: `${path}:l` }, el.div(loopPosA, sampleLength));
  const leftB = el.table({ path: `${path}:l` }, el.div(loopPosB, sampleLength));
  const rightA = el.table({ path: `${path}:r` }, el.div(loopPosA, sampleLength));
  const rightB = el.table({ path: `${path}:r` }, el.div(loopPosB, sampleLength));

  // Interpolate between A and B
  let left = el.mul(env, el.add(el.mul(el.sub(1, frac), leftA), el.mul(frac, leftB)));
  let right = el.mul(env, el.add(el.mul(el.sub(1, frac), rightA), el.mul(frac, rightB)));

  // Apply a soft clipper to prevent extreme loudness
  const gain = 0.75;
  left = el.tanh(el.mul(gain, left));
  right = el.tanh(el.mul(gain, right));

  inc++;
  return { id, gate, left, right };
}
