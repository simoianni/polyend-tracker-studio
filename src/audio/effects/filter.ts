import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData, InstrumentFilterType } from '@polyend/tracker-lib';
import { InstrumentNode } from '@/types/audio-engine.ts';
import AudioUtils from '@/audio/utils/audioutils.ts';

let inc = 0;

// --- Corrected values based on original source code ---

// The C++ code generates this table with the formula:
// 20.0f * powf(2.0f, idx / 50.0f)
// This creates an exponential frequency curve.
const FILTER_FREQS = Array.from({ length: 478 }, (_, i) => 20.0 * Math.pow(2.0, i / 50.0));
const MAX_FREQ_INDEX = 477;

// The C++ code clamps resonance (q) between 0.7 and 5.0.
// We will map the instrument's 0.0-1.0 resonance value to this range.
const MIN_Q = 0.7;
const MAX_Q = 5.0;

// --- End of corrected values ---

export function filter(out: InstrumentNode, instrument: InstrumentData, gate: ElemNode) {
  let { left, right } = out;

  const filterType = instrument.filterType;

  // Correctly map the 0.0-1.0 resonance to the 0.7-5.0 range
  const resonance = MIN_Q + instrument.resonance * (MAX_Q - MIN_Q);

  const index = Math.floor(instrument.cutoff * MAX_FREQ_INDEX);
  const minFrequency = FILTER_FREQS[index];

  let freq: ElemNode | number = minFrequency;

  const cutoffEnv = instrument.automations[2];
  if (cutoffEnv.enabled) {
    const env = AudioUtils.createCutoffAutomation(instrument, gate);
    const amount = cutoffEnv.envelope.amount;
    const index = Math.floor(amount * MAX_FREQ_INDEX);
    const maxFrequency = FILTER_FREQS[index];

    freq = el.add(el.const({ key: `filter-${inc}:env`, value: minFrequency }), el.mul(env, maxFrequency));
    inc++;
  }

  if (filterType === InstrumentFilterType.LowPass) {
    left = el.lowpass(freq, resonance, left);
    right = el.lowpass(freq, resonance, right);
  } else if (filterType === InstrumentFilterType.HighPass) {
    left = el.highpass(freq, resonance, left);
    right = el.highpass(freq, resonance, right);
  } else if (filterType === InstrumentFilterType.BandPass) {
    left = el.bandpass(freq, resonance, left);
    right = el.bandpass(freq, resonance, right);
  }

  return { left, right };
}
