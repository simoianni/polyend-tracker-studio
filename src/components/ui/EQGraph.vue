<script setup lang="ts">
  import { ref, onMounted, watch, PropType } from 'vue';
  import { EQBand } from '@/components/sample-editor/actions/equalizer.ts';
  import { EQ_BAND_COLORS } from '@/utils/colors.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    bands: {
      type: Array as PropType<EQBand[]>,
      required: true,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['update:bands']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const canvas = ref<HTMLCanvasElement | null>(null);
  const audioContext = new AudioContext();
  const width = 550;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };

  const minFreq = 20;
  const maxFreq = 22000;

  const minGain = -24;
  const maxGain = 24;

  const hoveredBandIndex = ref<number | null>(null);
  const draggedBandIndex = ref<number | null>(null);

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------

  // --- Coordinate Conversion ---
  function freqToX(freq: number): number {
    const logFreq = Math.log(freq);
    const logMin = Math.log(minFreq);
    const logMax = Math.log(maxFreq);
    const pos = (logFreq - logMin) / (logMax - logMin);
    return pos * (width - (padding.left + padding.right)) + padding.left;
  }

  function xToFreq(x: number): number {
    const pos = (x - padding.left) / (width - (padding.left + padding.right));
    const logMin = Math.log(minFreq);
    const logMax = Math.log(maxFreq);
    const logFreq = pos * (logMax - logMin) + logMin;
    return Math.exp(logFreq);
  }

  function gainToY(gain: number): number {
    const pos = (gain - minGain) / (maxGain - minGain);
    return (1 - pos) * (height - (padding.top + padding.bottom)) + padding.top;
  }

  function yToGain(y: number): number {
    const pos = 1 - (y - padding.top) / (height - (padding.top + padding.bottom));
    return pos * (maxGain - minGain) + minGain;
  }

  // --- Drawing ---
  function draw() {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx);
    drawCurve(ctx);
    drawBandPoints(ctx);
  }

  function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 0.25;
    ctx.fillStyle = '#aaa';
    ctx.font = '10px sans-serif';

    // Vertical lines and labels (frequency)
    ctx.textAlign = 'center';
    const freqLines = [30, 60, 100, 200, 500, 1000, 2000, 5000, 10000];
    freqLines.forEach((freq) => {
      const x = freqToX(freq);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
      ctx.fillText(label, x, height - padding.bottom + 12);
    });

    // Horizontal lines and labels (gain)
    ctx.textAlign = 'right';
    const gainLines = [-18, -12, -6, 0, 6, 12, 18];
    gainLines.forEach((gain) => {
      const y = gainToY(gain);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${gain}`, padding.left - 5, y + 3);
    });

    // Add labels for min and max frequencies
    ctx.textAlign = 'left';
    ctx.fillText('20', padding.left, height - padding.bottom + 12);
    ctx.textAlign = 'right';
    ctx.fillText('22k', width - padding.right, height - padding.bottom + 12);
  }

  function drawCurve(ctx: CanvasRenderingContext2D) {
    const overallResponse = new Float32Array(width).fill(0);
    const freqPoints = new Float32Array(width);

    for (let i = 0; i < width; i++) {
      freqPoints[i] = xToFreq(i);
    }

    props.bands.forEach((band) => {
      if (band.type === 'allpass') return;

      const filter = audioContext.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.frequency;
      filter.gain.value = band.gain;
      if (band.q) {
        filter.Q.value = band.q;
      }

      const magResponse = new Float32Array(width);
      const phaseResponse = new Float32Array(width);
      filter.getFrequencyResponse(freqPoints, magResponse, phaseResponse);

      for (let i = 0; i < width; i++) {
        overallResponse[i] += 20 * Math.log10(magResponse[i]);
      }
    });

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      const db = Math.max(minGain, Math.min(maxGain, overallResponse[i]));
      const x = i;
      const y = gainToY(db);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  function drawBandPoints(ctx: CanvasRenderingContext2D) {
    props.bands.forEach((band, index) => {
      if (band.type === 'allpass') return;

      const x = freqToX(band.frequency);
      let y;

      if (['peaking', 'lowshelf', 'highshelf'].includes(band.type)) {
        y = gainToY(band.gain);
      } else {
        y = gainToY(0); // Draw on 0dB line for others
      }

      ctx.fillStyle = EQ_BAND_COLORS[index % EQ_BAND_COLORS.length];

      const isHovered = hoveredBandIndex.value === index || draggedBandIndex.value === index;
      const radius = isHovered ? 7 : 5;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();

      if (isHovered) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }

  // --- Interactivity ---
  function handleMouseMove(e: MouseEvent) {
    if (!canvas.value) return;
    const rect = canvas.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedBandIndex.value !== null) {
      const band = props.bands[draggedBandIndex.value];
      const updatedBands = JSON.parse(JSON.stringify(props.bands));
      const newFreq = Math.max(minFreq, Math.min(maxFreq, xToFreq(x)));
      updatedBands[draggedBandIndex.value].frequency = Math.round(newFreq);

      if (['peaking', 'lowshelf', 'highshelf'].includes(band.type)) {
        const newGain = Math.max(minGain, Math.min(maxGain, yToGain(y)));
        updatedBands[draggedBandIndex.value].gain = parseFloat(newGain.toFixed(1));
      }
      emit('update:bands', updatedBands);
    } else {
      let foundBand = false;
      for (let i = 0; i < props.bands.length; i++) {
        const band = props.bands[i];
        if (band.type === 'allpass') continue;

        const bx = freqToX(band.frequency);
        let by;
        if (['peaking', 'lowshelf', 'highshelf'].includes(band.type)) {
          by = gainToY(band.gain);
        } else {
          by = gainToY(0);
        }

        const distance = Math.sqrt(Math.pow(x - bx, 2) + Math.pow(y - by, 2));

        if (distance < 10) {
          hoveredBandIndex.value = i;
          canvas.value.style.cursor = 'pointer';
          foundBand = true;
          break;
        }
      }
      if (!foundBand) {
        hoveredBandIndex.value = null;
        canvas.value.style.cursor = 'default';
      }
    }
  }

  function handleMouseDown() {
    if (hoveredBandIndex.value !== null) {
      draggedBandIndex.value = hoveredBandIndex.value;
    }
  }

  function handleMouseUp() {
    draggedBandIndex.value = null;
  }

  function handleMouseLeave() {
    hoveredBandIndex.value = null;
    draggedBandIndex.value = null;
  }

  function handleWheel(e: WheelEvent) {
    if (hoveredBandIndex.value === null) return;

    const band = props.bands[hoveredBandIndex.value];
    if (['lowshelf', 'highshelf'].includes(band.type)) return; // These don't have Q

    e.preventDefault();

    const updatedBands = JSON.parse(JSON.stringify(props.bands));
    if (band.q) {
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newQ = Math.max(0.1, Math.min(30, band.q + delta));
      updatedBands[hoveredBandIndex.value].q = parseFloat(newQ.toFixed(1));
    }
    emit('update:bands', updatedBands);
  }

  watch(() => props.bands, draw, { deep: true });

  onMounted(() => {
    if (canvas.value) {
      draw();
    }
  });
</script>

<template>
  <div class="eq-graph">
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
      @wheel="handleWheel"
    ></canvas>
  </div>
</template>

<style lang="scss">
  .eq-graph {
    canvas {
      background-color: #111;
      border: 1px solid #222;
      border-radius: 5px;
      box-shadow:
        0 0.5px 0 rgba(255, 255, 255, 0.15),
        0 -0.5px 0 rgba(255, 255, 0.255, 0.05);
    }
  }
</style>
