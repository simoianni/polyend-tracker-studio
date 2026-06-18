<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, PropType } from 'vue';
  import { InstrumentData, InstrumentPlayMode } from '@polyend/tracker-lib';
  import {
    formatAutomationShape,
    formatAutomationType,
    formatFilterType,
    formatGranularLoopType,
    formatGranularShape,
    formatMilliSeconds,
    formatNumber,
    formatSeconds,
  } from '@/utils/helpers.ts';
  import { InstrumentView } from '@/types/instrument-editor.ts';

  type ParamObject = {
    type?: 'button' | 'incremental';
    label?: string;
    value?: number | string;
    method?: any;
    classes?: string[];
    action?: string;
    max?: number;
    more?: boolean;
    disabled?: boolean;
  };

  type Options = {
    zoomPercentage: number;
    activeSlice: number;
    activeInstrumentParameterPage: number;
    activeAutomationPage: number;
    activeAutomation: number;
    recIsRecording: boolean;
    recHasSource: boolean;
    recAutoSampling: boolean;
    recHasMidiOutput: boolean;
  };

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    activeView: {
      type: Number as PropType<InstrumentView>,
      default: 0,
    },
    instrumentData: {
      type: Object as PropType<InstrumentData | null>,
      default: null,
    },
    parameters: {
      type: Object as PropType<Options>,
      default: {
        zoomPercentage: 0.01,
        activeSlice: 0,
        activeInstrumentParameterPage: 0,
        activeAutomationPage: 0,
        activeAutomation: 0,
      } as Options,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['action']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  // const value = ref();
  const drag = {
    distance: 0,
    threshold: 6,
  };

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const computedParameters = computed(() => {
    const instrument = props.instrumentData;
    const parameters = props.parameters;
    if (instrument) {
      switch (props.activeView) {
        case InstrumentView.PLAYBACK:
          return getPlaybackParameters(instrument);
        case InstrumentView.PARAMETERS:
          return getInstrumentParameters(instrument);
        case InstrumentView.AUTOMATIONS:
          return getAutomationParameters(instrument);
        case InstrumentView.EDITOR:
          return getSampleEditorParameters();
        case InstrumentView.RECORDER:
          return getSampleRecorderParameters(parameters);
      }
    }
    return [];
  });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  // watch(value, (newval, oldval) => { console.log(newval, oldval); });

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
  // onBeforeUnmount(() => {});
  // onUnmounted(() => {});

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------

  //----------------------------------
  // Get Parameters Methods
  //----------------------------------
  function getPlaybackParameters(instrument: InstrumentData): ParamObject[] {
    const { playmode } = instrument;
    const sliceModes = [InstrumentPlayMode.Slice, InstrumentPlayMode.BeatSlice];
    const loopedModes = [
      InstrumentPlayMode.ForwardLoop,
      InstrumentPlayMode.BackwardLoop,
      InstrumentPlayMode.PingpongLoop,
    ];
    const params = props.parameters;

    if (playmode === InstrumentPlayMode.OneShot) {
      return [
        {},
        { label: 'Start', value: formatSeconds(instrument.startPoint, instrument) },
        {},
        {},
        { label: 'End', value: formatSeconds(instrument.endPoint, instrument) },
        { label: 'Zoom', value: formatNumber(params.zoomPercentage) },
        { label: 'Play Modes', classes: ['playmode'] },
      ];
    }

    if (loopedModes.includes(playmode)) {
      return [
        {},
        { label: 'Start', value: formatSeconds(instrument.startPoint, instrument) },
        { label: 'Loop Start', value: formatSeconds(instrument.loopPoint1, instrument) },
        { label: 'Loop End', value: formatSeconds(instrument.loopPoint2, instrument) },
        { label: 'End', value: formatSeconds(instrument.endPoint, instrument) },
        { label: 'Zoom', value: formatNumber(params.zoomPercentage) },
        { label: 'Play Modes', classes: ['playmode'] },
      ];
    }

    if (sliceModes.includes(playmode)) {
      return [
        {
          type: 'incremental',
          label: 'Slice',
          value: `${params.activeSlice + 1} of ${instrument.numSlices}`,
          method: handleSliceChange,
        },
        {
          label: 'Adjust',
          value: formatSeconds(instrument.slices[params.activeSlice], instrument),
        },
        {},
        { type: 'button', label: 'Add', action: 'slice-add' },
        { type: 'button', label: 'Remove', action: 'slice-remove' },
        { label: 'Zoom', value: formatNumber(params.zoomPercentage) },
        { label: 'Play Modes', classes: ['playmode'] },
      ];
    }

    if (playmode === InstrumentPlayMode.Granular) {
      return [
        {},
        {
          label: 'Position',
          value: formatSeconds(instrument.granular.currentPosition, instrument),
        },
        {
          label: 'Length',
          value: formatMilliSeconds(instrument.granular.grainLength, instrument),
        },
        {
          type: 'button',
          label: 'Shape',
          value: formatGranularShape(instrument.granular.shape),
          action: 'granular-shape',
        },
        {
          type: 'button',
          label: 'Loop',
          value: formatGranularLoopType(instrument.granular.type),
          action: 'granular-loop',
        },
        { label: 'Play Modes', classes: ['playmode'] },
      ];
    }

    if (playmode === InstrumentPlayMode.Wavetable) {
      return [
        {
          type: 'incremental',
          label: 'Position',
          value: `${instrument.wavetableCurrentWindow}`,
          method: handleWavetableWindow,
        },
        {
          type: 'incremental',
          label: 'Window',
          value: `${instrument.sample.wavetable.windowSize}`,
          method: handleWavetableSize,
        },
        {},
        {},
        {},
        { label: 'Play Modes', classes: ['playmode'] },
      ];
    }

    return [];
  }

  function getInstrumentParameters(instrument: InstrumentData): ParamObject[] {
    const page = props.parameters.activeInstrumentParameterPage;
    if (page === 0) {
      return [
        { label: 'Volume', value: instrument.volume || '0' },
        { label: 'Panning', value: instrument.panning || '0' },
        { label: 'Tune', value: instrument.tune || '0' },
        { label: 'Finetune', value: instrument.finetune || '0' },
        {
          label: 'Filter Type',
          value: instrument.filterEnabled ? formatFilterType(instrument.filterType) : 'Disabled',
        },
        { label: 'Cutoff', value: formatNumber(instrument.cutoff) },
        { label: 'Resonance', value: formatNumber(instrument.resonance) },
        {
          type: 'button',
          label: 'More',
          more: true,
          value: page,
          max: 2,
          method: toggleInstrumentParameterPages,
        },
      ];
    }

    return [
      { label: 'Overdrive', value: instrument.overdrive || '0' },
      { label: 'Bit Depth', value: instrument.bitdepth },
      { label: 'Reverb', value: instrument.reverbSend || '0' },
      { label: 'Delay', value: instrument.delaySend || '0' },
      {},
      {},
      {},
      {
        type: 'button',
        label: 'More',
        more: true,
        value: page,
        max: 2,
        method: toggleInstrumentParameterPages,
      },
    ];
  }

  function getAutomationParameters(instrument: InstrumentData): ParamObject[] {
    const page = props.parameters.activeAutomationPage;
    const activeAutomation = props.parameters.activeAutomation;
    const automation = instrument.automations[activeAutomation];
    const envelope = automation.envelope;
    const lfo = automation.lfo;
    if (page !== 1) {
      return [
        { label: 'Destination', classes: ['automation-destination'] },
        { label: 'Type', value: formatAutomationType(automation), classes: ['automation-type'] },
        { label: 'Attack', value: formatSeconds(envelope.attack * 0.001) },
        { label: 'Decay', value: formatSeconds(envelope.decay * 0.001) },
        { label: 'Sustain', value: Math.floor(envelope.sustain * 100) || '0' },
        { label: 'Release', value: formatSeconds(envelope.release * 0.001) },
        { label: 'Amount', value: Math.floor(envelope.amount * 100) || '0' },
      ];
    }

    return [
      { label: 'Destination', classes: ['automation-destination'] },
      { label: 'Type', value: formatAutomationType(automation), classes: ['automation-type'] },
      { label: 'Shape', value: formatAutomationShape(lfo.shape) },
      { label: 'Speed', value: lfo.speed },
      { label: 'Amount', value: Math.floor(lfo.amount * 100) || '0' },
      {},
      {},
    ];
  }

  function getSampleEditorParameters(): ParamObject[] {
    return [{}, {}, {}, {}, {}, {}, {}, {}];
  }

  function getSampleRecorderParameters(params: Options): ParamObject[] {
    /*
    const autoSampling: ParamObject = { label: 'Auto-Sample', disabled: true };
    */
    const defaultSampling: ParamObject = { label: 'Record', disabled: true };
    if (params.recHasSource) {
      defaultSampling.disabled = false;
      defaultSampling.classes = ['record', 'armed'];
      defaultSampling.action = 'record-start';

      /*
      if (params.recHasMidiOutput) {
        autoSampling.disabled = false;
        autoSampling.action = 'auto-sample';
      }

      if (params.recAutoSampling) {
        autoSampling.classes = ['autosample'];
      }
      */

      if (params.recIsRecording) {
        defaultSampling.label = 'Stop';
        defaultSampling.classes = ['record', 'recording'];
        defaultSampling.action = 'record-stop';
      }
    }

    return [
      { label: 'Select<br/> Source', action: 'select-source' },
      { classes: ['record', 'space'] },
      {}, // autoSampling,
      defaultSampling,
      { label: 'Level', classes: ['gain', 'level'] },
      { label: 'Gain', classes: ['gain', 'value'] },
    ];
  }

  //----------------------------------
  // Methods
  //----------------------------------

  function toggleInstrumentParameterPages(param: ParamObject) {
    let page = props.parameters.activeInstrumentParameterPage;
    const maxPages = param.max || 1;
    page += 1;
    if (page >= maxPages) {
      page = 0;
    }
    emit('action', { action: 'instrument-parameter-page', value: page });
  }

  //----------------------------------
  // Event Handler
  //----------------------------------
  function handleClick(param: ParamObject) {
    if (param.method) {
      param.method(param);
    } else if (param.action) {
      emit('action', { action: param.action });
    }
  }

  function handleSliceChange(evt: MouseEvent | WheelEvent) {
    const target = evt.currentTarget as HTMLDivElement;
    if (evt.type === 'mousedown') {
      target.requestPointerLock();
      target.addEventListener('mouseup', handleSliceChange, { capture: false, passive: true });
      document.addEventListener('mousemove', handleSliceChange, { capture: false, passive: true });
    } else if (evt.type === 'mouseup') {
      document.exitPointerLock();
      document.removeEventListener('mousemove', handleSliceChange);
      target.removeEventListener('mouseup', handleSliceChange);
    } else if (evt.type === 'mousemove' || evt.type === 'wheel') {
      const movement = evt.type === 'wheel' ? (evt as WheelEvent).deltaY : evt.movementY;
      drag.distance += Math.abs(movement);
      if (drag.distance >= drag.threshold) {
        drag.distance = 0;
        const activeSlice = props.parameters.activeSlice || 0;
        const numSlices = (props.instrumentData?.numSlices || 1) - 1;
        const increment = movement > 0 ? -1 : 1;
        const value = Math.min(numSlices, Math.max(0, activeSlice + increment));
        if (value !== activeSlice) {
          emit('action', { action: 'change-active-slice', value });
        }
      }
    }
  }

  function handleWavetableWindow(evt: MouseEvent | WheelEvent) {
    const target = evt.currentTarget as HTMLDivElement;
    if (evt.type === 'mousedown') {
      target.requestPointerLock();
      target.addEventListener('mouseup', handleWavetableWindow, { capture: false, passive: true });
      document.addEventListener('mousemove', handleWavetableWindow, { capture: false, passive: true });
    } else if (evt.type === 'mouseup') {
      document.exitPointerLock();
      document.removeEventListener('mousemove', handleWavetableWindow);
      target.removeEventListener('mouseup', handleWavetableWindow);
    } else if (evt.type === 'mousemove' || evt.type === 'wheel') {
      const movement = evt.type === 'wheel' ? (evt as WheelEvent).deltaY : evt.movementY;
      drag.distance += Math.abs(movement);
      if (drag.distance >= drag.threshold) {
        drag.distance = 0;
        const instrument = props.instrumentData;
        if (instrument) {
          const currentIndex = instrument.wavetableCurrentWindow;
          const maxIndex = instrument.sample.wavetable.windowCount;
          const increment = movement > 0 ? -1 : 1;
          instrument.wavetableCurrentWindow = Math.min(maxIndex, Math.max(0, currentIndex + increment));
        }
      }
    }
  }

  function handleWavetableSize(evt: MouseEvent | WheelEvent) {
    const target = evt.currentTarget as HTMLDivElement;
    if (evt.type === 'mousedown') {
      target.requestPointerLock();
      target.addEventListener('mouseup', handleWavetableSize, { capture: false, passive: true });
      document.addEventListener('mousemove', handleWavetableSize, { capture: false, passive: true });
    } else if (evt.type === 'mouseup') {
      document.exitPointerLock();
      document.removeEventListener('mousemove', handleWavetableSize);
      target.removeEventListener('mouseup', handleWavetableSize);
    } else if (evt.type === 'mousemove' || evt.type === 'wheel') {
      const movement = evt.type === 'wheel' ? (evt as WheelEvent).deltaY : evt.movementY;
      drag.distance += Math.abs(movement);
      if (drag.distance >= drag.threshold) {
        drag.distance = 0;
        const instrument = props.instrumentData;
        if (instrument) {
          const validSizes = [32, 64, 128, 256, 512, 1024, 2048];
          const maxIndex = validSizes.length - 1;
          const currentSize = instrument.sample.wavetable.windowSize;
          const currentIndex = validSizes.findIndex((v) => v === currentSize);
          const increment = movement > 0 ? -1 : 1;
          const newSizeIndex = Math.min(maxIndex, Math.max(0, currentIndex + increment));
          const newWindowSize = validSizes[newSizeIndex];
          const newWindowCount = Math.floor(instrument.sample.length / newWindowSize);
          if (instrument.wavetableCurrentWindow > newWindowCount) {
            instrument.wavetableCurrentWindow = newWindowCount;
          }
          instrument.sample.wavetable.windowSize = newWindowSize;
          instrument.sample.wavetable.windowCount = newWindowCount;
        }
      }
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
  <div class="parameter-bar">
    <template v-for="(param, pdx) in computedParameters" :key="`param-${pdx}`">
      <div
        v-if="param?.type === 'button'"
        @click="handleClick(param)"
        :class="[param.type, ...(param.classes ? param.classes : []), ...[{ disabled: param.disabled }]]"
      >
        <template v-if="param.label || param.value">
          <label v-html="param.label" />
          <span v-if="param.value && !param.more">{{ param.value }}</span>
          <ul v-if="param.more">
            <li
              v-for="i in param.max"
              :key="`param-${pdx}-button-max-${i}`"
              :class="{ active: i - 1 === param.value }"
            />
          </ul>
        </template>
      </div>

      <div
        v-else-if="param?.type === 'incremental'"
        @wheel.passive="param.method"
        @mousedown.passive="param.method"
        :class="[param.type, ...(param.classes ? param.classes : []), ...[{ disabled: param.disabled }]]"
      >
        <template v-if="param.label || param.value">
          <label v-html="param.label" />
          <span v-if="param.value && !param.more">{{ param.value }}</span>
          <ul v-if="param.more">
            <li
              v-for="i in param.max"
              :key="`param-${pdx}-incremental-max-${i}`"
              :class="{ active: i - 1 === param.value }"
            />
          </ul>
        </template>
      </div>

      <div v-else :class="[...(param.classes ? param.classes : [])]" @click="handleClick(param)">
        <template v-if="param.label || param.value">
          <label v-html="param.label" />
          <span v-if="param.value && !param.more">{{ param.value }}</span>
          <ul v-if="param.more">
            <li v-for="i in param.max" :key="`param-${pdx}-max${i}`" :class="{ active: i - 1 === param.value }" />
          </ul>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  div.parameter-bar {
    display: flex;
    gap: 8px;
    padding: 2px;
    background: var(--pattern-step-bg-color);
    min-width: 800px;
    min-height: 44px;
    height: 44px;

    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 0;
      position: relative;
      text-align: center;
      width: 100%;
      min-height: 40px;
      gap: 2px;
      user-select: none;

      &:after {
        position: absolute;
        content: '';
        width: 1px;
        height: 85%;
        background-color: #555;
        right: -5px;
        bottom: 2px;
      }
      &:last-of-type:after {
        display: none;
      }

      &.playmode {
        min-width: 177px;
      }
      &.automation-destination {
        min-width: 176px;
      }
      &.automation-type {
        min-width: 134px;
      }
      &.gain {
        &.level {
          max-width: 80px;
        }
        &.value {
          max-width: 86px;
        }
      }
      &.button {
        cursor: pointer;
        & > label,
        & > span,
        & > ul > li {
          cursor: pointer;
        }
      }
      &.incremental {
        cursor: n-resize;
        & > label,
        & > span,
        & > ul > li {
          cursor: n-resize;
        }
      }
      &.disabled {
        opacity: 0.25;
      }
      &.autosample {
        position: relative;
        &:before {
          position: absolute;
          content: '';
          width: calc(80%);
          height: 3px;
          background: #4caf50;
          bottom: 3px;
          left: 50%;
          border-radius: 6px;
          transform: translate(-50%, 0);
        }
      }
      &.record {
        &.space {
          min-width: 400px;
        }
        &.armed {
          &:before {
            position: absolute;
            content: '';
            width: calc(80%);
            height: 3px;
            background: #cf6e63;
            bottom: 3px;
            left: 50%;
            border-radius: 6px;
            transform: translate(-50%, 0);
          }
        }

        &.recording {
          &:before {
            position: absolute;
            content: '';
            width: calc(80%);
            height: 3px;
            background: #cf6e63;
            bottom: 3px;
            left: 50%;
            border-radius: 6px;
            transform: translate(-50%, 0);
            --blink-color: #cf6e63;
            animation: blink 1s linear infinite;
          }
        }
      }

      & > label {
        opacity: 0.6;
        font-weight: 500;
        font-size: 11px;

        &:only-child {
          font-size: 13px;
          opacity: 1;
        }
      }

      & > span {
        font-size: 13px;

        &:empty {
          display: none;
        }
      }

      & > ul {
        display: inline-flex;
        padding: 0;
        margin: 4px 0 4px 0;
        list-style-type: none;
        top: 4px;
        right: 4px;
        gap: 4px;

        & > li {
          padding: 0;
          margin: 0;
          width: 8px;
          height: 8px;
          border-radius: 8px;
          background: #333;
          border: 1px solid rgba(0, 0, 0, 1);

          &.active {
            background: #999;
          }
        }
      }
    }
  }
</style>
