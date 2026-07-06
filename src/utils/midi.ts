/**
 * MIDI file exporter for Polyend Tracker patterns.
 * Exports multi-track MIDI files compatible with Ableton Live and other DAWs.
 */

export function exportPatternAsMidi(
  tracks: { steps: { note: number; instrument: number }[]; length: number }[],
  bpm: number,
  trackNames?: string[],
): Uint8Array {
  const TICKS_PER_QUARTER = 480;
  const ticksPerStep = TICKS_PER_QUARTER / 4; // 16th note = 120 ticks

  // Collect tracks that have at least one note
  const activeTracks: { notes: { step: number; note: number; velocity: number }[]; name: string }[] = [];

  for (let t = 0; t < tracks.length; t++) {
    const track = tracks[t];
    const notes: { step: number; note: number; velocity: number }[] = [];

    for (let s = 0; s < track.length; s++) {
      const step = track.steps[s];
      if (step && step.note >= 0 && step.note <= 127) {
        const velocity = 100; // default velocity
        notes.push({ step: s, note: step.note, velocity });
      }
    }

    if (notes.length > 0) {
      const name = trackNames?.[t] || `Track ${t + 1}`;
      activeTracks.push({ notes, name });
    }
  }

  if (activeTracks.length === 0) return new Uint8Array(0);

  const numTracks = activeTracks.length + 1; // +1 for tempo track
  const chunks: Uint8Array[] = [];

  // Header chunk
  chunks.push(midiHeader(1, numTracks, TICKS_PER_QUARTER));

  // Tempo track (first track)
  chunks.push(midiTempoTrack(bpm, TICKS_PER_QUARTER));

  // Note tracks
  for (const track of activeTracks) {
    chunks.push(midiNoteTrack(track, ticksPerStep, TICKS_PER_QUARTER));
  }

  return concatArrays(chunks);
}

function midiHeader(format: number, numTracks: number, division: number): Uint8Array {
  const data = new Uint8Array(14);
  data.set([0x4d, 0x54, 0x68, 0x64], 0); // "MThd"
  data.set([0x00, 0x00, 0x00, 0x06], 4); // length = 6
  data.set([0x00, format], 8);             // format
  data.set([0x00, numTracks], 10);          // num tracks
  data.set([(division >> 8) & 0x7f, division & 0xff], 12); // division
  return data;
}

function midiTempoTrack(bpm: number, ticksPerQuarter: number): Uint8Array {
  const events: number[][] = [];

  // Tempo meta event: microseconds per quarter note
  const microPerQuarter = Math.round(60000000 / bpm);
  events.push([
    0x00, // delta time = 0
    0xff, 0x51, 0x03, // meta event: set tempo
    (microPerQuarter >> 16) & 0xff,
    (microPerQuarter >> 8) & 0xff,
    microPerQuarter & 0xff,
  ]);

  // Time signature: 4/4
  events.push([
    0x00, // delta time = 0
    0xff, 0x58, 0x04, // meta event: time signature
    0x04, // numerator = 4
    0x02, // denominator = 2 (power of 2, so 2^2 = 4)
    0x18, // clocks per click (24)
    0x08, // 32nd notes per quarter (8)
  ]);

  // End of track
  events.push([0x00, 0xff, 0x2f, 0x00]);

  return createTrackChunk(events.flat());
}

function midiNoteTrack(
  track: { notes: { step: number; note: number; velocity: number }[]; name: string },
  ticksPerStep: number,
  ticksPerQuarter: number,
): Uint8Array {
  const events: { time: number; data: number[] }[] = [];

  // Track name
  const nameBytes = new TextEncoder().encode(track.name);
  const nameEvent = [0xff, 0x03, nameBytes.length, ...nameBytes];
  events.push({ time: 0, data: nameEvent });

  const noteLength = ticksPerStep * 0.9; // slightly shorter than full step

  for (const { step, note, velocity } of track.notes) {
    const startTick = step * ticksPerStep;
    // Note On: channel 0, note, velocity
    events.push({ time: startTick, data: [0x90, note & 0x7f, velocity & 0x7f] });
    // Note Off: channel 0, note, velocity 0
    events.push({ time: startTick + Math.floor(noteLength), data: [0x80, note & 0x7f, 0x00] });
  }

  // Sort by time
  events.sort((a, b) => a.time - b.time);

  // Convert to delta times
  const deltaEvents: number[] = [];
  let prevTime = 0;
  for (const evt of events) {
    const delta = evt.time - prevTime;
    deltaEvents.push(...encodeVarLen(delta), ...evt.data);
    prevTime = evt.time;
  }

  // End of track
  deltaEvents.push(0x00, 0xff, 0x2f, 0x00);

  return createTrackChunk(deltaEvents);
}

function createTrackChunk(data: number[]): Uint8Array {
  const len = data.length;
  const chunk = new Uint8Array(8 + len);
  chunk.set([0x4d, 0x54, 0x72, 0x6b], 0); // "MTrk"
  chunk.set([(len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff], 4);
  chunk.set(data, 8);
  return chunk;
}

function encodeVarLen(value: number): number[] {
  const bytes: number[] = [];
  let v = value;
  do {
    bytes.unshift(v & 0x7f);
    v = Math.floor(v / 128);
  } while (v > 0);
  // Set continuation bit on all bytes except the last
  for (let i = 0; i < bytes.length - 1; i++) {
    bytes[i] |= 0x80;
  }
  return bytes;
}

function concatArrays(arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) totalLength += arr.length;
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
