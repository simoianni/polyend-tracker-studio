import { el, ElemNode } from '@elemaudio/core';
import { InstrumentData, InstrumentPlayMode, SAMPLE_RATE } from '@polyend/tracker-lib';
import WebRenderer from '@elemaudio/web-renderer';
import VFSManager from '@/audio/vfs/manager.ts';
import { InstrumentNode, PartialInstrumentNode, VFSInstrument } from '@/types/audio-engine.ts';
import { reverb } from '@/audio/effects/reverb.ts';
import { stereoDelay } from '@/audio/effects/delay.ts';
import { oneshot } from '@/audio/playmodes/oneshot.ts';
import { looped } from '@/audio/playmodes/looped.ts';
import { slice } from '@/audio/playmodes/slice.ts';
import { beatslice } from '@/audio/playmodes/beatslice.ts';
import { wavetable } from '@/audio/playmodes/wavetable.ts';
import { granular } from '@/audio/playmodes/granular.ts';
import { filter } from '@/audio/effects/filter.ts';
import { bitcrush } from '@/audio/effects/bitcrush.ts';
import { panning } from '@/audio/effects/panning.ts';
import { overdrive } from '@/audio/effects/overdrive.ts';
import AudioUtils from '@/audio/utils/audioutils.ts';

export default class AudioEngine {
  //---------------------------------------------------
  //
  //  Variables / Properties
  //
  //---------------------------------------------------
  private static core: WebRenderer | null;
  private static ctx: AudioContext | null;
  private static mainNode: AudioWorkletNode | null;
  private static vfsManager: VFSManager | null;

  private static nodes: Map<any, any> | null = new Map();

  private static reverbInL: ElemNode | null = null;
  private static reverbInR: ElemNode | null = null;

  private static delayInL: ElemNode | null = null;
  private static delayInR: ElemNode | null = null;

  private static gateInc: number = 0;

  static get isInitialized(): boolean {
    return !!this.ctx && !!this.core && !!this.vfsManager && !!this.mainNode;
  }

  static get context(): AudioContext | null {
    return this.ctx;
  }

  //---------------------------------------------------
  //
  //  Public Methods
  //
  //---------------------------------------------------
  static async init() {
    if (this.isInitialized) {
      return;
    }

    this.ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
    this.core = new WebRenderer();

    this.mainNode = await this.core.initialize(this.ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });

    this.vfsManager = new VFSManager(this.core, this.ctx);

    this.mainNode.connect(this.ctx.destination);

    this.reverbInL = el.tapIn({ name: 'reverb:l' });
    this.reverbInR = el.tapIn({ name: 'reverb:r' });
    this.delayInL = el.tapIn({ name: 'delay:l' });
    this.delayInR = el.tapIn({ name: 'delay:r' });

