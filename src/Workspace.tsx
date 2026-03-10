import { useEffect, useRef } from 'react'
import { useCameraStore } from './camera'

const GRID_SIZE = 20
const DOT_RADIUS = 1
const DOT_COLOR = 'rgba(255, 255, 255, 0.1)'

export function Workspace() {
    const svgRef = useRef<SVGSVGElement>(null)
    const isPanning = useRef(false)
    const isSpaceHeld = useRef(false)

    const { offsetX, offsetY, zoom } = useCameraStore()

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
                {/* placeholder wireframe elements for testing */}
                <rect x={100} y={80} width={300} height={200} rx={4} fill="none" stroke="#555" strokeWidth={1.5} />
                <text x={120} y={120} fill="#aaa" fontSize={16}>Login Form</text>
                <rect x={120} y={140} width={260} height={32} rx={3} fill="#1a1a22" stroke="#444" />
                <text x={132} y={162} fill="#666" fontSize={13}>Email</text>
                <rect x={120} y={184} width={260} height={32} rx={3} fill="#1a1a22" stroke="#444" />
                <text x={132} y={206} fill="#666" fontSize={13}>Password</text>
                <rect x={120} y={232} width={260} height={32} rx={3} fill="#334" stroke="#558" />
                <text x={220} y={254} fill="#ccc" fontSize={13} textAnchor="middle">Sign In</text>

                <rect x={500} y={60} width={250} height={300} rx={4} fill="none" stroke="#555" strokeWidth={1.5} />
                <text x={520} y={100} fill="#aaa" fontSize={16}>Sidebar</text>
                <rect x={520} y={120} width={210} height={28} rx={3} fill="#1a1a22" stroke="#444" />
                <rect x={520} y={158} width={210} height={28} rx={3} fill="#1a1a22" stroke="#444" />
                <rect x={520} y={196} width={210} height={28} rx={3} fill="#1a1a22" stroke="#444" />
                <rect x={520} y={234} width={210} height={28} rx={3} fill="#1a1a22" stroke="#444" />

                <rect x={100} y={400} width={650} height={40} rx={4} fill="none" stroke="#555" strokeWidth={1.5} />
                <text x={425} y={426} fill="#aaa" fontSize={14} textAnchor="middle">Navigation Bar</text>
            </g>
        </svg>
    )
}
