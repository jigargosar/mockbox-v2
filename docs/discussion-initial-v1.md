# MockBox v2 - Initial Discussion

## What is it
A wireframing tool. Users create wireframes by placing UI components on a canvas. Like Balsamiq.

## Tech Stack
Vite + React + TypeScript + Tailwind v4 + pnpm
rough.js for sketchy SVG rendering
zustand for state management

## Rendering Approach
Pure SVG for wireframe components. Each component is a React component rendering SVG.
rough.js gives the hand-drawn sketchy aesthetic.
SVG-only to start. Canvas background layer (for grid, guides, snap lines) can be added later if grid performance becomes a problem — non-disruptive addition since it just sits behind everything.
No canvas element for wireframe components — SVG gives native DOM events, hit testing, hover, cursor behavior for free.

## Text Handling
SVG <text> for display mode. Scales naturally with zoom.
HTML input/textarea overlay for edit mode. Double-click to enter edit, outside click to commit.
Coordinate bridge via getScreenCTM() to position HTML overlay over SVG element.
Input box sizing is scale-dependent: width = element width * zoom, font-size = base font * zoom.

Text behavior (same as Excalidraw/Figma):
- Click to type: auto-width, grows horizontally
- Press Enter: establishes current width, wraps, grows vertically
- Manual resize: fixed width, auto-height, wraps
Alignment (left/center/right) is just a property on the text element, works same in both modes.

## SVG Components
All wireframe components rendered as SVG elements with rough.js.
Decision: SVG, not canvas, not HTML/CSS. SVG gives vector scaling, DOM interactivity, and maps 1:1 to React components.

## Design Style
Sketchy / hand-drawn / lo-fi (like Balsamiq). Not clean/minimal.

## App Layout
Panels are: collapsible, resizable, placeable, with zen mode (canvas only, everything hidden).
General structure: component palette, canvas workspace, properties panel, top bar.

## USP and Philosophy
Smooth user interaction is the USP. Opinionated but familiar — don't deviate from what users expect.
Opinions need iteration — not set in stone.
80/20 rule — focus on 20% of features that deliver 80% of value.
Large-scale app — architecture must be extensible from day 1 but ready to throw away code when hitting a wall or chasing tail.

## V1 Scope (the 20%)
- SVG workspace with pan/zoom
- 3-4 core components: rectangle, text, line, container
- Place, select, move, resize
- Rough.js sketchy rendering
- Text editing (double-click, HTML input, outside click commit)
- Save/load JSON (local storage)

## Future Features (architecture prepared, not implemented)
- Full component library (button, input, checkbox, dropdown, navbar, card, image placeholder, divider)
- Collapsible / resizable / placeable / zen mode panels
- Component palette sidebar
- Properties panel
- Undo/redo
- Copy/paste/duplicate
- Multi-select / grouping
- Keyboard shortcuts
- Snap-to-grid / alignment guides
- Export (PNG, SVG)
- Multi-page wireframes
- Templates

## Planning Approach
Don't plan too many things upfront even though capturing them matters.
Features not in v1 should be captured but architecture shouldn't over-invest.
Be ready to throw away code. Don't chase tail.
No over-engineering. Stubs and extension points where needed, not full implementations.
