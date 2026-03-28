# b6plus slide repo

Minimal static slide repo for technical talks, built on the W3C `b6plus`
presentation script:

https://www.w3.org/Talks/Tools/b6plus/

The goal is simple:

- keep the toolchain close to zero
- keep the visual system quiet and content-first
- keep enough structure to write technical talks quickly

## Structure

- `index.html`
  - the default working deck
- `talks/template/index.html`
  - a clean starter file for new talks
- `assets/b6plus.js`
  - vendored W3C presentation script
- `assets/css/theme.css`
  - shared minimal theme

## Quick start

Use Bun as the local static server:

Requires Bun to be installed locally.

```bash
bun run dev
```

Then open:

- `http://localhost:4173/`
- `http://localhost:4173/?full`
- `http://localhost:4173/talks/template/?full`

The local server entry point is `server.ts`, built with `Bun.serve` so the
repo no longer depends on Python for previewing slides.

## Writing workflow

1. Edit `index.html` if you want one active deck in the repo.
2. Copy `talks/template/index.html` into a new folder under `talks/` for a new talk.
3. Keep each slide to one idea.
4. Use speaker notes with a direct child element of class `comment`.
5. Use `class="incremental"` or `class="next"` only when sequence matters.

## Keyboard shortcuts

- `A`: toggle index mode and slide mode
- `Space`, `Right`, `Down`: next slide
- `Left`, `Up`: previous slide
- `2`: open second screen
- `D`: toggle dark mode
- `?`: show command help

## Style notes

This theme is intentionally quiet:

- wide margins
- strong type hierarchy
- black-first background
- orange-first theme with purple support
- no decorative sidebars or logos

Color semantics:

- orange is reserved for page titles and the primary visual identity
- purple is reserved for links, code, and secondary technical emphasis
- rose is reserved for critical or cautionary emphasis
- body copy stays neutral unless it needs emphasis

It is meant for engineering talks where diagrams, code, and metrics should
carry the presentation.

## Source

`assets/b6plus.js` is downloaded from the W3C `b6plus` page and kept local so
the repo can be edited and presented without depending on an external script.

## Local docs

For a repo-local Markdown reference derived from the official W3C `b6plus`
documentation, see:

- `docs/b6plus/README.md`
- `docs/b6plus/official-guide.zh-CN.md`
- `docs/b6plus/feature-reference.zh-CN.md`
- `docs/b6plus/theme-authoring.zh-CN.md`
