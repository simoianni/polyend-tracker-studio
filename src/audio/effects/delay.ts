import { el, ElemNode } from '@elemaudio/core';
import { SAMPLE_RATE } from '@polyend/tracker-lib';

export interface StereoDelayParams {
  key: string;
  timeL: number; // ms
  timeR: number; // ms
  feedback: number; // 0–1
  pingPong?: boolean; // if true, cross-feed feedback
}

export function stereoDelay(props: StereoDelayParams): [ElemNode, ElemNode] {
  const { key, timeL, timeR, feedback, pingPong = false } = props;
  const ms2samps = (ms: number) => SAMPLE_RATE * (ms / 1000);

  // TapIn from engine
  const tapL = el.tapIn({ name: `${key}:l` });
  const tapR = el.tapIn({ name: `${key}:r` });

  // Feedback taps
  const fbL = el.tapIn({ name: `${key}:fbL` });
  const fbR = el.tapIn({ name: `${key}:fbR` });

  // If pingPong is enabled, cross-feed feedback paths
  const fbSourceL = pingPong ? fbR : fbL;
  const fbSourceR = pingPong ? fbL : fbR;

  // Left delay
  const dl = el.delay({ size: ms2samps(2000) }, ms2samps(timeL), 0, el.add(tapL, el.mul(feedback, fbSourceL)));

  // Right delay
  const dr = el.delay({ size: ms2samps(2000) }, ms2samps(timeR), 0, el.add(tapR, el.mul(feedback, fbSourceR)));

  // Send delay outputs back into feedback taps
  const fbLOut = el.tapOut({ name: `${key}:fbL` }, dl);
  const fbROut = el.tapOut({ name: `${key}:fbR` }, dr);

  return [fbLOut, fbROut];
}
