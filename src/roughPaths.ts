import { RoughGenerator } from 'roughjs/bin/generator'
import type { Options, PathInfo } from 'roughjs/bin/core'

const generator = new RoughGenerator()

export function newSeed(): number {
    return RoughGenerator.newSeed()
}

// All shapes generated at origin — position via SVG transform
// This ensures rough paths don't regenerate during drag

export function roughRectangle(
    seed: number,
    width: number,
    height: number,
    options?: Options,
): ReadonlyArray<PathInfo> {
    const drawable = generator.rectangle(0, 0, width, height, { seed, ...options })
    return generator.toPaths(drawable)
}

export function roughLine(
    seed: number,
    dx: number,
    dy: number,
    options?: Options,
): ReadonlyArray<PathInfo> {
    const drawable = generator.line(0, 0, dx, dy, { seed, ...options })
    return generator.toPaths(drawable)
}
