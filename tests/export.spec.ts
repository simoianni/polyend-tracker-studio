import { describe, it, expect } from 'vitest';
import { mkdtemp, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import Tracker, { PatternFX, type InstrumentData, type PatternData } from '@polyend/tracker-lib';
import Project from '@tracker-internals/projects/project.js';
import Pattern from '@tracker-internals/patterns/pattern.js';
import Instrument from '@tracker-internals/instruments/instrument.js';
import Metadata from '@tracker-internals/patterns/metadata.js';
import { buildProjectZip, exportTrackerProject, sanitizeTrackerName } from '../src/utils/export.ts';
import { applyTrackerLibPatches, detectTrackCount } from '../src/utils/tracker-lib-patches.ts';

//---------------------------------------------------
//  Helpers
//---------------------------------------------------

/** Builds a minimal valid 16-bit PCM mono WAV with a short sine wave. */
function makeTestWav(numFrames = 441, sampleRate = 44100): ArrayBuffer {
  const dataSize = numFrames * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  for (let i = 0; i < numFrames; i++) {
    view.setInt16(44 + i * 2, Math.round(Math.sin((i / numFrames) * Math.PI * 8) * 20000), true);
  }
  return buffer;
}

/** Creates a 16-track pattern with deterministic notes / instruments / FX. */
function makeTestPattern(): PatternData {
  const pattern = Tracker.createPattern(16, 64);
  const arpFx = PatternFX.find((fx) => fx.symbol === 'a') || PatternFX[1];
  for (let t = 0; t < 4; t++) {
    for (let s = 0; s < 64; s += 4) {
      const step = pattern.tracks[t].steps[s];
      step.note = 24 + t * 12 + (s % 12);
      step.instrument = t;
      step.fx = [{ type: arpFx, value: arpFx.default }];
    }
  }
  return pattern;
}

function makeTestInstrument(name = 'testkick'): InstrumentData {
  const instrument = Tracker.createInstrument(makeTestWav());
  instrument.sample.filename = name;
  instrument.volume = 0.8;
  instrument.panning = 0.25; // valid range: -1.0 … 1.0
  return instrument;
}

//---------------------------------------------------
//  sanitizeTrackerName
//---------------------------------------------------

describe('sanitizeTrackerName', () => {
  it('strips characters the firmware does not allow', () => {
    expect(sanitizeTrackerName('My/Proj*ect_!', 32)).toBe('MyProject');
  });

  it('truncates to the requested length', () => {
    expect(sanitizeTrackerName('a'.repeat(50), 32)).toHaveLength(32);
  });

  it('falls back to Untitled for empty results', () => {
    expect(sanitizeTrackerName('///***', 32)).toBe('Untitled');
  });
});

//---------------------------------------------------
//  Round-trips at the buffer level
//---------------------------------------------------

describe('pattern round-trip (write → parse)', () => {
  it('preserves every step, note, instrument and FX', () => {
    const original = makeTestPattern();
    const buffer = Pattern.write(original);
    const parsed = Pattern.parse(buffer);

    expect(parsed.trackCount).toBe(16);
    expect(parsed.tracks).toHaveLength(original.tracks.length);
    for (let t = 0; t < original.tracks.length; t++) {
      expect(parsed.tracks[t].length).toBe(original.tracks[t].length);
      for (let s = 0; s < original.tracks[t].steps.length; s++) {
        const a = original.tracks[t].steps[s];
        const b = parsed.tracks[t].steps[s];
        expect(b.note, `track ${t} step ${s} note`).toBe(a.note);
        expect(b.instrument, `track ${t} step ${s} instrument`).toBe(a.instrument);
        // The binary format always stores two FX slots per step; empty
        // slots parse back as FX index 0 — compare only the real ones.
        const activeFx = (fx: { type: { index: number }; value: number }[]) =>
          fx.filter((f) => f.type.index !== 0).map((f) => [f.type.index, f.value]);
        expect(activeFx(b.fx)).toEqual(activeFx(a.fx));
      }
    }
  });
});

describe('instrument round-trip (write → parse)', () => {
  it('preserves sample name, parameters and sample length', () => {
    const original = makeTestInstrument();
    const buffer = Instrument.write(original);
    const parsed = Instrument.parse(buffer);

    expect(parsed.sample.filename).toBe('testkick');
    expect(parsed.volume).toBeCloseTo(0.8, 2);
    expect(parsed.panning).toBeCloseTo(0.25, 1); // stored as a byte → ~0.01 quantization
    expect(parsed.sample.length).toBe(original.sample.length);
    expect(parsed.playmode).toBe(original.playmode);
  });
});

describe('project round-trip (write → parse)', () => {
  it('preserves name, tempo and track names', () => {
    const original = Tracker.createProject('RoundTrip');
    original.values.globalTempo = 140;
    original.values.trackNames[0] = 'Kick';
    original.values.trackNames[1] = 'Snare';

    const parsed = Project.parse(Project.write(original));

    expect(parsed.projectName).toBe('RoundTrip');
    expect(parsed.values.globalTempo).toBeCloseTo(140, 1);
    expect(parsed.values.trackNames[0]).toBe('Kick');
    expect(parsed.values.trackNames[1]).toBe('Snare');
  });
});

//---------------------------------------------------
//  Full project export → import
//---------------------------------------------------

describe('exportTrackerProject', () => {
  const patterns = [
    { name: 'Intro', data: makeTestPattern() },
    { name: 'Verse', data: makeTestPattern() },
  ];
  const instruments: (InstrumentData | null)[] = [];
  instruments[0] = makeTestInstrument('kick');
  instruments[3] = makeTestInstrument('snare');

  it('produces the SD-card folder structure with correct names', async () => {
    const zip = buildProjectZip({ projectName: 'My Song', bpm: 128, patterns, instruments });
    const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir);

    expect(names).toContain('My Song/project.mt');
    expect(names).toContain('My Song/patternsMetadata');
    expect(names).toContain('My Song/patterns/pattern_01.mtp');
    expect(names).toContain('My Song/patterns/pattern_02.mtp');
    expect(names).toContain('My Song/instruments/1 kick.pti');
    expect(names).toContain('My Song/instruments/4 snare.pti');
    expect(names).toHaveLength(6);
  });

  it('re-parses every exported file identically (buffer level)', async () => {
    const zip = buildProjectZip({ projectName: 'My Song', bpm: 128, patterns, instruments });

    const project = Project.parse(await zip.file('My Song/project.mt')!.async('arraybuffer'));
    expect(project.projectName).toBe('My Song');
    expect(project.values.globalTempo).toBeCloseTo(128, 1);

    const metadata = Metadata.parsePatternsMetadata(await zip.file('My Song/patternsMetadata')!.async('arraybuffer'));
    expect(metadata.patternNames.slice(0, 2)).toEqual(['Intro', 'Verse']);

    const pattern = Pattern.parse(await zip.file('My Song/patterns/pattern_01.mtp')!.async('arraybuffer'));
    expect(pattern.tracks[0].steps[0].note).toBe(patterns[0].data.tracks[0].steps[0].note);

    const kick = Instrument.parse(await zip.file('My Song/instruments/1 kick.pti')!.async('arraybuffer'));
    expect(kick.sample.filename).toBe('kick');
  });

  it('survives the exact read path used by the app import (Tracker.read*)', async () => {
    const zip = buildProjectZip({ projectName: 'My Song', bpm: 128, patterns, instruments });
    const dir = await mkdtemp(join(tmpdir(), 'tracker-export-'));

    const write = async (entry: string, file: string) =>
      writeFile(join(dir, file), Buffer.from(await zip.file(entry)!.async('arraybuffer')));

    await write('My Song/project.mt', 'project.mt');
    await write('My Song/patterns/pattern_01.mtp', 'pattern_01.mtp');
    await write('My Song/instruments/1 kick.pti', '1 kick.pti');

    const project = await Tracker.readProject(join(dir, 'project.mt'));
    expect(project).not.toBeNull();
    expect(project!.values.globalTempo).toBeCloseTo(128, 1);

    const pattern = await Tracker.readPattern(join(dir, 'pattern_01.mtp'));
    expect(pattern).not.toBeNull();
    expect(pattern!.trackCount).toBe(16);
    expect(pattern!.tracks[2].steps[4].note).toBe(patterns[0].data.tracks[2].steps[4].note);

    const instrument = await Tracker.readInstrument(join(dir, '1 kick.pti'));
    expect(instrument).not.toBeNull();
    expect(instrument!.sample.filename).toBe('kick');
  });

  it('preserves an imported base project (song structure, fx settings)', async () => {
    const base = Tracker.createProject('Original Name');
    base.values.trackNames[0] = 'Bassline';
    base.values.delayTime = 350;
    base.song.playlist[0] = 1;
    base.song.playlist[1] = 2;

    const zip = buildProjectZip({ projectName: 'Renamed', bpm: 95, patterns, instruments, baseProject: base });
    const project = Project.parse(await zip.file('Renamed/project.mt')!.async('arraybuffer'));

    expect(project.projectName).toBe('Renamed');
    expect(project.values.globalTempo).toBeCloseTo(95, 1);
    expect(project.values.trackNames[0]).toBe('Bassline');
    expect(project.values.delayTime).toBe(350);
    expect(project.song.playlist[0]).toBe(1);
    expect(project.song.playlist[1]).toBe(2);
  });

  it('returns a non-empty zip Blob', async () => {
    const blob = await exportTrackerProject({ projectName: 'My Song', bpm: 128, patterns, instruments });
    expect(blob.size).toBeGreaterThan(1000);
  });
});

