# KOM Productions — Positivus-Style Redesign

A bold, modern talent agency platform inspired by the Positivus landing page design aesthetic.

## 🎨 Design Features

- **Lime green (#B9FF66) primary accent** — energetic and eye-catching
- **Thick black borders (2-3px)** on all cards and elements
- **Rounded corners everywhere** (14px, 24px, 45px radius scale)
- **Space Grotesk font** — geometric and modern
- **High contrast** — white background, black text, bold colors
- **Pill badges** for communities (Ruthless = red, Trace = cyan)
- **Hover lift effects** on interactive cards
- **Clean card-based layout** with generous padding

---

## 📦 Installation

### Step 1: Replace your `src/` folder

Delete your current `src/` folder and replace it with the new one from `kom-v2/src/`.

```bash
# Backup your current src (optional)
mv src src-old

# Copy the new redesigned src
cp -r kom-v2/src ./
```

### Step 2: Update `vite.config.ts`

Replace with this to fix the CSS loading issue:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Step 3: Update `.gitignore`

Add these lines to prevent committing secrets:

```
.env
.env.*
!.env.example
```

Then remove the tracked `.env`:

```bash
git rm --cached .env
```

### Step 4: Rotate your Supabase key

⚠️ **CRITICAL**: Your `.env` was committed to the public repo.

1. Go to Supabase Dashboard → Settings → API
2. Click **Regenerate** next to the anon/public key
3. Update your local `.env` with the new key

### Step 5: Update the database

Run the updated `database-schema.sql` in Supabase Dashboard → SQL Editor.

This adds:
- Proper UPDATE/DELETE RLS policies
- UUIDs instead of SERIAL IDs
- Fixed vote counts (upvote_count + downvote_count)
- Username in the RPC function output
- Seed data for Ruthless and Trace communities

### Step 6: Install & Run

```bash
npm install
npm run dev
```

---

## 🗂️ File Structure

```
src/
├── components/
│   ├── Navbar.tsx          — Clean white nav with lime CTA
│   ├── PostCard.tsx        — Card with thick borders & rounded corners
│   └── CreatePost.tsx      — Modal for creating posts
├── pages/
│   ├── HomePage.tsx        — Hero + lime section + feed
│   ├── CommunityPage.tsx   — Colored banner per community
│   ├── PostPage.tsx        — Full post view + comments
│   ├── AuthPage.tsx        — Split-screen auth with lime accent
│   └── ProfilePage.tsx     — User profile with lime header
├── context/
│   └── AuthContext.tsx     — Session management
├── lib/
│   └── supabase.ts         — Supabase client
├── App.tsx                 — Routes
├── main.tsx                — Entry point
└── index.css               — Positivus design system
```

---

## 🎨 Design System

### Colors

| Variable | Hex | Usage |
|---|---|---|
| `--lime` | #B9FF66 | Primary accent, CTAs, highlights |
| `--black` | #191A23 | Text, borders, dark backgrounds |
| `--white` | #FFFFFF | Backgrounds, light elements |
| `--ruthless` | #FF3366 | Ruthless community accent |
| `--trace` | #00D9FF | Trace community accent |
| `--text-muted` | #898989 | Secondary text |

### Border Radius

- `--radius-sm`: 14px — inputs, buttons
- `--radius-md`: 24px — cards, containers
- `--radius-lg`: 45px — hero illustrations, large sections

### Typography

- **Font**: Space Grotesk (600-700 weight for headings)
- **Headings**: 40-72px, font-weight 700
- **Body**: 15-17px, font-weight 400-500
- **Pills/badges**: 12-14px, font-weight 600

---

## 🚀 Key Components

### Navbar
- Sticky white background with black bottom border
- Round logo badge with 'K' initial
- Lime green "Join Now" CTA button
- Active state with colored underline

### PostCard
- Light gray (#F3F3F3) background
- 2px black border with rounded corners
- Community color accent bar at top
- Circular vote buttons with hover effects
- Pill badge for community name

### Hero Section
- Split layout: text left, illustration right
- Lime highlighted text inline with heading
- Two CTA buttons side-by-side
- Stats display below CTAs

### Community Pages
- Colored banner section (pink for Ruthless, light blue for Trace)
- Large emoji icon
- Decorative circle patterns in background
- "Post to Community" CTA button

---

## 🐛 Troubleshooting

### CSS not loading
- Make sure `@tailwindcss/vite` is in `vite.config.ts` plugins
- Run `npm install` to ensure all packages are installed
- Clear your browser cache

### Supabase errors
- Check that `.env` has the new regenerated keys
- Verify the database schema was applied in Supabase SQL Editor
- Make sure RLS policies are enabled

### Build errors
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check that all imports use correct file paths
- Ensure TypeScript version is compatible (6.0.2 in package.json)

---

## 📸 Design Inspiration

This redesign is inspired by the [Positivus Landing Page](https://www.figma.com/community/file/1230604708032389430/positivus-landing-page-design) design by Olga, featuring:

- Bold use of lime green accent color
- Thick borders and generous border radius
- Card-based layout with hover effects
- Clean geometric design
- High contrast and readability

---

## 🎯 Next Steps

1. Add more illustrations to empty state sections
2. Create custom icons for vote buttons
3. Add profile avatar upload functionality
4. Implement image upload for posts (currently URL-only)
5. Add search and filtering for posts
6. Create admin panel for community moderation

---

## 📄 License

MIT License — feel free to use this for your own projects!