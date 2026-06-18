import { el, ElemNode } from '@elemaudio/core';
import { InstrumentNode } from '@/types/audio-engine.ts';

/**
 * A custom waveshaper that replicates the Tracker's 3-stage overdrive algorithm.
 * @param x Input signal, expected to be pre-multiplied by the gain stage.
 */
function trackerOverdrive(x: ElemNode): ElemNode {
  const x_abs = el.abs(x);

  // Create masks for the three regions based on the input signal's absolute value.
  // The thresholds 0.25 and 0.5 correspond to the integer thresholds in the C++ source.
  const low_mask = el.le(x_abs, 0.25); // |x| <= 0.25
  const high_mask = el.ge(x_abs, 0.5); // |x| >= 0.5
  const mid_mask = el.sub(1, el.add(low_mask, high_mask)); // The remainder

  // --- Output for each region ---

  // 1. Low region: y = 3x
  const low_out = el.mul(x, 3);

  // 2. Mid region: A quadratic curve that connects the low and high regions.
  // The original formula is y = (4 - (2 - 4|x|)^2) / 4 * sign(x).
  // This simplifies to y = 4x - 4x|x|
  const mid_out = el.sub(el.mul(4, x), el.mul(4, x, x_abs));

  // 3. High region: Hard clip, y = sign(x)
  // const high_out = elSign(x);
  const high_out = el.select(el.ge(x, 0), 1, -1);

  // Sum the outputs of the three regions, multiplied by their respective masks.
  // Since the masks are mutually exclusive, only one region will be active at a time.
  return el.add(el.mul(low_mask, low_out), el.mul(mid_mask, mid_out), el.mul(high_mask, high_out));
}

export function overdrive(out: InstrumentNode, overdrive: number = 0) {
  let { left, right } = out;

  // If overdrive is 0, the effect is completely bypassed in the original source.
  if (overdrive === 0) {
    return { left, right };
  }

  // Map the instrument's overdrive property (0-100) to the C++ gain multiplier.
  // The C++ formula is: gain = (overdrive * 8 + 128) / 256;
  const gain = (overdrive * 8 + 128) / 256;

  // Apply the gain and then the custom waveshaper
  left = trackerOverdrive(el.mul(left, gain));
  right = trackerOverdrive(el.mul(right, gain));

  return { left, right };
}
