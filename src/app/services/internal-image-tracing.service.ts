import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
    DEFAULT_TRACE_PRESET_ID,
    getInternalTraceDefaultOptions,
    getInternalTraceMaxLongEdge,
    getInternalTracePresetDefinitions,
    normalizeInternalTraceOptions,
    traceInternalRaster
} from './internal-image-tracing-engine';
import type {
    InternalTraceOptions,
    InternalTracePresetDefinition,
    InternalTracePresetId,
    InternalTraceProgress,
    InternalTraceRequest,
    InternalTraceResult,
    TraceRaster
} from './internal-image-tracing-engine';

export type {
    InternalTraceDetailLevel,
    InternalTraceOptions,
    InternalTracePresetDefinition,
    InternalTracePresetId,
    InternalTraceProgress,
    InternalTraceRequest,
    InternalTraceResult,
    TraceRaster
} from './internal-image-tracing-engine';

const TRACE_OPTIONS_STORAGE_KEY = 'elise-internal-trace-options';

type TraceSource = {
    image: HTMLImageElement;
    sourceWidth: number;
    sourceHeight: number;
    dispose: () => void;
};

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

@Injectable({
    providedIn: 'root'
})
export class InternalImageTracingService {
    private readonly document = inject(DOCUMENT);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly presetDefinitions: InternalTracePresetDefinition[] = getInternalTracePresetDefinitions();

    getPresetDefinitions(): InternalTracePresetDefinition[] {
        return this.presetDefinitions.map((preset) => ({
            ...preset,
            defaults: { ...preset.defaults }
        }));
    }

    getDefaultOptions(presetId: InternalTracePresetId = DEFAULT_TRACE_PRESET_ID): InternalTraceOptions {
        return getInternalTraceDefaultOptions(presetId);
    }

    getInitialOptions(): InternalTraceOptions {
        return this.getStoredOptions() ?? this.getDefaultOptions();
    }

