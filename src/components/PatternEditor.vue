<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch, PropType } from 'vue';
  import Tracker, { PatternData, PatternFX, InstrumentData, ProjectData } from '@polyend/tracker-lib';
  import {
    AttributeListItem,
    CursorIndex,
    EffectList,
    InstrumentList,
    NoteToMidiMap,
    StepProperty,
  } from '@/types/pattern-editor.ts';
  import {
    ALL_KEYCODES,
    ALL_ARROW_KEYCODES,
    ALL_STEP_ATTRIBUTE_KEYCODES,
    StepAttributeKeyCodes,
    ALL_OCTAVE_KEYCODES,
    ALL_NOTE_KEYCODES,
    ALL_NUMBER_KEYCODES,
    OperatorKeyCodes,
    ArrowKeyCodes,
    KeyboardEvents,
    NoteKeyCodes,
  } from '@/objects/keyboard.ts';
  import Step from '@/components/pattern-editor/Step.vue';
  import Button from '@/components/ui/Button.vue';
  import ModalPatternCreate from '@/components/modals/ModalPatternCreate.vue';
  import VueComp from '@/utils/vuecomp.ts';
  import AudioEngine from '@/audio/engine.ts';
  import { VFSInstrument } from '@/types/audio-engine.ts';
  import { exportPatternAsMidi } from '@/utils/midi.ts';
  import { exportAbletonProject } from '@/utils/ableton.ts';
  import { exportTrackerProject, sanitizeTrackerName } from '@/utils/export.ts';
  import { downloadFile } from '@/utils/io.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    instrumentStore: {
      type: Map as PropType<Map<number, InstrumentData | null>>,
      default: () => new Map(),
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['edit-instrument', 'import-instruments']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const patternContainer = ref<HTMLDivElement | null>(null);
  const activeIndex = ref<CursorIndex>({ x: 0, y: 0 });
  const activeStep = ref<InstanceType<typeof Step> | null>(null);
  const steps = useTemplateRef('steps');

  //----------------------------------
  // Playback state
  //----------------------------------
  const isPlaying = ref(false);
  const bpm = ref(120);
  const playRow = ref(0);
  let playInterval: ReturnType<typeof setInterval> | null = null;
  const activeNotes: Map<string, VFSInstrument | null> = new Map();
  const loadedInstruments = new Map<number, VFSInstrument>();

  //----------------------------------
  // Overlay variables
  //----------------------------------
  const overlayContainer = ref<HTMLDivElement | null>(null);
  const overlayVisible = ref<boolean>(false);
  const overlayAttributesList = ref<AttributeListItem[]>([]);
  const overlayTitle = ref<string | null>(null);
  const overlayAttrIndex = ref<number>(0);

  //----------------------------------
  // State variables
  //----------------------------------
  const patternData = ref<PatternData | null>(null);
  let recMode: boolean;
  let activeStepProperty: StepProperty = StepProperty.NOTE;

  //----------------------------------
  // Keyboard variables
  //----------------------------------
  let activeKeyDown: string | null = null;
  let incUpdateTimer: number | undefined = undefined;
  let keyInputTimer: number | undefined = undefined;

  //----------------------------------
  // Value variables
  //----------------------------------
  const noteInput: number = 12;
  let valueInput: string = '';
  let currentOctave: number = 4;
  let currentInstrument: number = 0;

  const incrementSlow = 1;
  const incrementFast = 10;

  //----------------------------------
  // Constants
  //----------------------------------
  const STEP_HEIGHT = 18;
  const INITIAL_REPEAT_DELAY = 175;
  const SCROLL_THRESHOLD_FACTOR = 2.75;

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const tracks = computed(() => patternData.value?.tracks ?? []);

  const numTracks = computed(() => tracks.value.length);

  const numSteps = computed(() => {
    if (tracks.value.length > 0) {
      return tracks.value[0].length + 1;
    }
    return 0;
  });

  const trackData = computed(() =>
    tracks.value.map((track) => ({
      ...track,
      steps: track.steps.slice(0, track.length + 1),
    })),
  );

  const currentInstrumentSlot = computed(() => {
    const step = getCurrentStepData();
    return step ? step.instrument : 0;
  });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  // watch(value, (newval, oldval) => { console.log(newval, oldval); });

  watch(
    () => props.instrumentStore,
    async () => {
      if (isPlaying.value) {
        // Reload instruments while keeping playback running
        await ensureInstrumentsLoaded();
      }
    },
    { deep: true },
  );

  //---------------------------------------------------
  //
  //  Vue Lifecycle
  //
  //---------------------------------------------------
  // onBeforeMount(() => {});
  // onMounted(() => {});
  // onBeforeUpdate(() => {});
  // onUpdated(() => {});
  // onActivated(() => {});
  // onDeactivated(() => {});
  onBeforeUnmount(() => {
    removeInteractions();
  });
  // onUnmounted(() => {});

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------
  async function addInteractions() {
    const container = patternContainer.value as HTMLDivElement;
    if (!container) return;

    container.addEventListener(KeyboardEvents.KEY_DOWN, handleKeyboardEvents);
    container.addEventListener(KeyboardEvents.KEY_UP, handleKeyboardEvents);
    container.focus();

    nextTick(() => {
      activateStep(activeIndex.value);
    });
  }

  function removeInteractions() {
    activeKeyDown = null;
    overlayVisible.value = false;

    const container = patternContainer.value as HTMLDivElement;
    if (!container) return;

    container.removeEventListener(KeyboardEvents.KEY_DOWN, handleKeyboardEvents);
    container.removeEventListener(KeyboardEvents.KEY_UP, handleKeyboardEvents);
  }

  //----------------------------------
  // UI Overlay Methods
  //----------------------------------
  function overlayOpen() {
    const stepProperty = activeStepProperty;
    const visible = overlayVisible.value;
    if (recMode && activeKeyDown && !visible) {
      if (stepProperty == StepProperty.INSTRUMENT) {
        overlayTitle.value = 'Instruments';
        overlayAttributesList.value = InstrumentList;
        overlayAttrIndex.value = 0;

        const stepData = getCurrentStepData();
        if (stepData) {
          overlayAttrIndex.value = stepData.instrument;
        }
        overlayVisible.value = true;
      } else if (stepProperty == StepProperty.FX1 || stepProperty == StepProperty.FX2) {
        overlayTitle.value = 'Fx';
        overlayAttributesList.value = EffectList;

        const stepData = getCurrentStepData();
        if (stepData) {
          if (stepProperty === StepProperty.FX1) {
            overlayAttrIndex.value = stepData.fx[0].type.index;
          }
          if (stepProperty === StepProperty.FX2) {
            overlayAttrIndex.value = stepData.fx[1].type.index;
          }
        } else {
          overlayAttrIndex.value = 0;
        }

        overlayVisible.value = true;
      }
    }
  }

  function overlayClose() {
    const values = overlayAttributesList.value;
    const attribute = values.find((a) => a.index === overlayAttrIndex.value);
    if (attribute) {
      const fxCopy = structuredClone(PatternFX[attribute.index]);
      const stepData = getCurrentStepData();
      if (activeStepProperty == StepProperty.INSTRUMENT) {
        stepData.note = stepData.note === -1 ? noteInput : stepData.note;
        stepData.instrument = overlayAttrIndex.value;
        currentInstrument = stepData.instrument;
      } else if (activeStepProperty === StepProperty.FX1) {
        stepData.fx[0] = { type: fxCopy, value: fxCopy.default };
      } else if (activeStepProperty === StepProperty.FX2) {
        stepData.fx[1] = { type: fxCopy, value: fxCopy.default };
      }
    }

    overlayTitle.value = null;
    overlayAttributesList.value = [];
    overlayAttrIndex.value = 0;
    overlayVisible.value = false;
  }

  function overlayNavigate(keycode: string) {
    const values = overlayAttributesList.value;
    const currentIndex = values.findIndex((a) => a.index === overlayAttrIndex.value);
    let newIndex = currentIndex;

    switch (keycode) {
      case ArrowKeyCodes.ArrowUp:
        newIndex -= incrementSlow;
        break;
      case ArrowKeyCodes.ArrowDown:
        newIndex += incrementSlow;
        break;
      case ArrowKeyCodes.ArrowLeft:
        newIndex -= incrementFast;
        break;
      case ArrowKeyCodes.ArrowRight:
        newIndex += incrementFast;
        break;
    }

    const maxIndex = values.length - 1;
    if (newIndex < 0 && currentIndex !== 0) {
      newIndex = 0;
    } else if (newIndex < 0 && currentIndex === 0) {
      newIndex = values.length - 1;
    } else if (newIndex > maxIndex && currentIndex !== maxIndex) {
      newIndex = maxIndex;
    } else if (newIndex > maxIndex && currentIndex === maxIndex) {
      newIndex = 0;
    }
    overlayAttrIndex.value = values[newIndex].index;
    const container = overlayContainer.value as HTMLDivElement;
    if (container) {
      const threshold = Math.floor(maxIndex / SCROLL_THRESHOLD_FACTOR);
      const scrollTop = (newIndex - threshold) * STEP_HEIGHT;
      container.scrollTop = newIndex >= threshold ? scrollTop : 0;
    }
  }

  //----------------------------------
  // Navigation Methods
  //----------------------------------
  function updateCursor(newIndex: CursorIndex) {
    const index = { ...newIndex };
    const container = patternContainer.value as HTMLDivElement;
    const totalTracks = numTracks.value - 1;
    const totalSteps = numSteps.value - 1;

    if (index.x < 0) {
      index.x = 0;
    }
    if (index.x > totalTracks) {
      index.x = totalTracks;
    }
    if (index.y > totalSteps) {
      index.y = 0;
    }
    if (index.y < 0) {
      index.y = totalSteps;
    }

    if (container) {
      container.scrollTop = index.y * STEP_HEIGHT;
      if (index.x > numTracks.value / 2 - 1) {
        container.scrollLeft = container.scrollWidth;
      } else {
        container.scrollLeft = 0;
      }
    }

    activateStep(index);
  }

  //----------------------------------
  // Step State Methods
  //----------------------------------
  function activateStep(index: CursorIndex) {
    const oldStep = activeStep.value;
    if (oldStep) {
      oldStep.setActive(false);
    }

    const newStep = getStep(index);
    if (newStep) {
      activeStep.value = newStep;
      newStep.setActive(true, activeStepProperty, recMode);
      newStep.$el.focus();
    }
    activeIndex.value = index;
  }

  function updateStepState(incremental?: number, value?: number) {
    const step = activeStep.value;
    step?.updateState(activeStepProperty, recMode);

    if (incremental !== undefined || value !== undefined) {
      const inc = incremental || 0;
      const stepData = getCurrentStepData();
      if (stepData) {
        if (activeStepProperty === StepProperty.NOTE) {
          const note = stepData.note;
          const newval = value !== undefined ? value : note + inc;
          stepData.note = clampValue(newval, -4, 127);
          stepData.instrument = currentInstrument;
        } else if (activeStepProperty === StepProperty.INSTRUMENT) {
          const inst = stepData.instrument;
          const newval = value !== undefined ? value : inst + inc;
          stepData.instrument = clampValue(newval, 0, 66);
          currentInstrument = stepData.instrument;
        } else if (activeStepProperty === StepProperty.FX1) {
          const fx = stepData.fx[0];
          const newval = value !== undefined ? value : fx.value + inc;
          fx.value = clampValue(newval, fx.type.min, fx.type.max);
        } else if (activeStepProperty === StepProperty.FX2) {
          const fx = stepData.fx[1];
          const newval = value !== undefined ? value : fx.value + inc;
          fx.value = clampValue(newval, fx.type.min, fx.type.max);
        }
      }
    }
  }

  function deleteStepState() {
    const stepData = getCurrentStepData();
    if (stepData) {
      stepData.note = -1;
      stepData.instrument = 0;
      stepData.fx[0].value = 0;
      stepData.fx[0].type = structuredClone(PatternFX[0]);
      stepData.fx[1].value = 0;
      stepData.fx[1].type = structuredClone(PatternFX[0]);
    }
  }

  function getStep(index?: CursorIndex) {
    const idx = index || (activeIndex.value as CursorIndex);
    if (idx) {
      const x = idx.x > 0 ? idx.x * numSteps.value : 0;
      return (steps.value || [])[x + idx.y];
    }
    return null;
  }

  function getCurrentStepData() {
    const index = activeIndex.value;
    return trackData.value?.[index.x]?.steps?.[index.y] || null;
  }

  //----------------------------------
  // Helper Methods
  //----------------------------------
  const clampValue = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  };

  //----------------------------------
  // Event Handlers
  //----------------------------------
  function handleKeyboardEvents(evt: KeyboardEvent) {
    if (evt.code === 'Space') {
      evt.preventDefault();
      evt.stopPropagation();
      togglePlay();
      return;
    }
    if (evt.type === KeyboardEvents.KEY_DOWN) return handleKeyDown(evt);
    if (evt.type === KeyboardEvents.KEY_UP) return handleKeyUp(evt);
  }

  function handleKeyDown(evt: KeyboardEvent) {
    if (!ALL_KEYCODES.includes(evt.code)) return;
    const isArrowPress = ALL_ARROW_KEYCODES.includes(evt.code);
    const activeKeyDownIsStepAttr = activeKeyDown !== null && ALL_STEP_ATTRIBUTE_KEYCODES.includes(activeKeyDown);

    evt.preventDefault();
    evt.stopPropagation();

    if (
      isArrowPress &&
      (!recMode || (recMode && !activeKeyDownIsStepAttr)) &&
      (!recMode || (recMode && !evt.ctrlKey))
    ) {
      const index = activeIndex.value;
      switch (evt.code) {
        case ArrowKeyCodes.ArrowUp:
          updateCursor({ ...index, y: index.y - 1 });
          break;
        case ArrowKeyCodes.ArrowDown:
          updateCursor({ ...index, y: index.y + 1 });
          break;
        case ArrowKeyCodes.ArrowLeft:
          updateCursor({ ...index, x: index.x - 1 });
          break;
        case ArrowKeyCodes.ArrowRight:
          updateCursor({ ...index, x: index.x + 1 });
          break;
      }
    } else if (recMode) {
      if (evt.ctrlKey) {
        handleValueChangeByArrows(evt.code);
      } else if (ALL_NUMBER_KEYCODES.includes(evt.code)) {
        handleValueChangeByKeys(evt.key);
      } else if (ALL_NOTE_KEYCODES.includes(evt.code)) {
        handleNoteChange(evt.code);
      }
    }

    if (ALL_STEP_ATTRIBUTE_KEYCODES.includes(evt.code) && !recMode) {
      const keyToIndex: Record<string, number> = {
        [StepAttributeKeyCodes.NOTE]: 0,
        [StepAttributeKeyCodes.INSTRUMENT]: 1,
        [StepAttributeKeyCodes.FX1]: 2,
        [StepAttributeKeyCodes.FX2]: 3,
      };
      const index = keyToIndex[evt.code] ?? 0;
      const stepProperties = Object.values(StepProperty);
      activeStepProperty = stepProperties[index] || null;
      updateStepState();
    }

    if (!isArrowPress && (activeKeyDown === null || activeKeyDown !== evt.code)) {
      activeKeyDown = evt.code;
    }
    if (activeKeyDownIsStepAttr) {
      if (!overlayVisible.value) {
        overlayOpen();
      } else {
        overlayNavigate(evt.code);
      }
    }
  }

  function handleKeyUp(evt: KeyboardEvent) {
    if (evt.code === OperatorKeyCodes.Escape) {
      recMode = !recMode;
      updateStepState();
    }

    if (recMode && evt.code === OperatorKeyCodes.Delete) {
      deleteStepState();
    }

    if (incUpdateTimer !== undefined) {
      clearInterval(incUpdateTimer);
      incUpdateTimer = undefined;
    }

    if (activeKeyDown === evt.code) {
      activeKeyDown = null;
      overlayClose();
    }
  }

  function handleValueChangeByArrows(code: string) {
    if (incUpdateTimer === undefined) {
      let incremental = 0;
      switch (code) {
        case ArrowKeyCodes.ArrowUp:
          incremental = incrementSlow;
          break;
        case ArrowKeyCodes.ArrowDown:
          incremental = -incrementSlow;
          break;
        case ArrowKeyCodes.ArrowLeft:
          incremental = activeStepProperty === StepProperty.NOTE ? -12 : -incrementFast;
          break;
        case ArrowKeyCodes.ArrowRight:
          incremental = activeStepProperty === StepProperty.NOTE ? 12 : incrementFast;
          break;
      }

      if (incremental !== 0) {
        updateStepState(incremental);
        let speed = INITIAL_REPEAT_DELAY;
        const loop = () => {
          updateStepState(incremental);
          speed = Math.max(25, speed - 25);
          incUpdateTimer = window.setTimeout(loop, speed);
        };
        incUpdateTimer = window.setTimeout(loop, speed);
      }
    }
  }

  function handleValueChangeByKeys(value: string) {
    window.clearTimeout(keyInputTimer);
    valueInput += value;
    updateStepState(undefined, parseInt(valueInput, 10));
    keyInputTimer = window.setTimeout(() => {
      valueInput = '';
    }, 300);
  }

  function handleNoteChange(code: string) {
    if (ALL_OCTAVE_KEYCODES.includes(code)) {
      switch (code) {
        case NoteKeyCodes.OctaveUp:
          currentOctave += 1;
          break;
        case NoteKeyCodes.OctaveDown:
          currentOctave -= 1;
          break;
      }
      currentOctave = clampValue(currentOctave, 0, 10);
      return;
    }

    const noteName = Object.keys(NoteKeyCodes).find((key) => NoteKeyCodes[key] === code);
    if (noteName) {
      const baseMidiNote = NoteToMidiMap[noteName];
      const value = baseMidiNote + currentOctave * 12 - 12;
      updateStepState(undefined, value);
    }
  }

  function handlePatternCreate() {
    VueComp.create(ModalPatternCreate, document.body, {
      onCreate: (data: { tracks: number; steps: number }) => {
        const { tracks, steps } = data;
        removeInteractions();
        patternData.value = Tracker.createPattern(tracks, steps);
        nextTick(async () => {
          await addInteractions();
        });
      },
    });
  }

  async function handlePatternInput(file: File) {
    if (file) {
      removeInteractions();
      patternData.value = await Tracker.readPattern(file);
      nextTick(async () => {
        await addInteractions();
      });
    }
  }

  async function handlePatternOutput() {
    const pattern = patternData.value;
    if (pattern) {
      await Tracker.writePattern(pattern);
    }
  }

  async function handleMidiExport() {
    const pattern = patternData.value;
    if (!pattern) return;
    const data = exportPatternAsMidi(pattern.tracks, bpm.value);
    if (data.length === 0) return;
    // Copy into a fresh ArrayBuffer-backed view — TS 5.7+ narrows BlobPart to
    // ArrayBufferView<ArrayBuffer>, which Uint8Array<ArrayBufferLike> fails.
    const buffer = new Uint8Array(data).buffer as ArrayBuffer;
    downloadFile('Pattern.mid', new Blob([buffer], { type: 'audio/midi' }));
  }

  async function handleAbletonExport() {
    const patterns =
      projectPatterns.value.length > 0
        ? projectPatterns.value
        : patternData.value
          ? [{ name: 'Pattern', data: patternData.value }]
          : [];

    if (patterns.length === 0) return;

    // Convert instrumentStore Map to array
    const instruments: (InstrumentData | null)[] = [];
    const store = props.instrumentStore;
    if (store) {
      for (const [slot, data] of store.entries()) {
        instruments[slot] = data;
      }
    }

    try {
      const blob = await exportAbletonProject(instruments, patterns, bpm.value, 'Tracker Project');
      downloadFile('Tracker_Project.zip', blob);
    } catch (e) {
      console.error('Export failed:', e);
    }
  }

  async function handleProjectExport() {
    const patterns =
      projectPatterns.value.length > 0
        ? projectPatterns.value
        : patternData.value
          ? [{ name: 'Pattern 1', data: patternData.value }]
          : [];

    if (patterns.length === 0) return;

    // Convert instrumentStore Map to a slot-indexed array
    const instruments: (InstrumentData | null)[] = [];
    const store = props.instrumentStore;
    if (store) {
      for (const [slot, data] of store.entries()) {
        instruments[slot] = data;
      }
    }

    const projectName = importedProjectName.value || 'Tracker Project';

    try {
      const blob = await exportTrackerProject({
        projectName,
        bpm: bpm.value,
        patterns,
        instruments,
        baseProject: importedProject.value,
      });
      downloadFile(`${sanitizeTrackerName(projectName, 32)}.zip`, blob);
    } catch (e) {
      console.error('Project export failed:', e);
    }
  }

  //----------------------------------
  // Import Project
  //----------------------------------
  const projectPatterns = ref<{ name: string; data: PatternData }[]>([]);
  const activePatternIndex = ref<number>(-1);
  // Full ProjectData from an imported project.mt — kept so that re-exporting
  // preserves song structure, track names and delay/reverb settings.
  const importedProject = ref<ProjectData | null>(null);
  const importedProjectName = ref<string>('');

  // Full editor reset: playback, patterns, imported project, BPM.
  // Called by App.vue's "Clear" button, and before importing a new project.
  function clearAll() {
    if (isPlaying.value) {
      stopPlayback();
    }
    removeInteractions();
    patternData.value = null;
    projectPatterns.value = [];
    activePatternIndex.value = -1;
    importedProject.value = null;
    importedProjectName.value = '';
    bpm.value = 120;
  }

  defineExpose({ clearAll });

  async function handleImportProject(files: File[]) {
    // A project import replaces the whole editor state — leftovers from a
    // previously loaded project (patterns, BPM, project data) must not survive.
    clearAll();

    const instruments: { slot: number; data: InstrumentData }[] = [];
    const patterns: { name: string; data: PatternData }[] = [];
    const rootPatterns: { name: string; data: PatternData }[] = [];

    let projectFile: File | undefined;
    for (const file of files) {
      if (file.name.toLowerCase() === 'project.mt') {
        projectFile = file;
        break;
      }
    }

    if (projectFile) {
      try {
        const projectData = await Tracker.readProject(projectFile);
        if (projectData) {
          bpm.value = projectData.values.globalTempo || 120;
          importedProject.value = projectData;
          importedProjectName.value = projectData.projectName || '';
        }
      } catch (e) {
        console.warn('Failed to read project.mt:', e);
      }
    }

    for (const file of files) {
      if (file === projectFile) continue;
      const path = (file as any).webkitRelativePath || file.name;
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'pti') {
        const slotMatch = file.name.match(/^(\d+)/);
        if (slotMatch) {
          const slot = parseInt(slotMatch[1], 10) - 1;
          try {
            const data = await Tracker.readInstrument(file);
            if (data) {
              instruments.push({ slot, data });
            }
          } catch (e) {
            console.warn('Failed to load instrument:', file.name, e);
          }
        }
      } else if (ext === 'mtp') {
        try {
          const data = await Tracker.readPattern(file);
          if (data) {
            const name = file.name.replace(/\.mtp$/i, '');
            if (path.includes('patterns/')) {
              patterns.push({ name, data });
            } else {
              rootPatterns.push({ name, data });
            }
          }
        } catch (e) {
          console.warn('Failed to load pattern:', file.name, e);
        }
      }
      // .patch files are ignored (not valid tracker patterns)
    }

    const allPatterns = [...rootPatterns, ...patterns].sort((a, b) => {
      const numA = parseInt(a.name.match(/(\d+)/)?.[1] || '0', 10);
      const numB = parseInt(b.name.match(/(\d+)/)?.[1] || '0', 10);
      if (numA !== numB) return numA - numB;
      return a.name.localeCompare(b.name);
    });
    projectPatterns.value = allPatterns;

    // Always emit — even with zero instruments — so App.vue replaces the whole
    // instrument set (a project with no readable instruments must still clear
    // the leftovers from the previous session).
    emit('import-instruments', instruments);

    if (allPatterns.length > 0) {
      removeInteractions();
      patternData.value = allPatterns[0].data;
      activePatternIndex.value = 0;
      nextTick(async () => {
        await addInteractions();
      });
    }
  }

  function selectProjectPattern(index: number) {
    if (index >= 0 && index < projectPatterns.value.length) {
      removeInteractions();
      patternData.value = projectPatterns.value[index].data;
      activePatternIndex.value = index;
      nextTick(async () => {
        await addInteractions();
      });
    }
  }

  //----------------------------------
  // Playback Methods
  //----------------------------------
  async function togglePlay() {
    if (isPlaying.value) {
      stopPlayback();
    } else {
      await startPlayback();
    }
  }

  async function startPlayback() {
    if (!patternData.value) return;

    isPlaying.value = true;
    playRow.value = 0;

    await ensureInstrumentsLoaded();

    // Scroll to top
    if (patternContainer.value) {
      patternContainer.value.scrollTop = 0;
    }

    const msPerStep = ((60 / bpm.value) * 1000) / 4;

    const play = () => {
      if (!isPlaying.value || !patternData.value) return;

      playCurrentRow();
      playRow.value++;

      if (playRow.value >= numSteps.value) {
        playRow.value = 0;
      }

      scrollToPlayRow();
      playInterval = setTimeout(play, msPerStep);
    };

    play();
  }

  function scrollToPlayRow() {
    const container = patternContainer.value;
    if (!container) return;
    const targetY = playRow.value * STEP_HEIGHT;
    const halfVisible = Math.floor(container.clientHeight / 2);
    container.scrollTop = Math.max(0, targetY - halfVisible + STEP_HEIGHT);
  }

  function stopPlayback() {
    isPlaying.value = false;
    if (playInterval !== null) {
      clearTimeout(playInterval);
      playInterval = null;
    }
    // Release all active notes
    activeNotes.forEach((vfs, key) => {
      const noteNum = parseInt(key.split('-')[2], 10);
      if (vfs && !isNaN(noteNum)) {
        AudioEngine.notesOff(noteNum);
      }
    });
    activeNotes.clear();
    playRow.value = 0;
  }

  async function ensureInstrumentsLoaded() {
    if (!AudioEngine.isInitialized) {
      await AudioEngine.init();
    }

    const store = props.instrumentStore;
    if (!store) return;

    // Always reload all instruments to ensure fresh VFSInstrument refs
    loadedInstruments.clear();
    for (const [slot, data] of store.entries()) {
      if (data) {
        const vfs = await AudioEngine.addInstrument(data);
        if (vfs) loadedInstruments.set(slot, vfs);
      }
    }
  }

  function playCurrentRow() {
    if (!patternData.value) return;
    const tracks = patternData.value.tracks;
    const row = playRow.value;

    // Note off previous notes
    activeNotes.forEach((vfs, key) => {
      const noteNum = parseInt(key.split('-')[2], 10);
      if (vfs && !isNaN(noteNum)) {
        try {
          AudioEngine.notesOff(noteNum);
        } catch {
          /* ignore */
        }
      }
    });
    activeNotes.clear();

    // Play notes for current row
    for (let t = 0; t < tracks.length; t++) {
      const step = tracks[t].steps[row];
      if (!step || step.note < 0) continue;

      const note = step.note;
      const instrumentSlot = step.instrument || 0;
      const vfs = loadedInstruments.get(instrumentSlot);
      if (vfs) {
        try {
          AudioEngine.notesOn(vfs, note, 100);
          activeNotes.set(`track-${t}-row-${row}`, vfs);
        } catch {
          // AudioEngine might be stale, skip this note
        }
      }
    }
  }

  function handleBpmChange(delta: number) {
    bpm.value = Math.max(20, Math.min(300, bpm.value + delta));
    if (isPlaying.value) {
      stopPlayback();
      startPlayback();
    }
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <div class="pattern-editor">
    <div ref="patternContainer" class="pattern" tabindex="0">
      <div class="track-names">
        <div><span>--</span></div>
        <div v-for="num in numTracks" :key="`title-${num}`">
          <span>Track {{ num }}</span>
        </div>
      </div>
      <div class="data">
        <div class="lane left">
          <span v-for="num in numSteps" :key="`step-${num}`" :class="{ beat: (num - 1) % 4 === 0 }">
            {{ num }}
          </span>
        </div>
        <div class="tracks">
          <div v-for="(track, x) in trackData" class="track" :key="`track-${x}`">
            <Step
              ref="steps"
              v-for="(step, y) in track.steps"
              :key="`track-${x}-step-${y}`"
              :step-data="step"
              :on-beat="y % 4 === 0"
              :playing="isPlaying && y === playRow"
            />
          </div>
        </div>
        <div class="lane right" />
      </div>
    </div>
    <div v-if="overlayVisible" ref="overlayContainer" class="overlay">
      <h3>{{ overlayTitle }}</h3>
      <ul>
        <li
          v-for="(attr, aidx) in overlayAttributesList"
          :key="`attr-${aidx}`"
          :data-index="attr.index"
          :class="{ active: overlayAttrIndex === attr.index }"
        >
          <template v-if="attr.symbol">
            <span class="symbol">{{ attr.symbol }}</span>
            <span class="symbol delimiter"> - </span>
          </template>
          <span class="label">{{ attr.label }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="actions">
    <div class="group">
      <Button @click="handlePatternCreate"> <sup>New</sup> Pattern </Button>
      <Button type="file" mime-types=".mtp" @file="handlePatternInput"> <sup>Load</sup> Pattern </Button>
      <Button type="folder" @folder="handleImportProject"> <sup>Import</sup> Project </Button>
      <Button v-if="patternData" @click="handlePatternOutput"> <sup>Save</sup> Pattern </Button>
    </div>
    <div v-if="projectPatterns.length > 1" class="group separator" />
    <div v-if="projectPatterns.length > 1" class="group">
      <select
        class="pattern-select"
        :value="activePatternIndex"
        @change="selectProjectPattern(parseInt(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="(p, i) in projectPatterns" :key="i" :value="i">{{ p.name }}</option>
      </select>
    </div>
    <div v-if="patternData" class="group separator" />
    <div v-if="patternData" class="group">
      <Button @click="togglePlay">
        <sup>{{ isPlaying ? 'Stop' : 'Play' }}</sup>
      </Button>
      <span class="bpm-display">
        <span class="bpm-label">BPM</span>
        <span class="bpm-value">{{ bpm }}</span>
        <span class="bpm-arrows">
          <button class="bpm-btn" @click="handleBpmChange(1)">+</button>
          <button class="bpm-btn" @click="handleBpmChange(-1)">-</button>
        </span>
      </span>
    </div>
    <div v-if="patternData" class="group separator" />
    <div v-if="patternData" class="group">
      <Button @click="handleMidiExport"> <sup>Export</sup> MIDI </Button>
      <Button @click="handleAbletonExport"> <sup>Export</sup> Ableton </Button>
      <Button @click="handleProjectExport"> <sup>Export</sup> Project </Button>
    </div>
    <div v-if="patternData" class="group separator" />
    <div v-if="patternData" class="group">
      <Button @click="emit('edit-instrument', currentInstrumentSlot)">
        <sup>Edit</sup> Instrument {{ currentInstrumentSlot }}</Button
      >
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/scss/fonts';

  div.pattern-editor {
    position: relative;
    background: var(--pattern-bg-color);
    // background-image: url('@/assets/svgs/logo-polyend.svg');
    background-position: center center;
    background-repeat: repeat;
    background-size: auto 10%;
    border-radius: 6px;
    box-shadow:
      0 0.5px 0 rgba(255, 255, 255, 0.15),
      0 -0.5px 0 rgba(255, 255, 0.255, 0.05);
    overflow: hidden;

    & > div.pattern {
      position: relative;
      font-size: 12px;
      width: 100vw;
      max-width: calc((124px * 8) + 36px + (3px * 7));
      height: calc((var(--pattern-step-height) * 32) + 7px);
      max-height: calc((var(--pattern-step-height) * 32) + 7px);
      overflow: hidden;
      border: 2px solid var(--pattern-bg-color);
      padding: 2px 0 5px 0;
      outline: 0;

      & > div.track-names {
        position: sticky;
        top: 0;
        display: flex;
        gap: 3px;
        z-index: 4;

        & > div {
          min-width: 124px;
          padding: 0;
          height: var(--pattern-step-height);

          & > span {
            background-color: var(--pattern-track-label-bg-color);
            color: var(--pattern-track-label-color);
            font-weight: bold;
            padding: 2px 4px;
            user-select: none;
          }

          &:first-of-type {
            max-width: 27px;
            min-width: 27px;
            width: 27px;
            height: var(--pattern-step-height);
            padding: 0;
            opacity: 0;
          }
        }
      }

      & > div.data {
        display: flex;
        width: auto;
        padding: calc(var(--pattern-step-height) * 15) 0;

        & > div.lane {
          position: sticky;
          left: 0;
          background: var(--pattern-step-bg-color);
          z-index: 3;

          &.right {
            left: auto;
            opacity: 0;
            min-width: 1px;
            overflow: hidden;
            padding: 0;
          }

          & > span {
            display: flex;
            align-items: center;
            min-width: 30px;
            height: var(--pattern-step-height);
            padding: 0 1ch;
            color: var(--pattern-step-label-color);
            border-right: 3px solid var(--pattern-bg-color);
            user-select: none;

            &.beat {
              background: var(--pattern-step-beat-bg-color);
            }
          }
        }

        & > div.tracks {
          display: flex;
          gap: 3px;

          & > div > div {
            height: var(--pattern-step-height);
          }

          & > div.track {
            min-width: 17ch;
          }
        }
      }
    }

    & > .overlay {
      position: absolute;
      top: 2px;
      right: 2px;
      border-radius: 0 6px 6px 0;
      height: calc(100% - 4px);
      min-width: 180px;
      max-height: 100%;
      overflow: hidden;
      background: var(--pattern-overlay-bg-color);
      z-index: 5;
      user-select: none;

      & > h3 {
        position: sticky;
        top: 0;
        font-size: 13px;
        padding: 0 8px;
        height: var(--pattern-step-height);
        background: var(--pattern-overlay-accent-color);
        list-style-type: none;
        color: var(--pattern-overlay-title-color);
      }

      & > ul {
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        margin: 0;
        list-style-type: none;
        color: var(--pattern-overlay-accent-color);
        min-height: 100%;

        & > li {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0 16px;
          margin: 0;
          height: 18px;
          border: 2px solid transparent;
          font-size: 12px;
          color: var(--pattern-overlay-text-color);

          &.active {
            border: 2px solid var(--pattern-overlay-accent-color);
            color: var(--pattern-overlay-accent-color);
          }

          & > span {
            display: inline-block;
            &.symbol {
              min-width: 12px;
            }
          }
        }
      }
    }
  }

  .bpm-display {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: var(--pattern-step-bg-color);
    border-radius: 4px;
    user-select: none;

    .bpm-label {
      font-size: 10px;
      color: #888;
      text-transform: uppercase;
    }

    .bpm-value {
      font-size: 14px;
      color: #fff;
      font-weight: bold;
      min-width: 30px;
      text-align: center;
    }

    .bpm-arrows {
      display: flex;
      flex-direction: column;
      gap: 0;

      .bpm-btn {
        background: transparent;
        border: none;
        color: #888;
        font-size: 10px;
        cursor: pointer;
        line-height: 1;
        padding: 0 2px;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .pattern-select {
    background: #1e1f21;
    color: #fff;
    border: 2px solid black;
    border-radius: 6px;
    padding: 4px 8px;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    min-width: 140px;

    &:focus {
      outline: 0;
      border-color: #444;
    }
  }
</style>
