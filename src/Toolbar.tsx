import { useToolsStore } from './tools'

export function Toolbar() {
    const { activeTool, setActiveTool } = useToolsStore()

    return (
        <div className="fixed top-4 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-1 py-1 backdrop-blur-xl">
            <ToolButton
                active={activeTool === 'select'}
                onClick={() => setActiveTool('select')}
                label="Select (V)"
            >
                <PointerIcon />
            </ToolButton>
            <ToolButton
                active={activeTool === 'rectangle'}
                onClick={() => setActiveTool('rectangle')}
                label="Rectangle (R)"
            >
                <RectangleIcon />
            </ToolButton>
        </div>
    )
}

function ToolButton(props: {
    readonly active: boolean
    readonly onClick: () => void
    readonly label: string
    readonly children: React.ReactNode
}) {
    return (
        <button
            onClick={props.onClick}
            className={`flex size-7 items-center justify-center rounded-lg transition-colors ${
                props.active
                    ? 'bg-white/[0.12] text-white/90'
                    : 'text-white/40 hover:bg-white/[0.06] hover:text-white/80'
            }`}
            title={props.label}
        >
            {props.children}
        </button>
    )
}

function PointerIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
                d="M3 1.5l1 10 2.5-3.5L10.5 7z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function RectangleIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
                x="2"
                y="3"
                width="10"
                height="8"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    )
}
