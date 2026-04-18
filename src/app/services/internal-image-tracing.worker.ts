import { traceInternalRaster } from './internal-image-tracing-engine';
import type { InternalTraceOptions, InternalTraceProgress, InternalTraceRequest, InternalTraceResult } from './internal-image-tracing-engine';

type WorkerTraceRequestMessage = {
    type: 'trace';
    payload: {
        sourceWidth: number;
        sourceHeight: number;
        tracedWidth: number;
        tracedHeight: number;
        options: InternalTraceOptions;
        raster: {
            width: number;
            height: number;
            data: ArrayBuffer;
        };
    };
};

type WorkerTraceResponseMessage =
    | { type: 'progress'; progress: InternalTraceProgress }
    | { type: 'result'; result: InternalTraceResult }
    | { type: 'error'; error: string };

addEventListener('message', ({ data }: MessageEvent<WorkerTraceRequestMessage>) => {
    if (!data || data.type !== 'trace') {
        return;
    }

    try {
        const request: InternalTraceRequest = {
            sourceWidth: data.payload.sourceWidth,
            sourceHeight: data.payload.sourceHeight,
            tracedWidth: data.payload.tracedWidth,
            tracedHeight: data.payload.tracedHeight,
            options: data.payload.options,
            raster: {
                width: data.payload.raster.width,
                height: data.payload.raster.height,
                data: new Uint8ClampedArray(data.payload.raster.data)
            }
        };

        const result = traceInternalRaster(request, (progress) => {
            postMessage({ type: 'progress', progress } satisfies WorkerTraceResponseMessage);
        });

        postMessage({ type: 'result', result } satisfies WorkerTraceResponseMessage);
    }
    catch (error) {
        postMessage({
            type: 'error',
            error: error instanceof Error ? error.message : String(error ?? 'Image tracing worker failed.')
        } satisfies WorkerTraceResponseMessage);
    }
});
