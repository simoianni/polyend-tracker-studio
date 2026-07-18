<script setup lang="ts">
  //---------------------------------------------------
  //
  //  Imports
  //
  //---------------------------------------------------
  import { ref } from 'vue';
  import Modal from '@/components/ui/Modal.vue';

  //---------------------------------------------------
  //
  //  Emits
  //
  //---------------------------------------------------
  const emit = defineEmits(['close']);

  //---------------------------------------------------
  //
  //  Data Model
  //
  //---------------------------------------------------
  const modal = ref<InstanceType<typeof Modal> | null>(null);
  const activeTab = ref<'pattern' | 'instruments'>('pattern');

  const actions = [{ label: 'Close', value: 'close' }];

  //---------------------------------------------------
  //
  //  Methods
  //
  //---------------------------------------------------
  function handleAction(action: string) {
    if (action === 'close') {
      emit('close');
    }
  }
</script>

<template>
  <Modal
    ref="modal"
    title="Tracker Unified Editor — Guide"
    :actions="actions"
    class="modal-help"
    @action="handleAction"
    @close="emit('close')"
  >
    <div class="help-content">
      <!-- Tab bar -->
      <div class="help-tabs">
        <button :class="{ active: activeTab === 'pattern' }" @click="activeTab = 'pattern'">Pattern Editor</button>
        <button :class="{ active: activeTab === 'instruments' }" @click="activeTab = 'instruments'">
          Instrument Editor
        </button>
      </div>

      <!-- ============================================================ -->
      <!--  PATTERN EDITOR TAB                                           -->
      <!-- ============================================================ -->
      <div v-if="activeTab === 'pattern'" class="help-tab">
        <section>
          <h4>Navigation</h4>
          <table>
            <tr>
              <td><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd></td>
              <td>Move cursor in the pattern grid</td>
            </tr>
            <tr>
              <td><kbd>Tab</kbd></td>
              <td>Switch between Pattern and Instrument views</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Step Attributes</h4>
          <p>Each step has 4 attributes you can edit. Press the number key to select which one:</p>
          <table>
            <tr>
              <td><kbd>1</kbd></td>
              <td><strong>Note</strong> — pitch (C-0 to G-10)</td>
            </tr>
            <tr>
              <td><kbd>2</kbd></td>
              <td><strong>Instrument</strong> — which instrument slot plays (0–66)</td>
            </tr>
            <tr>
              <td><kbd>3</kbd></td>
              <td><strong>FX1</strong> — first effect (volume, pan, glide, etc.)</td>
            </tr>
            <tr>
              <td><kbd>4</kbd></td>
              <td><strong>FX2</strong> — second effect</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Recording Mode</h4>
          <p>
            Press <kbd>Escape</kbd> to toggle <strong>Record Mode</strong> ON/OFF. When active, the cursor turns red and
            you can live-edit steps.
          </p>
          <table>
            <tr>
              <td><kbd>Esc</kbd></td>
              <td>Toggle record mode</td>
            </tr>
            <tr>
              <td><kbd>Z</kbd><kbd>X</kbd><kbd>C</kbd>…<kbd>,</kbd></td>
              <td>Input notes (C to C, bottom row = white keys)</td>
            </tr>
            <tr>
              <td><kbd>S</kbd><kbd>D</kbd><kbd>G</kbd><kbd>H</kbd><kbd>J</kbd></td>
              <td>Input sharps/flats (C# D# F# G# A# = black keys)</td>
            </tr>
            <tr>
              <td><kbd>.</kbd></td>
              <td>Octave down</td>
            </tr>
            <tr>
              <td><kbd>/</kbd></td>
              <td>Octave up</td>
            </tr>
            <tr>
              <td><kbd>0</kbd>–<kbd>9</kbd></td>
              <td>Input numeric values (buffered, waits 300ms)</td>
            </tr>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>↑</kbd><kbd>↓</kbd></td>
              <td>Fine-tune value ±1</td>
            </tr>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>←</kbd><kbd>→</kbd></td>
              <td>Coarse change: ±10 (or ±12 for notes)</td>
            </tr>
            <tr>
              <td><kbd>Delete</kbd></td>
              <td>Clear current step (in record mode)</td>
            </tr>
          </table>
          <p class="note">Hold Ctrl+Arrow for auto-repeat (starts slow, accelerates).</p>
        </section>

        <section>
          <h4>Overlay Menus</h4>
          <p>
            When in record mode, pressing <kbd>2</kbd> (Instrument) or <kbd>3</kbd>/<kbd>4</kbd> (FX1/FX2) opens an
            overlay list. Use <kbd>↑</kbd><kbd>↓</kbd> or <kbd>←</kbd><kbd>→</kbd> to browse and select.
          </p>
        </section>

        <section>
          <h4>Playback</h4>
          <table>
            <tr>
              <td><kbd>Space</kbd></td>
              <td>Play / Stop the pattern</td>
            </tr>
            <tr>
              <td>BPM ± buttons</td>
              <td>Adjust tempo (20–300 BPM)</td>
            </tr>
          </table>
          <p class="note">Playback scrolls the view automatically. Notes highlight green as they play.</p>
        </section>

        <section>
          <h4>File Operations</h4>
          <table>
            <tr>
              <td><strong>New Pattern</strong></td>
              <td>Create a blank pattern (choose tracks &amp; steps)</td>
            </tr>
            <tr>
              <td><strong>Load Pattern</strong></td>
              <td>Open a <code>.mtp</code> file</td>
            </tr>
            <tr>
              <td><strong>Import Project</strong></td>
              <td>
                Load a full tracker project folder (<code>project.mt</code> + <code>patterns/</code> +
                <code>instruments/</code>)
              </td>
            </tr>
            <tr>
              <td><strong>Save Pattern</strong></td>
              <td>Download current pattern as <code>.mtp</code></td>
            </tr>
            <tr>
              <td><strong>Export MIDI</strong></td>
              <td>Export pattern as <code>.mid</code> file</td>
            </tr>
            <tr>
              <td><strong>Export Ableton</strong></td>
              <td>Export as Ableton Live project (<code>.zip</code> with <code>.als</code> + samples)</td>
            </tr>
            <tr>
              <td><strong>Edit Instrument</strong></td>
              <td>Jump to Instrument Editor for the current step's instrument</td>
            </tr>
          </table>
        </section>
      </div>

      <!-- ============================================================ -->
      <!--  INSTRUMENT EDITOR TAB                                        -->
      <!-- ============================================================ -->
      <div v-if="activeTab === 'instruments'" class="help-tab">
        <section>
          <h4>Navigation</h4>
          <table>
            <tr>
              <td><kbd>Tab</kbd></td>
              <td>Switch between Pattern and Instrument views</td>
            </tr>
            <tr>
              <td><kbd>←</kbd><kbd>→</kbd> buttons</td>
              <td>Cycle through instrument slots (0–66)</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Sub-views</h4>
          <p>The Instrument Editor has 3 main sections (each with 2 pages):</p>
          <table>
            <tr>
              <td><strong>Sample Playback</strong></td>
              <td>Waveform display, playmode selection, slices, zoom</td>
            </tr>
            <tr>
              <td><strong>Instrument Parameters</strong> (2 pages)</td>
              <td>Filter, tuning, volume, panning, overdrive, bitcrusher, FX sends</td>
            </tr>
            <tr>
              <td><strong>Instrument Automations</strong> (2 pages)</td>
              <td>6 automations (Volume, Pan, Cutoff, Wavetable Pos, Granular Pos, Finetune) with Envelope + LFO</td>
            </tr>
            <tr>
              <td><strong>Sample Editor</strong> (2 pages)</td>
              <td>Cut, Fade In, Fade Out, Normalize, Compress, Equalize</td>
            </tr>
            <tr>
              <td><strong>Sample Recorder</strong> (2 pages)</td>
              <td>Record audio from mic/line-in, with MIDI-triggered auto-sampling</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Playing Notes</h4>
          <table>
            <tr>
              <td><kbd>Z</kbd><kbd>X</kbd><kbd>C</kbd>…<kbd>,</kbd></td>
              <td>Natural notes — C D E F G A B C (bottom row = white keys)</td>
            </tr>
            <tr>
              <td><kbd>S</kbd><kbd>D</kbd><kbd>G</kbd><kbd>H</kbd><kbd>J</kbd></td>
              <td>Sharps/flats — C# D# F# G# A# (middle row = black keys)</td>
            </tr>
            <tr>
              <td><kbd>.</kbd></td>
              <td>Octave down</td>
            </tr>
            <tr>
              <td><kbd>/</kbd></td>
              <td>Octave up</td>
            </tr>
          </table>
          <p class="note">
            Lower notes trigger lower slice indices in Beat Slice mode.<br />Notes are held until you release the key
            (monophonic per note).
          </p>
        </section>

        <section>
          <h4>Playmodes</h4>
          <table>
            <tr>
              <td><strong>1-Shot</strong></td>
              <td>Plays the sample once from start to end</td>
            </tr>
            <tr>
              <td><strong>Forward Loop</strong></td>
              <td>Loops between Loop Start and Loop End, forward</td>
            </tr>
            <tr>
              <td><strong>Backward Loop</strong></td>
              <td>Loops between Loop Start and Loop End, backward</td>
            </tr>
            <tr>
              <td><strong>Pingpong Loop</strong></td>
              <td>Alternates forward/backward between loop points</td>
            </tr>
            <tr>
              <td><strong>Slice</strong></td>
              <td>Plays one slice at a time; use the Slice selector</td>
            </tr>
            <tr>
              <td><strong>Beat Slice</strong></td>
              <td>Each note triggers a different slice (Z=slice1, S=slice2, X=slice3, D=slice4…)</td>
            </tr>
            <tr>
              <td><strong>Wavetable</strong></td>
              <td>Cycles through wavetable windows; position is automatable</td>
            </tr>
            <tr>
              <td><strong>Granular</strong></td>
              <td>Granular synthesis with adjustable grain size, position, shape, and type</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Slice Operations</h4>
          <table>
            <tr>
              <td><strong>Slice selector</strong></td>
              <td>Use <kbd>←</kbd><kbd>→</kbd> on the parameter bar to change active slice</td>
            </tr>
            <tr>
              <td><strong>Add slice</strong></td>
              <td>Adds a slice at cursor position (or midpoint of last gap)</td>
            </tr>
            <tr>
              <td><strong>Remove slice</strong></td>
              <td>Removes the last slice</td>
            </tr>
            <tr>
              <td><strong>Adjust</strong></td>
              <td>Shows the frame position of the active slice</td>
            </tr>
            <tr>
              <td><strong>Click on waveform</strong></td>
              <td>Drag slice markers (regions) to reposition them</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Zoom</h4>
          <p>
            Scroll the mouse wheel on the waveform to zoom in/out. The zoom percentage is displayed in the parameter bar
            at the bottom. Hold <kbd>Shift</kbd> + scroll to keep the view unchanged.
          </p>
        </section>

        <section>
          <h4>Instrument Parameters</h4>
          <table>
            <tr>
              <td><strong>Filter</strong></td>
              <td>Low-pass / High-pass / Band-pass; Cutoff and Resonance</td>
            </tr>
            <tr>
              <td><strong>Tuning</strong></td>
              <td>Coarse tune (±24 semitones) + Finetune (±100 cents)</td>
            </tr>
            <tr>
              <td><strong>Volume</strong></td>
              <td>0.0 – 2.0 (0.0 = 0 dB)</td>
            </tr>
            <tr>
              <td><strong>Panning</strong></td>
              <td>-1.0 (full left) to 1.0 (full right)</td>
            </tr>
            <tr>
              <td><strong>Delay Send</strong></td>
              <td>0.0 – 1.0</td>
            </tr>
            <tr>
              <td><strong>Reverb Send</strong></td>
              <td>0.0 – 1.0</td>
            </tr>
            <tr>
              <td><strong>Overdrive</strong></td>
              <td>0 – 100</td>
            </tr>
            <tr>
              <td><strong>Bit Depth</strong></td>
              <td>4 – 16 bit reduction</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>Automations</h4>
          <p>6 automation slots: Volume, Panning, Cutoff, Wavetable Position, Granular Position, Finetune.</p>
          <p>Each has:</p>
          <ul>
            <li><strong>Envelope</strong>: Amount, Delay, Attack, Decay, Sustain, Release</li>
            <li><strong>LFO</strong>: Shape (Sine/Triangle/Saw/Square/Random), Speed, Amount</li>
          </ul>
          <p class="note">Toggle between Envelope and LFO by clicking "ENV" / "LFO" on the parameter bar.</p>
        </section>

        <section>
          <h4>Sample Editor</h4>
          <table>
            <tr>
              <td><strong>Cut</strong></td>
              <td>Select a region and delete it (or keep only the selection)</td>
            </tr>
            <tr>
              <td><strong>Fade In</strong></td>
              <td>Apply linear fade-in to selected region</td>
            </tr>
            <tr>
              <td><strong>Fade Out</strong></td>
              <td>Apply linear fade-out to selected region</td>
            </tr>
            <tr>
              <td><strong>Normalize</strong></td>
              <td>Normalize peak amplitude to 0 dB</td>
            </tr>
            <tr>
              <td><strong>Compress</strong></td>
              <td>Dynamic range compression with adjustable threshold, ratio, attack, release</td>
            </tr>
            <tr>
              <td><strong>Equalize</strong></td>
              <td>3-band EQ (Low/Mid/High) with ±12 dB gain per band</td>
            </tr>
          </table>
          <p class="note">
            Drag on the waveform to create a selection, then apply an action. Press <kbd>Esc</kbd> to clear selection.
          </p>
        </section>

        <section>
          <h4>Sample Recorder</h4>
          <table>
            <tr>
              <td><strong>Record</strong></td>
              <td>Record from microphone or line input</td>
            </tr>
            <tr>
              <td><strong>Auto-sampling</strong></td>
              <td>MIDI-triggered: sends MIDI notes, records each one automatically</td>
            </tr>
            <tr>
              <td><strong>Commit</strong></td>
              <td>Accept the recording and load it as the instrument sample</td>
            </tr>
          </table>
        </section>

        <section>
          <h4>File Operations</h4>
          <table>
            <tr>
              <td><strong>New Instrument</strong></td>
              <td>Create from audio file, create sliced instrument from multiple files, or create empty instrument</td>
            </tr>
            <tr>
              <td><strong>Load Instrument</strong></td>
              <td>Open a <code>.pti</code> file</td>
            </tr>
            <tr>
              <td><strong>Save Instrument</strong></td>
              <td>Download current instrument as <code>.pti</code></td>
            </tr>
            <tr>
              <td><strong>Save as .WAV</strong></td>
              <td>Export only the sample as <code>.wav</code></td>
            </tr>
            <tr>
              <td><strong>Configure MIDI</strong></td>
              <td>Set MIDI input/output devices for keyboard control and auto-sampling</td>
            </tr>
          </table>
        </section>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss">
  .modal-help {
    .help-content {
      width: 620px;
      max-height: 65vh;
      overflow-y: auto;
      padding-right: 4px;

      // Custom scrollbar
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 3px;
        &:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }

    .help-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 16px;
      background: #111;
      border-radius: 4px;
      padding: 2px;

      button {
        flex: 1;
        background: transparent;
        border: none;
        color: #666;
        font-family: inherit;
        font-size: 12px;
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 3px;
        transition: all 0.15s;

        &.active {
          background: #222;
          color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        &:hover:not(.active) {
          color: #999;
        }
      }
    }

    .help-tab {
      section {
        margin-bottom: 18px;

        &:last-child {
          margin-bottom: 0;
        }

        h4 {
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 4px;
        }

        p {
          font-size: 11px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.55);
          margin: 0 0 8px 0;

          &.note {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.35);
            font-style: italic;
            margin-top: 4px;
          }
        }

        ul {
          margin: 4px 0 8px 0;
          padding-left: 18px;
          li {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.55);
            line-height: 1.5;
          }
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;

        tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          &:last-child {
            border-bottom: none;
          }
        }

        td {
          padding: 4px 8px;
          vertical-align: top;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.5;

          &:first-child {
            white-space: nowrap;
            color: rgba(255, 255, 255, 0.8);
            min-width: 180px;
          }
        }
      }

      kbd {
        display: inline-block;
        font-family: inherit;
        font-size: 10px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 3px;
        padding: 1px 5px;
        margin: 0 2px;
        color: rgba(255, 255, 255, 0.75);
        white-space: nowrap;
      }

      code {
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 10px;
        background: rgba(255, 255, 255, 0.06);
        padding: 1px 4px;
        border-radius: 2px;
      }

      strong {
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }
</style>
