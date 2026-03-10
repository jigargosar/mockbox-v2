import { type PointerEvent, type WheelEvent, useCallback, useRef, useState } from 'react'

type ViewBox = { x: number; y: number; width: number; height: number }

function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    return pt.matrixTransform(svg.getScreenCTM()!.inverse())
}

function useApp() {
    const svgRef = useRef<SVGSVGElement>(null)
    const [viewBox, setViewBox] = useState<ViewBox>({
        x: 0, y: 0, width: window.innerWidth, height: window.innerHeight,
    })
    const dragStart = useRef<{ x: number; y: number } | null>(null)

    const onPointerDown = useCallback((e: PointerEvent) => {
        if (e.button !== 0 || !svgRef.current) return
        const pt = toSvgPoint(svgRef.current, e.clientX, e.clientY)
        dragStart.current = { x: pt.x, y: pt.y }
    }, [])

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!dragStart.current || !svgRef.current) return
        const pt = toSvgPoint(svgRef.current, e.clientX, e.clientY)
        setViewBox(vb => ({
            ...vb,
            x: vb.x - (pt.x - dragStart.current!.x),
            y: vb.y - (pt.y - dragStart.current!.y),
        }))
    }, [])

    const onPointerUp = useCallback(() => {
        dragStart.current = null
    }, [])

    const onWheel = useCallback((e: WheelEvent) => {
        if (!svgRef.current) return
        if (e.ctrlKey) {
            const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9
            const pt = toSvgPoint(svgRef.current, e.clientX, e.clientY)
            setViewBox(vb => ({
                x: pt.x - (pt.x - vb.x) * scaleFactor,
                y: pt.y - (pt.y - vb.y) * scaleFactor,
                width: vb.width * scaleFactor,
                height: vb.height * scaleFactor,
            }))
        } else {
            const scale = viewBox.width / svgRef.current.clientWidth
            setViewBox(vb => ({
                ...vb,
                x: vb.x + e.deltaX * scale,
                y: vb.y + e.deltaY * scale,
            }))
        }
    }, [viewBox.width])

    return { svgRef, viewBox, onPointerDown, onPointerMove, onPointerUp, onWheel }
}

export function App() {
    const { svgRef, viewBox, onPointerDown, onPointerMove, onPointerUp, onWheel } = useApp()
    const { x, y, width, height } = viewBox

    return (
        <svg
            ref={svgRef}
            className="h-screen w-screen bg-gray-950"
            viewBox={`${x} ${y} ${width} ${height}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onWheel={onWheel}
        >
            <rect x={100} y={100} width={200} height={150} fill="none" stroke="white" strokeWidth={2} />
        </svg>
    )
}
