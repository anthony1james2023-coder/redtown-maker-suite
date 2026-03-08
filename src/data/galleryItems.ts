export interface GalleryItem {
  id: number;
  title: string;
  creator: string;
  category: string;
  likes: number;
  gradient: string;
  description: string;
}

export const galleryCategories = ["All", "Platformer", "Puzzle", "RPG", "Action", "Racing", "Strategy", "Arcade"];

export const galleryItems: GalleryItem[] = [
  { id: 1, title: "Neon Runner", creator: "PixelKing", category: "Platformer", likes: 342, gradient: "from-cyan-500 to-blue-600", description: "Fast-paced neon platformer with procedural levels" },
  { id: 2, title: "Mind Maze", creator: "PuzzleMaster", category: "Puzzle", likes: 256, gradient: "from-purple-500 to-pink-600", description: "Brain-bending puzzle game with 50+ levels" },
  { id: 3, title: "Dragon Quest Lite", creator: "RPGLover", category: "RPG", likes: 489, gradient: "from-orange-500 to-red-600", description: "Classic RPG with turn-based combat and exploration" },
  { id: 4, title: "Space Blaster X", creator: "AstroGamer", category: "Action", likes: 178, gradient: "from-indigo-500 to-purple-600", description: "Retro shoot-em-up with power-ups and boss fights" },
  { id: 5, title: "Turbo Drift", creator: "SpeedDemon", category: "Racing", likes: 312, gradient: "from-green-500 to-emerald-600", description: "Drift racing with customizable cars and tracks" },
  { id: 6, title: "Tower Defense Pro", creator: "StrategyKing", category: "Strategy", likes: 267, gradient: "from-yellow-500 to-orange-600", description: "Build towers and defend against waves of enemies" },
  { id: 7, title: "Pixel Bounce", creator: "RetroFan", category: "Arcade", likes: 445, gradient: "from-pink-500 to-rose-600", description: "Addictive bouncing ball game with one-tap controls" },
  { id: 8, title: "Shadow Ninja", creator: "NinjaCodr", category: "Platformer", likes: 523, gradient: "from-gray-600 to-gray-800", description: "Stealth platformer with shadow mechanics" },
  { id: 9, title: "Color Match Mania", creator: "ColorFan", category: "Puzzle", likes: 198, gradient: "from-teal-400 to-cyan-600", description: "Match colors in this fast-paced puzzle challenge" },
  { id: 10, title: "Fantasy Kingdoms", creator: "WorldBuilder", category: "RPG", likes: 634, gradient: "from-emerald-500 to-teal-600", description: "Build and manage your medieval fantasy kingdom" },
  { id: 11, title: "Bullet Storm", creator: "ActionHero", category: "Action", likes: 287, gradient: "from-red-500 to-orange-600", description: "Intense bullet-hell shooter with epic patterns" },
  { id: 12, title: "Kart Championship", creator: "RaceAce", category: "Racing", likes: 156, gradient: "from-blue-400 to-indigo-600", description: "Mario Kart-inspired racing with items and boosts" },
  { id: 13, title: "Chess Evolved", creator: "ChessFan", category: "Strategy", likes: 189, gradient: "from-amber-500 to-yellow-600", description: "Chess with special abilities and power-up squares" },
  { id: 14, title: "Snake Reborn", creator: "ClassicGmr", category: "Arcade", likes: 567, gradient: "from-lime-500 to-green-600", description: "Classic snake with modern twists and power-ups" },
  { id: 15, title: "Cloud Jumper", creator: "SkyHigh", category: "Platformer", likes: 234, gradient: "from-sky-400 to-blue-500", description: "Endless vertical platformer in the clouds" },
  { id: 16, title: "Logic Gates", creator: "BrainBox", category: "Puzzle", likes: 145, gradient: "from-violet-500 to-purple-600", description: "Programming-inspired puzzle game with logic gates" },
  { id: 17, title: "Dungeon Crawler 2D", creator: "DungeonDev", category: "RPG", likes: 378, gradient: "from-stone-500 to-stone-700", description: "Procedural dungeons with loot and monsters" },
  { id: 18, title: "Asteroid Defender", creator: "SpaceNerd", category: "Action", likes: 203, gradient: "from-slate-500 to-slate-700", description: "Protect Earth from incoming asteroids" },
  { id: 19, title: "Speed Racer 3000", creator: "VroomVroom", category: "Racing", likes: 289, gradient: "from-red-400 to-pink-600", description: "Futuristic racing on gravity-defying tracks" },
  { id: 20, title: "Tetris Remix", creator: "BlockDrop", category: "Arcade", likes: 712, gradient: "from-fuchsia-500 to-pink-600", description: "Tetris with new block types and game modes" },
  { id: 21, title: "Empire Builder", creator: "Conqueror", category: "Strategy", likes: 345, gradient: "from-amber-600 to-red-600", description: "Build an empire from scratch in this 4X game" },
  { id: 22, title: "Gravity Flip", creator: "PhysicsGuy", category: "Puzzle", likes: 167, gradient: "from-indigo-400 to-blue-600", description: "Flip gravity to solve challenging platforming puzzles" },
  { id: 23, title: "Samurai Slash", creator: "BladeMstr", category: "Action", likes: 456, gradient: "from-red-600 to-rose-700", description: "Slice through enemies in this stylish action game" },
  { id: 24, title: "Pong Evolved", creator: "RetroKid", category: "Arcade", likes: 234, gradient: "from-emerald-400 to-green-600", description: "Classic Pong with power-ups and special modes" },
];