    rememberOptions(options: InternalTraceOptions): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        try {
            localStorage.setItem(TRACE_OPTIONS_STORAGE_KEY, JSON.stringify(normalizeInternalTraceOptions(options)));
        }
        catch {
            // Ignore storage failures and keep the in-memory selection.
        }
    }

    async traceImageSource(
        source: string,
        options: InternalTraceOptions,
        existingImage?: HTMLImageElement,
        onProgress?: (progress: InternalTraceProgress) => void
    ): Promise<InternalTraceResult> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error('Image tracing is only available in the browser.');
        }

        onProgress?.({ stage: 'Loading image', progress: 2 });

        const normalizedOptions = normalizeInternalTraceOptions(options);
        const traceSource = await this.loadTraceSource(source, existingImage);
        try {
            const scaledSize = this.getScaledSize(
                traceSource.sourceWidth,
                traceSource.sourceHeight,
                getInternalTraceMaxLongEdge(normalizedOptions.presetId)
            );

            onProgress?.({ stage: 'Preparing worker input', progress: 8 });

            const raster = this.createRaster(traceSource.image, scaledSize.width, scaledSize.height);
            const request: InternalTraceRequest = {
                sourceWidth: traceSource.sourceWidth,
                sourceHeight: traceSource.sourceHeight,
                tracedWidth: scaledSize.width,
                tracedHeight: scaledSize.height,
                raster,
                options: normalizedOptions
            };

            this.rememberOptions(normalizedOptions);

            if (this.canUseWorker()) {
                try {
                    return await this.traceWithWorker(request, onProgress);
                }
                catch (error) {
                    console.warn('Internal trace worker failed; falling back to main thread tracing.', error);
                }
            }

            onProgress?.({ stage: 'Tracing on main thread', progress: 12 });
            return traceInternalRaster(request, onProgress);
        }
        finally {
            traceSource.dispose();
        }
    }

    private canUseWorker(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }

        const view = this.document.defaultView;
        return typeof view?.Worker !== 'undefined';
    }

    private async traceWithWorker(
        request: InternalTraceRequest,
        onProgress?: (progress: InternalTraceProgress) => void
    ): Promise<InternalTraceResult> {
        const rasterCopy = request.raster.data.slice();

        return await new Promise<InternalTraceResult>((resolve, reject) => {
            const worker = new Worker(new URL('./internal-image-tracing.worker', import.meta.url), { type: 'module' });

            const cleanup = () => {
                worker.onmessage = null;
                worker.onerror = null;
                worker.terminate();
            };

            worker.onmessage = ({ data }: MessageEvent<WorkerTraceResponseMessage>) => {
                switch (data?.type) {
                    case 'progress':
                        onProgress?.(data.progress);
                        break;
                    case 'result':
                        cleanup();
                        resolve(data.result);
                        break;
                    case 'error':
                        cleanup();
                        reject(new Error(data.error));
                        break;
                }
            };

            worker.onerror = (event) => {
                cleanup();
                reject(event.error ?? new Error(event.message || 'Image tracing worker failed.'));
            };

            const message: WorkerTraceRequestMessage = {
                type: 'trace',
                payload: {
                    sourceWidth: request.sourceWidth,
                    sourceHeight: request.sourceHeight,
                    tracedWidth: request.tracedWidth,
                    tracedHeight: request.tracedHeight,
                    options: request.options,
                    raster: {
                        width: request.raster.width,
                        height: request.raster.height,
                        data: rasterCopy.buffer
                    }
                }
            };

            worker.postMessage(message, [rasterCopy.buffer]);
        });
    }

    private createRaster(image: HTMLImageElement, width: number, height: number): TraceRaster {
        const canvas = this.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            throw new Error('Unable to create a tracing canvas.');
        }

        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);

        return {
            width: imageData.width,
            height: imageData.height,
            data: new Uint8ClampedArray(imageData.data)
        };
    }

    private getStoredOptions(): InternalTraceOptions | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        try {
            const value = localStorage.getItem(TRACE_OPTIONS_STORAGE_KEY);
            if (!value) {
                return null;
            }

            return normalizeInternalTraceOptions(JSON.parse(value) as Partial<InternalTraceOptions>);
        }
        catch {
            return null;
        }
    }

    private getScaledSize(sourceWidth: number, sourceHeight: number, maxLongEdge: number) {
        const longEdge = Math.max(sourceWidth, sourceHeight);
        if (longEdge <= maxLongEdge) {
            return { width: sourceWidth, height: sourceHeight };
        }

        const scale = maxLongEdge / longEdge;
        return {
            width: Math.max(1, Math.round(sourceWidth * scale)),
            height: Math.max(1, Math.round(sourceHeight * scale))
        };
    }

    private async loadTraceSource(source: string, existingImage?: HTMLImageElement): Promise<TraceSource> {
        const trimmedSource = source?.trim();
        if (!trimmedSource) {
            throw new Error('An image source is required for tracing.');
        }

        if (!this.isCrossOriginSource(trimmedSource) && existingImage?.complete && existingImage.naturalWidth > 0) {
            return {
                image: existingImage,
                sourceWidth: existingImage.naturalWidth,
                sourceHeight: existingImage.naturalHeight,
                dispose: () => { }
            };
        }

        const view = this.document.defaultView;
        if (!view?.fetch || !view.URL || !view.Image) {
            throw new Error('Browser image helpers are unavailable.');
        }

        const response = await view.fetch(trimmedSource, { credentials: 'omit', cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Unable to fetch image for tracing: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = view.URL.createObjectURL(blob);
        try {
            const image = await this.loadImage(objectUrl, view.Image);
            return {
                image,
                sourceWidth: image.naturalWidth,
                sourceHeight: image.naturalHeight,
                dispose: () => view.URL.revokeObjectURL(objectUrl)
            };
        }
        catch (error) {
            view.URL.revokeObjectURL(objectUrl);
            throw error;
        }
    }

    private isCrossOriginSource(source: string): boolean {
        if (!isPlatformBrowser(this.platformId) || source.startsWith('data:') || source.startsWith('blob:')) {
            return false;
        }

        try {
            const view = this.document.defaultView;
            if (!view?.location) {
                return false;
            }

            const sourceUrl = new URL(source, view.location.href);
            return sourceUrl.origin !== view.location.origin;
        }
        catch {
            return false;
        }
    }

    private loadImage(source: string, ImageCtor: typeof Image): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new ImageCtor();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Unable to load tracing image: ${source}`));
            image.src = source;
        });
    }
}
