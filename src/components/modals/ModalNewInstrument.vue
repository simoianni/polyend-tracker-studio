<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { nextTick, ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';
  import Button from '@/components/ui/Button.vue';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  // defineProps({});

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
  const modal = ref<InstanceType<typeof Modal> | null>(null);

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
    emit('action', value);
    nextTick(() => {
      modal.value?.close();
    });
  }
  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <Modal ref="modal" class="new-instrument" title="Create New Instrument">
    <div class="group buttons">
      <Button small fill @click="handleAction('sample')">Load Sample</Button>
      <Button small fill @click="handleAction('slice')">Create Sliced Instrument</Button>
      <Button small fill @click="handleAction('empty')">Empty Instrument</Button>
    </div>
  </Modal>
</template>

<style lang="scss">
  .modal.new-instrument {
    & > .overlay > .content > .group.buttons > button {
      display: block;
      margin-bottom: 4px;
    }
  }
</style>
