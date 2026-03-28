# b6plus Official Docs in Markdown

This directory keeps a local Markdown reference set derived from the official W3C
`b6plus` documentation, so the repo can be used offline and the key material is
easy to search.

## Source of truth

These notes are based on the official W3C pages below:

- User manual:
  [https://www.w3.org/Talks/Tools/b6plus/](https://www.w3.org/Talks/Tools/b6plus/)
  (manual page, last modified on 2026-01-24 according to the page footer)
- Intro page and simple style examples:
  [https://www.w3.org/Talks/Tools/b6plus.html](https://www.w3.org/Talks/Tools/b6plus.html)
- Style sheet authoring guide:
  [https://www.w3.org/Talks/Tools/b6plus/writing-style-sheets.html](https://www.w3.org/Talks/Tools/b6plus/writing-style-sheets.html)
  (last modified on 2026-03-04 according to the page footer)

The Markdown files in this folder are reorganized and translated notes for local
lookup, not a byte-for-byte mirror.

## Files

- [official-guide.zh-CN.md](./official-guide.zh-CN.md)
  - A practical getting-started guide for writing and presenting slides with
    `b6plus`
- [feature-reference.zh-CN.md](./feature-reference.zh-CN.md)
  - A fuller feature reference, organized by class names, attributes, URL
    parameters, shortcuts, and advanced capabilities
- [theme-authoring.zh-CN.md](./theme-authoring.zh-CN.md)
  - Notes for maintainers who want to customize or extend the slide theme

## Repo mapping

The most relevant files in this repo are:

- Runtime script: [`assets/b6plus.js`](../../assets/b6plus.js)
- Local theme: [`assets/css/theme.css`](../../assets/css/theme.css)
- Active deck: [`index.html`](../../index.html)
- Template deck: [`talks/template/index.html`](../../talks/template/index.html)
- Local preview server: `bun run dev`

## Recommended reading order

1. Read [official-guide.zh-CN.md](./official-guide.zh-CN.md)
2. Keep [feature-reference.zh-CN.md](./feature-reference.zh-CN.md) open while
   editing slides
3. Read [theme-authoring.zh-CN.md](./theme-authoring.zh-CN.md) only when you need
   to adjust the visual system or build a new theme
