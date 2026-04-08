# Let's Vision 2026 | WebSpatial Talk Slides

> WebSpatial: Building visionOS Spatial Apps with HTML/CSS Like SwiftUI + RealityKit

This repository contains the slide deck for a talk presented at Let's Vision 2026.
It should be read as the home page for the talk project first, and only secondarily
as a lightweight `b6plus`-based slide repo.

- Speaker: Dexter Yang (Yang Yang)
- Organization: ByteDance
- Role: Creator of the Open Source WebSpatial Project
- Event: Let's Vision 2026
- Location: Shanghai

## Live URLs

- [English](https://letsvision2026.webspatial.dev)
- [Chinese](https://letsvision2026.webspatial.dev/cn)

## What This Talk Is About

This talk focuses on a simple claim:

The web on visionOS has already gained important new capabilities, but it still
does not offer the same spatial application paradigm that native visionOS
development gets from `SwiftUI + RealityKit`.

The presentation uses WebSpatial as the concrete example for how HTML, CSS, and
DOM-based development can evolve toward spatial computing without abandoning the
existing web ecosystem.

Main sections:

- Background
- Make the Web Spatial Too
- WebSpatial Features
- WebSpatial Philosophy

## Repository Contents

- `index.html`
  - main deck entry
- `index-cn.html`
  - Chinese deck variant
- `slides.md`
  - slide-by-slide outline, content draft, and speaker notes
- `assets/images`
  - optimized image assets used by the deck
- `assets/media`
  - embedded demo videos
- `assets/css/theme.css`
  - presentation theme
- `assets/b6plus.js`
  - vendored W3C `b6plus` runtime
- `server.ts`
  - local static preview server built with `Bun.serve`
- `docs/b6plus`
  - repo-local reference material for `b6plus`

## Local Preview

Requires Bun to be installed locally.

```bash
bun run dev
```

Then open:

- `http://localhost:4173/`
- `http://localhost:4173/index-cn.html`

## Build For Static Hosting

Generate a clean static output directory:

```bash
bun run build
```

This writes the deployable site to `dist/` and copies only the files needed for
hosting:

- `dist/index.html`
- `dist/cn/index.html`
- `dist/assets`

## Editing Workflow

- Edit `index.html` and `index-cn.html` when updating the rendered slide decks.
- Edit `slides.md` when refining the talk structure, page copy, or speaker notes.
- Update source images under `images/`, then run `bun run optimize:images` to
  regenerate `assets/images` when slide visuals change.

`optimize:images` depends on local `magick` and `cwebp` binaries.

## Tech Notes

This repo intentionally stays close to zero build tooling:

- static HTML slides
- local vendored `b6plus`
- Bun-based preview server
- pre-optimized image assets with AVIF/WebP/fallback outputs

`b6plus` is the presentation runtime, not the subject of the project. The
subject of the project is the Let's Vision 2026 talk and its WebSpatial-focused
content.

## Reference

Official `b6plus` page:

- https://www.w3.org/Talks/Tools/b6plus/
