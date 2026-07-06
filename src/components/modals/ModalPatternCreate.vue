<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';

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
  const emit = defineEmits(['cancel', 'create']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const numTracks = ref<number>(16);
  const numSteps = ref<number>(32);

  const actions = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Create', value: 'create' },
  ];

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

  // onMounted(async () => {});
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
  function handleAction(value: string) {
    if (value === 'create') {
      const tracks = numTracks.value;
      const steps = numSteps.value;
      emit('create', { tracks, steps });
    } else {
      emit('cancel');
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
  <Modal title="Create Pattern" :actions="actions" @action="handleAction">
    <div class="group">
      <label>Tracker</label>
      <select v-model.number="numTracks">
        <option :value="16">Tracker+ / Mini</option>
        <option :value="12">OG Tracker</option>
      </select>
    </div>
    <div class="group">
      <label>Steps</label>
      <input type="number" min="1" max="128" step="1" value="32" v-model.number="numSteps" />
    </div>
  </Modal>
</template>

<style lang="scss"></style>

<i18n />
