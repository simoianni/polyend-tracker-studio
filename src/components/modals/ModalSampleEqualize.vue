<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';
  import { EQBand } from '@/components/sample-editor/actions/equalizer.ts';
  import { EQ_BAND_COLORS } from '@/utils/colors.ts';

  import EQGraph from '@/components/ui/EQGraph.vue';

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

  const bands = ref<EQBand[]>([]);

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
  function addBand() {
    const arr = JSON.parse(JSON.stringify(bands.value));
    arr.push({
      type: 'peaking',
      gain: 0,
      frequency: 1000,
      q: 1,
    } as EQBand);
    bands.value = arr;
  }

  function deleteBand(index: number) {
    const arr = JSON.parse(JSON.stringify(bands.value));
    arr.splice(index, 1);
    bands.value = arr;
  }
  function handleAction(action: string) {
    emit('action', { action, options: { bands: bands.value } });
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
  <Modal ref="modal" class="equalizer" title="Equalizer" :actions="actions" @action="handleAction" persistent>
    <EQGraph v-model:bands="bands" />
    <div class="group band">
      <div
        v-for="(band, idx) in bands"
        :class="{ 'no-border': idx === bands.length - 1 }"
        :key="`band-${idx}`"
        :style="{ borderLeftColor: EQ_BAND_COLORS[idx % EQ_BAND_COLORS.length] }"
      >
        <select v-model="band.type">
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="bandpass">Bandpass</option>
          <option value="lowshelf">Lowshelf</option>
          <option value="highshelf">Highshelf</option>
          <option value="peaking">Peaking</option>
          <option value="notch">Notch</option>
        </select>
        <span class="param">FREQ: {{ band.frequency }} Hz</span>
        <span class="param" v-if="['lowpass', 'highpass', 'bandpass', 'notch', 'peaking'].includes(band.type)"
          >Q: {{ (band.q || 0).toFixed(1) }}</span
        >
        <span class="param" v-else>&nbsp;</span>
        <span class="param" v-if="['lowshelf', 'highshelf', 'peaking'].includes(band.type)"
          >GAIN: {{ band.gain.toFixed(1) }} dB</span
        >
        <span class="param" v-else>&nbsp;</span>
        <button class="delete-band" @click="deleteBand(idx)">×</button>
      </div>
      <div class="add">
        <button @click="addBand">+</button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss">
  .modal.equalizer .overlay > .content > .group {
    label {
      display: flex;
      justify-content: space-between;
    }

    &.band {
      background: black;
      width: 100%;
      padding: 4px;
      margin: 0;
      border-radius: 5px;
      box-shadow:
        0 0.5px 0 rgba(255, 255, 255, 0.15),
        0 -0.5px 0 rgba(255, 255, 0.255, 0.05);

      & > div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        border-left: 3px solid transparent;
        padding-left: 8px;
        padding-top: 2px;
        padding-bottom: 2px;
        font-size: 1rem;
        margin-bottom: 2px;

        & > select,
        & > span {
          width: calc(30% - 12px);
          font-size: 1rem;
        }
        & > span {
          width: calc(20% - 12px);
          font-size: 1rem;
        }

        .param {
          color: #ccc;
        }

        .delete-band {
          min-width: 40px;
          margin-left: auto;
          background: none;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 10px;

          &:hover {
            color: #fff;
          }
        }

        &.no-border {
          border-bottom: 0;
        }

        & > div {
          margin-bottom: 0;
        }
      }

      & > div.add {
        margin-top: 4px;
        background-color: #050505;
        justify-content: center;

        &:only-child {
          margin-top: 0;
          margin-bottom: 0;
        }
        & > button {
          color: #666;
          background: none;
          border: 0;
          position: relative;
          top: 1px;
          width: 100%;
          font-size: 2rem;
        }

        &:hover {
          background-color: #0a0a0a;
          & > button {
            color: white;
          }
        }
      }
    }
  }
</style>

<i18n />
