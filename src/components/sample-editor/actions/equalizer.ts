import { AudioUtil } from '@polyend/tracker-lib';

// BiquadFilterType is a built-in TS type for the Web Audio API
export interface EQBand {
  type: BiquadFilterType;
  frequency: number;
  gain: number;
  q?: number;
}

export interface EqualizerOptions {
  bands: EQBand[];
}

let isProcessing = false;

// Helper function to convert a planar AudioBuffer to an interleaved Float32Array
function interleave(audioBuffer: AudioBuffer): Float32Array {
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const result = new Float32Array(length * numChannels);

  for (let i = 0; i < numChannels; i++) {
    const channelData = audioBuffer.getChannelData(i);
    for (let j = 0; j < length; j++) {
      result[j * numChannels + i] = channelData[j];
    }
  }
  return result;
}

export default class SampleEditorAction_Equalizer {
  static async execute(wavBuffer: ArrayBuffer, options: EqualizerOptions): Promise<ArrayBuffer | null> {
    if (isProcessing || !options.bands || options.bands.length === 0) return null;
    isProcessing = true;

    try {
      // 1. Decode the WAV buffer into an AudioBuffer
      // We use a temporary AudioContext for decoding.
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sourceAudioBuffer = await audioCtx.decodeAudioData(wavBuffer.slice(0));
      await audioCtx.close();

      // 2. Set up the OfflineAudioContext for processing
      const offlineCtx = new OfflineAudioContext(
        sourceAudioBuffer.numberOfChannels,
        sourceAudioBuffer.length,
        sourceAudioBuffer.sampleRate,
      );

      // 3. Create and connect the source node
      const sourceNode = offlineCtx.createBufferSource();
      sourceNode.buffer = sourceAudioBuffer;

      // 4. Create and chain the EQ filters
      let lastNode: AudioNode = sourceNode;
      options.bands.forEach((band) => {
        const filterNode = offlineCtx.createBiquadFilter();
        filterNode.type = band.type;
        filterNode.frequency.value = band.frequency;
        filterNode.gain.value = band.gain;
        if (band.q !== undefined) {
          filterNode.Q.value = band.q;
        }
        lastNode.connect(filterNode);
        lastNode = filterNode;
      });

      // 5. Connect the final node to the destination and start rendering
      lastNode.connect(offlineCtx.destination);
      sourceNode.start(0);
      const renderedBuffer = await offlineCtx.startRendering();

      // 6. Convert the resulting AudioBuffer back to a WAV ArrayBuffer
      const interleavedData = interleave(renderedBuffer);
      return AudioUtil.createWavFile(interleavedData, {
        numChannels: renderedBuffer.numberOfChannels,
        sampleRate: renderedBuffer.sampleRate,
        bitsPerSample: 16,
      });
    } catch (e) {
      console.error('Failed to apply EQ:', e);
      return null;
    } finally {
      isProcessing = false;
    }
  }

  static async preview(wavBuffer: ArrayBuffer, options: EqualizerOptions): Promise<HTMLAudioElement | null> {
    const equalizedBuffer = await this.execute(wavBuffer, options);
    if (equalizedBuffer) {
      const blob = new Blob([equalizedBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      return audio;
    }
    return null;
  }
}
