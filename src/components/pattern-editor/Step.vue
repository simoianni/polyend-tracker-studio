<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, PropType, ref } from 'vue';
  import { FX, StepData } from '@polyend/tracker-lib';
  import { StepProperty } from '@/types/pattern-editor.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------

  const props = defineProps({
    stepData: {
      type: Object as PropType<StepData>,
      required: true,
    },
    onBeat: {
      type: Boolean,
      default: false,
    },
    playing: {
      type: Boolean,
      default: false,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  // const emit = defineEmits([]);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const view = ref<HTMLDivElement | null>(null);
  const active = ref<boolean>(false);
  const activeProperty = ref<StepProperty | null>(null);
  const recMode = ref<boolean>(false);

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const note = computed(() => {
    const value = props.stepData.note;
    if (value < -4 || value > 127 || !Number.isInteger(value)) {
      return null;
    }
    if (value === -4) {
      return 'OFF';
    }
    if (value === -3) {
      return 'CUT';
    }
    if (value === -2) {
      return 'FAD';
    }
    if (value === -1) {
      return null;
    }

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = value % 12;
    const octave = Math.floor(value / 12);
    return `${noteNames[noteIndex]}${octave}`;
  });

  const instrument = computed(() => {
    const note = props.stepData.note;
    const value = props.stepData?.instrument;
    if (note >= 0) {
      const val = value + 1;
      if (val >= 65) {
        return `S${val - 64}`;
      }
      if (val >= 49) {
        return `M${val - 48}`;
      }
      return String(val).padStart(2, '0');
    }
    return null;
  });

  const fx1 = computed(() => {
    return parseFX(props.stepData.fx[0] as FX);
  });

  const fx2 = computed(() => {
    return parseFX(props.stepData.fx[1] as FX);
  });

  const cssClasses = computed(() => {
    return [
      ...(active.value ? ['active'] : []),
      ...(active.value && activeProperty.value ? [activeProperty.value] : []),
      ...(props.onBeat ? ['beat'] : []),
      ...(recMode.value ? ['rec'] : []),
      ...(props.playing ? ['playing'] : []),
    ];
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
  function setActive(value: boolean, property?: StepProperty, rec?: boolean) {
    active.value = value || false;
    updateState(property, rec);
  }

  function updateState(property?: StepProperty, rec?: boolean) {
    recMode.value = rec || false;
    activeProperty.value = property || null;
  }

  //----------------------------------
  // Step Related Methods
  //----------------------------------
  function parseFX(fx: FX) {
    if (fx.type.symbol === '-') {
      return null;
    }
    return `${fx.type.symbol}${fx.value}`;
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({
    setActive,
    updateState,
  });
</script>

<template>
  <div ref="view" class="step" :class="cssClasses" tabindex="-1">
    <span class="note">{{ note }}</span>
    <span class="instrument">{{ instrument }}</span>
    <span class="fx1">{{ fx1 }}</span>
    <span class="fx2">{{ fx2 }}</span>
  </div>
</template>

<style lang="scss">
  div.step {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
    max-width: 124px;
    min-width: 124px;
    width: 100%;
    height: 18px;
    background: var(--pattern-step-bg-color);
    padding: 0 0;
    outline: 0;

    &.beat {
      background: var(--pattern-step-beat-bg-color);
    }

    &.active {
      --step-border-color: var(--pattern-step-active-color);
      --step-bg-color: var(--pattern-step-active-color);
      --step-text-color: var(--pattern-step-active-text-color);
    }

    &.active.rec {
      --step-border-color: var(--pattern-step-recording-color);
      --step-bg-color: var(--pattern-step-recording-color);
      --step-text-color: var(--pattern-step-recording-text-color);
    }
    &.active:after {
      position: absolute;
      content: '';
      inset: 0;
      width: 100%;
      height: 100%;
      border: 1px solid var(--step-border-color);
      z-index: 2;
    }

    & > span {
      display: flex;
      align-items: center;
      user-select: none;
      height: 18px;
      &:empty:after {
        position: relative;
        left: 1px;
        letter-spacing: 3px;
        text-align: center;
      }
    }

    & > span.note {
      min-width: 34px;
      max-width: 34px;
      padding: 0 2px;
      color: var(--pattern-step-note-color);
      &:empty:after {
        content: '---';
        color: currentColor;
        opacity: 0.2;
      }
    }
    &.active.note > span.note {
      background-color: var(--step-bg-color);
      color: var(--step-text-color);
      &:empty:after {
        color: currentColor;
        opacity: 1;
      }
    }

    & > span.instrument {
      min-width: 22px;
      max-width: 22px;
      padding: 0 2px;
      color: var(--pattern-step-instrument-color);
      &:empty:after {
        content: '--';
        color: currentColor;
        opacity: 0.2;
      }
    }
    &.active.instrument > span.instrument {
      background-color: var(--step-bg-color);
      color: var(--step-text-color);
      &:empty:after {
        color: currentColor;
        opacity: 1;
      }
    }

    & > span.fx1 {
      min-width: 34px;
      max-width: 34px;
      padding: 0 2px;
      color: var(--pattern-step-fx1-color);
      &:empty:after {
        content: '----';
        color: currentColor;
        opacity: 0.2;
      }
    }
    &.active.fx1 > span.fx1 {
      background-color: var(--step-bg-color);
      color: var(--step-text-color);
      &:empty:after {
        color: currentColor;
        opacity: 1;
      }
    }

    & > span.fx2 {
      min-width: 34px;
      max-width: 34px;
      padding: 0 2px;
      color: var(--pattern-step-fx2-color);
      &:empty:after {
        content: '----';
        color: currentColor;
        opacity: 0.2;
      }
    }
    &.active.fx2 > span.fx2 {
      background-color: var(--step-bg-color);
      color: var(--step-text-color);
      &:empty:after {
        color: currentColor;
        opacity: 1;
      }
    }

    &.playing {
      background-color: rgba(76, 175, 80, 0.15);
      box-shadow: inset 0 0 0 1px rgba(76, 175, 80, 0.4);
    }
  }
</style>
