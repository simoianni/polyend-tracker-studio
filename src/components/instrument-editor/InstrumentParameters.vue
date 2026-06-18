<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, onMounted, PropType, ref } from 'vue';
  import SliderVertical from '@/components/ui/SliderVertical.vue';
  import { InstrumentData } from '@polyend/tracker-lib';
  import List from '@/components/ui/List.vue';

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
    page: {
      type: Number,
      default: 0,
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
  const volume = ref<number>(0);
  const panning = ref<number>(0);
  const tune = ref<number>(0);
  const finetune = ref<number>(0);
  const cutoff = ref<number>(0);
  const resonance = ref<number>(0);

  const overdrive = ref<number>(0);
  const bitdepth = ref<number>(0);
  const reverb = ref<number>(0);
  const delay = ref<number>(0);

  const activeFilter = ref<number>(-1);

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const computedFilters = computed(() => {
    const instrument = props.instrumentData;
    if (instrument) {
      return [
        { label: 'Disabled', value: -1 },
        { label: 'Low-pass', value: 0 },
        { label: 'High-pass', value: 1 },
        { label: 'Band-pass', value: 2 },
      ];
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
  onMounted(() => {
    const instrument = props.instrumentData;
    if (instrument) {
      volume.value = instrument.volume;
      panning.value = instrument.panning;
      tune.value = instrument.tune;
      finetune.value = instrument.finetune;
      cutoff.value = instrument.cutoff;
      resonance.value = instrument.resonance;

      overdrive.value = instrument.overdrive;
      bitdepth.value = instrument.bitdepth;
      reverb.value = instrument.reverbSend;
      delay.value = instrument.delaySend;

      activeFilter.value = -1;
      if (instrument.filterEnabled) {
        activeFilter.value = instrument.filterType;
      }
    }
  });
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
    console.log('InstrumentAutomations:', action);
  }
  async function render(): Promise<void> {}
  function update(): void {}

  //----------------------------------
  // Event Handlers
  //----------------------------------
  function handleActiveFilter(value: number) {
    const instrument = props.instrumentData;
    if (instrument) {
      if (value === -1) {
        instrument.filterEnabled = false;
      } else {
        instrument.filterEnabled = true;
        instrument.filterType = value;
      }
    }
    activeFilter.value = value;
  }

  function handleInput(prop: string, value: number) {
    const instrument = props.instrumentData;
    if (instrument) {
      instrument[prop] = value;
    }
  }
  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({ executeAction, render, update });
</script>

<template>
  <div class="instrument-parameters">
    <template v-if="instrumentData">
      <template v-if="page === 0">
        <div tabindex="-1">
          <SliderVertical :min="0" :max="2" :step="0.01" v-model="volume" @input="handleInput('volume', $event)" />
        </div>
        <div tabindex="-1">
          <SliderVertical
            bipolar
            :min="-1"
            :max="1"
            :step="0.01"
            v-model="panning"
            @input="handleInput('panning', $event)"
          />
        </div>
        <div tabindex="-1">
          <SliderVertical bipolar :min="-24" :max="24" v-model="tune" @input="handleInput('tune', $event)" />
        </div>
        <div tabindex="-1">
          <SliderVertical bipolar :min="-100" :max="100" v-model="finetune" @input="handleInput('finetune', $event)" />
        </div>
        <div tabindex="-1">
          <List :items="computedFilters" :value="activeFilter" @input="handleActiveFilter" />
        </div>
        <div :class="{ disabled: !instrumentData.filterEnabled }" tabindex="-1">
          <SliderVertical :min="0" :max="1" :step="0.01" v-model="cutoff" @input="handleInput('cutoff', $event)" />
        </div>
        <div :class="{ disabled: !instrumentData.filterEnabled }" tabindex="-1">
          <SliderVertical
            :min="0"
            :max="1"
            :step="0.01"
            v-model="resonance"
            @input="handleInput('resonance', $event)"
          />
        </div>
        <div />
      </template>
      <template v-else>
        <div tabindex="-1">
          <SliderVertical :min="0" :max="100" :step="1" v-model="overdrive" @input="handleInput('overdrive', $event)" />
        </div>
        <div tabindex="-1">
          <SliderVertical :min="4" :max="16" :step="1" v-model="bitdepth" @input="handleInput('bitdepth', $event)" />
        </div>
        <div tabindex="-1">
          <SliderVertical :min="0" :max="1" :step="0.01" v-model="reverb" @input="handleInput('reverbSend', $event)" />
        </div>
        <div tabindex="-1">
          <SliderVertical :min="0" :max="1" :step="0.01" v-model="delay" @input="handleInput('delaySend', $event)" />
        </div>
        <div />
        <div />
        <div />
        <div />
      </template>
    </template>
  </div>
</template>

<style lang="scss">
  div.instrument-parameters {
    display: flex;
    background: black;
    width: 100%;
    height: 100%;
    padding: 3px 2px;
    min-width: 804px;
    min-height: 404px;

    & > div {
      position: relative;
      width: 12.5%;
      height: 100%;
      border: 6px solid var(--instrument-params-border-color);
      background: var(--instrument-params-border-color);
      margin-right: 2px;

      & ~ div:empty {
        margin-right: 0;
        padding-right: 2px;
      }

      &:focus-within {
        outline: 2px solid #cf1818;
        outline-offset: -2px;
      }

      &:first-of-type {
        border-radius: 4px 0 0 0;
      }
      &:last-of-type {
        border-radius: 0 4px 0 0;
        margin-right: 0;
      }

      &.disabled {
        &:after {
          position: absolute;
          inset: 0;
          content: '';
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
</style>
