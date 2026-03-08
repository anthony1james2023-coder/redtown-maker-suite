## Plan: Add Content & Resource Pages

I'll create 5 new content/resource pages, each with its own unique content and purpose. All pages will use the existing Navbar, Footer, and FunFactsSection, plus the cyberpunk styling consistent with the rest of the site.

### New Pages

1. **Blog** (`/blog`) — 20+ blog post cards with titles, dates, excerpts, categories, and read-time estimates. Filterable by category (Tutorials, News, Updates, Tips).
2. **Tutorials** (`/tutorials`) — Step-by-step tutorial cards organized by difficulty (Beginner, Intermediate, Advanced). Each card shows title, description, estimated time, and difficulty badge.
3. **Documentation** (`/docs`) — Sidebar navigation with sections (Getting Started, API Reference, Components, Deployment). Each section has multiple doc entries with code snippets and explanations.
4. **Gallery** (`/gallery`) — Visual showcase grid of user-created games/projects with screenshots (gradient placeholders), titles, creators, and like counts. Filterable by category.
5. **About / Team** (`/about`) — Company story section, mission statement, and a team grid with 12+ team member cards (avatar placeholders, names, roles, bios).
6. Owner /owner owner kenneth youtube channel redtown 2 

### Technical Details

- Create 6 new page components in `src/pages/`
- Create data files in `src/data/` for blog posts, tutorials, docs content, gallery items, and team members (each with ~20-30 entries)
- Add routes to `src/App.tsx`
- Add nav links to `src/components/Navbar.tsx` (desktop + mobile)
- Each page includes Navbar, Footer, FunFactsSection, and the cyberpunk background decorations

### Files to Create

- `src/data/blogPosts.ts`
- `src/data/tutorials.ts`
- `src/data/docsContent.ts`
- `src/data/galleryItems.ts`
- `src/data/teamMembers.ts`
- `src/pages/Blog.tsx`
- `src/pages/Tutorials.tsx`
- `src/pages/Docs.tsx`
- `src/pages/Gallery.tsx`
- `src/pages/About.tsx`
- `Src/pages/owner.tsx`

### Files to Edit

- `src/App.tsx` — Add 6 new routes
- `src/components/Navbar.tsx` — Add links (use a dropdown "More" menu to avoid overcrowding)

Y will add a botton pages in /home to see all the pages