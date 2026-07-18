<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, PropType } from 'vue';
  import VueComp from '@/utils/vuecomp.ts';
  import { Input, NoteMessageEvent, Output, WebMidi } from 'webmidi';
  import Tracker, { InstrumentData, InstrumentPlayMode } from '@polyend/tracker-lib';
  import { downloadFile, requestFiles } from '@/utils/io.ts';
  import { combineAudioFiles, processAudioFile } from '@/utils/helpers.ts';

  import AudioEngine from '@/audio/engine.ts';
  import { VFSInstrument } from '@/types/audio-engine.ts';
  import AudioUtils from '@/audio/utils/audioutils.ts';

  import SamplePlayback from '@/components/instrument-editor/SamplePlayback.vue';
  import ParameterBar from '@/components/instrument-editor/ParameterBar.vue';
  import InstrumentParameters from '@/components/instrument-editor/InstrumentParameters.vue';
  import InstrumentAutomations from '@/components/instrument-editor/InstrumentAutomations.vue';
  import SampleEditor from '@/components/sample-editor/SampleEditor.vue';
  import SampleRecorder from '@/components/sample-editor/SampleRecorder.vue';
  import Button from '@/components/ui/Button.vue';

  import { ALL_NOTE_KEYCODES, ALL_OCTAVE_KEYCODES, KeyboardEvents, NoteKeyCodes } from '@/objects/keyboard.ts';
  import { NoteToMidiMap } from '@/types/pattern-editor.ts';
  import { InstrumentView } from '@/types/instrument-editor.ts';

  import ModalNewInstrument from '@/components/modals/ModalNewInstrument.vue';
  import ModalUseSampleCuepoints from '@/components/modals/ModalUseSampleCuepoints.vue';
  import ModalCreatedSliced from '@/components/modals/ModalCreatedSliced.vue';
  import ModalSaveInstrument from '@/components/modals/ModalSaveInstrument.vue';
  import ModalMidiConfig from '@/components/modals/ModalMidiConfig.vue';

  //---------------------------------------------------
  //
  //  Types
  //
  //---------------------------------------------------
  type ViewComponent = {
    executeAction(action: string, value?: any): void;
    render(): Promise<void>;
    update(): void;
  };

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    modelValue: {
      type: Object as PropType<InstrumentData | null>,
      default: null,
    },
    slotNumber: {
      type: Number,
      default: 0,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['update:modelValue', 'back']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const midiInput = ref<Input | undefined>();
  const midiOutput = ref<Output | undefined>();
  const availableMidiInputs = ref<string[]>([]);
  const availableMidiOutputs = ref<string[]>([]);

  const instrumentData = ref<InstrumentData | null>(null);
  let vfsInstrument: VFSInstrument | null = null;

  const heldNotes: Map<number, boolean> = new Map();
  let currentOctave: number = 5;

  const zoomPercentage = ref<number>(0.01);
  const activeSlice = ref<number>(0);

  const activeView = ref<ViewComponent | null>(null);
  const activeViewType = ref<InstrumentView>(InstrumentView.PLAYBACK);

  const recIsRecording = ref<boolean>(false);
  const recHasSource = ref<boolean>(false);
  const recAutoSampling = ref<boolean>(false);

  const activeInstrumentParameterPage = ref<number>(0);
  const activeAutomation = ref<number>(0);
  const activeAutomationPage = ref<number>(0);

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const computedViewLabel = computed(() => {
    const type = activeViewType.value;
    switch (type) {
      case InstrumentView.PLAYBACK:
        return 'Sample Playback';
      case InstrumentView.PARAMETERS:
        return 'Instrument Parameters 1/2';
      case InstrumentView.AUTOMATIONS:
        return 'Instrument Automations 2/2';
      case InstrumentView.EDITOR:
        return 'Sample Editor 1/2';
      case InstrumentView.RECORDER:
        return 'Sample Recorder 2/2';
    }
    return null;
  });

  const recHasMidiOutput = computed(() => {
    return !!midiOutput.value;
  });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  // watch(instrumentData, async (newval, oldval) => {}, { deep: true });

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal && newVal !== instrumentData.value) {
        instrumentData.value = newVal;
        changeActiveView(InstrumentView.PLAYBACK);
        nextTick(async () => {
          activeView.value?.render();
          if (AudioEngine.isInitialized) {
            vfsInstrument = await AudioEngine.addInstrument(newVal);
          }
        });
      }
    },
  );

  watch(instrumentData, (newVal) => {
    emit('update:modelValue', newVal);
  });

  watch(midiInput, (newInput, oldInput) => {
    if (oldInput) {
      oldInput.removeListener('noteon', handleMidiNoteOn);
      oldInput.removeListener('noteoff', handleMidiNoteOff);
    }
    if (newInput) {
      newInput.addListener('noteon', handleMidiNoteOn);
      newInput.addListener('noteoff', handleMidiNoteOff);
    }
  });

  //---------------------------------------------------
  //
  //  Vue Lifecycle
  //
  //---------------------------------------------------
  // onBeforeMount(() => {});
  onMounted(async () => {
    // MIDI is optional – the editor works with keyboard only
    try {
      await WebMidi.enable();
    } catch {
      // User denied MIDI permission or browser doesn't support it
      console.warn('Web MIDI not available – keyboard playback will still work');
    }
    if (WebMidi.enabled) {
      availableMidiInputs.value = WebMidi.inputs.map((o) => o.name);
      availableMidiOutputs.value = WebMidi.outputs.map((o) => o.name);
      const midiIn = localStorage.getItem('midi-in');
      const midiOut = localStorage.getItem('midi-out');
      if (midiIn) {
        midiInput.value = WebMidi.getInputByName(midiIn);
      }
      if (midiOut) {
        midiOutput.value = WebMidi.getOutputByName(midiOut);
      }
    }

    await AudioEngine.init();

    if (props.modelValue) {
      instrumentData.value = props.modelValue;
      changeActiveView(InstrumentView.PLAYBACK);
      nextTick(async () => {
        activeView.value?.render();
        if (AudioEngine.isInitialized) {
          vfsInstrument = await AudioEngine.addInstrument(props.modelValue!);
        }
      });
    }

    window.addEventListener(KeyboardEvents.KEY_DOWN, handleKeyboardEvents);
    window.addEventListener(KeyboardEvents.KEY_UP, handleKeyboardEvents);
  });
  // onBeforeUpdate(() => {});
  // onUpdated(() => {});
  // onActivated(() => {});
  // onDeactivated(() => {});
  onBeforeUnmount(async () => {
    window.removeEventListener(KeyboardEvents.KEY_DOWN, handleKeyboardEvents);
    window.removeEventListener(KeyboardEvents.KEY_UP, handleKeyboardEvents);

    const midi = midiInput.value;
    if (midi) {
      midi.removeListener('noteon', handleMidiNoteOn);
      midi.removeListener('noteoff', handleMidiNoteOff);
    }
    // NOTE: do NOT destroy AudioEngine here - PatternEditor uses it for playback
  });
  // onUnmounted(() => {});

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------
  async function createInstrumentFromSample() {
    const file = (await requestFiles('audio/*', false).catch(() => null)) as File | null;
    if (file) {
      let buffer: ArrayBuffer;
      let slices: number[];
      try {
        ({ buffer, slices } = await processAudioFile(file));
      } catch (e) {
        console.error('Failed to load sample:', file.name, e);
        alert(`Could not load "${file.name}": unsupported or corrupted audio file.`);
        return;
      }
      if (slices.length > 0) {
        VueComp.create(ModalUseSampleCuepoints, document.body, {
          numCuePoints: slices.length,
          onAction: (action: string) => {
            if (action === 'confirm') {
              loadInstrumentFromSample(buffer, slices);
            } else {
              loadInstrumentFromSample(buffer);
            }
          },
        });
      } else {
        loadInstrumentFromSample(buffer);
      }
    }
  }

  async function createSlicedInstrumentFromSamples() {
    const files = (await requestFiles('audio/*', true).catch(() => null)) as FileList | null;
    if (!files || files.length === 0) return;
    VueComp.create(ModalCreatedSliced, document.body, {
      files,
      onAction: async (files: File[]) => {
        const combined = await combineAudioFiles(files);
        if (combined) {
          loadInstrumentFromSample(combined.buffer, combined.slices);
        } else {
          alert('Could not create the sliced instrument: unsupported or corrupted audio files.');
        }
      },
    });
  }

  function loadInstrumentFromSample(buffer: ArrayBuffer, slices?: number[]) {
    const instrument = Tracker.createInstrument(buffer, slices);
    instrumentData.value = instrument;
    changeActiveView(InstrumentView.PLAYBACK);
    nextTick(async () => {
      activeView.value?.render();
      if (AudioEngine.isInitialized) {
        vfsInstrument = await AudioEngine.addInstrument(instrument);
      }
    });
  }

  function createEmptyInstrument() {
    instrumentData.value = Tracker.createInstrument();
    changeActiveView(InstrumentView.RECORDER);
    vfsInstrument = null;
    nextTick(() => {
      activeView.value?.update();
    });
  }

  //----------------------------------
  // UI Methods
  //----------------------------------
  async function changeActiveView(view: InstrumentView) {
    if (activeViewType.value !== view) {
      activeViewType.value = view;

      const instrument = instrumentData.value;
      if (view === InstrumentView.PLAYBACK && instrument) {
        nextTick(async () => {
          const instance = activeView.value;
          if (instance) {
            await instance.render();
          }
        });
      }
    }
  }

  //----------------------------------
  // Event Handlers
  //----------------------------------
  function handleKeyboardEvents(evt: KeyboardEvent) {
    if (evt.type === KeyboardEvents.KEY_DOWN) return handleKeyboardNoteOn(evt);
    if (evt.type === KeyboardEvents.KEY_UP) return handleKeyboardNoteOff(evt);
  }

  function handleParameterBarAction(actionobj: { action: string; value: any }) {
    const { action, value } = actionobj;
    switch (action) {
      case 'instrument-parameter-page':
        activeInstrumentParameterPage.value = value;
        break;
      case 'automation-page':
        activeInstrumentParameterPage.value = value;
        break;
      case 'change-active-slice':
        const instrument = instrumentData.value;
        if (instrument) {
          activeSlice.value = value;
          instrument.selectedSlice = value;
        }
        break;
      default:
        const instance = activeView.value;
        if (instance) {
          instance.executeAction(action, value);
        }
        break;
    }
  }

  function handleMidiNoteOn(evt: NoteMessageEvent) {
    if (vfsInstrument) {
      const [note, velocity] = evt.dataBytes;
      AudioEngine.notesOn(vfsInstrument, note, velocity);
      handleActiveSlice(note);
    }
  }

  function handleMidiNoteOff(evt: NoteMessageEvent) {
    if (vfsInstrument) {
      const [note] = evt.dataBytes;
      AudioEngine.notesOff(note);
    }
  }

  function handleKeyboardNoteOn(evt: KeyboardEvent) {
    const code = evt.code;
    if (vfsInstrument && ALL_NOTE_KEYCODES.includes(code)) {
      if (ALL_OCTAVE_KEYCODES.includes(code)) {
        switch (code) {
          case NoteKeyCodes.OctaveUp:
            currentOctave += 1;
            break;
          case NoteKeyCodes.OctaveDown:
            currentOctave -= 1;
            break;
        }
        currentOctave = AudioUtils.clamp(currentOctave, 0, 10);
        return;
      }

      const noteName = Object.keys(NoteKeyCodes).find((key) => NoteKeyCodes[key] === code);
      if (noteName) {
        const baseMidiNote = NoteToMidiMap[noteName];
        const value = baseMidiNote + currentOctave * 12 - 12;
        if (!heldNotes.has(value)) {
          heldNotes.set(value, true);
          AudioEngine.notesOn(vfsInstrument, value, 127);
          handleActiveSlice(value);
        }
      }
    }
  }

  function handleKeyboardNoteOff(evt: KeyboardEvent) {
    const code = evt.code;
    if (vfsInstrument && ALL_NOTE_KEYCODES.includes(code)) {
      const noteName = Object.keys(NoteKeyCodes).find((key) => NoteKeyCodes[key] === code);
      if (noteName) {
        const baseMidiNote = NoteToMidiMap[noteName];
        const value = baseMidiNote + currentOctave * 12 - 12;
        heldNotes.delete(value);
        AudioEngine.notesOff(value);
      }
    }
  }

  function handleActiveSlice(note: number) {
    const instrument = instrumentData.value;
    if (instrument && instrument.playmode === InstrumentPlayMode.BeatSlice) {
      const index = AudioUtils.clamp(Math.floor(note - 60), 0, instrument.numSlices - 1);
      instrument.selectedSlice = index;
      activeSlice.value = index;
    }
  }

  function handleInstrumentCreate() {
    VueComp.create(ModalNewInstrument, document.body, {
      onAction: (action: string) => {
        switch (action) {
          case 'empty':
            createEmptyInstrument();
            break;
          case 'sample':
            createInstrumentFromSample();
            break;
          case 'slice':
            createSlicedInstrumentFromSamples();
            break;
        }
      },
    });
  }

  async function handleInstrumentInput(file: File) {
    if (file) {
      const instrument = await Tracker.readInstrument(file);
      if (instrument) {
        instrumentData.value = instrument;
        await activeView.value?.render();

        if (AudioEngine.isInitialized) {
          vfsInstrument = await AudioEngine.addInstrument(instrument);
        }
      }
    }
  }

  async function handleInstrumentOutput() {
    const instrument = instrumentData.value;
    if (instrument) {
      VueComp.create(ModalSaveInstrument, document.body, {
        filename: instrument.sample.filename,
        onSave: async (filename: string) => {
          instrument.sample.filename = filename;
          await Tracker.writeInstrument(instrument);
        },
      });
    }
  }

  async function handleSampleUpdate(wav: ArrayBuffer) {
    const instrument = instrumentData.value;
    if (instrument) {
      instrument.setSample(wav);
      if (AudioEngine.isInitialized) {
        vfsInstrument = await AudioEngine.addInstrument(instrument);
      }
    }
  }

  function handleDownload() {
    const instrument = instrumentData.value;
    if (instrument && instrument.wav) {
      const filename = instrument.sample.filename.trim();
      downloadFile(`${filename}.wav`, instrument.getSampleAsBlob());
    }
  }

  function handleMidiConfig() {
    VueComp.create(ModalMidiConfig, document.body, {
      input: midiInput.value?.name,
      output: midiOutput.value?.name,
      availableInputs: availableMidiInputs.value,
      availableOutputs: availableMidiOutputs.value,
      onInput: (data: { input?: Input; output?: Output }) => {
        const { input, output } = data;
        if (input) {
          localStorage.setItem('midi-in', input.name);
          midiInput.value = input;
        }
        if (output) {
          localStorage.setItem('midi-out', output.name);
          midiOutput.value = output;
        }
      },
    });
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <div class="instrument-editor">
    <div class="infobar">
      {{ computedViewLabel }}
    </div>

    <SamplePlayback
      v-if="activeViewType === InstrumentView.PLAYBACK"
      ref="activeView"
      :instrument-data="instrumentData"
      v-model:zoomPercentage="zoomPercentage"
      v-model:active-slice-index="activeSlice"
    />

    <InstrumentParameters
      v-else-if="activeViewType === InstrumentView.PARAMETERS"
      ref="activeView"
      :page="activeInstrumentParameterPage"
      :instrument-data="instrumentData"
    />

    <InstrumentAutomations
      v-else-if="activeViewType === InstrumentView.AUTOMATIONS"
      ref="activeView"
      :instrument-data="instrumentData"
      v-model:page="activeAutomationPage"
      v-model:active-automation="activeAutomation"
    />

    <SampleEditor
      v-else-if="activeViewType === InstrumentView.EDITOR"
      ref="activeView"
      :instrument-data="instrumentData"
      @sample-update="handleSampleUpdate"
    />

    <SampleRecorder
      v-else-if="activeViewType === InstrumentView.RECORDER"
      ref="activeView"
      :midi-output="midiOutput"
      :instrument-data="instrumentData"
      v-model:is-recording="recIsRecording"
      v-model:has-recording-source="recHasSource"
      v-model:autosampling="recAutoSampling"
      @sample-update="handleSampleUpdate"
    />

    <ParameterBar
      :active-view="activeViewType"
      :instrument-data="instrumentData"
      :parameters="{
        zoomPercentage,
        activeSlice,
        activeInstrumentParameterPage,
        activeAutomationPage,
        activeAutomation,
        recIsRecording,
        recAutoSampling,
        recHasSource,
        recHasMidiOutput,
      }"
      @action="handleParameterBarAction"
    />
  </div>
  <div class="actions">
    <template v-if="instrumentData">
      <div class="group">
        <Button
          :focused="activeViewType === InstrumentView.PLAYBACK"
          @click="changeActiveView(InstrumentView.PLAYBACK)"
        >
          <sup>Sample</sup> Playback
        </Button>
        <Button
          :pages="[InstrumentView.PARAMETERS, InstrumentView.AUTOMATIONS]"
          :active-page="activeViewType"
          @page="changeActiveView($event)"
        >
          <sup>Instrument</sup> Parameters
        </Button>
        <Button
          :pages="[InstrumentView.EDITOR, InstrumentView.RECORDER]"
          :active-page="activeViewType"
          @page="changeActiveView($event)"
        >
          <sup>Sample</sup> Editor
        </Button>
      </div>
      <div class="group separator" />
    </template>

    <div class="group">
      <Button @click="handleInstrumentCreate"> <sup>New</sup> Instrument </Button>
      <Button type="file" @file="handleInstrumentInput" mime-types=".pti"> <sup>Load</sup> Instrument </Button>
      <Button v-if="instrumentData" @click="handleInstrumentOutput"> <sup>Save</sup> Instrument </Button>
      <Button red v-if="instrumentData" @click="handleDownload"> <sup>Save as</sup> .WAV </Button>
    </div>

    <div class="group separator" />

    <div class="group">
      <Button @click="handleMidiConfig"><sup>Configure</sup> MIDI</Button>
    </div>

    <div class="group separator" />

    <div class="group">
      <Button @click="emit('back')"><sup>Back to</sup> Pattern</Button>
    </div>
  </div>
</template>

<style lang="scss">
  div.instrument-editor {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-radius: 6px;
    min-height: 448px;
    min-width: 984px;
    box-shadow:
      0 0.5px 0 rgba(255, 255, 255, 0.15),
      0 -0.5px 0 rgba(255, 255, 0.255, 0.05);
    overflow: hidden;

    & > .infobar {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 6px;
      min-height: 26px;
      background: black;

      &:after {
        content: '';
        position: absolute;
        width: calc(100% - 2px);
        height: 1px;
        left: 1px;
        bottom: 0;
        background: linear-gradient(0deg, transparent 50%, white);
      }
    }

    & + .actions {
      position: relative;
      left: 1px;
    }
  }
</style>

<i18n />
