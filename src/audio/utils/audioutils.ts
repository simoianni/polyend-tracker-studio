import { el, ElemNode } from '@elemaudio/core';
import {
  Automation,
  InstrumentData,
  Envelope,
  LFO,
  LFO_SHAPE,
  VOLUME_LFO_RATES,
  DEFAULT_LFO_RATES,
} from '@polyend/tracker-lib';

export default class AudioUtils {
  static createVolumeAutomation(instrument: InstrumentData, gate: ElemNode): ElemNode {
    return this.createAutomation(instrument.automations[0], gate, true);
  }

  static createPanningAutomation(instrument: InstrumentData, gate: ElemNode): ElemNode {
    return this.createAutomation(instrument.automations[1], gate);
  }

  static createCutoffAutomation(instrument: InstrumentData, gate: ElemNode): ElemNode {
    return this.createAutomation(instrument.automations[2], gate);
  }

  static createWavetableAutomation(instrument: InstrumentData, gate: ElemNode): ElemNode {
    return this.createAutomation(instrument.automations[3], gate);
  }

  static createGranularAutomation(instrument: InstrumentData, gate: ElemNode): ElemNode {
    return this.createAutomation(instrument.automations[4], gate);
  }

  static createPitch(note: number, instrument: InstrumentData, gate: ElemNode): ElemNode {
    const automation = instrument.automations[5];
    let node: ElemNode | number = 0;
    if (automation.enabled) {
      node = this.createAutomation(automation, gate);
    }

    const noteNode = el.const({ value: note - 60 });
    const tuneNode = el.const({ value: instrument.tune });
    const fineTuneNode = el.const({ value: instrument.finetune / 100 });
    const baseSemitones = el.add(noteNode, tuneNode, fineTuneNode);
    const totalSemitones = el.add(baseSemitones, node);
    return el.pow(2, el.div(totalSemitones, 12));
  }

  static createEnvelope(options: Envelope, gate: ElemNode): ElemNode {
    const factor = 0.0021;
    const attack = el.mul(options.attack, factor);
    const decay = el.mul(options.decay, factor);
    const release = el.mul(options.release, factor);
    return el.mul(options.amount, el.adsr(attack, decay, options.sustain, release, gate));
  }

  static createLFO(options: LFO, envelope: ElemNode, isAmp: boolean = false): ElemNode {
    const lfoHz = this.lfoSpeedToHz(options.speed, 130, isAmp);

    let lfo: ElemNode;
    switch (options.shape) {
      case LFO_SHAPE.RevSaw:
        lfo = el.sub(1, el.mul(2, el.phasor(lfoHz)));
        break;
      case LFO_SHAPE.Saw:
        lfo = el.sub(el.mul(2, el.phasor(lfoHz)), 1);
        break;
      case LFO_SHAPE.Triangle:
        lfo = isAmp ? el.triangle(lfoHz * 0.5) : el.triangle(lfoHz);
        break;
      case LFO_SHAPE.Square:
        lfo = isAmp
          ? el.sub(el.mul(2, el.geq(el.phasor(lfoHz * 0.5), 0.5)), 1)
          : el.sub(el.mul(2, el.geq(el.phasor(lfoHz), 0.5)), 1);
        break;
      case LFO_SHAPE.Random:
        lfo = el.sub(el.mul(2, el.latch(el.train(lfoHz), el.rand())), 1);
        break;
      default:
        lfo = 1;
    }

    return el.mul(envelope, el.mul(options.amount, lfo));
  }

  private static createAutomation(automation: Automation, gate: ElemNode, isAmp: boolean = false): ElemNode | number {
    const env: ElemNode = el.adsr(0, 0, 1, 0, gate);
    if (automation.enabled && !automation.isLFO) {
      return AudioUtils.createEnvelope(automation.envelope, gate);
    } else if (automation.enabled && automation.isLFO) {
      return AudioUtils.createLFO(automation.lfo, env, isAmp);
    }
    return env;
  }

  private static lfoSpeedToHz(speed: number, bpm: number, isAmp: boolean = false): number {
    const table = isAmp ? VOLUME_LFO_RATES : DEFAULT_LFO_RATES;
    const rateValue = table[speed];
    const baseFrequency = (bpm / 60.0) * 4;
    return baseFrequency / rateValue;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  static edge(x: ElemNode): ElemNode {
    return el.max(0, el.sub(x, el.z(x)));
  }
}
