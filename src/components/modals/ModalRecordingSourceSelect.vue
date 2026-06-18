<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { PropType, ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';

  type InputDevice = {
    id: string;
    label: string;
    kind: MediaDeviceKind;
  };

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  defineProps({
    inputs: {
      type: Array as PropType<InputDevice[]>,
      default: () => [],
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['select']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const selectedSource = ref<string>('desktop');

  const actions = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Select', value: 'select' },
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
  function handleAction(action: string) {
    if (action === 'select') {
      emit('select', selectedSource.value);
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
  <Modal title="Select Recording Source" :actions="actions" @action="handleAction">
    <div class="group">
      <select v-model="selectedSource">
        <option v-for="(input, idx) in inputs" :key="`input-${idx}`" :value="input.id">
          {{ input.label }}
        </option>
      </select>
    </div>
  </Modal>
</template>

<style lang="scss"></style>

<i18n />
