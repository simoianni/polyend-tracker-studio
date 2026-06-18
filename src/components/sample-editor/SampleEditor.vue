<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { onMounted, PropType, ref } from 'vue';
  import { InstrumentData } from '@polyend/tracker-lib';
  import VueComp from '@/utils/vuecomp.ts';
  import Waveform from '@/components/shared/Waveform.vue';
  import List from '@/components/ui/List.vue';
  import { SampleSelection } from '@/types/sample-editor.ts';
  import SampleEditorAction_Cut from '@/components/sample-editor/actions/cut.ts';
  import SampleEditorAction_FadeOut from '@/components/sample-editor/actions/fade-out.ts';
  import SampleEditorAction_FadeIn from '@/components/sample-editor/actions/fade-in.ts';
  import SampleEditorAction_Normalize from '@/components/sample-editor/actions/normalize.ts';
  import SampleEditorAction_Compress from '@/components/sample-editor/actions/compress.ts';
  import SampleEditorAction_Equalizer from '@/components/sample-editor/actions/equalizer.ts';
  import ModalSampleCompress from '@/components/modals/ModalSampleCompress.vue';
  import ModalSampleEqualize from '@/components/modals/ModalSampleEqualize.vue';

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
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['sample-update']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const waveformInstance = ref<InstanceType<typeof Waveform> | null>(null);
  const activeSelection = ref<SampleSelection | null>(null);

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  // const computedProperty = computed(() => { return null; });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  // watch(value, (newval, oldval) => {});

  //---------------------------------------------------
  //
  //  Vue Lifecycle
  //
  //---------------------------------------------------
  // onBeforeMount(() => {});
  onMounted(async () => {
    update();
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
  function executeAction(): void {}

  async function render(): Promise<void> {}

  async function update() {
    const instrument = props.instrumentData;
    if (instrument && instrument.wav) {
      const waveform = waveformInstance.value;
      if (waveform) {
        await waveform.load(instrument.getSampleAsBlob());
      }
    }
  }

  async function executeEditAction(action: string) {
    if (!props.instrumentData || !props.instrumentData.wav) return;
    const existingBuffer = props.instrumentData.wav;
    switch (action) {
      case 'cut':
        await updateSample(await SampleEditorAction_Cut.execute(existingBuffer, activeSelection.value));
        break;
      case 'fade-in':
        await updateSample(await SampleEditorAction_FadeIn.execute(existingBuffer, activeSelection.value));
        break;
      case 'fade-out':
        await updateSample(await SampleEditorAction_FadeOut.execute(existingBuffer, activeSelection.value));
        break;
      case 'normalize':
        await updateSample(await SampleEditorAction_Normalize.execute(existingBuffer));
        break;
      case 'compress':
        VueComp.create(ModalSampleCompress, document.body, {
          onAction: async (data) => {
            const { action, options } = data;
            if (action === 'preview') {
              await SampleEditorAction_Compress.preview(existingBuffer, options);
            } else if (action === 'apply') {
              await updateSample(await SampleEditorAction_Compress.execute(existingBuffer, options));
            }
          },
        });
        break;
      case 'equalize':
        VueComp.create(ModalSampleEqualize, document.body, {
          onAction: async (data) => {
            const { action, options } = data;
            if (action === 'preview') {
              await SampleEditorAction_Equalizer.preview(existingBuffer, options);
            } else if (action === 'apply') {
              await updateSample(await SampleEditorAction_Equalizer.execute(existingBuffer, options));
            }
          },
        });
        break;
    }
  }

  async function updateSample(newBuffer?: ArrayBuffer | null): Promise<void> {
    if (newBuffer) {
      emit('sample-update', newBuffer);

      const waveform = waveformInstance.value;
      if (waveform) {
        const blob = new Blob([newBuffer.slice(0)], { type: 'audio/wav' });
        await waveform.load(blob);
      }

      activeSelection.value = null;
    }
  }

  //----------------------------------
  // Event Handlers
  //----------------------------------

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({ executeAction, render, update });
</script>

<template>
  <div class="sample-editor">
    <Waveform
      editor-mode
      ref="waveformInstance"
      :selection="activeSelection"
      @selection="activeSelection = $event"
      @cut="executeEditAction('cut')"
    />
    <div class="info">
      <List
        :items="[
          { label: 'Cut', value: 'cut' },
          { label: 'Fade In', value: 'fade-in' },
          { label: 'Fade Out', value: 'fade-out' },
          { label: 'Normalize', value: 'normalize' },
          { label: 'Compress', value: 'compress' },
          { label: 'Equalize', value: 'equalize' },
        ]"
        @input="executeEditAction"
      />
    </div>
  </div>
</template>

<style lang="scss">
  div.sample-editor {
    display: flex;
    background: black;
    width: 100%;
    height: 100%;
    min-width: 804px;
    min-height: 404px;
    max-width: 984px;

    & > div.waveform {
      min-width: 804px;
    }

    & > div.info {
      margin-top: 1px;
      width: 100%;
      height: calc(100% - 3px);
      line-height: 1.43;
      margin-right: 2px;
      background: var(--instrument-params-border-color);
    }
  }
</style>
