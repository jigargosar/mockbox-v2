# Balsamiq Layering Model

Balsamiq does not use a traditional layers panel (like Photoshop or Figma) where every element is listed individually in a sidebar. Instead, it uses a "stacking" model where elements are layered directly on the canvas as if they were pieces of paper.

## Key Concepts

1. **Stacking Order** — every element you add is placed on top of the previous ones
2. **No Layers Panel** — no dedicated sidebar list to manage individual elements as layers
3. **No Named Layers** — you don't name layers (e.g., "Background" or "Button 1") because layers don't exist as separate objects in a menu

## Layering Commands

Change the stack order via the Property Inspector or right-click menu:

| Action        | Shortcut             |
|---------------|----------------------|
| Bring to Front | Ctrl/Cmd + Shift + Up |
| Bring Forward  | Ctrl/Cmd + Up        |
| Send Backward  | Ctrl/Cmd + Down      |
| Send to Back   | Ctrl/Cmd + Shift + Down |

## Selection

1. **Hidden elements** — hold ALT while clicking to select an element buried behind others
2. **Selection menu** — right-click while holding Shift to see a list of all elements stacked at that spot, then pick the one underneath

## Grouping

Group multiple items with Ctrl/Cmd + G to treat them as a single unit in the stack.

## Containers

Certain elements (Browser Window, iPhone, etc.) act as containers — moving the container automatically moves all elements placed inside it.
