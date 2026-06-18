//----------------------------------
// Interfaces
//----------------------------------
import { InstrumentData } from '@polyend/tracker-lib';
import { ElemNode } from '@elemaudio/core';

export interface VFSInstrument {
  path: string;
  instrument: InstrumentData;
}

export interface InstrumentNode {
  id: string;
  gate: ElemNode;
  left: any;
  right: any;
  delaySend: number;
  reverbSend: number;
  volume: number;
}

export interface PartialInstrumentNode {
  id?: string;
  gate?: ElemNode;
  left?: any;
  right?: any;
  delaySend?: number;
  reverbSend?: number;
  volume?: number;
}
