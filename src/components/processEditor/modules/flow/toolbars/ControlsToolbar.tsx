import React, {useRef} from 'react';
import useStore from "../../../store";
import {useReactFlow} from "reactflow";
import {onExport, onLoad, onSave} from "../../../util/ImportExportUtils";

export default function ControlsToolbar() {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const getChildren = useStore((state) => state.getChildren)
    const getNodeById = useStore((state) => state.getNodeById)
    const reactFlowInstance = useReactFlow();
    const inputFile = useRef<HTMLInputElement | null>(null);

    return (
        <aside>
            <div style={{
                borderRadius: 10,
                padding: 16,
                background: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <button style={{ width: "100%", marginBottom: 10 }} onClick={_ => onSave(nodes, edges)}>
                    Save editor file (.json)
                    <a id="downloadSave" style={{ display: "none"}}></a>
                </button>
                <button style={{
                    width: "100%",
                    marginBottom: 10,
                    userSelect: "none",
                }} onClick={() => {
                    if (inputFile.current !== null) {
                        inputFile.current.click();
                    } else {
                        console.warn("Error while uploading")
                    }
                }}>
                    <input accept={".json"} type='file' id='file' ref={inputFile} hidden onChange={(event) => {
                        onLoad(event, reactFlowInstance)
                    }}/>
                    Upload editor file (.json)
                </button>
                <button style={{ width: "100%" }} onClick={_ => onExport(nodes, edges, getChildren, getNodeById)}>
                    Export for Engine (.bpmn)
                    <a id="downloadExport" style={{ display: "none"}}></a>
                </button>
            </div>
        </aside>
    );
};