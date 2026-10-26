import fs from 'fs';
import path from 'path';

// Parse .env manually to avoid extra dependencies
function loadEnv() {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY is not defined in .env');
  process.exit(1);
}

const scenes = [
  {
    id: 'archivist_1_celestial_archive',
    chapter: 'I',
    title: 'The Celestial Archive',
    imageSrc: 'Gemini_Generated_Image_e487wze487wze487.png',
    artFilename: 'archivist_1_celestial_archive.png',
    audioFilename: 'archivist_scene_1.mp3',
    narration: 'Before the first sunrise and long after the final star had faded, there existed a place beyond the reach of time. It was called the Celestial Archive. Within its endless halls rested the memories of a billion worlds: the first songs ever sung, the last words of forgotten kings, the laughter of children beneath alien suns, and the dreams of civilizations that had vanished before humanity learned to name the stars. And watching over them all was a solitary keeper known only as the Astral Archivist. For countless ages, the Archivist had preserved everything that the universe could no longer remember.'
  },
  {
    id: 'archivist_2_heartbeat_in_dark',
    chapter: 'II',
    title: 'The Heartbeat in the Dark',
    imageSrc: 'Gemini_Generated_Image_xr5vtwxr5vtwxr5v.png',
    artFilename: 'archivist_2_heartbeat_in_dark.png',
    audioFilename: 'archivist_scene_2.mp3',
    narration: 'Until one silent evening, a book appeared where no book had ever been. The book was small enough to rest upon an open palm, yet its cover seemed darker than the space between galaxies. No title marked its spine. No seal identified its maker. When the Archivist touched it, the library fell completely silent. Every candle extinguished. Every floating page became still. Then, from somewhere deep within the book, came a sound the Archivist had not heard in ten thousand years. A heartbeat. Its pages opened by themselves. On the first page, a single star flickered against a field of darkness. It was weak, trembling, and almost extinguished. Beneath it appeared a message written in light: When the last light dies, remember me.'
  },
  {
    id: 'archivist_3_observatory',
    chapter: 'III',
    title: 'The Observatory of Forgotten Suns',
    imageSrc: 'Gemini_Generated_Image_q5nrelq5nrelq5nr.png',
    artFilename: 'archivist_3_observatory.png',
    audioFilename: 'archivist_scene_3.mp3',
    narration: 'The Archivist carried the book to the Observatory of Forgotten Suns, where the history of the universe unfolded across a thousand floating constellations. There, the truth became clear. Stars were disappearing, not from age, but from memory. Every time the final living creature on a world forgot its home, every time the last record of a civilization turned to dust, the star that had watched over that world began to fade. The universe was not simply growing old. It was forgetting why it had ever existed. And the little star inside the book was the last light of a world erased from every archive, every map, and every living mind. Except one.'
  },
  {
    id: 'archivist_4_vessel_void',
    chapter: 'IV',
    title: 'Fragments in the Void',
    imageSrc: 'Gemini_Generated_Image_daw0ehdaw0ehdaw0.png',
    artFilename: 'archivist_4_vessel_void.png',
    audioFilename: 'archivist_scene_4.mp3',
    narration: "The Archivist had a choice. They could lock the book away, preserving its fragile light for as long as the Archive itself endured. Or they could follow the star to the place where its story had begun. For the first time in ages, the Archivist chose uncertainty. A small vessel unfolded from the observatory's brass machinery. Its glass wings caught the light of distant nebulae as it slipped beyond the Archive and into the dark. Along the way, fragments of forgotten lives drifted through space: a paper lantern, a cracked porcelain cup, a child's drawing of two suns. The Archivist collected none of them. Instead, they listened. Each fragment seemed to whisper the same impossible truth: what is forgotten is not always gone."
  },
  {
    id: 'archivist_5_forgotten_world',
    chapter: 'V',
    title: 'The Forgotten World',
    imageSrc: 'Gemini_Generated_Image_kxl5adkxl5adkxl5.png',
    artFilename: 'archivist_5_forgotten_world.png',
    audioFilename: 'archivist_scene_5.mp3',
    narration: 'At the edge of a forgotten galaxy, the vessel found a world that no map remembered. Its oceans had become fields of silver dust. Towering cities lay broken beneath forests of glass. Across the ruins, pale blue flowers glowed between stones that had once been streets. The Archivist stepped onto the silent ground. There were no voices, no footsteps, no signs of life. Yet the little star in the book grew brighter.'
  },
  {
    id: 'archivist_6_vision_in_temple',
    chapter: 'VI',
    title: 'The Vision Beneath the Oldest Tower',
    imageSrc: 'Gemini_Generated_Image_gt02smgt02smgt02.png',
    artFilename: 'archivist_6_vision_in_temple.png',
    audioFilename: 'archivist_scene_6.mp3',
    narration: "Following its light, the Archivist descended into a temple beneath the oldest tower. On its walls were thousands of carved figures, each holding a small flame above their heads. At the center stood an empty pedestal. And above it, carved into stone, was a symbol the Archivist recognized from the very first pages of the Archive. It was the symbol of a beginning. The book opened once more. From its pages rose a vision. The Archivist saw a world beneath two golden suns. They saw rivers shining like liquid glass, cities built around enormous trees, and people who gathered every evening to tell their children stories about the stars. They saw a young child sitting beside an elder, asking why the night sky was so beautiful. The elder smiled and answered, 'Because every light you see is someone else's yesterday, still finding its way to you.' Then came the final memory. The people of that world, knowing their sun was dying, had gathered in their temple. Each had offered one cherished memory to the little star, hoping it would carry their world beyond its final night. The star had survived. Their world had not. And somehow, across an eternity of silence, the memory had waited to be found."
  },
  {
    id: 'archivist_7_release_of_star',
    chapter: 'VII',
    title: 'The Gift of Tomorrow',
    imageSrc: 'Gemini_Generated_Image_hocvpdhocvpdhocv.png',
    artFilename: 'archivist_7_release_of_star.png',
    audioFilename: 'archivist_scene_7.mp3',
    narration: 'The Archivist understood what had to be done. The star could be returned to the Archive, where its memory would remain safe but alone. Or its light could be released into the universe, allowing its memories to become part of countless new beginnings. But the Archive had one unbreakable law. Every memory released into the cosmos took something from the keeper who released it. The Archivist would lose the one memory that had sustained them through eternity: the memory of the first world they had ever saved. For a long moment, they held the book close. Then they remembered the child\'s question beneath the two suns, and the elder\'s answer. A memory was never meant to be a possession. It was meant to be passed on. The Archivist opened the book and let the star go. The star rose from the temple and dissolved into a thousand golden sparks. They traveled through the darkness, touching silent planets, forgotten oceans and the cold ruins of lost civilizations. Wherever a spark landed, something stirred. A flower opened on a world without a name. A sleeping ocean caught the light of a new moon. Far beyond the reach of any living eye, a young star awakened.'
  },
  {
    id: 'archivist_8_a_tomorrow',
    chapter: 'VIII',
    title: 'A Tomorrow',
    imageSrc: 'Gemini_Generated_Image_xpqhlkxpqhlkxpqh.png',
    artFilename: 'archivist_8_a_tomorrow.png',
    audioFilename: 'archivist_scene_8.mp3',
    narration: 'The Archivist returned to the Celestial Archive. Something was missing. The memory of the first world they had saved was gone, leaving only a gentle warmth they could not explain. Yet the library had changed. New books appeared upon its shelves, each filled with a story that had not existed before. The universe was no longer merely a collection of endings. It had begun to write itself again. And in the highest window of the Archive, a new star shone. The Archivist watched it quietly. For the first time in eternity, there was something they could not predict. A tomorrow.'
  }
];

