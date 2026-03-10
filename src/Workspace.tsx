import { useEffect, useRef } from 'react'
import { useCameraStore } from './camera'

const GRID_SIZE = 20
const DOT_RADIUS = 1
const DOT_COLOR = 'rgba(255, 255, 255, 0.1)'

export function Workspace() {
    const svgRef = useRef<SVGSVGElement>(null)
    const isPanning = useRef(false)
    const isSpaceHeld = useRef(false)

    const { offsetX, offsetY, zoom, pan } = useCameraStore()

    // Native wheel listener — passive: false required for preventDefault
    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const state = useCameraStore.getState()
            if (e.ctrlKey) {
                // Trackpad pinch — amplify small deltaY
                state.zoomAt(e.clientX, e.clientY, e.deltaY * 3)
            } else {
                // Two-finger swipe or mouse wheel — pan
                state.pan(-e.deltaX, -e.deltaY)
            }
        }

        svg.addEventListener('wheel', onWheel, { passive: false })
        return () => svg.removeEventListener('wheel', onWheel)
    }, [])

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

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        // TODO: once objects exist, left-click on empty canvas only
        const shouldPan = e.button === 1 || e.button === 0
        if (!shouldPan) return

        e.preventDefault()
        isPanning.current = true
        svgRef.current?.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isPanning.current) return
        useCameraStore.getState().pan(e.movementX, e.movementY)
    }

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        const wasPan = e.button === 1 || (e.button === 0 && isPanning.current)
        if (!wasPan) return
        isPanning.current = false
    }

    return (
        <svg
            ref={svgRef}
            className="h-full w-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <defs>
                <pattern
                    id="dot-grid"
                    width={GRID_SIZE}
                    height={GRID_SIZE}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`translate(${offsetX}, ${offsetY}) scale(${zoom})`}
                >
                    <circle
                        cx={GRID_SIZE / 2}
                        cy={GRID_SIZE / 2}
                        r={DOT_RADIUS}
                        fill={DOT_COLOR}
                    />
                </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#dot-grid)" />

            <g transform={`translate(${offsetX}, ${offsetY}) scale(${zoom})`}>
                {/* wireframe content */}
            </g>
        </svg>
    )
}
