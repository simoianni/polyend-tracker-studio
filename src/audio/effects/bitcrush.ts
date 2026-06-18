import { el } from '@elemaudio/core';
import { InstrumentNode } from '@/types/audio-engine.ts';

export function bitcrush(out: InstrumentNode, bitdepth: number) {
  let { left, right } = out;
  left = reduce(left, bitdepth);
  right = reduce(right, bitdepth);

  return { left, right };
}

function reduce(signal: any, bits: number) {
  const levels = Math.pow(2, bits - 1) - 1;
  const scaled = el.mul(signal, levels);
  const rounded = el.floor(el.add(scaled, 0.5));
  return el.div(rounded, levels);
}
