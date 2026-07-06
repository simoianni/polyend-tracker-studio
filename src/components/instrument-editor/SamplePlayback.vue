<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { nextTick, PropType, ref } from 'vue';
  import { InstrumentData, InstrumentPlayMode, MAX_16BIT } from '@polyend/tracker-lib';
  import Waveform from '@/components/shared/Waveform.vue';
  import { seconds2frames } from '@/utils/helpers.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    instrumentData: {
      type: Object as PropType<InstrumentData | null>,
      default: null,
    },
    zoomPercentage: {
      type: Number,
      default: 0.01,
    },
    activeSliceIndex: {
      type: Number,
      default: 0,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['update:zoomPercentage', 'update:activeSliceIndex']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const waveformInstance = ref<InstanceType<typeof Waveform> | null>(null);

  const PLAY_MODES = [
    { value: 0, label: '1-Shot' },
    { value: 1, label: 'Forward Loop' },
    { value: 2, label: 'Backward Loop' },
    { value: 3, label: 'Pingpong Loop' },
    { value: 4, label: 'Slice' },
    { value: 5, label: 'Beat Slice' },
    { value: 6, label: 'Wavetable' },
    { value: 7, label: 'Granular' },
  ];

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------

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
  function executeAction(action: string) {
    switch (action) {
      case 'slice-add':
        sliceAdd();
        break;
      case 'slice-remove':
        sliceRemove();
        break;
      case 'granular-shape':
        granularShapeChange();
        break;
      case 'granular-loop':
        granularLoopChange();
        break;
    }
  }

  async function render() {
    nextTick(async () => {
      const waveform = waveformInstance.value;
      if (waveform) {
        await waveform.render();
      }
    });
  }

  function update() {
    const waveform = waveformInstance.value;
    if (waveform) {
      waveform.update();
    }
  }

  function playmodeChange(mode: InstrumentPlayMode) {
    const instrument = props.instrumentData;
    if (instrument) {
      instrument.playmode = mode;
      nextTick(async () => {
        update();
      });
    }
  }

  function sliceAdd() {
    const instrument = props.instrumentData;
    if (instrument && instrument.numSlices < instrument.slices.length) {
      // Place the new slice at the cursor position clicked on the waveform
      const time = waveformInstance.value?.getCurrentTime() || 0;
      let position = Math.min(seconds2frames(time, instrument), MAX_16BIT - 1);
      if (position <= 0) {
        let lastSlice = instrument.slices[instrument.numSlices - 1];
        if (!lastSlice) {
          lastSlice = 0;
        }
        position = lastSlice + Math.floor((MAX_16BIT - lastSlice) / 2);
      }

      const active = instrument.slices.slice(0, instrument.numSlices);
      if (!active.includes(position)) {
        active.push(position);
        active.sort((a, b) => a - b);
        active.forEach((value, index) => {
          instrument.slices[index] = value;
        });
        instrument.numSlices += 1;

        const newIndex = active.indexOf(position);
        instrument.selectedSlice = newIndex;
        emit('update:activeSliceIndex', newIndex);
      }
      update();
    }
  }

  function sliceRemove() {
    const instrument = props.instrumentData;
    if (instrument) {
      const lastIndex = instrument.numSlices;
      instrument.numSlices -= 1;
      instrument.slices[lastIndex - 1] = 0;
      update();
    }
  }

  function granularLoopChange() {
    const instrument = props.instrumentData;
    if (instrument) {
      let value = instrument.granular.type;
      value += 1;
      if (value > 2) {
        value = 0;
      }
      instrument.granular.type = value;
    }
  }

  function granularShapeChange() {
    const instrument = props.instrumentData;
    if (instrument) {
      let value = instrument.granular.shape;
      value += 1;
      if (value > 2) {
        value = 0;
      }
      instrument.granular.shape = value;
    }
  }

  //----------------------------------
  // Event Handlers
  //----------------------------------
  function handleZoomChange(value: number) {
    emit('update:zoomPercentage', value);
  }

  function handleSliceChange(value: number) {
    emit('update:activeSliceIndex', value);
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({ executeAction, render, update });
</script>

<template>
  <div class="sample-playback-view">
    <Waveform
      ref="waveformInstance"
      :instrument-data="instrumentData"
      :zoomPercentage="zoomPercentage"
      :active-slice-index="activeSliceIndex"
      @zoom="handleZoomChange"
      @slice="handleSliceChange"
    />
    <ul class="play-modes" :class="{ active: !!instrumentData }">
      <li
        v-for="(mode, midx) in PLAY_MODES"
        :key="`pm-${midx}`"
        :class="{ active: instrumentData?.playmode === mode.value }"
        @click="playmodeChange(mode.value)"
      >
        {{ mode.label }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  div.sample-playback-view {
    display: flex;
    background: black;

    & > ul.play-modes {
      min-width: 180px;
      border-left: 1px solid black;
      padding: 8px 2px;
      margin: 0;
      list-style-type: none;
      background: var(--pattern-step-bg-color);
      box-shadow: inset 0 -2px 4px black;

      & > li {
        padding: 2px 8px;
        border: 2px solid transparent;
        margin: 0 0 2px 0;
        user-select: none;
        cursor: pointer;
        opacity: 0.1;
        pointer-events: none;

        &:hover {
          border: 2px solid white;
          background: white;
          color: black;
        }

        &.active {
          border: 2px solid white;
        }
      }

      &.active {
        & > li {
          opacity: 1;
          pointer-events: all;
        }
      }
    }
  }
</style>

<i18n />
