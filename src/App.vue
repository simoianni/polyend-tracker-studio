<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { ref, computed, watch, onBeforeUnmount, onMounted, shallowRef } from 'vue';
  import { watchDebounced } from '@vueuse/core';
  import { InstrumentData } from '@polyend/tracker-lib';
  import PatternEditor from '@/components/PatternEditor.vue';
  import InstrumentEditor from '@/components/InstrumentEditor.vue';
  import ModalHelp from '@/components/modals/ModalHelp.vue';
  import VueComp from '@/utils/vuecomp.ts';
  import { loadPersistedInstruments, persistInstrument } from '@/utils/persistence.ts';

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  type AppView = 'pattern' | 'instruments';

  const activeView = ref<AppView>('pattern');
  const currentInstrumentSlot = ref<number>(0);
  const instrumentStore = shallowRef<Map<number, InstrumentData | null>>(new Map());

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const currentInstrumentData = computed(() => {
    return instrumentStore.value.get(currentInstrumentSlot.value) || null;
  });

  const slotLabel = computed(() => {
    const slot = currentInstrumentSlot.value;
    if (slot >= 64 && slot <= 66) return `Synth ${slot - 63}`;
    if (slot >= 48 && slot <= 62) return `MIDI Channel ${slot - 47}`;
    return `Instrument ${slot + 1}`;
  });

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------
  function switchView(view: AppView) {
    activeView.value = view;
  }

  function selectInstrumentSlot(slot: number) {
    currentInstrumentSlot.value = slot;
    activeView.value = 'instruments';
  }

  function handleInstrumentDataUpdate(data: InstrumentData | null) {
    instrumentStore.value.set(currentInstrumentSlot.value, data);
    // Force reactivity update
    instrumentStore.value = new Map(instrumentStore.value);
    persistInstrument(currentInstrumentSlot.value, data);
  }

  function handleInstrumentImport(instruments: { slot: number; data: InstrumentData }[]) {
    for (const { slot, data } of instruments) {
      instrumentStore.value.set(slot, data);
      persistInstrument(slot, data);
    }
    instrumentStore.value = new Map(instrumentStore.value);
  }

  // Persist edits made inside the instrument editor (slices, parameters,
  // sample edits mutate the instrument in place without replacing it)
  watchDebounced(
    currentInstrumentData,
    (data) => {
      if (data) {
        persistInstrument(currentInstrumentSlot.value, data);
      }
    },
    { deep: true, debounce: 500 },
  );

  function changeInstrumentSlot(delta: number) {
    const newSlot = currentInstrumentSlot.value + delta;
    if (newSlot >= 0 && newSlot <= 66) {
      currentInstrumentSlot.value = newSlot;
    }
  }

  function showHelp() {
    VueComp.create(ModalHelp, document.body, {});
  }

  //---------------------------------------------------
  //
  //  Keyboard Shortcuts
  //
  //---------------------------------------------------
  function handleGlobalKeydown(evt: KeyboardEvent) {
    // Tab to switch views
    if (evt.key === 'Tab' && !evt.ctrlKey && !evt.metaKey) {
      // Only handle when not in an input
      if (document.activeElement === document.body || 
          document.activeElement?.hasAttribute('data-pattern-container')) {
        evt.preventDefault();
        activeView.value = activeView.value === 'pattern' ? 'instruments' : 'pattern';
      }
    }
  }

  onMounted(async () => {
    window.addEventListener('keydown', handleGlobalKeydown);

    const persisted = await loadPersistedInstruments();
    if (persisted.size > 0) {
      const merged = new Map(instrumentStore.value);
      for (const [slot, data] of persisted) {
        if (!merged.has(slot)) {
          merged.set(slot, data);
        }
      }
      instrumentStore.value = merged;
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
  });
</script>

<template>
  <div class="unified-tracker">
    <nav class="tab-bar">
      <button
        :class="{ active: activeView === 'pattern' }"
        @click="switchView('pattern')"
      >
        Pattern Editor
      </button>
      <button
        :class="{ active: activeView === 'instruments' }"
        @click="switchView('instruments')"
      >
        Instrument Editor
      </button>
      <span class="shortcut-hint">Tab to switch</span>
      <button class="help-btn" @click="showHelp" title="Guide / Help">?</button>
    </nav>

    <div v-show="activeView === 'pattern'" class="view-container">
      <PatternEditor :instrument-store="instrumentStore" @edit-instrument="selectInstrumentSlot" @import-instruments="handleInstrumentImport" />
    </div>

    <div v-if="activeView === 'instruments'" class="view-container">
      <div class="slot-selector">
        <button class="slot-nav" @click="changeInstrumentSlot(-1)">&lt;</button>
        <span class="slot-label">{{ slotLabel }} <em>(slot {{ currentInstrumentSlot }})</em></span>
        <button class="slot-nav" @click="changeInstrumentSlot(1)">&gt;</button>
      </div>
      <InstrumentEditor
        :key="currentInstrumentSlot"
        :modelValue="currentInstrumentData"
        :slot-number="currentInstrumentSlot"
        @update:modelValue="handleInstrumentDataUpdate"
        @back="switchView('pattern')"
      />
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/scss/app';

  body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 15px;
    justify-content: flex-start;
    align-items: center;
    height: 100vh;
    width: 100%;
  }

  .unified-tracker {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: center;
  }

  nav.tab-bar {
    display: flex;
    gap: 0;
    background: #1a1b1e;
    border-radius: 8px;
    padding: 3px;
    box-shadow: 0 0.5px 0 rgba(255, 255, 255, 0.1);

    button {
      background: transparent;
      border: none;
      color: #888;
      font-family: inherit;
      font-size: 13px;
      padding: 6px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;

      &.active {
        background: #2a2b2e;
        color: #fff;
      }

      &:hover:not(.active) {
        color: #ccc;
      }
    }

    .shortcut-hint {
      display: flex;
      align-items: center;
      padding: 0 12px;
      font-size: 10px;
      color: #555;
    }

    .help-btn {
      margin-left: auto;
      width: 26px;
      height: 26px;
      padding: 0 !important;
      font-size: 13px !important;
      font-weight: bold;
      color: #666 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 50% !important;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;

      &:hover {
        color: #fff !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
    }
  }

  .view-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .slot-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #1a1b1e;
    padding: 6px 16px;
    border-radius: 8px;
    box-shadow: 0 0.5px 0 rgba(255, 255, 255, 0.1);

    .slot-nav {
      background: #2a2b2e;
      border: none;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #3a3b3e;
      }
    }

    .slot-label {
      font-size: 14px;
      color: #fff;
      min-width: 220px;
      text-align: center;

      em {
        color: #666;
        font-style: normal;
        font-size: 11px;
      }
    }
  }

  div.actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin: 0 auto;

    & > div.group {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      &.separator {
        position: relative;
        top: 1px;
        width: 1px;
        height: 100%;
        background: #fff;
        opacity: 0.2;
      }
    }
  }
</style>
