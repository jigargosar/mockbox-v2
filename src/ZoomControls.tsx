import { selectZoomPercent, useCameraStore } from './camera'

export function ZoomControls() {
    const { zoomIn, zoomOut, reset } = useCameraStore()
    const zoomPercent = useCameraStore(selectZoomPercent)

    return (
        <div className="fixed right-4 bottom-4 flex items-center gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-1 py-1 backdrop-blur-xl">
            <ControlButton onClick={zoomOut} label="Zoom out">
                <MinusIcon />
            </ControlButton>

            <button
                onClick={reset}
                className="min-w-[52px] rounded-lg px-2 py-1.5 font-mono text-[11px] tracking-wide text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80"
                title="Reset zoom to 100%"
            >
                {zoomPercent}%
            </button>

            <ControlButton onClick={zoomIn} label="Zoom in">
                <PlusIcon />
            </ControlButton>

            <Separator />

            <ControlButton onClick={reset} label="Fit to content">
                <FitIcon />
            </ControlButton>
        </div>
    )
}

function ControlButton(props: {
    readonly onClick: () => void
    readonly label: string
    readonly children: React.ReactNode
}) {
    return (
        <button
            onClick={props.onClick}
            className="flex size-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
            title={props.label}
        >
            {props.children}
        </button>
    )
}

function Separator() {
    return <div className="mx-0.5 h-4 w-px bg-white/[0.08]" />
}

function MinusIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function FitIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
                d="M2 5V3a1 1 0 0 1 1-1h2M9 2h2a1 1 0 0 1 1 1v2M12 9v2a1 1 0 0 1-1 1H9M5 12H3a1 1 0 0 1-1-1V9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}