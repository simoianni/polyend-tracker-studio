import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData, MAX_16BIT } from '@polyend/tracker-lib';
import AudioUtils from '@/audio/utils/audioutils.ts';

let inc = 0;

export function beatslice(path: string, instrument: InstrumentData, note: number, gate: ElemNode) {
  const id = `beatslice-${inc}`;

  const env = AudioUtils.createVolumeAutomation(instrument, gate);

  const sampleLength = instrument.sample.length;

  // Ensure slices exist
  const slices: number[] = instrument.slices ?? [];
  const numSlices = instrument.numSlices;

  if (numSlices === 0) {
    const left = el.mul(env, el.table({ path: `${path}:l` }, el.div(el.mul(0, el.time()), sampleLength)));
    const right = el.mul(env, el.table({ path: `${path}:r` }, el.div(el.mul(0, el.time()), sampleLength)));
    inc++;
    return { id, left, right };
  }

  // Map note to slice index
  // Max 48 slices mapped from lowest note = 0 to highest note = 47
  const sliceIdx = AudioUtils.clamp(Math.floor(note - 60), 0, numSlices - 1);
  const startPos = slices[sliceIdx];
  const endPos = sliceIdx < numSlices - 1 ? slices[sliceIdx + 1] : sampleLength;
  const sliceStart = startPos * (instrument.sample.length / MAX_16BIT);
  const sliceEnd = endPos * (instrument.sample.length / MAX_16BIT);

  // --- Note-on detection and elapsed time ---
  const isOn = el.geq(gate, 0.5);
  const noteOnPulse = el.max(0, el.sub(isOn, el.z(isOn)));
  const startTime = el.latch(noteOnPulse, el.time());
  const elapsed = el.sub(el.time(), startTime);

  // Current read position within slice
  const posFrames = el.add(sliceStart, elapsed);

  // Don't read past slice end
  const slicePos = el.min(posFrames, sliceEnd);

  // Table reads
  const left = el.mul(env, el.table({ path: `${path}:l` }, el.div(slicePos, sampleLength)));
  const right = el.mul(env, el.table({ path: `${path}:r` }, el.div(slicePos, sampleLength)));

  inc++;
  return { id, left, right };
}
