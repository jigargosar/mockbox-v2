import type { PathInfo } from 'roughjs/bin/core'

export function RoughPaths(props: { readonly paths: ReadonlyArray<PathInfo> }) {
    return (
        <>
            {props.paths.map((path, i) => (
                <path
                    key={i}
                    d={path.d}
                    stroke={path.stroke}
                    strokeWidth={path.strokeWidth}
                    fill={path.fill ?? 'none'}
                />
            ))}
        </>
    )
}
