import { useEffect, useRef } from 'react'
import { selectCameraTransform, selectZoom, useCameraStore } from './camera'
import { useElementsStore } from './elements'
import { SelectionOutline, WireframeElementView } from './WireframeElement'

const GRID_SIZE = 24
const DOT_RADIUS = 0.8
const DOT_COLOR = 'rgba(130, 160, 210, 0.06)'

type InteractionMode =
    | { readonly type: 'idle' }
    | { readonly type: 'panning' }
    | { readonly type: 'moving'; readonly elementId: string }

const IDLE: InteractionMode = { type: 'idle' }

export function Workspace() {
    const svgRef = useRef<SVGSVGElement>(null)
    const mode = useRef<InteractionMode>(IDLE)
    const isSpaceHeld = useRef(false)

    const { pan, zoomAt, setViewport } = useCameraStore()
    const cameraTransform = useCameraStore(selectCameraTransform)
    const zoom = useCameraStore(selectZoom)
    const { elements, selectedId, select, deselect, moveElement } = useElementsStore()

    // Track viewport dimensions on mount + resize
    useEffect(() => {
        const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [setViewport])

    // Native wheel listener — passive: false required for preventDefault
    // Actions are stable references from zustand, safe as deps
    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (e.ctrlKey) {
                // Trackpad pinch — amplify small deltaY
                zoomAt(e.clientX, e.clientY, e.deltaY * 3)
            } else {
                // Two-finger swipe or mouse wheel — pan
                pan(-e.deltaX, -e.deltaY)
            }
        }

        svg.addEventListener('wheel', onWheel, { passive: false })
        return () => svg.removeEventListener('wheel', onWheel)
    }, [pan, zoomAt])

    // Space key tracking for space+drag panning
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault()
                isSpaceHeld.current = true
            }
        }
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                isSpaceHeld.current = false
            }
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [])

    // Canvas-level pointerdown — deselect + pan (only fires if no element caught it)
    const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        const shouldPan = e.button === 1 || e.button === 0
        if (!shouldPan) return

        e.preventDefault()
        deselect()
        mode.current = { type: 'panning' }
        svgRef.current?.setPointerCapture(e.pointerId)
    }

    // Element-level pointerdown — select + start move
    const handleElementPointerDown = (e: React.PointerEvent, elementId: string) => {
        if (e.button !== 0) return

        e.preventDefault()
        e.stopPropagation()
        select(elementId)
        mode.current = { type: 'moving', elementId }
        svgRef.current?.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        switch (mode.current.type) {
            case 'idle':
                return
            case 'panning':
                pan(e.movementX, e.movementY)
                return
            case 'moving':
                moveElement(mode.current.elementId, e.movementX / zoom, e.movementY / zoom)
                return
        }
    }

    const handlePointerUp = () => {
        mode.current = IDLE
    }

    return (
        <svg
            ref={svgRef}
            className="h-full w-full"
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <defs>
                <radialGradient id="vignette">
                    <stop offset="0%" stopColor="#13131c" />
                    <stop offset="100%" stopColor="#06060a" />
                </radialGradient>
                <pattern
                    id="dot-grid"
                    width={GRID_SIZE}
                    height={GRID_SIZE}
                    patternUnits="userSpaceOnUse"
                    patternTransform={cameraTransform}
                >
                    <circle
                        cx={GRID_SIZE / 2}
                        cy={GRID_SIZE / 2}
                        r={DOT_RADIUS}
                        fill={DOT_COLOR}
                    />
                </pattern>
                <filter id="drop-shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
                </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#vignette)" />
            <rect width="100%" height="100%" fill="url(#dot-grid)" />

            <g transform={cameraTransform}>
                {/* origin crosshair */}
                <line x1={-40} y1={0} x2={40} y2={0} stroke="#2a2a3a" strokeWidth={0.5} />
                <line x1={0} y1={-40} x2={0} y2={40} stroke="#2a2a3a" strokeWidth={0.5} />

                {elements.map((element) => (
                    <g
                        key={element.id}
                        filter="url(#drop-shadow)"
                        onPointerDown={(e) => handleElementPointerDown(e, element.id)}
                        style={{ cursor: 'move' }}
                    >
                        <WireframeElementView element={element} />
                    </g>
                ))}

                {selectedId &&
                    elements
                        .filter((el) => el.id === selectedId)
                        .map((el) => <SelectionOutline key={`sel-${el.id}`} element={el} />)}
            </g>
        </svg>
    )
}
