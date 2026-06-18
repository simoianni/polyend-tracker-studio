<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { onMounted, ref, PropType } from 'vue';
  import Modal from '@/components/ui/Modal.vue';
  import { Input, Output, WebMidi } from 'webmidi';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    input: {
      type: String,
      default: null,
    },
    output: {
      type: String,
      default: null,
    },
    availableInputs: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    availableOutputs: {
      type: Array as PropType<string[]>,
      default: () => [],
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
  const valinput = ref<string | undefined>(undefined);
  const valoutput = ref<string | undefined>(undefined);
  const actions = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Confirm', value: 'confirm' },
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
    if (WebMidi.enabled) {
      valinput.value = props.input || undefined;
      valoutput.value = props.output || undefined;
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
  function handleAction(action: string) {
    let input: Input | undefined;
    let output: Output | undefined;
    if (action === 'confirm') {
      if (valinput.value !== undefined) {
        input = WebMidi.getInputByName(valinput.value);
      }
      if (valoutput.value !== undefined) {
        output = WebMidi.getOutputByName(valoutput.value);
      }
    }
    emit('input', { input, output });
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <Modal title="MIDI Config" :actions="actions" @action="handleAction">
    <div class="group">
      <label>MIDI In:</label>
      <select v-model="valinput">
        <option :value="undefined" selected disabled>Choose input device</option>
        <option v-for="(input, idx) in availableInputs" :key="`input-${idx}`" :value="input">
          {{ input }}
        </option>
      </select>
    </div>
    <div class="group">
      <label>MIDI Out:</label>
      <select v-model="valoutput">
        <option :value="undefined" selected disabled>Choose output device</option>
        <option v-for="(output, odx) in availableOutputs" :key="`output-${odx}`" :value="output">
          {{ output }}
        </option>
      </select>
    </div>
  </Modal>
</template>

<style lang="scss"></style>

<i18n />
