<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, PropType, watch } from 'vue';
  import { InstrumentData } from '@polyend/tracker-lib';
  import List from '@/components/ui/List.vue';
  import SliderVertical from '@/components/ui/SliderVertical.vue';

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
    activeAutomation: {
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 0,
    },
  });

  const automationDestinations = [
    { label: 'Volume', value: 0 },
    { label: 'Panning', value: 1 },
    { label: 'Cutoff', value: 2 },
    { label: 'Wavetable Position', value: 3 },
    { label: 'Granular Position', value: 4 },
    { label: 'Finetune', value: 5 },
  ];

  const automationTypes = [
    { label: 'Disabled', value: -1 },
    { label: 'Envelope', value: 0 },
    { label: 'LFO', value: 1 },
  ];

  const lfoShapes = [
    { label: 'Rev Saw', value: 0 },
    { label: 'Saw', value: 1 },
    { label: 'Triangle', value: 2 },
    { label: 'Square', value: 3 },
    { label: 'Random', value: 4 },
  ];

  const lfoSpeeds = [
    { label: '128 steps', value: 0 },
    { label: '96 steps', value: 1 },
    { label: '64 steps', value: 2 },
    { label: '48 steps', value: 3 },
    { label: '32 steps', value: 4 },
    { label: '24 steps', value: 5 },
    { label: '16 steps', value: 6 },
    { label: '12 steps', value: 7 },
    { label: '8 steps', value: 8 },
    { label: '6 steps', value: 9 },
    { label: '4 steps', value: 10 },
    { label: '3 steps', value: 11 },
    { label: '2 steps', value: 12 },
    { label: '3/2 steps', value: 13 },
    { label: '1 step', value: 14 },
    { label: '3/4 step', value: 15 },
    { label: '1/2 step', value: 16 },
    { label: '3/8 step', value: 17 },
    { label: '1/3 step', value: 18 },
    { label: '1/4 step', value: 19 },
    { label: '3/16 step', value: 20 },
    { label: '1/6 step', value: 21 },
    { label: '1/8 step', value: 22 },
    { label: '1/12 step', value: 23 },
    { label: '1/16 step', value: 24 },
    { label: '1/24 step', value: 25 },
    { label: '1/32 step', value: 26 },
    { label: '1/48 step', value: 27 },
    { label: '1/64 step', value: 28 },
  ];

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['update:activeAutomation', 'update:page']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  // const value = ref();
  // const model = defineModel<number>({ type: Number, default: 0 });

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const computedEnvelope = computed(() => {
    const instrument = props.instrumentData;
    if (instrument) {
      const auto = instrument.automations[props.activeAutomation];
      return auto?.envelope || {};
    }
    return null;
  });
  const computedLFO = computed(() => {
    const instrument = props.instrumentData;
    if (instrument) {
      const auto = instrument.automations[props.activeAutomation];
      return auto?.lfo || {};
    }
    return null;
  });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  watch(
    () => props.activeAutomation,
    (newval) => {
      const instrument = props.instrumentData;
      const auto = instrument?.automations[newval];
      if (auto && auto.enabled) {
        emit('update:page', auto.isLFO ? 1 : 0);
      } else {
        emit('update:page', -1);
      }
    },
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
  // onBeforeUnmount(() => {});
  // onUnmounted(() => {});

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------
  function executeAction() {}
  async function render(): Promise<void> {}
  function update(): void {}

  function handleDestination(value: number) {
    emit('update:activeAutomation', value);
  }
  function handleType(value: number) {
    const instrument = props.instrumentData;
    const automation = instrument?.automations[props.activeAutomation];
    if (automation) {
      if (value === -1) {
        automation.enabled = false;
      } else {
        automation.enabled = true;
        automation.isLFO = value === 1;
      }
    }
    emit('update:page', value);
  }
  function handleShape(value: number) {
    const instrument = props.instrumentData;
    const automation = instrument?.automations[props.activeAutomation];
    if (automation) {
      automation.lfo.shape = value;
    }
  }
  function handleSpeed(value: number) {
    const instrument = props.instrumentData;
    const automation = instrument?.automations[props.activeAutomation];
    if (automation) {
      automation.lfo.speed = value;
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
  <div class="instrument-automation">
    <template v-if="instrumentData">
      <div class="destination" tabindex="-1">
        <List :items="automationDestinations" :value="activeAutomation" @input="handleDestination" />
      </div>
      <div class="type" tabindex="-1">
        <List :items="automationTypes" :value="page" @input="handleType" />
      </div>

      <template v-if="page !== 1 && computedEnvelope">
        <div tabindex="-1" :class="{ disabled: page === -1 }">
          <SliderVertical :min="0" :max="10000" v-model="computedEnvelope.attack" />
        </div>
        <div tabindex="-1" :class="{ disabled: page === -1 }">
          <SliderVertical :min="0" :max="10000" v-model="computedEnvelope.decay" />
        </div>
        <div tabindex="-1" :class="{ disabled: page === -1 }">
          <SliderVertical :min="0" :max="1" :step="0.01" v-model="computedEnvelope.sustain" />
        </div>
        <div tabindex="-1" :class="{ disabled: page === -1 }">
          <SliderVertical :min="0" :max="10000" v-model="computedEnvelope.release" />
        </div>
        <div tabindex="-1" :class="{ disabled: page === -1 }">
          <SliderVertical :min="0" :max="1" :step="0.01" v-model="computedEnvelope.amount" />
        </div>
      </template>
      <template v-else-if="page === 1 && computedLFO">
        <div tabindex="-1">
          <List :items="lfoShapes" :value="computedLFO.shape" @input="handleShape" />
        </div>
        <div tabindex="-1">
          <List :items="lfoSpeeds" :value="computedLFO.speed" @input="handleSpeed" />
        </div>
        <div tabindex="-1"><SliderVertical :min="0" :max="1" :step="0.01" v-model="computedLFO.amount" /></div>
        <div />
        <div />
      </template>
    </template>
  </div>
</template>

<style lang="scss">
  div.instrument-automation {
    display: flex;
    background: black;
    width: 100%;
    height: 100%;
    padding: 3px 2px;
    min-width: 804px;
    min-height: 404px;

    & > div {
      position: relative;
      width: 14%;
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

      &.destination {
        min-width: 180px;
      }

      &.type {
        min-width: 140px;
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

<i18n />
