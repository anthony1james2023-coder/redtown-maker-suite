export interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
  steps: number;
}

export const difficultyLevels = ["All", "Beginner", "Intermediate", "Advanced"];

export const tutorials: Tutorial[] = [
  { id: 1, title: "Your First Game in 5 Minutes", description: "Create a simple click-to-score game using the AI builder with zero coding experience.", difficulty: "Beginner", duration: "5 min", category: "Getting Started", steps: 4 },
  { id: 2, title: "Understanding the Builder Interface", description: "Navigate the Redtown 2 builder like a pro with this comprehensive UI tour.", difficulty: "Beginner", duration: "10 min", category: "Getting Started", steps: 8 },
  { id: 3, title: "Adding Player Movement", description: "Implement smooth player controls for top-down, side-scrolling, and platformer games.", difficulty: "Beginner", duration: "15 min", category: "Game Mechanics", steps: 6 },
  { id: 4, title: "Working with Sprites and Animation", description: "Import, create, and animate sprites for characters, enemies, and objects.", difficulty: "Beginner", duration: "12 min", category: "Assets", steps: 7 },
  { id: 5, title: "Basic Collision Detection", description: "Make objects interact with each other using simple collision systems.", difficulty: "Beginner", duration: "10 min", category: "Game Mechanics", steps: 5 },
  { id: 6, title: "Score Systems and UI", description: "Build score tracking, health bars, and in-game HUD elements.", difficulty: "Beginner", duration: "8 min", category: "UI", steps: 5 },
  { id: 7, title: "Level Design Fundamentals", description: "Design engaging levels with proper difficulty curves and player flow.", difficulty: "Intermediate", duration: "20 min", category: "Design", steps: 9 },
  { id: 8, title: "AI Enemy Behavior", description: "Create intelligent enemies with patrol, chase, and attack patterns.", difficulty: "Intermediate", duration: "25 min", category: "Game Mechanics", steps: 10 },
  { id: 9, title: "Particle Effects and Polish", description: "Add explosions, trails, sparkles, and other visual effects to your games.", difficulty: "Intermediate", duration: "18 min", category: "Visual Effects", steps: 8 },
  { id: 10, title: "Save/Load Game State", description: "Implement persistent game saves so players can continue where they left off.", difficulty: "Intermediate", duration: "15 min", category: "Data", steps: 6 },
  { id: 11, title: "Inventory Systems", description: "Build item pickups, inventory management, and equipment systems.", difficulty: "Intermediate", duration: "22 min", category: "Game Mechanics", steps: 9 },
  { id: 12, title: "Dialogue Systems", description: "Create NPC conversations with branching dialogue trees and choices.", difficulty: "Intermediate", duration: "20 min", category: "Game Mechanics", steps: 8 },
  { id: 13, title: "Tile-based Map Editor", description: "Build and edit game maps using a tile-based system with auto-tiling.", difficulty: "Intermediate", duration: "25 min", category: "Tools", steps: 10 },
  { id: 14, title: "Sound Design and Music", description: "Add background music, sound effects, and audio feedback to enhance gameplay.", difficulty: "Intermediate", duration: "15 min", category: "Audio", steps: 7 },
  { id: 15, title: "Procedural Level Generation", description: "Use algorithms to generate infinite unique levels for roguelike games.", difficulty: "Advanced", duration: "35 min", category: "Generation", steps: 12 },
  { id: 16, title: "Multiplayer Networking", description: "Add real-time multiplayer support with player syncing and lobby systems.", difficulty: "Advanced", duration: "45 min", category: "Networking", steps: 15 },
  { id: 17, title: "Shader Effects", description: "Create custom visual effects using shaders for water, lighting, and more.", difficulty: "Advanced", duration: "30 min", category: "Visual Effects", steps: 11 },
  { id: 18, title: "Physics Engine Deep Dive", description: "Master advanced physics for realistic simulations, ragdolls, and soft bodies.", difficulty: "Advanced", duration: "40 min", category: "Physics", steps: 13 },
  { id: 19, title: "Custom AI with Machine Learning", description: "Train AI agents that learn and adapt to player behavior over time.", difficulty: "Advanced", duration: "50 min", category: "AI", steps: 14 },
  { id: 20, title: "Publishing and Monetization", description: "Prepare, publish, and monetize your game on multiple platforms.", difficulty: "Advanced", duration: "30 min", category: "Business", steps: 10 },
  { id: 21, title: "Building a Full RPG", description: "End-to-end guide to creating a complete RPG with quests, combat, and story.", difficulty: "Advanced", duration: "60 min", category: "Complete Games", steps: 20 },
  { id: 22, title: "Camera Systems", description: "Implement smooth camera follow, zoom, shake, and cinematic camera movements.", difficulty: "Intermediate", duration: "15 min", category: "Game Mechanics", steps: 6 },
  { id: 23, title: "Touch Controls for Mobile", description: "Add virtual joysticks, buttons, and gesture controls for mobile games.", difficulty: "Intermediate", duration: "18 min", category: "Mobile", steps: 7 },
  { id: 24, title: "Game Analytics", description: "Track player behavior and game metrics to improve your game design.", difficulty: "Advanced", duration: "25 min", category: "Data", steps: 8 },
];
