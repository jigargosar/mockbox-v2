import type { WireframeElement } from './elements'
import { assertNever } from './utils'

export function WireframeElementView(props: { readonly element: WireframeElement }) {
    const { element } = props

    switch (element.type) {
        case 'rectangle':
            return (
                <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    rx={4}
                    fill="#12121a"
                    stroke="#252535"
                />
            )

        case 'text':
            return (
                <text
                    x={element.x}
                    y={element.y}
                    dominantBaseline="hanging"
                    fill="#7a7a8a"
                    fontSize={12}
                    fontFamily="system-ui"
                >
                    {element.content}
                </text>
            )

        case 'line':
            return (
                <line
                    x1={element.x}
                    y1={element.y}
                    x2={element.x + element.width}
                    y2={element.y + element.height}
                    stroke="#2e2e3a"
                    strokeWidth={1}
                />
            )

        case 'container':
            return (
                <g>
                    <rect
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        rx={6}
                        fill="#0e0e16"
                        stroke="#2e2e3a"
                        strokeWidth={1}
                    />
                    <text
                        x={element.x + 24}
                        y={element.y + 12}
                        dominantBaseline="hanging"
                        fill="#9a9aaa"
                        fontSize={15}
                        fontFamily="system-ui"
                    >
                        {element.label}
                    </text>
                </g>
            )

        default:
            return assertNever(element)
    }
}
