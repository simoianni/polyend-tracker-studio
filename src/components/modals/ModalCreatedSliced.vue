<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { computed, nextTick, onMounted, ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';
  import Sortable from 'sortablejs';

  import SVGDrag from '@/assets/svgs/icon-drag.svg';
  import SVGPlay from '@/assets/svgs/icon-play.svg';
  import SVGRemove from '@/assets/svgs/icon-remove.svg';
  import { requestFiles } from '@/utils/io.ts';

  //---------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------
  const props = defineProps({
    files: {
      type: FileList,
      default: null,
    },
  });

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['action']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const listContainer = ref<HTMLElement | null>(null);

  const modal = ref<InstanceType<typeof Modal> | null>(null);
  const iFiles = ref<File[]>([]);
  const playingIndex = ref<number>(-1);
  const isPlaying = ref<boolean>(false);

  const actions = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Preview All', value: 'preview-all' },
    { label: 'Create', value: 'create' },
  ];

  let sortable: Sortable;
  let audio: HTMLAudioElement;

  //---------------------------------------------------
  //
  //  Computed Properties
  //
  //---------------------------------------------------
  const numSlices = computed(() => {
    const numLen = String(iFiles.value.length).padStart(2, '0');
    return `${numLen} / 48`;
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
  onMounted(() => {
    const filelist = props.files || [];
    iFiles.value = [...filelist].slice(0, 48) as File[];

    const container = listContainer.value;
    if (container) {
      sortable = new Sortable(container, {
        draggable: '.item',
        forceFallback: false,
        dataIdAttr: 'data-index',
        direction: 'vertical',
        onEnd: handleSort,
      });
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
  async function add() {
    const newFiles = (await requestFiles('audio/wav', true)) || [];
    let newArr: File[] = [...iFiles.value];
    newArr.push(...(newFiles as File[]));
    newArr = newArr.slice(0, 48);
    iFiles.value = newArr;
  }

  function remove(idx: number) {
    const newArr: File[] = [...iFiles.value];
    newArr.splice(idx, 1);
    iFiles.value = newArr;
  }

  function play(idx: number) {
    const file = iFiles.value[idx] as File;
    if (file) {
      audio = new Audio();
      audio.src = URL.createObjectURL(file);
      playingIndex.value = idx;
      audio.addEventListener('ended', () => {
        playingIndex.value = -1;
        isPlaying.value = false;
      });
      isPlaying.value = true;
      audio.play();
    }
  }

  function stop() {
    if (audio) {
      audio.pause();
      playingIndex.value = -1;
      isPlaying.value = false;
    }
  }

  //----------------------------------
  // Event Handlers
  //----------------------------------
  function handleAction(action: string) {
    if (action === 'preview-all') {
      if (isPlaying.value) {
        stop();
      } else {
        audio = new Audio();
        const audioFiles = iFiles.value || [];
        let index = playingIndex.value;
        index += 1;
        if (index < audioFiles.length) {
          audio.src = URL.createObjectURL(audioFiles[index]);
          playingIndex.value = index;
          audio.addEventListener('ended', () => {
            index += 1;
            if (index < audioFiles.length) {
              audio.src = URL.createObjectURL(audioFiles[index]);
              playingIndex.value = index;
              audio.play();
            } else {
              playingIndex.value = -1;
              isPlaying.value = false;
            }
          });
          isPlaying.value = true;
          audio.play();
        }
      }
    } else if (action === 'create') {
      emit('action', iFiles.value);
      modal.value?.close();
    } else {
      modal.value?.close();
    }
  }

  function handleSort() {
    const newIndexes = sortable.toArray();
    const currentArr = iFiles.value;
    const newArr: File[] = [];
    newIndexes.forEach((idx) => {
      newArr.push(currentArr[idx]);
    });
    iFiles.value = [];
    nextTick(() => {
      iFiles.value = newArr;
    });
  }

  //---------------------------------------------------
  //
  //  Expose
  //
  //---------------------------------------------------
  // defineExpose({});
</script>

<template>
  <Modal
    ref="modal"
    class="sliced-instrument"
    title="Create sliced instrument"
    :actions="actions"
    @action="handleAction"
    persistent
  >
    <div class="group">
      <ul ref="listContainer">
        <li class="item" v-for="(file, idx) in files" :key="`item-${idx}`" :data-index="idx">
          <button class="drag"><SVGDrag /></button>
          <span>{{ file.name }}</span>
          <button class="remove" @click="remove(idx)"><SVGRemove /></button>
          <button v-if="playingIndex !== idx" class="play" @click="play(idx)"><SVGPlay /></button>
          <button v-else class="stop" @click="stop()"><SVGPlay /></button>
        </li>
        <li v-if="files.length < 48" class="add">
          <button @click="add">+</button>
        </li>
      </ul>
    </div>
    <div class="group num-slices">{{ numSlices }}</div>
  </Modal>
</template>

<style lang="scss">
  .modal.sliced-instrument .overlay > .content > .group {
    ul {
      list-style-type: none;
      width: 100%;
      padding: 4px;
      margin: 0;
      background: black;
      border-radius: 5px;
      box-shadow:
        0 0.5px 0 rgba(255, 255, 255, 0.15),
        0 -0.5px 0 rgba(255, 255, 0.255, 0.05);
      max-height: calc(22.44px * 12);
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 3px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 6px;
      }

      li {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        width: 100%;
        height: 20px;
        max-height: 20px;
        background-color: #111;
        padding: 0 4px 0 2px;
        box-shadow:
          0 0.5px 0 rgba(255, 255, 255, 0.15),
          0 -0.5px 0 rgba(255, 255, 0.255, 0.05);
        margin-bottom: 2px;

        &:first-of-type {
          border-radius: 2px 2px 0 0;
        }

        &:last-of-type {
          margin-bottom: 0;
          border-radius: 0 0 2px 2px;
        }

        & > span {
          width: 100%;
          user-select: none;
        }

        & > button {
          width: 20px;
          height: 20px;
          padding: 0;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #666;

          &.remove {
            &:hover {
              color: #cf6e63;
            }
          }
          &.play {
            &:hover {
              color: var(--pattern-step-note-color);
            }
          }
          &.stop {
            color: var(--pattern-step-note-color);
          }

          & > svg {
            position: relative;
            width: 14px;
            height: 14px;
          }
        }

        &.add {
          margin-top: 4px;
          background-color: #050505;
          justify-content: center;

          &:only-child {
            margin-top: 0;
          }
          & > button {
            position: relative;
            top: 1px;
            width: 100%;
            font-size: 2rem;
          }

          &:hover {
            background-color: #0a0a0a;
            & > button {
              color: white;
            }
          }
        }

        &:hover {
          & > button.drag {
            color: white;
          }
        }
      }
    }

    &.num-slices {
      padding-right: 4px;
      text-align: right;
      font-size: 1rem;
      opacity: 0.75;
      margin-bottom: 0;
      text-shadow: 1px 2px black;
      user-select: none;
    }
  }
</style>

<i18n />
