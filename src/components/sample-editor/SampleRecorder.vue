<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { PropType, ref, watch } from 'vue';
  import { AudioUtil, InstrumentData } from '@polyend/tracker-lib';
  import { Output } from 'webmidi';
  import VueComp from '@/utils/vuecomp.ts';
  import ModalRecordingSourceSelect from '@/components/modals/ModalRecordingSourceSelect.vue';
  import Waveform from '@/components/shared/Waveform.vue';
  import SliderVertical from '@/components/ui/SliderVertical.vue';
  import SampleEditorAction_Cut from '@/components/sample-editor/actions/cut.ts';
  import { SampleSelection } from '@/types/sample-editor.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    midiOutput: {
      type: Object as PropType<Output | undefined>,
      default: null,
    },
    instrumentData: {
      type: Object as PropType<InstrumentData | null>,
      default: null,
    },
    isRecording: {
      type: Boolean,
      default: false,
    },
    hasRecordingSource: {
      type: Boolean,
      default: false,
    },
    autosampling: {
      type: Boolean,
      default: false,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['sample-update', 'update:hasRecordingSource', 'update:isRecording', 'update:autosampling']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const waveformInstance = ref<InstanceType<typeof Waveform> | null>(null);

  const gainPercentage = ref(0);
  const gainValue = ref(1);
  const isClipping = ref(false);
  let clippingTimeoutId: number | undefined = undefined;

  const activeSelection = ref<SampleSelection | null>(null);

  let audioContext: AudioContext | null;
  let mediaStream: MediaStream | null;
  let mediaRecorder: MediaRecorder | null;

  let sourceNode: MediaStreamAudioSourceNode;
  let gainNode: GainNode | null = null;
  let analyser: AnalyserNode;
  const dataWindow: Float32Array[] = [];

  let lastDrawTime = 0;
  const drawFPS = 1000 / 15;
  let gainAnimationFrameId: number | null = null;
  let waveAnimationFrameId: number | null = null;

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
  watch(gainValue, (newGain) => {
    if (gainNode) {
      gainNode.gain.value = newGain;
    }
  });

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
  function executeAction(action: string): void {
    switch (action) {
      case 'select-source':
        handleSourceSelect();
        break;
      case 'record-start':
        handleRecordingStart();
        break;
      case 'record-stop':
        handleRecordingEnd();
        break;
      case 'auto-sample':
        handleAutoSampling();
        break;
      default:
        console.log(action);
        break;
    }
  }
  async function render(): Promise<void> {}
  function update(): void {}

  //----------------------------------
  // MediaStream Methods
  //----------------------------------
  async function prepareMediaStream(deviceId: string) {
    if (!deviceId) {
      return;
    }

    const options = {
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: 44100,
        sampleSize: 16,
        channelCount: 2,
      },
    };

    if (deviceId === 'desktop') {
      mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
    } else {
      options.audio['deviceId'] = deviceId;
      mediaStream = await navigator.mediaDevices.getUserMedia(options);
    }

    if (mediaStream.getAudioTracks().length === 0) {
      throw new Error("No audio track selected. Please check 'Share audio' when prompted.");
    }

    audioContext = new AudioContext({ sampleRate: 44100 });
    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    gainNode = audioContext.createGain();
    gainNode.gain.value = gainValue.value;

    const destinationNode = audioContext.createMediaStreamDestination();
    sourceNode.connect(gainNode);
    gainNode.connect(analyser);
    gainNode.connect(destinationNode);

    const processedStream = destinationNode.stream;

    const recording: Blob[] = [];
    mediaRecorder = new MediaRecorder(processedStream, {
      mimeType: 'video/webm;codecs=vp8,pcm',
      audioBitsPerSecond: 128000,
    });
    mediaRecorder.ondataavailable = (evt: BlobEvent) => {
      recording.push(evt.data);
    };
    mediaRecorder.onstop = async () => {
      await processRecording(recording);
    };

    waveformInstance.value?.empty();
    dataWindow.length = 0;

    emit('update:hasRecordingSource', true);
    monitorGain();
  }

  function monitorGain() {
    if (props.isRecording || !analyser) {
      if (gainAnimationFrameId) {
        cancelAnimationFrame(gainAnimationFrameId);
        gainAnimationFrameId = null;
      }
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);
    let peak = 0;
    let clipping = false;
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      if (value >= 255 || value <= 0) {
        clipping = true;
      }
      const centeredValue = Math.abs(value - 128);
      if (centeredValue > peak) {
        peak = centeredValue;
      }
    }
    gainPercentage.value = (peak / 128) * 100; // Normalize and scale

    if (clipping) {
      isClipping.value = true;
      if (clippingTimeoutId) {
        clearTimeout(clippingTimeoutId);
      }
      clippingTimeoutId = window.setTimeout(() => {
        isClipping.value = false;
      }, 150);
    }

    gainAnimationFrameId = requestAnimationFrame(monitorGain);
  }

  async function drawWaveform() {
    const now = performance.now();
    // Only draw if enough time has passed since the last draw
    if (now - lastDrawTime < drawFPS) {
      waveAnimationFrameId = requestAnimationFrame(drawWaveform);
      return; // Skip this frame
    }

    lastDrawTime = now; // Update the last draw time

    const waveform = waveformInstance.value;
    if (!waveform || !analyser) {
      return;
    }

    // Use getByteTimeDomainData for a simpler visualization
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);

    // Accumulate the data
    const floatData = new Float32Array(dataArray.length);
    for (let i = 0; i < dataArray.length; i++) {
      floatData[i] = (dataArray[i] - 128) / 128; // Normalize to -1 to 1 range
    }
    dataWindow.push(floatData);

    // Merge the data window into a single Float32Array
    const totalLength = dataWindow.reduce((sum, arr) => sum + arr.length, 0);
    const combinedData = new Float32Array(totalLength);
    let offset = 0;
    for (const arr of dataWindow) {
      combinedData.set(arr, offset);
      offset += arr.length;
    }

    await waveform.stream(combinedData, totalLength);
    waveAnimationFrameId = requestAnimationFrame(drawWaveform);
  }

  async function processRecording(recording: Blob[]) {
    if (!audioContext) return;

    const recordedBlob = new Blob(recording, { type: 'video/webm' });
    const arrayBuffer = await recordedBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Extract raw audio data from the AudioBuffer
    const channels: Float32Array[] = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    // Interleave the channel data if it's stereo
    const interleaved = new Float32Array(channels[0].length * audioBuffer.numberOfChannels);
    for (let i = 0; i < channels[0].length; i++) {
      for (let j = 0; j < audioBuffer.numberOfChannels; j++) {
        interleaved[i * audioBuffer.numberOfChannels + j] = channels[j][i];
      }
    }

    const wavBuffer = AudioUtil.createWavFile(interleaved, {
      numChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
      bitsPerSample: 16,
    });

    mediaStream = null;
    mediaRecorder = null;
    await audioContext.close();
    audioContext = null;

    emit('sample-update', wavBuffer);
    emit('update:isRecording', false);
    emit('update:hasRecordingSource', false);

    const waveform = waveformInstance.value;
    if (waveform) {
      const blob = new Blob([wavBuffer.slice(0)], { type: 'audio/wav' });
      await waveform.load(blob);
    }
  }

  //----------------------------------
  // Event Handlers
  //----------------------------------
  async function handleSourceSelect() {
    await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
      console.warn('Permission to access microphone denied. Device labels may not be available.');
    });

    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices
      .filter((device) => device.kind === 'audioinput')
      .map((device) => ({
        id: device.deviceId,
        label: device.label,
        kind: device.kind,
      }));
    inputs.unshift({ id: 'desktop', label: 'Desktop / System Audio', kind: 'videoinput' });

    VueComp.create(ModalRecordingSourceSelect, document.body, {
      inputs,
      onSelect: (deviceId: string) => {
        prepareMediaStream(deviceId);
      },
    });
  }

  async function handleRecordingStart() {
    if (mediaRecorder) {
      mediaRecorder.start();
      emit('update:isRecording', true);
      drawWaveform();
    }
  }

  async function handleRecordingEnd() {
    if (mediaRecorder && mediaStream && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaStream.getTracks().forEach((track) => track.stop());

      if (waveAnimationFrameId) {
        cancelAnimationFrame(waveAnimationFrameId);
        waveAnimationFrameId = null;
      }
    }
  }

  function handleAutoSampling() {
    if (props.autosampling) {
      emit('update:autosampling', false);
    } else {
      emit('update:autosampling', true);
    }
  }

  async function executeEditAction(action: string) {
    if (!props.instrumentData || !props.instrumentData.wav) return;

    const existingBuffer = props.instrumentData.wav;
    let newBuffer: ArrayBuffer | null = null;
    switch (action) {
      case 'cut':
        newBuffer = await SampleEditorAction_Cut.execute(existingBuffer, activeSelection.value);
        break;
    }

    if (newBuffer) {
      emit('sample-update', newBuffer);

      const waveform = waveformInstance.value;
      if (waveform) {
        const blob = new Blob([newBuffer.slice(0)], { type: 'audio/wav' });
        await waveform.load(blob);
      }
    }
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({ executeAction, render, update });
</script>

<template>
  <div class="sample-recorder">
    <Waveform
      editor-mode
      ref="waveformInstance"
      :selection="activeSelection"
      @selection="activeSelection = $event"
      @cut="executeEditAction('cut')"
    />
    <template v-if="hasRecordingSource && !isRecording">
      <div class="gain">
        <div>
          <div class="gain-meter" :class="{ clipping: isClipping }">
            <div><div :style="{ height: gainPercentage + '%' }"></div></div>
          </div>
        </div>
        <div>
          <SliderVertical :min="0" :max="10" :step="0.1" v-model="gainValue" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="info">
        <div>
          <ol>
            <li>Select Source</li>
            <li>Set Gain</li>
            <li>Record Audio</li>
            <li>Prepare Sample</li>
            <li>Profit 🥳</li>
          </ol>
          <ul>
            <li>Use the mouse to select regions of your sample.</li>
            <li>Press <code>Escape</code> to deselect a region.</li>
            <li>Press <code>Delete</code> to delete regions from the sample.</li>
            <li>Press the <code>Spacebar</code> to preview the sample.</li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  div.sample-recorder {
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

    & > div.gain {
      display: flex;
      position: relative;
      margin-top: 1px;
      width: 100%;
      height: calc(100% - 3px);

      & > div {
        border: 6px solid var(--instrument-params-border-color);
        background: var(--instrument-params-border-color);
        margin-right: 2px;
        position: relative;
        width: 50%;

        & > .gain-meter {
          height: 100%;
          min-width: 50%;
          width: 100%;

          &.clipping > div > div {
            background: #ff4136; // Red for clipping
          }

          & > div {
            position: relative;
            width: 100%;
            height: 100%;
            background: var(--instrument-params-container-color);
            box-shadow: inset 0 2px 8px 3px black;
            overflow: hidden;

            & > div {
              flex-grow: 0;
              flex-shrink: 0;
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 100px;
              background-color: #4caf50;
              transition:
                width 0.2s linear,
                background-color 0.2s linear;
            }
          }
        }
      }
    }

    & > div.info {
      margin-top: 1px;
      width: 100%;
      height: calc(100% - 3px);
      line-height: 1.43;
      margin-right: 2px;
      // color: color-mix(in hsl, currentColor, transparent 65%);
      border: 6px solid var(--instrument-params-border-color);
      background: var(--instrument-params-border-color);
      font-size: 1.2rem;
      user-select: none;

      & > div {
        & > ol {
          padding: 0 0 16px 14px;
          margin: 0;
          li {
            padding-left: 2px;
          }
        }
        & > ul {
          padding: 0;
          margin: 0;
          list-style-type: none;

          & > li {
            position: relative;
            padding: 0 0 8px 16px;
            margin: 0;

            &:before {
              position: absolute;
              content: '→';
              left: -2px;
              top: -1px;
            }

            & > code {
              background-color: #eee;
              color: black;
              padding: 1px 4px 2px 4px;
              border-radius: 6px;
              font-weight: 600;
              font-family: inherit;
            }
          }
        }
      }
    }
  }
</style>
