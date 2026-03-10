import { useMemo } from 'react'
import type { WireframeElement } from './elements'
import { RoughPaths } from './RoughPathsView'
import { roughLine, roughRectangle } from './roughPaths'
import { assertNever } from './utils'

const SELECTION_COLOR = '#4488ff'

export function WireframeElementView(props: {
    readonly element: WireframeElement
}) {
    const { element } = props

    // All rough shapes rendered at origin, positioned via transform on parent <g>
    switch (element.type) {
        case 'rectangle':
            return <RoughRect element={element} />

        case 'text':
            return (
                <text
                    x={0}
                    y={0}
                    dominantBaseline="hanging"
                    fill="#8a8a9a"
                    fontSize={13}
                    fontFamily="'Caveat', 'Segoe Print', cursive"
                >
                    {element.content}
                </text>
            )

        case 'line':
            return <RoughLineView element={element} />

        case 'container':
            return <RoughContainer element={element} />

        default:
            return assertNever(element)
    }
}

const RECT_OPTIONS = {
    roughness: 0.5,
    bowing: 0.6,
    strokeWidth: 1.5,
    stroke: '#b0b0c0',
    fill: '#12121a',
    fillStyle: 'solid' as const,
}

const CONTAINER_OPTIONS = {
    roughness: 0.5,
    bowing: 0.6,
    strokeWidth: 1.2,
    stroke: '#606078',
    fill: '#0e0e16',
    fillStyle: 'solid' as const,
}

const LINE_OPTIONS = {
    roughness: 0.4,
    bowing: 0.3,
    strokeWidth: 1.2,
    stroke: '#606078',
}

function RoughRect(props: { readonly element: WireframeElement }) {
    const { element } = props
    const paths = useMemo(
        () => roughRectangle(element.seed, element.width, element.height, RECT_OPTIONS),
        [element.seed, element.width, element.height],
    )
    return <RoughPaths paths={paths} />
}

function RoughLineView(props: { readonly element: WireframeElement }) {
    const { element } = props
    const paths = useMemo(
        () => roughLine(element.seed, element.width, element.height, LINE_OPTIONS),
        [element.seed, element.width, element.height],
    )
    return <RoughPaths paths={paths} />
}

function RoughContainer(props: { readonly element: WireframeElement & { readonly type: 'container' } }) {
    const { element } = props
    const paths = useMemo(
        () => roughRectangle(element.seed, element.width, element.height, CONTAINER_OPTIONS),
        [element.seed, element.width, element.height],
    )
    return (
        <g>
            <RoughPaths paths={paths} />
            <text
                x={24}
                y={12}
                dominantBaseline="hanging"
                fill="#9a9aaa"
                fontSize={16}
                fontFamily="'Caveat', 'Segoe Print', cursive"
            >
                {element.label}
            </text>
        </g>
    )
}

export function SelectionOutline(props: { readonly element: WireframeElement }) {
    const { element } = props
    const pad = 2
    return (
        <rect
            x={-pad}
            y={-pad}
            width={element.width + pad * 2}
            height={element.height + pad * 2}
            rx={4}
            fill="none"
            stroke={SELECTION_COLOR}
            strokeWidth={1.5}
            strokeDasharray="4 2"
            transform={`translate(${element.x}, ${element.y})`}
        />
    )
}
