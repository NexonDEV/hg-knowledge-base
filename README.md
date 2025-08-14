# 📚 HostGier.PL Knowledge Base

A lightweight, opinionated knowledge base for **HostGier.PL** — written in **MDX**, powered by **React + Vite + Tailwind CSS 4.1**, and designed for high signal-to-noise with full-text local search and a comfortable reading experience.

> Made with ❤️ by [NexonDEV](https://nexondev.pl)

---

## 💖 Support

If this project saved you time, consider supporting the project:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nexondev)

Or leave a ⭐ on GitHub to help others discover it:  
[![GitHub Repo stars](https://img.shields.io/github/stars/nexondev/hg-knowledge-base?style=social)](https://github.com/nexondev/hg-knowledge-base)

---

## ✨ Features

- **MDX (Markdown + JSX)** with GFM, heading anchors, **Math (KaTeX)**, **syntax highlighting**, and **raw HTML** support.
- **Full-text search** (MiniSearch): indexes title, H2/H3, normalized content, and tags; offline and blazing fast.
- **Sidebar navigation**: group definitions from `groups.json`, per-user sort modes, tasteful active “pill”, footer links (Home/Discord).
- **UI/UX**: Tailwind **v4.1** (CSS-first), dark/light theme toggle, comfortable spacing, sticky footer.
- **Zero-config routing**: every file under `src/content/**/*.mdx` becomes a page (`index.mdx → /…/`).

---

## 🚀 Quick Start

```bash
pnpm i
pnpm dev       # http://localhost:5173
pnpm build
pnpm preview
```

**Requirements:** Node 18+ · pnpm 8+

---

## 🗂️ Project Layout

```text
src/
  content/                # Your MDX pages
  components/
    Sidebar.tsx
    Search.tsx
    ThemeToggle.tsx
    DocPage.tsx
    Footer.tsx
    Logo.tsx
  lib/
    content.ts            # MDX loader + metadata (front matter)
    search.ts             # MiniSearch index + suggestions
  config/
    groups.json           # Sidebar groups configuration (icon, order)
  index.css               # Tailwind 4.1 tokens, prose, theme, spacing
  App.tsx
  main.tsx
```

---

## 🧩 Authoring MDX

**Front matter** (top of file):

```md
---
title: Getting Started
summary: A short, actionable description.
tags: [start, overview]
group: DevOps          # must exist in groups.json; otherwise falls back to "General"
order: 20              # intra-group ordering (lower → higher)
---
```

**Content** (what you can use):

- Standard **Markdown + GFM** (tables, task lists, strikethrough, autolinks).
- **JSX components** inline (<Component prop="x" />, imports/exports at top).
- **Code:** inline code and fenced blocks (with language hints).
- **Math:** `$…$` and `$$…$$` via KaTeX.
- **Raw HTML** (e.g., `<details>`, `<iframe>`).
    > **Security note:** raw HTML is enabled. If you need sanitization, add `rehype-sanitize` with a strict schema.

**Routing rules:**

- `src/content/index.mdx` → `/`
- `src/content/folder/index.mdx` → `/folder/`
- `src/content/guides/first-steps.mdx` → `/guides/first-steps`
    
---

## 🧭 Sidebar Groups

`src/config/groups.json` defines available groups, optional icons (from `lucide-react`), and ordering:
```json
[
  { "name": "General", "order": 0 },
  { "name": "DevOps",  "icon": "Server",   "order": 10 },
  { "name": "Backend", "icon": "Database", "order": 20 }
]
```
- Documents referencing a non-existent group fall back to **General**.
- If a group has no `icon`, the sidebar shows no icon for it.

---

## 🔍 Search (MiniSearch)

- **Indexed fields:** `title`, `headings (H2/H3)`, `normalized content`, `tags`.
- **Boosts:** `title ×4`, `headings ×2`, `tags ×2`, `content ×1`.
- **Options:** prefix matching enabled; fuzzy ratio `0.2`.
- **Stored fields:** `route`, `title`, `tags` (available directly on search hits, no `hit.store` nesting).

Content normalization strips code blocks, inline code, links/images, raw HTML tags, and markdown punctuation before indexing to reduce noise.

---

## 🛠️ MDX Build Pipeline

`vite.config.ts` integrates a pragmatic remark/rehype stack:
- remark:
    - `remark-gfm`
    - `remark-frontmatter`
    - `remark-math`
- rehype: 
    - `rehype-raw` (raw HTML to HAST) 
    - `rehype-slug` 
    - `rehype-autolink-headings` 
    - `rehype-katex` 
    - `rehype-highlight`

Add CSS for KaTeX + highlight.js in `src/index.css`:
```css
@import "katex/dist/katex.min.css";
@import "highlight.js/styles/atom-one-dark.css";
```
> **Tailwind v4.1** is configured via **CSS-first**: `@import "tailwindcss" source("./");` and plugins via `@plugin`. The Vite adapter is `@tailwindcss/vite`.

---

## 📦 Deployment

- **Vercel / Netlify:** static build out-of-the-box.
- **GitHub Pages:** `pnpm build` → publish `dist/` to `gh-pages`.

---

## 🤝 Contributing

PRs and issues welcome. Please keep the comfortable spacing profile, short and descriptive commits descriptions.

---

## 📝 License

MIT © 2025 — HostGier.PL Knowledge Base
