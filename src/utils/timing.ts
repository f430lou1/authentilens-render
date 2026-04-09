import { BodyBeat } from "../types/remotion";

export type Segment = { from: number; durationInFrames: number };

export function buildBodySegments(
  startFrame: number,
  beats: BodyBeat[]
): Segment[] {
  const segs: Segment[] = [];
  let cursor = startFrame;
  for (const b of beats) {
    segs.push({ from: cursor, durationInFrames: b.frames });
    cursor += b.frames;
  }
  return segs;
}
