import create from "zustand";
import {HistoryItem} from "@/components/processEditor/hooks/useUndoRedo";

export type UndoRedoState = {
    past: HistoryItem[]
    setPast: (newPast: HistoryItem[]) => void
    future: HistoryItem[]
    setFuture: (newFuture: HistoryItem[]) => void
}

export const useUndoRedoStore = create<UndoRedoState>((set, get) => ({
    past: [],
    setPast: (newPast: HistoryItem[]) => {
        set({
            past: newPast
        })
    },
    future: [],
    setFuture: (newFuture: HistoryItem[]) => {
        set({
            future: newFuture
        })
    }
}))