export interface DocEntry {
  id: string;
  title: string;
  content: string;
  code?: string;
}

export interface DocSection {
  id: string;
  title: string;
  entries: DocEntry[];
}

export const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    entries: [
      { id: "intro", title: "Introduction", content: "Redtown 2 is an AI-powered game builder that lets you create browser games using natural language prompts. No coding experience required — just describe what you want and watch it come to life." },
      { id: "quickstart", title: "Quick Start Guide", content: "1. Navigate to the Builder page\n2. Describe your game idea in the prompt\n3. Click 'Generate' and watch the AI build your game\n4. Test in the live preview panel\n5. Publish when you're satisfied", code: "// Example prompt:\n\"Create a 2D platformer with a red character\nthat can jump and collect coins\"" },
      { id: "requirements", title: "System Requirements", content: "Redtown 2 runs entirely in the browser. You'll need:\n• A modern browser (Chrome, Firefox, Safari, Edge)\n• Internet connection\n• Screen resolution of 1024x768 or higher recommended" },
      { id: "account", title: "Account Setup", content: "Create a free account to save your projects, publish games, and access the marketplace. Premium plans unlock additional AI models, storage, and features." },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    entries: [
      { id: "game-object", title: "Game Object", content: "The core Game object manages the game loop, scenes, and global state.", code: "const game = new Game({\n  width: 800,\n  height: 600,\n  fps: 60,\n  backgroundColor: '#1a1a2e'\n});\n\ngame.start();" },
      { id: "sprites", title: "Sprite API", content: "Create and manipulate sprites with position, rotation, scale, and animation support.", code: "const player = game.createSprite({\n  image: 'player.png',\n  x: 100,\n  y: 300,\n  width: 32,\n  height: 32\n});\n\nplayer.animate('walk', [0, 1, 2, 3], 0.1);" },
      { id: "input", title: "Input System", content: "Handle keyboard, mouse, and touch input with a unified API.", code: "game.input.onKey('ArrowRight', () => {\n  player.x += 5;\n});\n\ngame.input.onMouse('click', (x, y) => {\n  spawnParticle(x, y);\n});" },
      { id: "physics", title: "Physics Engine", content: "Apply gravity, velocity, and collision detection to game objects.", code: "player.physics.enable({\n  gravity: 980,\n  friction: 0.8,\n  bounce: 0.2\n});\n\nplayer.physics.onCollide('ground', () => {\n  canJump = true;\n});" },
      { id: "audio", title: "Audio System", content: "Play background music and sound effects with volume and loop controls.", code: "game.audio.playMusic('bgm.mp3', { volume: 0.5, loop: true });\ngame.audio.playSFX('jump.wav');" },
      { id: "scenes", title: "Scene Management", content: "Organize your game into scenes like menus, levels, and cutscenes.", code: "game.addScene('menu', MenuScene);\ngame.addScene('level1', Level1Scene);\ngame.switchScene('menu');" },
    ],
  },
  {
    id: "components",
    title: "Components",
    entries: [
      { id: "button-comp", title: "Button Component", content: "Pre-built UI button with hover, click, and disabled states for game menus.", code: "<GameButton\n  text=\"Start Game\"\n  onClick={() => game.start()}\n  style=\"primary\"\n/>" },
      { id: "healthbar", title: "Health Bar", content: "Animated health/progress bar component with customizable colors and sizes.", code: "<HealthBar\n  current={75}\n  max={100}\n  color=\"red\"\n  width={200}\n/>" },
      { id: "minimap", title: "Minimap", content: "Real-time minimap overlay showing player position and points of interest.", code: "<Minimap\n  world={gameWorld}\n  player={playerPos}\n  size={150}\n  zoom={0.1}\n/>" },
      { id: "dialogue-box", title: "Dialogue Box", content: "Typewriter-style text box for NPC conversations with portrait support.", code: "<DialogueBox\n  text=\"Welcome, adventurer!\"\n  speaker=\"Elder\"\n  portrait=\"elder.png\"\n  typeSpeed={30}\n/>" },
      { id: "particle-system", title: "Particle System", content: "Configurable particle emitter for explosions, fire, rain, and magic effects.", code: "<ParticleEmitter\n  type=\"explosion\"\n  x={200} y={150}\n  count={50}\n  lifetime={1.5}\n  colors={['#ff4444', '#ff8800', '#ffcc00']}\n/>" },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    entries: [
      { id: "publish", title: "Publishing Your Game", content: "Click the Publish button in the builder to deploy your game to a public URL. You can share this link with anyone to let them play your game." },
      { id: "custom-domain", title: "Custom Domain", content: "Premium users can connect a custom domain to their published games. Go to Settings > Domain and follow the DNS configuration steps." },
      { id: "embedding", title: "Embedding Games", content: "Embed your games on any website using an iframe.", code: "<iframe\n  src=\"https://redtown2.app/play/your-game-id\"\n  width=\"800\"\n  height=\"600\"\n  frameborder=\"0\"\n></iframe>" },
      { id: "export", title: "Exporting as Standalone", content: "Download your game as a standalone HTML file that can be hosted anywhere or played offline. Premium feature available on Pro and Enterprise plans." },
      { id: "versioning", title: "Version Control", content: "Each publish creates a version snapshot. You can roll back to any previous version from the Versions panel in the builder." },
    ],
  },
];
