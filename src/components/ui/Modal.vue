<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { nextTick, onBeforeUnmount, onMounted, PropType } from 'vue';
  import Button from '@/components/ui/Button.vue';

  type Action = {
    label: string;
    value: string;
  };

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    title: {
      type: String,
      default: ' ',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array as PropType<Action[]>,
      default: () => [],
    },
    class: {
      type: String,
      default: '',
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['action', 'close']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  // const value = ref();

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
    window.addEventListener('keyup', handleKeyEvent);
  });
  // onBeforeUpdate(() => {});
  // onUpdated(() => {});
  // onActivated(() => {});
  // onDeactivated(() => {});
  onBeforeUnmount(() => {
    window.removeEventListener('keyup', handleKeyEvent);
  });
  // onUnmounted(() => {});

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------
  function close() {
    emit('close');
  }

  function handleClick(action: Action) {
    emit('action', action.value);
    if (!props.persistent) {
      nextTick(() => {
        emit('close');
      });
    }
  }

  function handleKeyEvent(evt: KeyboardEvent) {
    if (evt.code === 'Escape') {
      emit('close');
    }
  }
  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  defineExpose({ close });
</script>

<template>
  <Teleport to="body">
    <div class="modal" :class="props.class">
      <div class="underlay" @click="emit('close')" />
      <div class="overlay">
        <h3>{{ title }}</h3>
        <div class="content">
          <slot />
          <div class="group actions">
            <Button
              v-for="(action, aidx) in actions"
              :key="`action-${aidx}`"
              :class="{ blue: aidx === actions.length - 1 }"
              @click="handleClick(action)"
            >
              {{ action.label }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
  div.modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;

    & > .underlay {
      position: absolute;
      height: 100%;
      width: 100%;
      background: black;
      opacity: 0;
      z-index: 1;
      animation: fadein 0.3s linear forwards;
    }

    & > .overlay {
      position: relative;
      z-index: 2;
      background: #0a0a0a;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid black;
      margin-top: -15%;
      box-shadow:
        0 5px 8px black,
        0 15px 80vw rgba(200, 200, 200, 0.2);
      min-width: 250px;
      opacity: 0;
      transform: translate(0, -20px);
      animation: dropdown 0.5s ease forwards;

      & > h3 {
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.85);
        color: black;
        padding: 8px 8px 8px 8px;
        user-select: none;
      }

      & > .content {
        padding: 16px 8px 8px 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-top: 1px solid black;
        border-radius: 0 0 6px 6px;

        & > .group {
          position: relative;
          font-size: 12px;
          margin-bottom: 8px;
          &:last-of-type {
            margin-bottom: 0;
          }

          label {
            display: block;
            font-size: 12px;
            padding: 0 0 4px 2px;
          }

          p {
            line-height: 1.3;
            padding: 0 4px;
          }

          select,
          input:not([type='range']) {
            width: 100%;
            background: black;
            color: white;
            border-radius: 2px;
            border: 0;
            border-color: black;
            outline: 0;
            height: 24px;

            &.error {
              outline: 1px solid rgb(from #cd1818 r g b / 0.75);
            }
          }

          &.actions {
            margin-top: 8px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;

            &:empty {
              display: none;
            }

            & > button {
              min-height: 32px;
              font-size: 11px;
              height: auto;
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
</style>

<i18n />
