import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData } from '@polyend/tracker-lib';
import { InstrumentNode } from '@/types/audio-engine.ts';
import AudioUtils from '@/audio/utils/audioutils.ts';

export function panning(out: InstrumentNode, instrument: InstrumentData, gate: ElemNode) {
  let { left, right } = out;

  const baseAngle = (instrument.panning + 1) * 0.25 * Math.PI;
  let panMod: ElemNode | number = 0;
  if (instrument.automations[1].enabled) {
    panMod = AudioUtils.createPanningAutomation(instrument, gate);
  }
  const panDepth = 0.5 * Math.PI;
  let angle = el.add(baseAngle, el.mul(panMod, panDepth));
  // Clamp the final angle to the valid range [0, PI/2] to prevent weirdness
  angle = el.max(0, el.min(0.5 * Math.PI, angle));

  const gainL = el.cos(angle);
  const gainR = el.sin(angle);

  left = el.mul(gainL, left);
  right = el.mul(gainR, right);

  return { left, right };
}