//---------------------------------------------------
//  Old-firmware pattern support (tracker-lib patch)
//---------------------------------------------------

describe('tracker-lib detectTrackCount patch', () => {
  const HEADER = 14 + 2 + 12; // header + padding + reserved, as parse() consumes
  const TRACK = 1 + 6 * 128;
  const CRC = 4;

  it('detects 8/12/16 tracks from the exact file sizes parse() consumes', () => {
    expect(detectTrackCount(HEADER + TRACK * 8 + CRC)).toBe(8); // 6184 — old firmware (e.g. Tracker AE packs)
    expect(detectTrackCount(HEADER + TRACK * 12 + CRC)).toBe(12); // 9260 — OG Tracker
    expect(detectTrackCount(HEADER + TRACK * 16 + CRC)).toBe(16); // 12336 — Tracker+ / Mini
    expect(detectTrackCount(999)).toBe(16); // unknown size → default
  });

  it('parses an 8-track old-firmware pattern without crashing', () => {
    applyTrackerLibPatches();

    // Build an 8-track file from a lib-written 16-track buffer:
    // same header + reserved bytes, first 8 tracks, same CRC field.
    const full = Pattern.write(makeTestPattern());
    const bytes = new Uint8Array(full);
    const eightTrack = new Uint8Array(HEADER + TRACK * 8 + CRC);
    eightTrack.set(bytes.subarray(0, HEADER + TRACK * 8), 0);
    eightTrack.set(bytes.subarray(full.byteLength - CRC), HEADER + TRACK * 8);

    const parsed = Pattern.parse(eightTrack.buffer);
    expect(parsed.trackCount).toBe(8);
    expect(parsed.tracks).toHaveLength(8);
    // Step data must round-trip identically for the surviving tracks
    const original = makeTestPattern();
    expect(parsed.tracks[1].steps[4].note).toBe(original.tracks[1].steps[4].note);
    expect(parsed.tracks[3].steps[8].instrument).toBe(original.tracks[3].steps[8].instrument);
  });
});