// Ensure target directories exist
const artDir = path.resolve('public', 'art');
const audioDir = path.resolve('public', 'audio');
fs.mkdirSync(artDir, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });

// Copy images
console.log('--- Copying generated images to public/art/ ---');
for (const scene of scenes) {
  const src = path.resolve('images', scene.imageSrc);
  const dst = path.resolve(artDir, scene.artFilename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✓ Copied ${scene.imageSrc} -> ${scene.artFilename}`);
  } else {
    console.warn(`! Source image not found: ${src}`);
  }
}

// Generate OpenAI TTS Audio for each scene with voice 'ash'
async function generateAudioForScene(scene, index) {
  const audioPath = path.resolve(audioDir, scene.audioFilename);
  console.log(`\n[${index + 1}/${scenes.length}] Generating voice narration for: "${scene.title}" (Voice: ash)...`);
  
  const payload = {
    model: 'tts-1-hd',
    input: scene.narration,
    voice: 'ash',
    response_format: 'mp3',
    speed: 0.95 // Cinematic narrative pacing
  };

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI TTS Error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(audioPath, buffer);
  console.log(`✓ Saved ${scene.audioFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function run() {
  console.log('\n--- Starting OpenAI TTS Generation with voice "ash" ---');
  for (let i = 0; i < scenes.length; i++) {
    try {
      await generateAudioForScene(scenes[i], i);
    } catch (err) {
      console.error(`Failed to generate audio for scene ${i + 1}:`, err);
      process.exit(1);
    }
  }
  console.log('\nAll 8 scenes successfully generated with voice "ash"!');
}

run();
