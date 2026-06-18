import { SampleSelection } from '@/types/sample-editor.ts';
import { AudioUtil, SAMPLE_RATE } from '@polyend/tracker-lib';

let isCutting = false;

export default class SampleEditorAction_Cut {
  static async execute(wavBuffer: ArrayBuffer, selection: SampleSelection | null): Promise<ArrayBuffer | null> {
    if (!isCutting && selection) {
      isCutting = true;

      const { start, end } = selection;
      const wavView = new DataView(wavBuffer);
      const numChannels = wavView.getUint16(22, true);
      const pcmData = new Int16Array(wavBuffer, 44);

      // Convert to Float32Array
      const originalBuffer = new Float32Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        const pcmSample = pcmData[i];
        if (pcmSample) {
          originalBuffer[i] = pcmSample / 32768;
        }
      }

      const totalFrames = originalBuffer.length / numChannels;
      const startFrame = Math.floor(start * SAMPLE_RATE);
      const endFrame = Math.min(totalFrames, Math.floor(end * SAMPLE_RATE));
      const startCut = startFrame * numChannels;
      const endCut = endFrame * numChannels;

      if (startCut >= endCut || endCut > originalBuffer.length) {
        console.error(`Invalid cut selection: start ${startCut}, end ${endCut}, total ${originalBuffer.length}`);
        isCutting = false;
        return null;
      }

      const totalLength = originalBuffer.length - (endCut - startCut);
      const newBuffer = new Float32Array(totalLength);

      // Copy the part before the selection
      newBuffer.set(originalBuffer.subarray(0, startCut));
      // Copy the part after the selection
      newBuffer.set(originalBuffer.subarray(endCut), startCut);

      // Now create a new wav file and emit it
      const newWavBuffer = AudioUtil.createWavFile(newBuffer, {
        numChannels,
        sampleRate: SAMPLE_RATE,
        bitsPerSample: 16,
      });

      isCutting = false;
      return newWavBuffer;
    }
    return null;
  }
}
