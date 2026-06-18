import WebRenderer from '@elemaudio/web-renderer';
import { InstrumentData } from '@polyend/tracker-lib';
import { VFSInstrument } from '@/types/audio-engine.ts';

export default class Manager {
  private core: WebRenderer;
  private ctx: AudioContext;
  private mapping: VFSInstrument[] = [];

  get map(): VFSInstrument[] {
    return this.mapping;
  }

  constructor(core: WebRenderer, ctx: AudioContext) {
    this.core = core;
    this.ctx = ctx;
  }

  async destroy() {
    await this.core.pruneVirtualFileSystem();
    this.mapping = [];
  }

  async addInstrument(instrument: InstrumentData): Promise<VFSInstrument | null> {
    const sample = (await this.ctx.decodeAudioData(instrument.wav.slice(0))) ?? null;
    if (sample) {
      const path = `${this.mapping.length}:${instrument.sample.filename}`;
      const map: VFSInstrument = { path, instrument };

      const numChannels = instrument.sample.channels;
      if (numChannels === 1) {
        await this.core.updateVirtualFileSystem({
          [`${map.path}:l`]: sample.getChannelData(0),
          [`${map.path}:r`]: sample.getChannelData(0),
        });
      } else {
        await this.core.updateVirtualFileSystem({
          [`${map.path}:l`]: sample.getChannelData(0),
          [`${map.path}:r`]: sample.getChannelData(1),
        });
      }

      this.mapping.push(map);

      return map;
    }
    return null;
  }
}
