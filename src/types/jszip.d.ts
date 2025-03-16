declare module "jszip" {
    export default class JSZip {
        file(name: string, data: string | Blob | ArrayBuffer | Uint8Array): this
        folder(name: string): JSZip | null
        generateAsync(options: { type: string }): Promise<Blob>
    }
}