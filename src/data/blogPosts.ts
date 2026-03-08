export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export const blogCategories = ["All", "Tutorials", "News", "Updates", "Tips"];

export const blogPosts: BlogPost[] = [
  { id: 1, title: "Getting Started with Redtown 2 Game Builder", excerpt: "Learn how to create your first game in under 5 minutes using our AI-powered builder.", category: "Tutorials", date: "2026-03-01", readTime: "5 min", author: "Kenneth" },
  { id: 2, title: "Redtown 2 v3.0 Released!", excerpt: "We've launched the biggest update yet with 50+ new features, improved AI, and more.", category: "News", date: "2026-02-28", readTime: "3 min", author: "Team" },
  { id: 3, title: "How AI is Changing Game Development", excerpt: "Explore how artificial intelligence is revolutionizing the way we build and play games.", category: "News", date: "2026-02-25", readTime: "7 min", author: "Kenneth" },
  { id: 4, title: "5 Tips for Better Game Design", excerpt: "Improve your games with these proven design principles that professional developers use.", category: "Tips", date: "2026-02-20", readTime: "4 min", author: "Kenneth" },
  { id: 5, title: "New Marketplace Features", excerpt: "Share and discover games from the community with our revamped marketplace.", category: "Updates", date: "2026-02-18", readTime: "3 min", author: "Team" },
  { id: 6, title: "Building Multiplayer Games", excerpt: "A comprehensive guide to adding multiplayer support to your Redtown 2 projects.", category: "Tutorials", date: "2026-02-15", readTime: "10 min", author: "Kenneth" },
  { id: 7, title: "Performance Optimization Guide", excerpt: "Make your games run smoother with these optimization techniques and best practices.", category: "Tips", date: "2026-02-12", readTime: "6 min", author: "Team" },
  { id: 8, title: "Community Spotlight: Top 10 Games", excerpt: "Check out the most popular games created by our community this month.", category: "News", date: "2026-02-10", readTime: "4 min", author: "Kenneth" },
  { id: 9, title: "Understanding the AI Agent System", excerpt: "Deep dive into how our AI agents work together to build your games.", category: "Tutorials", date: "2026-02-08", readTime: "8 min", author: "Team" },
  { id: 10, title: "Mobile Game Development Tips", excerpt: "Optimize your games for mobile devices with touch controls and responsive design.", category: "Tips", date: "2026-02-05", readTime: "5 min", author: "Kenneth" },
  { id: 11, title: "Winter Update Patch Notes", excerpt: "Bug fixes, performance improvements, and new templates in this winter update.", category: "Updates", date: "2026-02-01", readTime: "3 min", author: "Team" },
  { id: 12, title: "Creating Custom Game Assets", excerpt: "Learn how to design and import custom sprites, sounds, and animations.", category: "Tutorials", date: "2026-01-28", readTime: "9 min", author: "Kenneth" },
  { id: 13, title: "Game Monetization Strategies", excerpt: "Explore different ways to monetize your games while keeping players happy.", category: "Tips", date: "2026-01-25", readTime: "6 min", author: "Kenneth" },
  { id: 14, title: "New AI Models Available", excerpt: "We've added support for the latest AI models to improve game generation quality.", category: "Updates", date: "2026-01-22", readTime: "3 min", author: "Team" },
  { id: 15, title: "Building RPG Games from Scratch", excerpt: "Step-by-step guide to creating a full RPG with inventory, combat, and quests.", category: "Tutorials", date: "2026-01-20", readTime: "12 min", author: "Kenneth" },
  { id: 16, title: "Sound Design for Games", excerpt: "Add immersive audio to your games with our built-in sound tools.", category: "Tips", date: "2026-01-18", readTime: "5 min", author: "Team" },
  { id: 17, title: "Redtown 2 Hits 1 Million Users!", excerpt: "Celebrating a huge milestone with our amazing community of game creators.", category: "News", date: "2026-01-15", readTime: "2 min", author: "Kenneth" },
  { id: 18, title: "Advanced Physics in Games", excerpt: "Implement realistic physics simulations for platformers, racing, and puzzle games.", category: "Tutorials", date: "2026-01-12", readTime: "8 min", author: "Team" },
  { id: 19, title: "UI/UX Best Practices for Games", excerpt: "Design intuitive menus, HUDs, and interfaces that enhance the player experience.", category: "Tips", date: "2026-01-10", readTime: "6 min", author: "Kenneth" },
  { id: 20, title: "January Feature Roundup", excerpt: "A summary of all the new features and improvements shipped this month.", category: "Updates", date: "2026-01-08", readTime: "4 min", author: "Team" },
  { id: 21, title: "Creating Puzzle Games with AI", excerpt: "Use AI to generate unique puzzle mechanics and level designs automatically.", category: "Tutorials", date: "2026-01-05", readTime: "7 min", author: "Kenneth" },
  { id: 22, title: "Game Testing and QA Guide", excerpt: "Ensure your games are bug-free with proper testing methodologies.", category: "Tips", date: "2026-01-03", readTime: "5 min", author: "Team" },
  { id: 23, title: "Partnership with Major Studios", excerpt: "Exciting new partnerships that will bring more tools and resources to creators.", category: "News", date: "2026-01-01", readTime: "3 min", author: "Kenneth" },
];
