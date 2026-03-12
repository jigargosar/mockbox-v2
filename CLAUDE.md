# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start Vite dev server (HTTPS, HMR)
pnpm build            # Production build
pnpm typecheck        # TypeScript strict type checking (no emit)
pnpm typecheck:watch  # Watch mode type checking
```

No linter or test runner configured. TypeScript strict mode is the primary safety mechanism.

## Architecture

MockBox is a wireframing tool with a sketchy/hand-drawn aesthetic, built on pure SVG (not canvas).

### Rendering pipeline

rough.js `RoughGenerator` + `toPaths()` produces `PathInfo[]` (pure data, no DOM). Each wireframe element is a React component rendering `<path>` elements via `RoughPathsView`. Elements are generated at origin (0,0) and positioned via SVG `transform` on parent `<g>` — this ensures rough paths only recompute on seed/size change, not position.

Text uses `<text>` elements with handwriting font. HTML overlay planned for edit mode via `getScreenCTM()` coordinate bridge.

### State management

Three independent zustand stores following the same pattern — pure state transition functions outside the store, thin action wrappers inside, selectors for derived values:

1. `camera.ts` — pan/zoom/viewport (zoom clamped 25%-300%, exponential scaling)
   - Pure functions: `applyPan`, `applyZoomAt`
   - Selectors: `selectCameraTransform`, `selectZoomPercent`, `selectZoom`
   - Viewport injected via `setViewport` (no `window` dependency in store)

2. `elements.ts` — wireframe element CRUD and selection
   - `selectedIds` is an array (multi-select ready)
   - Pure function: `applyMove`
   - Element types: `rectangle | text | line | container` (discriminated union)

3. `tools.ts` — active tool selection (`select | rectangle`)

### Zustand conventions

- Never call `.getState()` from outside the store
- Inside store, use `set(s => pureFn(s, ...))` — not `get().action()`
- Derived values as selectors, not stored state
- Actions are domain events, not setters

### Interaction flow (Workspace.tsx)

`useCanvasInteraction` hook (in `Workspace.tsx`) owns all pointer/keyboard interaction. Uses `InteractionMode` discriminated union (`idle | panning | moving`) tracked via ref. Element `<g>` handlers call `stopPropagation` to distinguish element clicks from canvas clicks. Pointer capture for smooth drags. Screen-to-canvas delta conversion: `movementX / zoom`. Canvas pointerdown checks `activeTool` from tools store — rectangle tool places at click position, select tool starts pan/select.

### Key conventions

- Each element stores a `seed` (number) for deterministic rough.js rendering
- `roughPaths.ts` generates shapes at origin — `roughRectangle(seed, width, height, options)`
- `assertNever()` in `utils.ts` for exhaustive switches on element type union
- All element types share: `id, seed, x, y, width, height`

### Formatting

Prettier: 4-space indent, single quotes, no semicolons, trailing commas, 120 char width.
