<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import Modal from '@/components/ui/Modal.vue';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  defineProps({
    numCuePoints: {
      type: Number,
      default: 0,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['cancel', 'confirm']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const actions = [
    { label: 'No', value: 'cancel' },
    { label: 'Yes', value: 'confirm' },
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
    if (value === 'confirm') {
      emit('confirm');
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
  <Modal class="cue-points" title="Use Sample Cue Points" :actions="actions" @action="handleAction">
    <div class="group">
      <p>
        The current sample contains <span>{{ numCuePoints }} cue points</span>.<br />
        Would you like to create a sliced instrument?
      </p>
      <template v-if="numCuePoints > 48">
        <div class="warn">
          <span>⚠️</span>
          <div>Only the first 48 cue points can be used.</div>
        </div>
      </template>
    </div>
  </Modal>
</template>

<style lang="scss">
  .modal.cue-points {
    & > .overlay > .content > .group {
      color: #bbb;
      font-size: 12px;

      & > p > span {
        color: white;
      }
      & > div.warn {
        display: flex;
        padding: 8px 4px;
        border-radius: 4px;
        background-color: rgb(from #eacc69 r g b / 15%);
        gap: 6px;
        align-items: center;
        margin-top: 8px;
        font-size: inherit;
        color: inherit;
        border: 1px solid black;

        & > span {
          position: relative;
          top: -2px;
          font-size: 15px;
        }
      }
    }
  }
</style>

<i18n />
