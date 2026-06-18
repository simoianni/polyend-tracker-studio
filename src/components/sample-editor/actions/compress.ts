import { AudioUtil } from '@polyend/tracker-lib';

export interface CompressionOptions {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
  knee: number;
  wetDryMix: number;
  makeupGain: number;
}

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

let isProcessing = false;

export default class SampleEditorAction_Compress {
  static async execute(wavBuffer: ArrayBuffer, options: CompressionOptions): Promise<ArrayBuffer | null> {
    if (isProcessing) return null;
    isProcessing = true;

    try {
      // 1. Decode the WAV buffer into an AudioBuffer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sourceAudioBuffer = await audioCtx.decodeAudioData(wavBuffer.slice(0));
      await audioCtx.close();

      // 2. Set up the OfflineAudioContext for processing
      const offlineCtx = new OfflineAudioContext(
        sourceAudioBuffer.numberOfChannels,
        sourceAudioBuffer.length,
        sourceAudioBuffer.sampleRate,
      );

      // 3. Create source and compressor nodes
      const sourceNode = offlineCtx.createBufferSource();
      sourceNode.buffer = sourceAudioBuffer;

      const compressorNode = offlineCtx.createDynamicsCompressor();

      // 4. Set compressor parameters from options
      compressorNode.threshold.value = options.threshold;
      compressorNode.ratio.value = options.ratio;
      compressorNode.attack.value = options.attack / 1000; // Convert ms to seconds
      compressorNode.release.value = options.release / 1000; // Convert ms to seconds
      compressorNode.knee.value = options.knee;

      // The DynamicsCompressorNode does not have a wet/dry mix or makeup gain built-in.
      // We will implement this manually with GainNodes.

      const wetGainNode = offlineCtx.createGain();
      const dryGainNode = offlineCtx.createGain();
      const makeupGainNode = offlineCtx.createGain();

      // Set mix levels
      wetGainNode.gain.value = options.wetDryMix;
      dryGainNode.gain.value = 1 - options.wetDryMix;

      // Set makeup gain
      makeupGainNode.gain.value = Math.pow(10, options.makeupGain / 20);

      // 5. Connect the nodes in a parallel path for wet/dry mix
      sourceNode.connect(compressorNode);
      sourceNode.connect(dryGainNode);

      compressorNode.connect(wetGainNode);

      wetGainNode.connect(makeupGainNode);
      dryGainNode.connect(makeupGainNode);

      // 6. Connect to destination and start rendering
      makeupGainNode.connect(offlineCtx.destination);
      sourceNode.start(0);
      const renderedBuffer = await offlineCtx.startRendering();

      // 7. Convert the resulting AudioBuffer back to a WAV ArrayBuffer
      const interleavedData = interleave(renderedBuffer);
      const newWavBuffer = AudioUtil.createWavFile(interleavedData, {
        numChannels: renderedBuffer.numberOfChannels,
        sampleRate: renderedBuffer.sampleRate,
        bitsPerSample: 16,
      });

      return newWavBuffer;
    } catch (e) {
      console.error('Failed to apply compression:', e);
      return null;
    } finally {
      isProcessing = false;
    }
  }

  static async preview(wavBuffer: ArrayBuffer, options: CompressionOptions): Promise<HTMLAudioElement | null> {
    const compressedBuffer = await this.execute(wavBuffer, options);
    if (compressedBuffer) {
      const blob = new Blob([compressedBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      return audio;
    }
    return null;
  }
}
