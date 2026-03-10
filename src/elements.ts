import { create } from 'zustand'

// Domain types

type ElementId = string

type ElementBase = {
    readonly id: ElementId
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
}

export type RectangleElement = ElementBase & { readonly type: 'rectangle' }
export type TextElement = ElementBase & { readonly type: 'text'; readonly content: string }
export type LineElement = ElementBase & { readonly type: 'line' }
export type ContainerElement = ElementBase & { readonly type: 'container'; readonly label: string }

export type WireframeElement = RectangleElement | TextElement | LineElement | ContainerElement

// Pure state transitions

function applyMove(
    elements: ReadonlyArray<WireframeElement>,
    id: ElementId,
    dx: number,
    dy: number,
): ReadonlyArray<WireframeElement> {
    return elements.map((el) => (el.id === id ? { ...el, x: el.x + dx, y: el.y + dy } : el))
}

// Store

type ElementsState = {
    readonly elements: ReadonlyArray<WireframeElement>
    readonly selectedIds: ReadonlyArray<ElementId>
}

type ElementsActions = {
    readonly select: (id: ElementId) => void
    readonly deselect: () => void
    readonly moveElement: (id: ElementId, dx: number, dy: number) => void
}

const SEED_ELEMENTS: ReadonlyArray<WireframeElement> = [
    { id: '1', type: 'container', x: 96, y: 72, width: 312, height: 240, label: 'Login Form' },
    { id: '2', type: 'rectangle', x: 120, y: 120, width: 264, height: 36 },
    { id: '3', type: 'text', x: 136, y: 128, width: 100, height: 20, content: 'Email' },
    { id: '4', type: 'rectangle', x: 120, y: 168, width: 264, height: 36 },
    { id: '5', type: 'text', x: 136, y: 176, width: 100, height: 20, content: 'Password' },
    { id: '6', type: 'rectangle', x: 120, y: 216, width: 264, height: 36 },
    { id: '7', type: 'text', x: 252, y: 224, width: 60, height: 20, content: 'Sign In' },
    { id: '8', type: 'container', x: 456, y: 72, width: 264, height: 288, label: 'Sidebar' },
    { id: '9', type: 'rectangle', x: 480, y: 120, width: 216, height: 36 },
    { id: '10', type: 'rectangle', x: 480, y: 168, width: 216, height: 36 },
    { id: '11', type: 'rectangle', x: 480, y: 216, width: 216, height: 36 },
    { id: '12', type: 'rectangle', x: 480, y: 264, width: 216, height: 36 },
    { id: '13', type: 'container', x: 96, y: 384, width: 624, height: 48, label: 'Navigation Bar' },
]

export const useElementsStore = create<ElementsState & ElementsActions>((set) => ({
    elements: SEED_ELEMENTS,
    selectedIds: [],

    select: (id) => set({ selectedIds: [id] }),
    deselect: () => set({ selectedIds: [] }),
    moveElement: (id, dx, dy) => set((s) => ({ elements: applyMove(s.elements, id, dx, dy) })),
}))
