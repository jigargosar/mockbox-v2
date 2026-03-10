import { create } from 'zustand'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 3.0
const ZOOM_SPEED = 0.001
const ZOOM_STEP = 200

type Viewport = {
    readonly width: number
    readonly height: number
}

type CameraState = {
    readonly offsetX: number
    readonly offsetY: number
    readonly zoom: number
    readonly viewport: Viewport
}

type CameraActions = {
    readonly setViewport: (viewport: Viewport) => void
    readonly pan: (dx: number, dy: number) => void
    readonly zoomAt: (cursorX: number, cursorY: number, delta: number) => void
    readonly zoomIn: () => void
    readonly zoomOut: () => void
    readonly reset: () => void
}

// Pure state transitions — testable, reusable across actions

function applyPan(s: CameraState, dx: number, dy: number): Partial<CameraState> {
    return { offsetX: s.offsetX + dx, offsetY: s.offsetY + dy }
}

function applyZoomAt(s: CameraState, cursorX: number, cursorY: number, delta: number): Partial<CameraState> {
    const factor = Math.exp(-delta * ZOOM_SPEED)
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s.zoom * factor))
    const ratio = nextZoom / s.zoom
    return {
        zoom: nextZoom,
        offsetX: cursorX - (cursorX - s.offsetX) * ratio,
        offsetY: cursorY - (cursorY - s.offsetY) * ratio,
    }
}

// Selectors — derived values, not stored

export const selectCameraTransform = (s: CameraState) =>
    `translate(${s.offsetX}, ${s.offsetY}) scale(${s.zoom})`

export const selectZoomPercent = (s: CameraState) =>
    Math.round(s.zoom * 100)

// Store — thin action wrappers

const INITIAL_VIEWPORT: Viewport = { width: 0, height: 0 }
const INITIAL: CameraState = { offsetX: 0, offsetY: 0, zoom: 1, viewport: INITIAL_VIEWPORT }

export const useCameraStore = create<CameraState & CameraActions>((set) => ({
    ...INITIAL,

    setViewport: (viewport) => set({ viewport }),

    pan: (dx, dy) => set((s) => applyPan(s, dx, dy)),

    zoomAt: (cursorX, cursorY, delta) => set((s) => applyZoomAt(s, cursorX, cursorY, delta)),

    zoomIn: () => set((s) => applyZoomAt(s, s.viewport.width / 2, s.viewport.height / 2, -ZOOM_STEP)),

    zoomOut: () => set((s) => applyZoomAt(s, s.viewport.width / 2, s.viewport.height / 2, ZOOM_STEP)),

    reset: () => set(INITIAL),
}))
