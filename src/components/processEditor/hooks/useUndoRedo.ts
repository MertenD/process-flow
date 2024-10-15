import {useCallback, useEffect} from 'react'
import {Edge, Node, useReactFlow} from 'reactflow'
import {useUndoRedoStore} from "@/stores/UndoRedoStore";

type UseUndoRedoOptions = {
    maxHistorySize: number
    enableShortcuts: boolean
}

type UseUndoRedo = (options?: UseUndoRedoOptions) => {
    undo: () => void
    redo: () => void
    takeSnapshot: () => void
    canUndo: boolean
    canRedo: boolean
}

export type HistoryItem = {
    nodes: Node[]
    edges: Edge[]
}

const defaultOptions: UseUndoRedoOptions = {
    maxHistorySize: 100,
    enableShortcuts: true,
}

export const useUndoRedo: UseUndoRedo = ({
                                             maxHistorySize = defaultOptions.maxHistorySize,
                                             enableShortcuts = defaultOptions.enableShortcuts,
                                         } = defaultOptions) => {
    // the past and future arrays store the states that we can jump to
    const { past, setPast, future, setFuture } = useUndoRedoStore()

    const { setNodes, setEdges, getNodes, getEdges } = useReactFlow()

    const takeSnapshot = useCallback(() => {
        // push the current graph to the past state
        const newPast: HistoryItem[] = [
            ...past.slice(past.length - maxHistorySize + 1, past.length),
            { nodes: getNodes(), edges: getEdges() },
        ]
        setPast(newPast)

        // whenever we take a new snapshot, the redo operations need to be cleared to avoid state mismatches
        setFuture([])
    }, [past, maxHistorySize, getNodes, getEdges, setPast, setFuture])

    const undo = useCallback(() => {
        // get the last state that we want to go back to
        const pastState = past[past.length - 1]

        if (pastState) {
            // first we remove the state from the history
            const newPast = past.slice(0, past.length - 1)
            setPast(newPast)
            // we store the current graph for the redo operation
            const newFuture = [...future, { nodes: getNodes(), edges: getEdges() }]
            setFuture(newFuture)
            // now we can set the graph to the past state
            setNodes(pastState.nodes)
            setEdges(pastState.edges)
        }
    }, [setNodes, setEdges, getNodes, getEdges, past])

    const redo = useCallback(() => {
        const futureState = future[future.length - 1]

        if (futureState) {
            const newFuture = future.slice(0, future.length - 1)
            setFuture(newFuture)
            const newPast = [...past, { nodes: getNodes(), edges: getEdges() }]
            setPast(newPast)
            setNodes(futureState.nodes)
            setEdges(futureState.edges)
        }
    }, [setNodes, setEdges, getNodes, getEdges, future])

    useEffect(() => {
        // this effect is used to attach the global event handlers
        if (!enableShortcuts) {
            return
        }

        const keyDownHandler = (event: KeyboardEvent) => {
            if (event.key === 'z' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                redo()
            } else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
                undo()
            }
        }

        document.addEventListener('keydown', keyDownHandler)

        return () => {
            document.removeEventListener('keydown', keyDownHandler)
        }
    }, [undo, redo, enableShortcuts])

    return {
        undo,
        redo,
        takeSnapshot,
        canUndo: !past.length,
        canRedo: !future.length,
    }
}

export default useUndoRedo