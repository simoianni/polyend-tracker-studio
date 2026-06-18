import { SampleSelection } from '@/types/sample-editor.ts';
import { AudioUtil, SAMPLE_RATE } from '@polyend/tracker-lib';

let isFading = false;

export default class SampleEditorAction_FadeOut {
  static async execute(wavBuffer: ArrayBuffer, selection: SampleSelection | null): Promise<ArrayBuffer | null> {
    if (!isFading && selection) {
      isFading = true;

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

      const newBuffer = new Float32Array(originalBuffer);

      const totalFrames = originalBuffer.length / numChannels;
      const startFrame = Math.floor(start * SAMPLE_RATE);
      const endFrame = Math.min(totalFrames, Math.floor(end * SAMPLE_RATE));

      if (startFrame >= endFrame) {
        console.error(`Invalid fade selection: start ${startFrame}, end ${endFrame}`);
        isFading = false;
        return null;
      }

      const fadeDurationInFrames = endFrame - startFrame;

      for (let frame = startFrame; frame < endFrame; frame++) {
        const gain = 1.0 - (frame - startFrame) / fadeDurationInFrames;
        for (let channel = 0; channel < numChannels; channel++) {
          const sampleIndex = frame * numChannels + channel;
          if (sampleIndex < newBuffer.length) {
            newBuffer[sampleIndex] *= gain;
          }
        }
      }

      // Now create a new wav file and emit it
      const newWavBuffer = AudioUtil.createWavFile(newBuffer, {
        numChannels,
        sampleRate: SAMPLE_RATE,
        bitsPerSample: 16,
      });

      isFading = false;
      return newWavBuffer;
    }
    return null;
  }
}
