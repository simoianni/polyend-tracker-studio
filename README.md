# Polyend Tracker Instrument Editor

A web-based editor for creating, editing, managing, and _playing_ **Polyend Tracker Instrument (`.pti`)** files.\
Powered by [`tracker-lib`](http://github.com/polyend/tracker-lib) (along with other frameworks).

**Live Demo:** https://polyend.sandroid.xyz/instrumented/

For a quickish overview, check out this youtube video:

[![Watch the video](https://img.youtube.com/vi/6vzHuB2HkdE/0.jpg)](https://www.youtube.com/watch?v=6vzHuB2HkdE)


## Features

* **Sampler & Sample Editor:** 
  * Sample audio directly from within the editor
  * Edit the recordings before committing as an instrument
  * Offers functions like Cut, Fade In, Fade Out, Normalize, Compress, and Equalize

* **Instrument Creation Helpers:** create sliced instruments with ease.
* **Instrument Parameters:** Manage filters (cutoff, resonance, type), tuning, envelopes, LFOs, volume, panning, overdrive, bit-depth reduction, and FX sends.
* **Waveform Visualizer:** Interact with the waveform using custom zooming, scrolling, and marker placements.
* **Play your instruments:** Oh you thought this was just a simple sample playback? Oh no, my friend... this player uses the Web Audio API to play your instruments as they would sound.. well mostly.
* **Playback Modes:** Support for OneShot, Forward/Backward/Pingpong loops as well as advanced Wavetable and Granular engines.
* **Play via MIDI or Keyboard:** hook up your MIDI Keyboard or play the sounds directly on the keyboard.



## Technical Stack

* [`tracker-lib`](http://github.com/polyend/tracker-lib) (handles read/write of `.pti` files)
* **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
* **Audio Framework:** Built with [Elementary](https://github.com/elemaudio/elementary)
* **Waveform Renderer**: [WaveSurfer.js](https://wavesurfer.xyz/) v7 + Regions Plugin


## Getting Started

### Installation

1. Install all dependencies:
   ```bash
   npm install
   ```

2. Run the development server locally:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).


### Package Scripts

* `npm run dev`: Starts the local development server.
* `npm run build`: Compiles and bundles the application for production.
* `npm run test`: Runs formatting checks, ESLint, and type checks.
* `npm run lint`: Runs ESLint on source files.
* `npm run typecheck`: Validates TypeScript without compiling.



## Future Plans

I doubt i'll have time to meaningfully continue development on this going forward. It was meant as an example of what can be done with the [`tracker-lib`](http://github.com/polyend/tracker-lib). If anyone wants to continue development, I will happily accept PRs or add you as a contributor to this repository.

## License

`tracker-lib` is licensed under the [MIT License](https://opensource.org/licenses/MIT).

However, **this example repository** is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license. 

- **Attribution:** You are free to use, copy, modify, and build upon this code, but you must give appropriate credit to the original creator.
- **Non-Commercial:** You **cannot** use this example repository, or projects derived from it, to generate revenue, make money, or use it for commercial purposes.

What does this means in plain english? Feel free to use this for anything you want but keep it open source so the community can benefit from it. 😊

For full details, please see the [LICENSE](./LICENSE) file included in this repository. If your business needs to use this architecture or boilerplate commercially, please contact me to discuss a commercial licensing agreement.
