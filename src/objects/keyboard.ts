export enum KeyboardEvents {
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
}

export const StepAttributeKeyCodes = {
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
};

export const OperatorKeyCodes = {
  Escape: 'Escape',
  Backspace: 'Backspace',
  Delete: 'Delete',
};

export const ArrowKeyCodes = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
};

export const NoteKeyCodes = {
  C_Low: 'KeyZ',
  CSharp: 'KeyS',
  D: 'KeyX',
  DSharp: 'KeyD',
  E: 'KeyC',
  F: 'KeyV',
  FSharp: 'KeyG',
  G: 'KeyB',
  GSharp: 'KeyH',
  A: 'KeyN',
  ASharp: 'KeyJ',
  B: 'KeyM',
  C_High: 'Comma',
  OctaveDown: 'Period',
  OctaveUp: 'Slash',
};
export const NumberKeyCodes = {
  Digit1: 'Digit1',
  Digit2: 'Digit2',
  Digit3: 'Digit3',
  Digit4: 'Digit4',
  Digit5: 'Digit5',
  Digit6: 'Digit6',
  Digit7: 'Digit7',
  Digit8: 'Digit8',
  Digit9: 'Digit9',
  Digit0: 'Digit0',
  Numpad1: 'Numpad1',
  Numpad2: 'Numpad2',
  Numpad3: 'Numpad3',
  Numpad4: 'Numpad4',
  Numpad5: 'Numpad5',
  Numpad6: 'Numpad6',
  Numpad7: 'Numpad7',
  Numpad8: 'Numpad8',
  Numpad9: 'Numpad9',
  Numpad0: 'Numpad0',
};

export const ALL_NOTE_KEYCODES = Object.values(NoteKeyCodes);
export const ALL_NUMBER_KEYCODES = Object.values(NumberKeyCodes);
export const ALL_OCTAVE_KEYCODES = [NoteKeyCodes.OctaveDown, NoteKeyCodes.OctaveUp];
export const ALL_STEP_ATTRIBUTE_KEYCODES = Object.values(StepAttributeKeyCodes);
export const ALL_ARROW_KEYCODES = Object.values(ArrowKeyCodes);
export const ALL_KEYCODES = Object.values({
  ...StepAttributeKeyCodes,
  ...OperatorKeyCodes,
  ...ArrowKeyCodes,
  ...NumberKeyCodes,
  ...NoteKeyCodes,
});
