import { type PointerEvent, useEffect, useRef, useState } from 'react'

type ViewBox = { x: number; y: number; width: number; height: number }

function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    return pt.matrixTransform(ctm.inverse())
}

function useApp() {
    const svgRef = useRef<SVGSVGElement>(null)
    const contentRef = useRef<SVGGElement>(null)
    const [viewBox, setViewBox] = useState<ViewBox>({
        x: 0, y: 0, width: window.innerWidth, height: window.innerHeight,
    })
    const dragOrigin = useRef<{ x: number; y: number } | null>(null)

    const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
        if (e.button !== 0 || !svgRef.current) return
        const pt = toSvgPoint(svgRef.current, e.clientX, e.clientY)
        if (!pt) return
        dragOrigin.current = { x: pt.x, y: pt.y }
    }

    const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
        if (!dragOrigin.current || !svgRef.current) return
        const origin = dragOrigin.current
        const pt = toSvgPoint(svgRef.current, e.clientX, e.clientY)
        if (!pt) return
        setViewBox(vb => ({
            ...vb,
            x: vb.x - (pt.x - origin.x),
            y: vb.y - (pt.y - origin.y),
        }))
    }

    const onPointerUp = () => { dragOrigin.current = null }

    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (e.ctrlKey) {
                const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9
                const pt = toSvgPoint(svg, e.clientX, e.clientY)
                if (!pt) return
                setViewBox(vb => {
                    const newWidth = vb.width * scaleFactor
                    const minWidth = window.innerWidth / 5
                    const maxWidth = window.innerWidth * 3
                    if (newWidth < minWidth || newWidth > maxWidth) return vb
                    return {
                        x: pt.x - (pt.x - vb.x) * scaleFactor,
                        y: pt.y - (pt.y - vb.y) * scaleFactor,
                        width: newWidth,
                        height: vb.height * scaleFactor,
                    }
                })
            } else {
                setViewBox(vb => {
                    const scale = vb.width / svg.clientWidth
                    return {
                        ...vb,
                        x: vb.x + e.deltaX * scale,
                        y: vb.y + e.deltaY * scale,
                    }
                })
            }
        }
        svg.addEventListener('wheel', handleWheel, { passive: false })
        return () => svg.removeEventListener('wheel', handleWheel)
    }, [])

    const fitToContent = () => {
        if (!contentRef.current) return
        const bbox = contentRef.current.getBBox()
        const padding = 40
        const aspect = window.innerWidth / window.innerHeight
        let fitWidth = bbox.width + padding * 2
        let fitHeight = bbox.height + padding * 2
        if (fitWidth / fitHeight > aspect) {
            fitHeight = fitWidth / aspect
        } else {
            fitWidth = fitHeight * aspect
        }
        setViewBox({
            x: bbox.x - (fitWidth - bbox.width) / 2,
            y: bbox.y - (fitHeight - bbox.height) / 2,
            width: fitWidth,
            height: fitHeight,
        })
    }

    return { svgRef, contentRef, viewBox, onPointerDown, onPointerMove, onPointerUp, fitToContent }
}

export function App() {
    const { svgRef, contentRef, viewBox, onPointerDown, onPointerMove, onPointerUp, fitToContent } = useApp()
    const { x, y, width, height } = viewBox

    const buttonClass = 'px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700'

    return (
        <div className="relative h-screen w-screen overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button onClick={fitToContent} className={buttonClass}>Fit</button>
        </div>
        <svg
            ref={svgRef}
            className="h-screen w-screen bg-gray-950"
            viewBox={`${x} ${y} ${width} ${height}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}

        >
            <defs>
                <pattern id="dot-grid" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
                    <circle cx={10} cy={10} r={1} fill="rgb(255 255 255 / 0.15)" />
                </pattern>
            </defs>
            <rect x={x} y={y} width={width} height={height} fill="url(#dot-grid)" />
            <g ref={contentRef}>
                <rect x={100} y={100} width={200} height={150} fill="none" stroke="white" strokeWidth={2} />
            </g>
        </svg>
        </div>
    )
}
