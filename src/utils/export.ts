import JSZip from 'jszip';
import Tracker, { type InstrumentData, type PatternData, type ProjectData } from '@polyend/tracker-lib';
import Project from '@tracker-internals/projects/project.js';
import Pattern from '@tracker-internals/patterns/pattern.js';
import Instrument from '@tracker-internals/instruments/instrument.js';
import Metadata from '@tracker-internals/patterns/metadata.js';

// Characters allowed by the Tracker firmware in project / file names
// (see polyendtracker-formats: [[:alnum:]\-+@ ]+)
const NAME_SAFE = /[^a-zA-Z0-9\-+@ ]/g;
const MAX_PROJECT_NAME = 32;
const MAX_INSTRUMENT_NAME = 31;

export interface TrackerProjectExport {
  /** Project name — used for the root folder, the zip and project.mt */
  projectName: string;
  /** Global tempo (BPM) written into project.mt */
  bpm: number;
  /** Patterns in playlist order; names end up in the patternsMetadata file */
  patterns: { name: string; data: PatternData }[];
  /** Instruments indexed by 0-based slot (sparse arrays / null slots allowed) */
  instruments: (InstrumentData | null | undefined)[];
  /**
   * The ProjectData obtained from an imported project.mt, if any.
   * Passing it preserves song structure, track names, delay/reverb settings
   * and anything else the editor doesn't touch. When omitted, a fresh
   * project is created via Tracker.createProject().
   */
  baseProject?: ProjectData | null;
}

export function sanitizeTrackerName(name: string, maxLength: number): string {
  const cleaned = name.replace(NAME_SAFE, '').trim();
  return (cleaned || 'Untitled').substring(0, maxLength);
}

/**
 * Serializes the current editor state into a zip laid out exactly like a
 * Tracker project folder on the SD card:
 *
 * ProjectName/
 * ├── project.mt
 * ├── patternsMetadata
 * ├── patterns/
 * │   ├── pattern_01.mtp
 * │   └── ...
 * └── instruments/
 *     ├── 1 kick.pti
 *     └── ...
 *
 * Unzip it into the SD card's /Projects folder and open it on the device.
 */
export async function exportTrackerProject(options: TrackerProjectExport): Promise<Blob> {
  const zip = buildProjectZip(options);
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Same as {@link exportTrackerProject} but returns the JSZip instance,
 * so tests (and other consumers) can inspect entries without a Blob.
 */
export function buildProjectZip(options: TrackerProjectExport): JSZip {
  const projectName = sanitizeTrackerName(options.projectName, MAX_PROJECT_NAME);

  const project: ProjectData = options.baseProject ?? Tracker.createProject(projectName);
  project.projectName = projectName;
  project.values.globalTempo = options.bpm;

  const zip = new JSZip();
  const root = zip.folder(projectName)!;

  root.file('project.mt', Project.write(project));

  const patternsDir = root.folder('patterns')!;
  options.patterns.forEach((pattern, index) => {
    const num = String(index + 1).padStart(2, '0');
    patternsDir.file(`pattern_${num}.mtp`, Pattern.write(pattern.data));
  });

  const metadata = Tracker.createPatternsMetadata(options.patterns.map((p) => sanitizeTrackerName(p.name, 30)));
  root.file('patternsMetadata', Metadata.writePatternsMetadata(metadata));

  const instrumentsDir = root.folder('instruments')!;
  options.instruments.forEach((instrument, slot) => {
    if (!instrument) return;
    const rawName = instrument.sample?.filename?.replace(/\.(wav|pti)$/i, '') || 'instrument';
    const name = sanitizeTrackerName(rawName, MAX_INSTRUMENT_NAME);
    instrumentsDir.file(`${slot + 1} ${name}.pti`, Instrument.write(instrument));
  });

  return zip;
}
