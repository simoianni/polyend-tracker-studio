<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, onMounted, ref, watch } from 'vue';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    bipolar: {
      type: Boolean,
      default: false,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['input']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const inputElement = ref<HTMLInputElement>();
  const width = ref<string>('0px');
  const height = ref<string>('0px');
  const model = defineModel<number>({ type: Number, default: 0 });

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const percentage = computed(() => {
    if (props.bipolar) {
      const totalRange = props.max - props.min;
      const currentPosition = model.value - props.min;
      return (currentPosition / totalRange) * 100;
    } else {
      return (model.value / props.max) * 100;
    }
  });

  const gradientStyle = computed(() => {
    if (props.bipolar) {
      const pos = percentage.value;
      if (model.value === 0) {
        return `linear-gradient(90deg, transparent calc(50% - 1px), white calc(50%), transparent calc(50% + 1px)`;
      } else if (model.value > 0) {
        return `linear-gradient(90deg, transparent calc(50% - 1px), white calc(50%), white ${pos}%, transparent calc(${pos}%))`;
      } else {
        return `linear-gradient(90deg, transparent calc(${pos}% - 1px), white ${pos}%, white calc(50% - 1px), transparent 50%)`;
      }
    } else {
      return `linear-gradient(90deg, white ${percentage.value}%, transparent ${percentage.value}%)`;
    }
  });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  watch(model, (newval) => {
    emit('input', newval);
  });

  //---------------------------------------------------
  //
  //  Vue Lifecycle
  //
  //---------------------------------------------------
  // onBeforeMount(() => {});
  onMounted(() => {
    const input = inputElement.value;
    const parent = input?.parentElement;
    if (parent) {
      width.value = `${parent.clientWidth}px`;
      height.value = `${parent.clientHeight}px`;
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
  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      model.value = target.valueAsNumber;
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
  <input
    class="slider vertical"
    ref="inputElement"
    type="range"
    :step="step"
    :min="min"
    :max="max"
    v-model.number="model"
    @input="handleInput"
  />
</template>

<style lang="scss">
  .slider.vertical {
    position: absolute;
    top: calc(50% - 2px);
    left: calc(50% - 2px);
    width: v-bind(height);
    height: v-bind(width);
    appearance: none;
    background: var(--instrument-params-container-color);
    box-shadow: inset 0 2px 8px 3px black;
    transform: translate(-50%, -50%) rotate(-90deg);
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      height: 16px;
      width: 1px;
      background: transparent;
    }

    &::-webkit-slider-runnable-track {
      height: calc(100% - 2px);
      background: v-bind(gradientStyle);
    }

    &:focus {
      outline: none;
    }
  }
</style>

<i18n />
