<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';
  import SliderSmall from '@/components/ui/SliderSmall.vue';
  import { CompressionOptions } from '@/components/sample-editor/actions/compress.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  // const props = defineProps({});

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
  const actions = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Preview', value: 'preview' },
    { label: 'Apply', value: 'apply' },
  ];

  const modal = ref<InstanceType<typeof Modal> | null>(null);

  const threshold = ref<number>(-24);
  const ratio = ref<number>(2);
  const attack = ref<number>(50);
  const release = ref<number>(250);
  const knee = ref<number>(30);
  const makeupGain = ref<number>(0);
  const wetDryMix = ref<number>(1);

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  // const computedProp = computed(() => { return null; });

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
  function handleAction(action: string) {
    const options = {
      threshold: threshold.value,
      ratio: ratio.value,
      attack: attack.value,
      release: release.value,
      knee: knee.value,
      makeupGain: makeupGain.value,
      wetDryMix: wetDryMix.value,
    } as CompressionOptions;
    emit('action', { action, options });
    if (action !== 'preview') {
      modal.value?.close();
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
  <Modal ref="modal" class="compressor" title="Compressor" :actions="actions" @action="handleAction" persistent>
    <div class="group">
      <label
        ><span>Threshold</span> <span>{{ threshold }} dB</span></label
      >
      <SliderSmall v-model="threshold" :min="-100" :max="0" />
    </div>
    <div class="group">
      <label
        ><span>Ratio</span> <span>{{ ratio }}:1</span></label
      >
      <SliderSmall v-model="ratio" :min="1" :max="20" />
    </div>
    <div class="group">
      <label
        ><span>Attack</span> <span>{{ attack }} ms</span></label
      >
      <SliderSmall v-model="attack" :min="0" :max="1000" />
    </div>
    <div class="group">
      <label
        ><span>Release</span> <span>{{ release }} ms</span></label
      >
      <SliderSmall v-model="release" :min="0" :max="1000" />
    </div>
    <div class="group">
      <label
        ><span>Knee</span> <span>{{ knee }} dB</span></label
      >
      <SliderSmall v-model="knee" :min="0" :max="40" />
    </div>
    <div class="group">
      <label
        ><span>Makeup Gain</span> <span>{{ makeupGain }} dB</span></label
      >
      <SliderSmall v-model="makeupGain" :min="0" :max="24" />
    </div>
    <div class="group">
      <label
        ><span>Dry / Wet Mix</span> <span>{{ Math.round(wetDryMix * 100) }}%</span></label
      >
      <SliderSmall v-model="wetDryMix" :min="0" :max="1" :step="0.01" />
    </div>
  </Modal>
</template>

<style lang="scss">
  .modal.compressor .overlay > .content > .group {
    label {
      display: flex;
      justify-content: space-between;
    }
  }
</style>

<i18n />