    // this.core.on('snapshot', (evt) => { console.log(evt) });
  }

  static async resume() {
    const context = this.ctx;
    if (context && context.state === 'suspended') {
      await context.resume();
    }
  }

  static async suspend() {
    const context = this.ctx;
    if (context && context.state !== 'suspended') {
      await context.suspend();
    }
  }

  static async addInstrument(instrument: InstrumentData): Promise<VFSInstrument | null> {
    if (this.vfsManager) {
      return await this.vfsManager.addInstrument(instrument);
    }
    return null;
  }

  static notesOn(vfs: VFSInstrument, note: number, velocity: number): void {
    this.resume();
    const nodes = this.nodes || new Map();
    const { path, instrument } = vfs;

    const gate = el.const({ value: velocity / 127, key: `note-${this.gateInc}:gate` });
    const pitch = AudioUtils.createPitch(note, instrument, gate);

    let out: PartialInstrumentNode;
    switch (vfs.instrument.playmode) {
      case InstrumentPlayMode.OneShot:
        out = oneshot(path, instrument, pitch, gate);
        break;
      case InstrumentPlayMode.Slice:
        out = slice(path, instrument, pitch, gate);
        break;
      case InstrumentPlayMode.BeatSlice:
        out = beatslice(path, instrument, note, gate);
        break;
      case InstrumentPlayMode.Wavetable:
        out = wavetable(path, instrument, pitch, gate);
        break;
      case InstrumentPlayMode.Granular:
        out = granular(path, instrument, pitch, gate);
        break;
      case InstrumentPlayMode.ForwardLoop:
      case InstrumentPlayMode.BackwardLoop:
      case InstrumentPlayMode.PingpongLoop:
        out = looped(path, instrument, pitch, gate);
        break;
      default:
        out = oneshot(path, instrument, pitch, gate);
        break;
    }

    if (out) {
      const node = {
        ...out,
        gate,
        delaySend: instrument.delaySend,
        reverbSend: instrument.reverbSend,
        volume: instrument.volume,
      } as InstrumentNode;

      if (instrument.bitdepth < 16) {
        const { left, right } = bitcrush(node, instrument.bitdepth);
        node.left = left;
        node.right = right;
      }

      if (instrument.overdrive > 0) {
        const { left, right } = overdrive(node, instrument.overdrive);
        node.left = left;
        node.right = right;
      }

      if (instrument.filterEnabled) {
        const { left, right } = filter(node, instrument, gate);
        node.left = left;
        node.right = right;
      }

      if (instrument.panning !== 0) {
        const { left, right } = panning(node, instrument, gate);
        node.left = left;
        node.right = right;
      }

      this.gateInc++;

      nodes.set(note, node);
      this.render();
    }
  }

  static async notesOff(note: number) {
    if (this.nodes) {
      const node = this.nodes.get(note);
      if (node) {
        node.gate.props.value = 0;
        this.render();
        this.nodes.delete(note);
      }
    }
  }

  static async destroy() {
    if (this.vfsManager) {
      await this.vfsManager.destroy();
      this.vfsManager = null;
    }
    if (this.core) {
      await this.core.reset();
      this.core = null;
    }
    if (this.mainNode) {
      this.mainNode.disconnect();
      this.mainNode = null;
    }
    if (this.ctx) {
      await this.ctx.close();
      this.ctx = null;
    }
    this.reverbInL = null;
    this.reverbInR = null;
    this.delayInL = null;
    this.delayInR = null;
  }

  //---------------------------------------------------
  //
  //  Private Methods
  //
  //---------------------------------------------------
  private static render() {
    if (!this.core) return;
    if (!this.nodes) return;
    if (!this.delayInL) return;
    if (!this.delayInR) return;
    if (!this.reverbInL) return;
    if (!this.reverbInR) return;

    const { voicesLeft, voicesRight, voicesReverbLeft, voicesReverbRight, voicesDelayLeft, voicesDelayRight } =
      Array.from(this.nodes.values()).reduce(
        (acc, node) => {
          acc.voicesLeft.push(el.mul(node.volume, node.left));
          acc.voicesRight.push(el.mul(node.volume, node.right));

          acc.voicesDelayLeft.push(el.mul(node.volume, el.mul(node.delaySend, node.left)));
          acc.voicesDelayRight.push(el.mul(node.volume, el.mul(node.delaySend, node.right)));

          acc.voicesReverbLeft.push(el.mul(node.volume, el.mul(node.reverbSend, node.left)));
          acc.voicesReverbRight.push(el.mul(node.volume, el.mul(node.reverbSend, node.right)));

          return acc;
        },
        {
          voicesLeft: [],
          voicesRight: [],
          voicesDelayLeft: [],
          voicesDelayRight: [],
          voicesReverbLeft: [],
          voicesReverbRight: [],
        },
      );

    const dryL = el.add(...voicesLeft);
    const dryR = el.add(...voicesRight);

    const dryDelayL = el.add(...voicesDelayLeft);
    const dryDelayR = el.add(...voicesDelayRight);

    const dryReverbL = el.add(...voicesReverbLeft);
    const dryReverbR = el.add(...voicesReverbRight);

    //----------------------------------
    // Delay & Reverb
    //----------------------------------
    const delayParams = {
      key: 'delay',
      timeL: 400,
      timeR: 800,
      feedback: 0.4,
      pingpong: true,
    };
    const reverbParams = {
      key: 'reverb',
      size: 0.9,
      decay: 0.9,
      mod: 0.9999,
    };
    const [delayL, delayR] = stereoDelay(delayParams);
    const [reverbL, reverbR] = reverb(reverbParams, this.reverbInL, this.reverbInR);

    const masterVolume = 1;

    //----------------------------------
    // Mixing
    //----------------------------------
    this.core.render(
      el.mul(
        masterVolume,
        el.add(
          dryL,
          delayL,
          reverbL,
          el.tapOut({ name: 'delay:l' }, dryDelayL),
          el.tapOut({ name: 'reverb:l' }, dryReverbL),
        ),
      ),
      el.mul(
        masterVolume,
        el.add(
          dryR,
          delayR,
          reverbR,
          el.tapOut({ name: 'delay:r' }, dryDelayR),
          el.tapOut({ name: 'reverb:r' }, dryReverbR),
        ),
      ),
    );
  }
}
