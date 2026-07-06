import {
  Automation,
  GranularShape,
  GranularType,
  InstrumentData,
  InstrumentFilterType,
  LFO_SHAPE,
  MAX_16BIT,
  SAMPLE_RATE,
} from '@polyend/tracker-lib';
import { WaveFile } from 'wavefile';

//---------------------------------------------------
//
//  Formatting Methods
//
//---------------------------------------------------
export function formatNumber(value: number, fixed: number = 2) {
  return value.toFixed(fixed);
}

export function formatSeconds(value: number, instrument?: InstrumentData) {
  if (instrument) {
    value = frames2seconds(value, instrument);
    return `${value.toFixed(3)}s`;
  }
  return `${value.toFixed(3)}s`;
}

export function formatMilliSeconds(value: number, instrument?: InstrumentData) {
  if (instrument) {
    value = frames2seconds(value, instrument);
    return `${(value * 100).toFixed(3)}ms`;
  }
  return `${value.toFixed(2)}ms`;
}

export function formatAutomationType(value: Automation) {
  if (!value.enabled) {
    return 'Disabled';
  }
  return value.isLFO ? 'LFO' : 'Envelope';
}

export function formatAutomationShape(value: LFO_SHAPE) {
  switch (value) {
    case LFO_SHAPE.RevSaw:
      return 'Rev Saw';
    case LFO_SHAPE.Saw:
      return 'Saw';
    case LFO_SHAPE.Triangle:
      return 'Triangle';
    case LFO_SHAPE.Square:
      return 'Square';
    case LFO_SHAPE.Random:
      return 'Random';
  }
}

export function formatFilterType(value: number) {
  switch (value) {
    case InstrumentFilterType.LowPass:
      return 'Low-pass';
    case InstrumentFilterType.HighPass:
      return 'High-pass';
    case InstrumentFilterType.BandPass:
      return 'Band-pass';
  }
}

export function formatGranularLoopType(value: number) {
  switch (value) {
    case GranularType.Forward:
      return 'Forward';
    case GranularType.Backward:
      return 'Backward';
    case GranularType.PingPong:
      return 'PingPong';
  }
}

export function formatGranularShape(value: number) {
  switch (value) {
    case GranularShape.Square:
      return 'Square';
    case GranularShape.Triangle:
      return 'Triangle';
    case GranularShape.Gauss:
      return 'Gauss';
  }
}

//---------------------------------------------------
//
//  Converter Methods
//
//---------------------------------------------------
export function seconds2frames(seconds: number, instrument: InstrumentData): number {
  const sampleLength = instrument.sample.length;
  return Math.floor((seconds * SAMPLE_RATE * MAX_16BIT) / sampleLength);
}

export function frames2seconds(frames: number, instrument: InstrumentData): number {
  const sampleLength = instrument.sample.length;
  return (frames * (sampleLength / MAX_16BIT)) / SAMPLE_RATE;
}

export async function processAudioFile(
  file: File,
  sampleRate: number = 44100,
  bitDepth: number = 16,
): Promise<{ buffer: ArrayBuffer; samples: Int16Array; slices: number[]; channels: number }> {
  const inputBuffer = await file.arrayBuffer();

  // First try to parse it as a PCM WAV file (keeps cue points as slices)
  try {
    const wav = new WaveFile(new Uint8Array(inputBuffer));

    /** @ts-expect-error i can't be arsed :P */
    const fmtBitsPerSample = wav.fmt.bitsPerSample;
    /** @ts-expect-error i can't be arsed :P */
    const fmtSampleRate = wav.fmt.sampleRate;
    /** @ts-expect-error i can't be arsed :P */
    const channels = wav.fmt.numChannels;

    if (fmtBitsPerSample > bitDepth) {
      wav.toBitDepth(bitDepth.toString());
    }
    if (fmtSampleRate > sampleRate) {
      wav.toSampleRate(sampleRate);
    }

    const buffer = wav.toBuffer().buffer as ArrayBuffer;
    /** @ts-expect-error i can't be arsed :P */
    const samples = wav.getSamples(true) as Int16Array;
    /** @ts-expect-error i can't be arsed :P */
    const samples64 = wav.getSamples() as Float64Array[];
    const samplesLen = samples64[0].length;
    const cuePoints = wav
      .listCuePoints()
      /** @ts-expect-error i can't be arsed :P */
      .map((cue) => Math.round(((cue.dwPosition || 0) / samplesLen) * MAX_16BIT));

    const slices: number[] = cuePoints.slice(0, 48);
    return { buffer, slices, samples, channels };
  } catch (e) {
    console.warn(`Could not parse "${file.name}" as PCM WAV, decoding with WebAudio instead:`, e);
  }

  // Fallback: let the browser decode any audio format (mp3, m4a, aiff, flac,
  // compressed wav, ...) and rebuild a 16-bit PCM WAV from the decoded data
  const audioContext = new AudioContext({ sampleRate });
  try {
    const audioBuffer = await audioContext.decodeAudioData(inputBuffer.slice(0));
    const channels = Math.min(audioBuffer.numberOfChannels, 2);
    const length = audioBuffer.length;
    const samples = new Int16Array(length * channels);
    for (let ch = 0; ch < channels; ch++) {
      const data = audioBuffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const value = Math.max(-1, Math.min(1, data[i]));
        samples[i * channels + ch] = Math.round(value * 32767);
      }
    }
    const wav = new WaveFile();
    wav.fromScratch(channels, sampleRate, String(bitDepth), samples);
    const buffer = wav.toBuffer().buffer as ArrayBuffer;
    return { buffer, slices: [], samples, channels };
  } finally {
    await audioContext.close();
  }
}

export async function combineAudioFiles(
  files: File[],
  sampleRate: number = 44100,
  bitDepth: number = 16,
): Promise<{ buffer: ArrayBuffer; slices: number[] } | null> {
  try {
    const fileProcessingPromises = files.map((file) => processAudioFile(file, sampleRate, bitDepth));
    const results = await Promise.all(fileProcessingPromises);
    const numChannels = results.reduce((max, r) => Math.max(max, r.channels), 1);

    const slices: number[] = [];
    const concatenatedSamplesList: number[] = [];
    let currentLengthInFrames = 0;

    results.forEach(({ samples, channels }) => {
      slices.push(currentLengthInFrames);

      let sampleData = Array.from(samples);

      // Upmix mono to stereo if needed
      if (channels === 1 && numChannels === 2) {
        const upmixed: number[] = [];
        for (let i = 0; i < samples.length; i++) {
          upmixed.push(samples[i]); // L
          upmixed.push(samples[i]); // R
        }
        sampleData = upmixed;
      }

      for (let i = 0; i < sampleData.length; i++) {
        concatenatedSamplesList.push(sampleData[i]);
      }
      currentLengthInFrames += samples.length / channels;
    });

    const finalWav = new WaveFile();
    const finalSamples = new Int16Array(concatenatedSamplesList);

    finalWav.fromScratch(numChannels, sampleRate, String(bitDepth), finalSamples);
    const finalSlices = slices.map((s) => Math.round((s / currentLengthInFrames) * MAX_16BIT));
    const finalBuffer = finalWav.toBuffer().buffer as ArrayBuffer;
    return { buffer: finalBuffer, slices: finalSlices };
  } catch (error) {
    console.error('Error creating sliced instrument:', error);
  }
  return null;
}

//---------------------------------------------------
//
//  Misc Helpers
//
//---------------------------------------------------
export function clonify<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
