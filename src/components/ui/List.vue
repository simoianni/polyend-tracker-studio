<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { onMounted, PropType, ref } from 'vue';

  type ListItem = {
    label: string;
    value: number | string;
  };

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    items: {
      type: Array as PropType<ListItem[]>,
      default: () => [],
    },
    value: {
      type: Number,
      default: 0,
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
  const container = ref<HTMLElement>();

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
  // watch(value, (newval, oldval) => { console.log(newval, oldval); });

  //---------------------------------------------------
  //
  //  Vue Lifecycle
  //
  //---------------------------------------------------
  // onBeforeMount(() => {});
  onMounted(() => {
    const list = container.value;
    const li = list?.querySelector(`[data-index="${props.value}"]`);
    if (li) {
      li.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  function handleClick(item: ListItem) {
    emit('input', item.value);
  }
  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <ul ref="container" class="list">
    <li
      v-for="(item, idx) in items"
      @click="handleClick(item)"
      :class="{ active: item.value === value }"
      tabindex="-1"
      :data-index="idx"
      :key="`item-${idx}`"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<style lang="scss">
  ul.list {
    padding: 8px 2px;
    margin: 0;
    list-style-type: none;
    overflow-y: auto;
    max-height: 386px;
    scrollbar-width: none;

    & > li {
      padding: 2px 8px;
      border: 2px solid transparent;
      margin: 0 0 2px 0;
      user-select: none;
      cursor: pointer;
      outline: 0;

      &:hover {
        border: 2px solid white;
        background: white;
        color: black;
      }

      &.active {
        border: 2px solid white;
      }
    }

    &.active {
      & > li {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
</style>

<i18n />
