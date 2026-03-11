import { create } from 'zustand'

export type ToolType = 'select' | 'rectangle'

type ToolsState = {
    readonly activeTool: ToolType
}

type ToolsActions = {
    readonly setActiveTool: (tool: ToolType) => void
}

export const useToolsStore = create<ToolsState & ToolsActions>((set) => ({
    activeTool: 'select',
    setActiveTool: (tool) => set({ activeTool: tool }),
}))
