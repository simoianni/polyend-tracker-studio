import { AudioUtil, SAMPLE_RATE } from '@polyend/tracker-lib';

let isNormalizing = false;

export default class SampleEditorAction_Normalize {
  static async execute(wavBuffer: ArrayBuffer): Promise<ArrayBuffer | null> {
    if (!isNormalizing) {
      isNormalizing = true;

      const wavView = new DataView(wavBuffer);
      const numChannels = wavView.getUint16(22, true);
      const pcmData = new Int16Array(wavBuffer, 44);

      // Convert to Float32Array
      const float32Buffer = new Float32Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        const pcmSample = pcmData[i];
        if (pcmSample) {
          float32Buffer[i] = pcmSample / 32768;
        }
      }

      // Find the peak value in the entire sample
      let peak = 0.0;
      for (let i = 0; i < float32Buffer.length; i++) {
        const sample = Math.abs(float32Buffer[i]);
        if (sample > peak) {
          peak = sample;
        }
      }

      // If peak is not 0, normalize
      if (peak > 0.0) {
        const gain = 1.0 / peak;
        for (let i = 0; i < float32Buffer.length; i++) {
          float32Buffer[i] *= gain;
        }
      }

      // Now create a new wav file and emit it
      const newWavBuffer = AudioUtil.createWavFile(float32Buffer, {
        numChannels,
        sampleRate: SAMPLE_RATE,
        bitsPerSample: 16,
      });

      isNormalizing = false;
      return newWavBuffer;
    }
    return null;
  }
}
