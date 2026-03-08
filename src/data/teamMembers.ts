export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  gradient: string;
  initials: string;
}

export const teamMembers: TeamMember[] = [
  { id: 1, name: "Kenneth", role: "Founder & CEO", bio: "Creator of Redtown 2. Passionate about making game development accessible to everyone through AI.", gradient: "from-red-500 to-orange-500", initials: "K" },
  { id: 2, name: "Alex Rivera", role: "Lead AI Engineer", bio: "Building the neural networks that power our game generation engine.", gradient: "from-blue-500 to-cyan-500", initials: "AR" },
  { id: 3, name: "Sarah Chen", role: "Head of Design", bio: "Creating beautiful and intuitive interfaces for the builder experience.", gradient: "from-pink-500 to-rose-500", initials: "SC" },
  { id: 4, name: "Marcus Johnson", role: "Backend Architect", bio: "Scaling our infrastructure to support millions of game creators worldwide.", gradient: "from-green-500 to-emerald-500", initials: "MJ" },
  { id: 5, name: "Yuki Tanaka", role: "Game Engine Lead", bio: "Optimizing the game runtime for smooth performance across all devices.", gradient: "from-purple-500 to-violet-500", initials: "YT" },
  { id: 6, name: "Emma Williams", role: "Product Manager", bio: "Turning community feedback into features that creators actually want.", gradient: "from-amber-500 to-yellow-500", initials: "EW" },
  { id: 7, name: "David Kim", role: "Frontend Developer", bio: "Building the responsive, accessible UI components that make the builder shine.", gradient: "from-teal-500 to-cyan-500", initials: "DK" },
  { id: 8, name: "Olivia Brown", role: "Community Manager", bio: "Growing and nurturing our amazing community of game creators.", gradient: "from-rose-500 to-pink-500", initials: "OB" },
  { id: 9, name: "James Wilson", role: "DevOps Engineer", bio: "Keeping everything running smoothly with 99.99% uptime.", gradient: "from-indigo-500 to-blue-500", initials: "JW" },
  { id: 10, name: "Mia Garcia", role: "QA Lead", bio: "Making sure every feature works perfectly before it reaches our users.", gradient: "from-orange-500 to-red-500", initials: "MG" },
  { id: 11, name: "Ryan Lee", role: "ML Researcher", bio: "Pushing the boundaries of what AI can do for game development.", gradient: "from-cyan-500 to-blue-500", initials: "RL" },
  { id: 12, name: "Sophie Martinez", role: "Content Creator", bio: "Writing tutorials, docs, and guides to help creators succeed.", gradient: "from-violet-500 to-purple-500", initials: "SM" },
];
