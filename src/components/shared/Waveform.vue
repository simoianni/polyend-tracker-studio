<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, nextTick, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue';
  import { InstrumentData, InstrumentPlayMode, MAX_16BIT, SAMPLE_RATE } from '@polyend/tracker-lib';
  import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
  import RegionsPlugin from 'wavesurfer.js/plugins/regions';
  import { frames2seconds, seconds2frames } from '@/utils/helpers.ts';
  import { SampleSelection } from '@/types/sample-editor.ts';

  //---------------------------------------------------
  //
  //  Type Definitions
  //
  //---------------------------------------------------
  type Regions = {
    loop: any;
    grain: any;
    startPoint: any;
    endPoint: any;
    slices: any[];
  };

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
    zoomPercentage: {
      type: Number,
      default: 0.01,
    },
    activeSliceIndex: {
      type: Number,
      default: 0,
    },
    editorMode: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Object as PropType<SampleSelection | null>,
      default: null,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['zoom', 'slice', 'selection', 'cut']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const wsContainer = ref<HTMLElement | null>(null);
  const wsInstance = ref<WaveSurfer | null>(null);

  const regionPlugin = RegionsPlugin.create();
  const regions: Regions = {
    loop: null,
    grain: null,
    startPoint: null,
    endPoint: null,
    slices: [],
  };

  const zoom = ref<number>(0);
  const minZoom = 0;
  const maxZoom = 66666;
  let lastTime = 0;
  let lastInteractionTime = 0;

  const colors = {
    waveColor: '#eeeeee',
    progressColor: '#eeeeee',
  };

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const playModeClass = computed(() => {
    const instrument = props.instrumentData;
    if (instrument) {
      const { playmode } = instrument;
      const loopedModes = [
        InstrumentPlayMode.ForwardLoop,
        InstrumentPlayMode.BackwardLoop,
        InstrumentPlayMode.PingpongLoop,
      ];
      if (loopedModes.includes(playmode)) {
        return 'looped';
      }
      if (playmode === InstrumentPlayMode.Granular) {
        return 'granular';
      }
      if (playmode === InstrumentPlayMode.Wavetable) {
        return 'wavetable';
      }
    }
    if (props.editorMode) {
      return 'editor';
    }
    return '';
  });

  //---------------------------------------------------
  //
  //  Watch Properties
  //
  //---------------------------------------------------
  watch(
    () => props.selection,
    (newval) => {
      if (newval === null) {
        regionPlugin?.clearRegions();
      }
    },
  );

  watch(
    () => props.activeSliceIndex,
    () => {
      updateRegions();
    },
  );

  watch(
    () => props.instrumentData?.wavetableCurrentWindow,
    (newVal, oldVal) => {
      if (
        newVal !== undefined &&
        newVal !== oldVal &&
        props.instrumentData?.playmode === InstrumentPlayMode.Wavetable
      ) {
        focusOnWavetableWindow();
      }
    },
  );

  //---------------------------------------------------
  //
  //  Vue Lifecycle
  //
  //---------------------------------------------------
  // onBeforeMount(() => {});
  onMounted(() => {
    const container = wsContainer.value;
    if (container) {
      const ws = WaveSurfer.create({
        container,
        backend: props.editorMode ? 'WebAudio' : 'MediaElement',
        barGap: 0.5,
        height: 400,
        width: 800,
        sampleRate: SAMPLE_RATE,
        ...colors,
        plugins: [regionPlugin],
        dragToSeek: !props.editorMode,
      });

      // Track the clicked position directly: the media element seek is async,
      // so getCurrentTime() would still be stale right after the first click
      ws.on('interaction', (newTime: number) => {
        lastInteractionTime = newTime;
      });
      container.addEventListener('pointerdown', handlePointerDown);

      if (props.editorMode) {
        ws.on('finish', () => {
          ws.setTime(lastTime);
        });
        ws.on('pause', () => {
          ws.setTime(lastTime);
        });
        regionPlugin.enableDragSelection({ resize: true });
        regionPlugin.on('region-initialized', handleEditorRegionInit);
        regionPlugin.on('region-created', handleEditorRegionUpdated);
        regionPlugin.on('region-updated', handleEditorRegionUpdated);
        window.addEventListener('keyup', handleKey);
      }

      container.addEventListener('wheel', handleMouseWheel, { passive: false });

      wsInstance.value = ws;
      render();
    }
  });
  // onBeforeUpdate(() => {});
  // onUpdated(() => {});
  // onActivated(() => {});
  // onDeactivated(() => {});
  onBeforeUnmount(() => {
    const container = wsContainer.value;
    if (container) {
      window.removeEventListener('keyup', handleKey);
      container.removeEventListener('wheel', handleMouseWheel);
      container.removeEventListener('pointerdown', handlePointerDown);
    }
    wsInstance?.value?.destroy();
  });
  // onUnmounted(() => {});

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------

  //----------------------------------
  // Public Methods
  //----------------------------------
  async function render() {
    const instrument = props.instrumentData;
    const ws = wsInstance.value;
    if (ws && instrument) {
      lastInteractionTime = 0;
      empty();

      const isStereo = instrument.sample.channels === 2;
      const options = {
        ...ws.options,
        height: isStereo ? 200 : 400,
        splitChannels: isStereo ? [colors, colors] : undefined,
      };

      ws.setOptions(options as WaveSurferOptions);

      if (instrument.sample.length > 0) {
        ws.once('ready', () => {
          if (instrument.playmode === InstrumentPlayMode.Wavetable) {
            focusOnWavetableWindow();
          }
        });
        await ws.loadBlob(instrument.getSampleAsBlob());
      }
      update();
    }
  }

  async function stream(data: Float32Array, length: number) {
    const ws = wsInstance.value;
    if (ws) {
      await ws.load('', [data], length / SAMPLE_RATE);
      ws.setTime(ws.getDuration());
    }
  }

  async function load(blob: Blob) {
    const ws = wsInstance.value;
    if (ws) {
      empty();
      await nextTick(async () => {
        if (blob.size > 0) {
          await ws.loadBlob(blob);
        }
      });
    }
  }

  function update() {
    if (!props.editorMode) {
      updateRegions();
      if (props.instrumentData?.playmode !== InstrumentPlayMode.Wavetable) {
        wsInstance.value?.zoom(0);
        zoom.value = 0;
      } else {
        focusOnWavetableWindow();
      }
    }
  }

  function empty() {
    wsInstance.value?.empty();
  }

  function getCurrentTime(): number {
    return lastInteractionTime || wsInstance.value?.getCurrentTime() || 0;
  }

  //----------------------------------
  // Private Methods
  //----------------------------------
  function focusOnWavetableWindow() {
    const instrument = props.instrumentData;
    const ws = wsInstance.value;
    if (ws && instrument && instrument.playmode === InstrumentPlayMode.Wavetable) {
      const duration = ws.getDuration();
      if (!duration) return;

      const windowSize = instrument.sample.wavetable.windowSize;
      const windowCount = instrument.sample.wavetable.windowCount + 1;
      const currentWindow = instrument.wavetableCurrentWindow;

      ws.zoom(ws.getWidth() / (windowSize / 44100));
      ws.seekTo((currentWindow * (duration / windowCount)) / duration);
    }
  }

  function updateRegions() {
    const instrument = props.instrumentData;
    const ws = wsInstance.value;
    if (instrument && ws) {
      const currentPlayMode = instrument.playmode;
      const loopedModes = [
        InstrumentPlayMode.ForwardLoop,
        InstrumentPlayMode.BackwardLoop,
        InstrumentPlayMode.PingpongLoop,
      ];
      const sliceModes = [InstrumentPlayMode.Slice, InstrumentPlayMode.BeatSlice];

      // Reset regions
      regions.startPoint = null;
      regions.endPoint = null;
      regions.loop = null;
      regions.grain = null;
      regions.slices = [];

      regionPlugin.clearRegions();
      regionPlugin.unAll();

      // Create Ranges for slices
      if (sliceModes.includes(currentPlayMode)) {
        for (let i = 0; i < instrument.numSlices; i++) {
          const id = i === props.activeSliceIndex ? `slice active ${i}` : `slice ${i}`;
          const rawSlice = instrument.slices[i];
          const region = regionPlugin.addRegion({
            start: frames2seconds(rawSlice, instrument),
            id,
          });
          regions.slices.push(region);
        }
      }

      // Create Range for sample start and end
      if (currentPlayMode === InstrumentPlayMode.OneShot || loopedModes.includes(currentPlayMode)) {
        regions.startPoint = regionPlugin.addRegion({
          start: frames2seconds(instrument.startPoint, instrument),
          id: 'range start',
        });
        regions.endPoint = regionPlugin.addRegion({
          start: frames2seconds(instrument.endPoint === MAX_16BIT ? MAX_16BIT - 48 : instrument.endPoint, instrument),
          id: 'range end',
        });
      }

      if (currentPlayMode === InstrumentPlayMode.Granular) {
        const granPos = instrument.granular.currentPosition;
        const granSize = instrument.granular.grainLength / 2;
        regions.grain = regionPlugin.addRegion({
          start: frames2seconds(granPos - granSize, instrument),
          end: frames2seconds(granPos + granSize, instrument),
          id: `grain`,
          drag: true,
          resize: true,
        });
      }

      // Create Loop Range
      if (loopedModes.includes(currentPlayMode)) {
        regions.loop = regionPlugin.addRegion({
          start: frames2seconds(instrument.loopPoint1, instrument),
          end: frames2seconds(instrument.loopPoint2, instrument),
          id: `loop`,
          drag: true,
          resize: true,
        });
      }

      regionPlugin.on('region-clicked', handleInstrumentRegionClicked);
      regionPlugin.on('region-update', handleInstrumentRegionUpdate);
      regionPlugin.on('region-updated', handleInstrumentRegionUpdated);
    }
  }

  //----------------------------------
  // Event Handlers
  //----------------------------------
  function handlePointerDown(evt: PointerEvent) {
    const ws = wsInstance.value;
    if (ws) {
      const duration = ws.getDuration();
      const rect = ws.getWrapper().getBoundingClientRect();
      if (duration > 0 && rect.width > 0) {
        const relativeX = Math.min(Math.max((evt.clientX - rect.left) / rect.width, 0), 1);
        lastInteractionTime = relativeX * duration;
      }
    }
  }

  function handleMouseWheel(evt: WheelEvent) {
    if (!evt.shiftKey) {
      const ws = wsInstance.value;
      if (ws) {
        evt.preventDefault();
        const increment = evt.deltaY * 50;
        let value = zoom.value + increment;
        if (value < minZoom) {
          value = minZoom;
        }
        if (value > maxZoom) {
          value = maxZoom;
        }
        emit('zoom', (value / maxZoom) * 100);
        zoom.value = value;
        ws.zoom(value);
      }
    }
  }

  async function handleKey(evt: KeyboardEvent) {
    const ws = wsInstance.value;
    if (!ws) return;

    switch (evt.code) {
      case 'Escape':
        regionPlugin.clearRegions();
        emit('selection', null);
        break;
      case 'Home':
        ws.setTime(0);
        break;
      case 'End':
        ws.setTime(ws.getDuration());
        break;
      case 'Delete':
        if (!props.selection) return;
        emit('cut');
        regionPlugin.clearRegions();
        break;
      case 'Space':
        if (!ws.isPlaying()) {
          const selection = props.selection;
          if (selection) {
            lastTime = selection.start;
            ws.play(selection.start, selection.end);
          } else {
            lastTime = ws.getCurrentTime();
            ws.play(lastTime);
          }
        } else {
          ws.pause();
        }
        break;
      default:
      // console.log(evt.code);
    }
  }

  //----------------------------------
  // Instrument related region handlers
  //----------------------------------
  function handleInstrumentRegionClicked(evt: any) {
    const { id } = evt;
    const instrument = props.instrumentData;
    if (instrument && String(id).includes('slice')) {
      const newIndex = parseInt(id.replace(/\D+/, ''), 10) || 0;
      emit('slice', newIndex);
      instrument.selectedSlice = newIndex;
    }
  }

  function handleInstrumentRegionUpdate(evt: any) {
    const instrument = props.instrumentData;
    if (instrument) {
      const { id, start, end } = evt;
      const baseId = id.replace(/ \d+/, '');
      if (baseId.startsWith('slice')) {
        const index = parseInt(id.replace(/\D+/g, ''), 10) || 0;
        instrument.slices[index] = seconds2frames(start, instrument);
      } else {
        switch (baseId) {
          case 'range start':
            instrument.startPoint = seconds2frames(start, instrument);
            break;
          case 'range end':
            instrument.endPoint = seconds2frames(end, instrument);
            break;
          case 'loop':
            instrument.loopPoint1 = seconds2frames(start, instrument);
            instrument.loopPoint2 = seconds2frames(end, instrument);
            break;
          case 'grain':
            const startFrame = seconds2frames(start, instrument);
            const endFrame = seconds2frames(end, instrument);
            const length = endFrame - startFrame;
            const position = Math.floor(startFrame + length / 2);
            instrument.granular.currentPosition = position;
            instrument.granular.grainLength = length;
            break;
        }
      }
    }
  }

  function handleInstrumentRegionUpdated(evt: any) {
    const instrument = props.instrumentData;
    if (instrument) {
      const { id } = evt;
      const baseId = id.replace(/ \d+/, '');
      if (baseId.startsWith('slice')) {
        const index = parseInt(id.replace(/\D+/g, ''), 10) || 0;
        if (regions.slices[index]) {
          regions.slices[index].start = frames2seconds(instrument.slices[index], instrument);
        }
      } else {
        switch (baseId) {
          case 'range start':
            regions.startPoint.start = frames2seconds(instrument.startPoint, instrument);
            break;
          case 'range end':
            regions.endPoint.start = frames2seconds(instrument.endPoint, instrument);
            break;
          case 'loop':
            regions.loop.start = frames2seconds(instrument.loopPoint1, instrument);
            regions.loop.end = frames2seconds(instrument.loopPoint2, instrument);
            break;
          case 'grain':
            const pos = instrument.granular.currentPosition;
            const size = Math.floor(instrument.granular.grainLength / 2);
            regions.grain.start = frames2seconds(pos - size, instrument);
            regions.grain.end = frames2seconds(pos + size, instrument);
            break;
        }
      }
    }
  }

  //----------------------------------
  // Editor related region handlers
  //----------------------------------
  function handleEditorRegionInit() {
    regionPlugin.clearRegions();
  }

  function handleEditorRegionUpdated(evt: any) {
    const { start, end } = evt;
    emit('selection', { start, end });
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({ render, stream, update, load, empty, getCurrentTime });
</script>

<template>
  <div ref="wsContainer" id="waveform" class="waveform" :class="playModeClass" />
</template>

<style lang="scss">
  .waveform {
    padding: 2px;
    min-width: 804px;
    min-height: 404px;

    --region-color: #6c9ae6;

    &.granular {
      --region-color: #6c9ae6;
    }

    &.wavetable {
      ::part(cursor) {
        display: none;
      }
    }

    ::part(region) {
      background: rgb(from var(--region-color) r g b / 0.2);
    }

    ::part(region-handle) {
      position: absolute;
      padding: 0;
      width: 1px;
      background-color: rgb(from var(--region-color) r g b / 0.7);
      height: 100%;
      cursor: pointer;
    }
    ::part(region-handle):after {
      content: '▽';
      font-size: 13px;
      color: rgb(from var(--region-color) r g b / 0.7);
      position: absolute;
      left: -5px;
      top: calc(100% - 13px);
      transform-origin: 50% 50%;
    }
    ::part(region-handle region-handle-left):after {
      transform: translate(2px, 2px) rotate(28deg);
    }
    ::part(region-handle region-handle-right):after {
      transform: translate(-1px, 2px) rotate(-28deg);
    }

    ::part(marker) {
      padding: 0;
      width: 1px;
      border: 1px solid transparent;
      height: 100%;
      transform-origin: 50% 50%;
      font-size: 0;
      letter-spacing: 0;
      text-indent: 10pxvs;
      cursor: pointer;
    }
    ::part(marker slice) {
      top: 6px;
      height: calc(100% - 6px);
      background-color: #ffff30;
    }
    ::part(marker slice active) {
      background-color: #45ff30;
    }
    ::part(marker range) {
      background-color: #aaa;
    }
    ::part(marker):after {
      content: '▽';
      font-size: 13px;
      position: absolute;
    }
    ::part(marker slice):after {
      color: #ffff30;
      left: -5px;
      top: -10px;
      transform: translate(-0.5px, 0);
    }
    ::part(marker slice active):after {
      color: #45ff30;
    }
    ::part(marker range):after {
      transform-origin: 50% 50%;
      color: #aaa;
      left: 0;
      top: 0;
    }
    ::part(marker range start):after {
      transform: translate(-3px, -3px) rotate(28deg);
    }
    ::part(marker range end):after {
      transform: translate(-8px, -3px) rotate(-28deg);
    }

    &.editor {
      ::part(region-handle) {
        border-left: rgb(from var(--region-color) r g b / 0.075) !important;
        border-right: rgb(from var(--region-color) r g b / 0.075) !important;
        background: rgb(from var(--region-color) r g b / 0.075) !important;
      }
      ::part(region-handle):after {
        display: none;
      }
    }
  }
</style>

<i18n />
