import { create } from 'zustand'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 3.0
const ZOOM_SPEED = 0.001

type CameraState = {
    readonly offsetX: number
    readonly offsetY: number
    readonly zoom: number
}

type CameraActions = {
    readonly pan: (dx: number, dy: number) => void
    readonly zoomAt: (cursorX: number, cursorY: number, delta: number) => void
    readonly reset: () => void
}

const INITIAL: CameraState = { offsetX: 0, offsetY: 0, zoom: 1 }

export const useCameraStore = create<CameraState & CameraActions>((set) => ({
    ...INITIAL,

    pan: (dx, dy) =>
        set((s) => ({
            offsetX: s.offsetX + dx,
            offsetY: s.offsetY + dy,
        })),

    zoomAt: (cursorX, cursorY, delta) =>
        set((s) => {
            const factor = Math.exp(-delta * ZOOM_SPEED)
            const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s.zoom * factor))
            const ratio = nextZoom / s.zoom
            return {
                zoom: nextZoom,
                offsetX: cursorX - (cursorX - s.offsetX) * ratio,
                offsetY: cursorY - (cursorY - s.offsetY) * ratio,
            }
        }),

    reset: () => set(INITIAL),
}))
