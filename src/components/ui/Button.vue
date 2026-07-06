<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, PropType, ref } from 'vue';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    type: {
      type: String as PropType<'button' | 'file' | 'folder'>,
      default: 'button',
    },
    mimeTypes: {
      type: String,
      default: '',
    },
    pages: {
      type: Array,
      default: () => [],
    },
    activePage: {
      type: Number,
      default: 0,
    },

    // CSS Booleans
    focused: {
      type: Boolean,
      default: false,
    },
    blue: {
      type: Boolean,
      default: false,
    },
    yellow: {
      type: Boolean,
      default: false,
    },
    red: {
      type: Boolean,
      default: false,
    },
    blink: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: Boolean,
      default: false,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['click', 'file', 'page', 'folder']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const pageIndex = ref<number>(0);

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const active = computed(() => {
    return props.focused || props.pages.includes(props.activePage);
  });

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
  function handleClick(evt: Event) {
    const container = evt.currentTarget as HTMLDivElement;
    if (!container) return;

    if (props.type === 'file' || props.type === 'folder') {
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.click();
      }
    } else if (props.pages.length > 0) {
      const pages = props.pages;
      const activePage = props.activePage;
      let index = pages.findIndex((i) => i === activePage);

      index = index + 1;
      if (index >= pages.length) {
        index = 0;
      }
      pageIndex.value = index;
      emit('page', pages[index]);
    } else {
      emit('click', evt);
    }
    container.blur();
  }

  function handleInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    if (props.type === 'folder') {
      const files = input.files;
      if (files && files.length > 0) {
        emit('folder', Array.from(files));
      }
    } else {
      const file = (input?.files || [])[0];
      if (file) {
        emit('file', file);
      }
    }
    input.value = '';
  }
  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <button class="btn" :class="{ small, fill, active, blue, yellow, red, blink }" @click="handleClick">
    <ul v-if="pages.length > 0">
      <li v-for="(page, pidx) in pages" :key="`page-${pidx}`" :class="{ active: page === activePage }" />
    </ul>
    <slot />
    <input v-if="type === 'file'" type="file" :accept="mimeTypes" tabindex="-1" aria-hidden="true" @input="handleInput" />
    <input v-if="type === 'folder'" type="file" webkitdirectory directory tabindex="-1" aria-hidden="true" @input="handleInput" />
  </button>
</template>

<style lang="scss">
  @use '@/assets/scss/fonts';

  button.btn {
    --button-blink-color: transparent;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 4px 10px 3px 5px;
    min-width: 80px;
    min-height: 48px;
    @include fonts.tracker-button;
    font-size: 11px;
    line-height: 1.1;
    text-align: left;
    user-select: none;
    cursor: pointer;
    background: #1e1f21;
    border: 2px solid black;
    border-bottom-width: 3px;
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0.5px 0 rgba(255, 255, 255, 0.15);
    transform: translate(0, 0);
    outline: 0;
    overflow: hidden;

    &.small {
      display: block;
      min-height: 23px;
      padding-bottom: 4px;
    }

    &.fill {
      padding-right: 5px;
      width: 100%;
    }

    & > sup {
      vertical-align: baseline;
      font-size: 9px;
    }

    & > ul {
      position: absolute;
      display: none;
      padding: 0;
      margin: 0;
      list-style-type: none;
      top: 4px;
      right: 4px;
      gap: 4px;

      & > li {
        padding: 0;
        margin: 0;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        background: #000;
        border: 1px solid rgba(0, 0, 0, 1);

        &.active {
          background: #888;
        }
      }
    }

    &:after {
      position: absolute;
      content: '';
      inset: 0;
      border: 1.2px solid white;
      border-radius: 3.4px;
      opacity: 0.1;
    }

    & > input[type='file'] {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
      outline: 0;
    }

    &.blue {
      --blink-color: #54cfc1;
      background-color: #54cfc1;
      color: rgba(0, 0, 0, 0.85);
      &:after {
        border-color: black;
        opacity: 0.5;
      }
    }

    &.yellow {
      --blink-color: #dfdd9e;
      background-color: #dfdd9e;
      color: rgba(0, 0, 0, 0.85);

      &:after {
        border-color: black;
        opacity: 0.5;
      }
    }

    &.red {
      --blink-color: #cf6e63;
      background: #cf6e63;
      color: rgba(0, 0, 0, 0.85);
      &:after {
        border-color: black;
        opacity: 0.5;
      }
    }

    &.active {
      color: rgba(255, 255, 255, 1);
      background: linear-gradient(0deg, #1e1f21 50%, rgba(0, 0, 0, 0.4));

      & > ul {
        display: inline-flex;
      }
    }

    &:hover {
      transform: translate(0, -0.5px);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 1);
    }

    &:active {
      border-top-width: 3px;
      border-bottom-width: 2px;
      transform: translate(0, -0px) scale(0.99, 0.99);
    }
  }
</style>

<i18n />
