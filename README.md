# DreamTales 🌌✨
### An Immersive Narrated Generative Art & Cinematic Storytelling Experience

DreamTales is an atmospheric, browser-based digital theater that combines **generative visual art**, **high-definition synthetic narration**, **procedural ambient audio**, and **real-time reactive visuals** into an evocative static-art cinematic storytelling experience.

---

## 📖 Featured Narrative: *Chronicles of the Astral Archivist*

*“Before the first sunrise and long after the final star had faded, there existed a place beyond the reach of time...”*

An eight-chapter cosmic odyssey chronicling the keeper of forgotten worlds who embarks on an interstellar pilgrimage to deliver the memory of an extinguished civilization back into the cosmos.

### The 8 Visual Chapters
1. **Chapter I: The Celestial Archive** — The endless halls storing the memories of a billion civilizations.
2. **Chapter II: The Heartbeat in the Dark** — A mysterious untitled tome pulses with a living heartbeat.
3. **Chapter III: The Observatory of Forgotten Suns** — Constellations fading as worlds are forgotten.
4. **Chapter IV: Fragments in the Void** — The glass-winged skiff navigates celestial debris of lost lives.
5. **Chapter V: The Forgotten World** — Silver dust dunes, ruins, and luminescent flora beneath dying skies.
6. **Chapter VI: The Vision Beneath the Oldest Tower** — Ancient temple projections revealing two golden suns.
7. **Chapter VII: The Gift of Tomorrow** — Releasing the solitary star memory to spark newborn worlds.
8. **Chapter VIII: A Tomorrow** — Returning to the archive forever changed, discovering new beginnings.

---

## 🌟 Key Architecture & Features

### 🎙️ Dual-Engine Voice Narration
- **Studio-Grade Local HD Voice**: Pre-rendered master tracks generated with **OpenAI TTS-1-HD** (Voice: `ash`) at cinematic pacing (`0.95x`).
- **Web Speech Synthesis Fallback**: Zero-dependency browser speech synthesis that functions completely offline.
- **Synchronized Teleprompter**: Live word-level highlighting with karaoke-style pacing tracking the narrator's voice.

### 🎧 Procedural Web Audio Soundscape
- Dynamic ambient synthesizer powered by the browser's native **Web Audio API**.
- Multi-oscillator harmonic drone with subtle binaural detuning and low-pass resonant filtration.
- **Smart Auto-Ducking**: Ambient tones automatically duck down during vocal narration and smoothly restore during pauses.
- Starts cleanly muted by default with instantaneous volume and mute controls.

### 🌌 Visual Effects & Aesthetics
- **2D Canvas Particle Engine**: Atmospheric astral dust, motes, and floating light specks with natural Brownian drift.
- **Audio-Reactive Spectrum Ribbon**: Real-time FFT frequency visualizer rendering glowing waveforms responsive to the narration.
- **Ken Burns Motion System**: Subtle pan-and-zoom cinematic animation creating dynamic depth over static generative artwork.
- **Glassmorphism Theme**: Sleek dark space aesthetics featuring frosted glass panels, neon accent glows, and responsive typography.

### 🏛️ Interactive Spaces
- **Theater Stage**: The main cinema experience with progress timeline, chapter navigation, and teleprompter display.
- **Exhibition Wall**: Art inspection gallery showcasing prompt engineering details, chapter synopses, and full-resolution art previews.
- **Creation Studio**: A narrative forge for authors and creators to script new scenes, customize art prompts, and audition voice narration.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause narration & cinema |
| `Arrow Right` | Advance to next scene |
| `Arrow Left` | Return to previous scene |
| `M` | Toggle ambient soundscape mute |
| `F` | Toggle immersive fullscreen mode |

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+ Modules), HTML5, Vanilla CSS3 (Custom Design Tokens)
- **Tooling & Bundler**: [Vite](https://vitejs.dev/)
- **Audio Synthesis**: Web Audio API, Web Speech Synthesis API, OpenAI Audio API (`tts-1-hd`)
- **Visuals**: HTML5 2D Canvas, CSS Keyframe Animations

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShreyMangle/dreamtales.git
   cd dreamtales
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for custom audio generation):**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key if you wish to run the voice generation pipeline
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🎙️ Narration Generation Pipeline

To synthesize fresh narration audio with custom voices:
```bash
npm run generate:audio
```
This executes `scripts/build_story_assets.js`, which connects to OpenAI's TTS API, synthesizes 320kbps MP3 audio for each scene, and exports them directly into `public/audio/`.

---

## 📄 License

MIT License. Crafted for creative storytelling and visual immersion.
