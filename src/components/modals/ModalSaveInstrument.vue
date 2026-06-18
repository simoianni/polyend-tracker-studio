<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { onMounted, ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    filename: {
      type: String,
      default: null,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['save']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const valinput = ref<string | undefined>(undefined);

  const modal = ref<InstanceType<typeof Modal> | null>(null);
  const inputError = ref<boolean>(false);

  const actions = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Save', value: 'save' },
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
  onMounted(async () => {
    valinput.value = props.filename || undefined;
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
  function handleAction(value: string) {
    if (value === 'save') {
      const val = valinput.value;
      if (val && val.length > 0) {
        emit('save', val);
        modal.value?.close();
      } else {
        inputError.value = true;
      }
    } else {
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
  <Modal
    ref="modal"
    class="save-instrument"
    title="Save Instrument"
    :actions="actions"
    @action="handleAction"
    persistent
  >
    <div class="group">
      <label>Instrument Name</label>
      <input type="text" maxlength="32" v-model="valinput" :class="{ error: inputError }" @input="inputError = false" />
      <span>.pti</span>
    </div>
  </Modal>
</template>

<style lang="scss">
  .modal.save-instrument {
    & > .overlay > .content > .group {
      input[type='text'] {
        min-width: 256px;
      }
      & > span {
        position: absolute;
        right: 8px;
        bottom: 5px;
        opacity: 0.25;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
      }
    }
  }
</style>

<i18n />
