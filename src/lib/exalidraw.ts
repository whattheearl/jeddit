import React from 'react';
import ReactDom from 'react-dom/client';

let Excalidraw: typeof import('@excalidraw/excalidraw');
let excalidrawApi: any;

export interface RenderOptions {
    onSave: Function | undefined;
}

export const render = async (options: RenderOptions) => {
    window.process = { env: { IS_PREACT: false } } as any;
    Excalidraw = await import('@excalidraw/excalidraw');
    const container = document.getElementById('root');
    const root = ReactDom.createRoot(container!);
    const saveButton = React.createElement(
        'button',
        {
            style: {
                height: '36px',
                padding: '0 10px',
                marginLeft: 'auto',
                backgroundColor: 'rgb(236, 236, 244)',
                borderRadius: '8px'
            },
            onClick: options.onSave ?? null,
            dangerouslySetInnerHTML: { __html: 'Save' }
        },
        null
    );

    // todo: overlay button over dialog so it will work in any screen size
    const footer = React.createElement(
        Excalidraw.Footer,
        { key: 'exalidraw-footer' },
        saveButton as any
    );
    const excalidraw = React.createElement(
        Excalidraw.Excalidraw,
        {
            UIOptions: {
                tools: {
                    image: false
                }
            },
            excalidrawAPI: (api) => {
                excalidrawApi = api;
                console.log({ api });
            }
        },
        [footer]
    );
    root.render(excalidraw);
    return Excalidraw;
};

export const exportSVGElement = async () => {
    const svg = await Excalidraw.exportToSvg({
        appState: excalidrawApi.getAppState(),
        elements: excalidrawApi.getSceneElements(),
        // files: excalidrawApi.getFiles(),
        files: null,
        renderEmbeddables: false
    });
    return svg;
};

export const exportToBlob = async () => {
    const blob = await Excalidraw.exportToBlob({
        appState: excalidrawApi.getAppState(),
        elements: excalidrawApi.getSceneElements(),
        files: null,
        renderEmbeddables: false,
        mimeType: 'image/png',
        exportPadding: 50,
        maxWidthOrHeight: 1200
    });
    return blob;
};

export const toggleVisibility = () => {
    const root = document.querySelector('#excalidraw') as HTMLElement;
    root.style.display == 'none' ? (root.style.display = 'flex') : (root.style.display = 'none');
};
