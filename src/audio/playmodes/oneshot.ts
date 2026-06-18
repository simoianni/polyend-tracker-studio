import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData, MAX_16BIT } from '@polyend/tracker-lib';
import AudioUtils from '@/audio/utils/audioutils.ts';

let inc = 0;

export function oneshot(path: string, instrument: InstrumentData, pitch: ElemNode, gate: ElemNode) {
  const id = `oneshot-${inc}`;

  const env = AudioUtils.createVolumeAutomation(instrument, gate);

  const sampleLength = instrument.sample.length;
  const startOffset = Math.floor(sampleLength * (instrument.startPoint / MAX_16BIT));
  const stopOffset = sampleLength - Math.floor(sampleLength * (instrument.endPoint / MAX_16BIT));
  const left = el.mul(
    env,
    el.sample(
      {
        path: `${path}:l`,
        key: `${id}:l`,
        mode: 'gate',
        startOffset,
        stopOffset,
      },
      1, // may need to be gate
      pitch,
    ),
  );
  const right = el.mul(
    env,
    el.sample(
      {
        path: `${path}:r`,
        key: `${id}:r`,
        mode: 'gate',
        startOffset,
        stopOffset,
      },
      1, // may need to be gate
      pitch,
    ),
  );

  inc++;
  return { id, left, right };
}
