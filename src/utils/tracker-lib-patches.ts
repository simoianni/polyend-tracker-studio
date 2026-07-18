import Pattern from '@tracker-internals/patterns/pattern.js';

/**
 * Fixes a track-count detection bug in @polyend/tracker-lib (<= 0.1.2).
 *
 * The library's Pattern.detectTrackCount() computes expected file sizes with a
 * base of 26 bytes (HEADER 14 + PADDING 2 + UNUSED 10), but Pattern.parse()
 * actually consumes 28 bytes (HEADER 14 + PADDING 2 + 12 reserved) before the
 * track data. The 2-byte mismatch means no real file ever matches the 8- or
 * 12-track sizes, so everything falls back to 16 tracks — and parsing an
 * 8-track pattern from an old-firmware project (e.g. the official
 * "Polyend Tracker AE" artist packs, 6184 bytes) reads past the end of the
 * buffer and throws a RangeError. 16-track files only work by accident,
 * because 16 is the fallback.
 *
 * Import this module once (see main.ts) before using Tracker.readPattern.
 */
const HEADER_SIZE = 14;
const PADDING_SIZE = 2;
const RESERVED_SIZE = 12; // parse() skips 12 reserved bytes, not 10
const TRACK_SIZE = 1 + 6 * 128; // track header + 128 steps × 6 bytes
const CRC_SIZE = 4;

export function detectTrackCount(fileSize: number): number {
  const base = HEADER_SIZE + PADDING_SIZE + RESERVED_SIZE;
  for (const count of [8, 12, 16]) {
    if (fileSize === base + TRACK_SIZE * count + CRC_SIZE) return count;
  }
  return 16;
}

export function applyTrackerLibPatches(): void {
  (Pattern as unknown as { detectTrackCount: (fileSize: number) => number }).detectTrackCount = detectTrackCount;
}
