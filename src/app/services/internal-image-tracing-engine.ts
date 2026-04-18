export type InternalTracePresetId = 'bw' | 'logo' | 'detailed' | 'poster' | 'photo' | 'highres-photo';

export type InternalTraceDetailLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface InternalTraceOptions {
    presetId: InternalTracePresetId;
    numberOfColors: number;
    detailLevel: InternalTraceDetailLevel;
    cornerThreshold: number;
    despeckleSize: number;
    curveFitting: boolean;
}

export interface InternalTracePresetDefinition {
    id: InternalTracePresetId;
    label: string;
    description: string;
    defaults: InternalTraceOptions;
}

export interface InternalTraceResult {
    svgText: string;
    presetId: InternalTracePresetId;
    sourceWidth: number;
    sourceHeight: number;
    tracedWidth: number;
    tracedHeight: number;
    estimatedComplexity: number;
    colorCount: number;
}

export interface InternalTraceProgress {
    stage: string;
    progress: number;
}

export interface TraceRaster {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

export interface InternalTraceRequest {
    sourceWidth: number;
    sourceHeight: number;
    tracedWidth: number;
    tracedHeight: number;
    raster: TraceRaster;
    options: InternalTraceOptions;
}

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface IndexedImage {
    array: number[][];
    palette: RGBA[];
}

interface PathPoint {
    x: number;
    y: number;
    t: number;
}

interface InterpolatedPoint {
    x: number;
    y: number;
    linesegment: number;
}

interface ScannedPath {
    points: PathPoint[];
    boundingbox: number[];
    holechildren: number[];
    isholepath: boolean;
}

interface InterpolatedPath {
    points: InterpolatedPoint[];
    boundingbox: number[];
    holechildren: number[];
    isholepath: boolean;
}

interface Segment {
    type: 'L' | 'Q';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3?: number;
    y3?: number;
}

interface TracedShape {
    segments: Segment[];
    boundingbox: number[];
    holechildren: number[];
    isholepath: boolean;
}

const INTERNAL_PRESETS: Record<InternalTracePresetId, {
    colors: number;
    maxLongEdge: number;
    blurRadius: number;
    blurDelta: number;
    ltres: number;
    qtres: number;
    pathomit: number;
    rightangleenhance: boolean;
    colorquantcycles: number;
}> = {
    'bw': {
        colors: 2,
        maxLongEdge: 2000,
        blurRadius: 0,
        blurDelta: 0,
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        rightangleenhance: true,
        colorquantcycles: 3
    },
    'logo': {
        colors: 8,
        maxLongEdge: 1600,
        blurRadius: 0,
        blurDelta: 20,
        ltres: 1,
        qtres: 1,
        pathomit: 4,
        rightangleenhance: true,
        colorquantcycles: 3
    },
    'detailed': {
        colors: 24,
        maxLongEdge: 1600,
        blurRadius: 2,
        blurDelta: 20,
        ltres: 1,
        qtres: 1,
        pathomit: 4,
        rightangleenhance: true,
        colorquantcycles: 3
    },
    'poster': {
        colors: 32,
        maxLongEdge: 1200,
        blurRadius: 4,
        blurDelta: 40,
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        rightangleenhance: true,
        colorquantcycles: 3
    },
    'photo': {
        colors: 64,
        maxLongEdge: 1000,
        blurRadius: 4,
        blurDelta: 60,
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        rightangleenhance: false,
        colorquantcycles: 5
    },
    'highres-photo': {
        colors: 256,
        maxLongEdge: 2200,
        blurRadius: 2,
        blurDelta: 24,
        ltres: 0.6,
        qtres: 0.6,
        pathomit: 1,
        rightangleenhance: false,
        colorquantcycles: 6
    }
};

const INTERNAL_PRESET_LIMITS: Record<InternalTracePresetId, { minColors: number; maxColors: number }> = {
    'bw': { minColors: 2, maxColors: 8 },
    'logo': { minColors: 2, maxColors: 64 },
    'detailed': { minColors: 4, maxColors: 128 },
    'poster': { minColors: 6, maxColors: 256 },
    'photo': { minColors: 8, maxColors: 256 },
    'highres-photo': { minColors: 16, maxColors: 256 }
};

export const DEFAULT_TRACE_PRESET_ID: InternalTracePresetId = 'logo';

const PRESET_DEFINITIONS: InternalTracePresetDefinition[] = [
    {
        id: 'bw',
        label: 'Black & White',
        description: 'Two-tone tracing for line art, signatures, and monochrome graphics.',
        defaults: { presetId: 'bw', numberOfColors: 2, detailLevel: 'medium', cornerThreshold: 60, despeckleSize: 8, curveFitting: false }
    },
    {
        id: 'logo',
        label: 'Logo',
        description: 'Clean tracing for simple logos, icons, and flat artwork.',
        defaults: { presetId: 'logo', numberOfColors: 8, detailLevel: 'medium', cornerThreshold: 55, despeckleSize: 4, curveFitting: true }
    },
    {
        id: 'detailed',
        label: 'Detailed',
        description: 'Higher fidelity for multicolor illustrations and badges.',
        defaults: { presetId: 'detailed', numberOfColors: 24, detailLevel: 'medium', cornerThreshold: 50, despeckleSize: 2, curveFitting: true }
    },
    {
        id: 'poster',
        label: 'Poster',
        description: 'Posterized vector art with moderate color and smoothing.',
        defaults: { presetId: 'poster', numberOfColors: 32, detailLevel: 'medium', cornerThreshold: 45, despeckleSize: 3, curveFitting: true }
    },
    {
        id: 'photo',
        label: 'Photo',
        description: 'High color-count stylized tracing for photographic images.',
        defaults: { presetId: 'photo', numberOfColors: 64, detailLevel: 'medium', cornerThreshold: 40, despeckleSize: 4, curveFitting: true }
    },
    {
        id: 'highres-photo',
        label: 'High Resolution Photo',
        description: 'Maximum-fidelity photo tracing for larger images with 256 colors and very high detail.',
        defaults: { presetId: 'highres-photo', numberOfColors: 256, detailLevel: 'very-high', cornerThreshold: 32, despeckleSize: 1, curveFitting: true }
    }
];

const GAUSSIAN_KERNELS = [
    [0.27901, 0.44198, 0.27901],
    [0.135336, 0.228569, 0.272192, 0.228569, 0.135336],
    [0.086776, 0.136394, 0.178908, 0.195843, 0.178908, 0.136394, 0.086776],
    [0.063327, 0.093095, 0.122589, 0.144599, 0.152781, 0.144599, 0.122589, 0.093095, 0.063327],
    [0.049692, 0.069304, 0.089767, 0.107988, 0.120651, 0.125194, 0.120651, 0.107988, 0.089767, 0.069304, 0.049692]
];

const PATHSCAN_LOOKUP: number[][][] = [
    [[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]],
    [[0, 1, 0, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [0, 2, -1, 0]],
    [[-1, -1, -1, -1], [-1, -1, -1, -1], [0, 1, 0, -1], [0, 0, 1, 0]],
    [[0, 0, 1, 0], [-1, -1, -1, -1], [0, 2, -1, 0], [-1, -1, -1, -1]],
    [[-1, -1, -1, -1], [0, 0, 1, 0], [0, 3, 0, 1], [-1, -1, -1, -1]],
    [[13, 3, 0, 1], [13, 2, -1, 0], [7, 1, 0, -1], [7, 0, 1, 0]],
    [[-1, -1, -1, -1], [0, 1, 0, -1], [-1, -1, -1, -1], [0, 3, 0, 1]],
    [[0, 3, 0, 1], [0, 2, -1, 0], [-1, -1, -1, -1], [-1, -1, -1, -1]],
    [[0, 3, 0, 1], [0, 2, -1, 0], [-1, -1, -1, -1], [-1, -1, -1, -1]],
    [[-1, -1, -1, -1], [0, 1, 0, -1], [-1, -1, -1, -1], [0, 3, 0, 1]],
    [[11, 1, 0, -1], [14, 0, 1, 0], [14, 3, 0, 1], [11, 2, -1, 0]],
    [[-1, -1, -1, -1], [0, 0, 1, 0], [0, 3, 0, 1], [-1, -1, -1, -1]],
    [[0, 0, 1, 0], [-1, -1, -1, -1], [0, 2, -1, 0], [-1, -1, -1, -1]],
    [[-1, -1, -1, -1], [-1, -1, -1, -1], [0, 1, 0, -1], [0, 0, 1, 0]],
    [[0, 1, 0, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [0, 2, -1, 0]],
    [[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]]
];

type ProgressHandler = (progress: InternalTraceProgress) => void;

export function getInternalTracePresetDefinitions(): InternalTracePresetDefinition[] {
    return PRESET_DEFINITIONS.map((preset) => ({
        ...preset,
        defaults: { ...preset.defaults }
    }));
}

export function getInternalTraceDefaultOptions(presetId: InternalTracePresetId = DEFAULT_TRACE_PRESET_ID): InternalTraceOptions {
    const preset = PRESET_DEFINITIONS.find((value) => value.id === presetId) ?? PRESET_DEFINITIONS[1];
    return { ...preset.defaults };
}

export function getInternalTraceMaxLongEdge(presetId: InternalTracePresetId): number {
    return INTERNAL_PRESETS[presetId].maxLongEdge;
}

export function normalizeInternalTraceOptions(options?: Partial<InternalTraceOptions> | null): InternalTraceOptions {
    const presetId = isPresetId(options?.presetId) ? options.presetId : DEFAULT_TRACE_PRESET_ID;
    const defaults = getInternalTraceDefaultOptions(presetId);
    const limits = INTERNAL_PRESET_LIMITS[presetId];

    return {
        presetId,
        numberOfColors: normalizeInteger(options?.numberOfColors, defaults.numberOfColors, limits.minColors, limits.maxColors),
        detailLevel: isDetailLevel(options?.detailLevel) ? options.detailLevel : defaults.detailLevel,
        cornerThreshold: normalizeInteger(options?.cornerThreshold, defaults.cornerThreshold, 10, 90),
        despeckleSize: normalizeInteger(options?.despeckleSize, defaults.despeckleSize, 0, 50),
        curveFitting: typeof options?.curveFitting === 'boolean' ? options.curveFitting : defaults.curveFitting
    };
}

export function traceInternalRaster(request: InternalTraceRequest, onProgress?: ProgressHandler): InternalTraceResult {
    const emit = createProgressEmitter(onProgress);
    const options = normalizeInternalTraceOptions(request.options);
    const presetConfig = INTERNAL_PRESETS[options.presetId];
    const limits = INTERNAL_PRESET_LIMITS[options.presetId];
    const numColors = clamp(options.numberOfColors, limits.minColors, limits.maxColors);
    const detailMultiplier = getDetailMultiplier(options.detailLevel);
    const ltres = presetConfig.ltres * detailMultiplier;
    const qtres = presetConfig.qtres * detailMultiplier;
    const pathomit = Math.max(1, Math.round(Math.max(presetConfig.pathomit, options.despeckleSize) * detailMultiplier));
    const useCurves = options.curveFitting ?? true;

    emit('Preparing image', 8);

    const blurred = presetConfig.blurRadius > 0
        ? selectiveBlur(request.raster, presetConfig.blurRadius, presetConfig.blurDelta, (fraction) => {
            emit('Smoothing source pixels', 8 + fraction * 18);
        })
        : request.raster;

    emit('Quantizing colors', 28);
    const indexed = colorQuantization(blurred, numColors, presetConfig.colorquantcycles, (fraction) => {
        emit('Quantizing colors', 28 + fraction * 28);
    });

    emit('Tracing vector paths', 56);
    const svgText = traceAndBuildSvg(
        indexed,
        request.tracedWidth,
        request.tracedHeight,
        ltres,
        qtres,
        pathomit,
        presetConfig.rightangleenhance,
        useCurves,
        (fraction) => {
            emit('Tracing vector paths', 56 + fraction * 40);
        }
    );

    emit('Rendering preview', 97);
    emit('Trace complete', 100);

    return {
        svgText,
        presetId: options.presetId,
        sourceWidth: request.sourceWidth,
        sourceHeight: request.sourceHeight,
        tracedWidth: request.tracedWidth,
        tracedHeight: request.tracedHeight,
        estimatedComplexity: (svgText.match(/<path\b/gi) ?? []).length,
        colorCount: indexed.palette.length
    };
}

function selectiveBlur(imgd: TraceRaster, radius: number, delta: number, onProgress?: (fraction: number) => void): TraceRaster {
    radius = Math.min(5, Math.max(1, Math.floor(radius)));
    delta = Math.min(1024, Math.abs(delta));
    const kernel = GAUSSIAN_KERNELS[radius - 1];
    const w = imgd.width;
    const h = imgd.height;
    const src = imgd.data;
    const totalRows = Math.max(1, h * 3);
    let processedRows = 0;
    const hblurred = new Float64Array(w * h * 4);

    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            let racc = 0, gacc = 0, bacc = 0, aacc = 0, wacc = 0;
            for (let k = -radius; k <= radius; k++) {
                const ii = i + k;
                if (ii >= 0 && ii < w) {
                    const idx = (j * w + ii) * 4;
                    const weight = kernel[k + radius];
                    racc += src[idx] * weight;
                    gacc += src[idx + 1] * weight;
                    bacc += src[idx + 2] * weight;
                    aacc += src[idx + 3] * weight;
                    wacc += weight;
                }
            }
            const idx = (j * w + i) * 4;
            hblurred[idx] = racc / wacc;
            hblurred[idx + 1] = gacc / wacc;
            hblurred[idx + 2] = bacc / wacc;
            hblurred[idx + 3] = aacc / wacc;
        }
        processedRows++;
        reportFraction(onProgress, processedRows, totalRows, h);
    }

    const fullblurred = new Float64Array(w * h * 4);
    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            let racc = 0, gacc = 0, bacc = 0, aacc = 0, wacc = 0;
            for (let k = -radius; k <= radius; k++) {
                const jj = j + k;
                if (jj >= 0 && jj < h) {
                    const idx = (jj * w + i) * 4;
                    const weight = kernel[k + radius];
                    racc += hblurred[idx] * weight;
                    gacc += hblurred[idx + 1] * weight;
                    bacc += hblurred[idx + 2] * weight;
                    aacc += hblurred[idx + 3] * weight;
                    wacc += weight;
                }
            }
            const idx = (j * w + i) * 4;
            fullblurred[idx] = racc / wacc;
            fullblurred[idx + 1] = gacc / wacc;
            fullblurred[idx + 2] = bacc / wacc;
            fullblurred[idx + 3] = aacc / wacc;
        }
        processedRows++;
        reportFraction(onProgress, processedRows, totalRows, h);
    }

    const result = new Uint8ClampedArray(src.length);
    for (let i = 0; i < src.length; i += 4) {
        const d = Math.abs(fullblurred[i] - src[i]) +
                  Math.abs(fullblurred[i + 1] - src[i + 1]) +
                  Math.abs(fullblurred[i + 2] - src[i + 2]) +
                  Math.abs(fullblurred[i + 3] - src[i + 3]);
        if (d > delta) {
            result[i] = src[i];
            result[i + 1] = src[i + 1];
            result[i + 2] = src[i + 2];
            result[i + 3] = src[i + 3];
        } else {
            result[i] = Math.floor(fullblurred[i]);
            result[i + 1] = Math.floor(fullblurred[i + 1]);
            result[i + 2] = Math.floor(fullblurred[i + 2]);
            result[i + 3] = Math.floor(fullblurred[i + 3]);
        }
    }
    reportFraction(onProgress, totalRows, totalRows, 1);

    return {
        width: w,
        height: h,
        data: result
    };
}

function colorQuantization(imgd: TraceRaster, numColors: number, cycles: number, onProgress?: (fraction: number) => void): IndexedImage {
    const w = imgd.width;
    const h = imgd.height;
    const data = imgd.data;
    let palette = sampleInitialPalette(imgd, numColors);
    const arr: number[][] = [];
    for (let j = 0; j < h + 2; j++) {
        arr[j] = new Array(w + 2).fill(-1);
    }

    const totalRows = Math.max(1, cycles * h);
    let processedRows = 0;

    for (let cycle = 0; cycle < cycles; cycle++) {
        const acc = palette.map(() => ({ r: 0, g: 0, b: 0, a: 0, n: 0 }));

        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                const idx = (j * w + i) * 4;
                const pr = data[idx];
                const pg = data[idx + 1];
                const pb = data[idx + 2];
                const pa = data[idx + 3];

                let bestK = 0;
                let bestDist = 1024;
                for (let k = 0; k < palette.length; k++) {
                    const dist = Math.abs(palette[k].r - pr) +
                        Math.abs(palette[k].g - pg) +
                        Math.abs(palette[k].b - pb) +
                        Math.abs(palette[k].a - pa);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestK = k;
                    }
                }

                acc[bestK].r += pr;
                acc[bestK].g += pg;
                acc[bestK].b += pb;
                acc[bestK].a += pa;
                acc[bestK].n++;
                arr[j + 1][i + 1] = bestK;
            }

            processedRows++;
            reportFraction(onProgress, processedRows, totalRows, h);
        }

        if (cycle < cycles - 1) {
            for (let k = 0; k < palette.length; k++) {
                if (acc[k].n > 0) {
                    palette[k] = {
                        r: Math.floor(acc[k].r / acc[k].n),
                        g: Math.floor(acc[k].g / acc[k].n),
                        b: Math.floor(acc[k].b / acc[k].n),
                        a: Math.floor(acc[k].a / acc[k].n)
                    };
                } else if (cycle < cycles - 2) {
                    palette[k] = {
                        r: Math.floor(Math.random() * 255),
                        g: Math.floor(Math.random() * 255),
                        b: Math.floor(Math.random() * 255),
                        a: 255
                    };
                }
            }
        }
    }

    const colorCounts = new Int32Array(palette.length);
    for (let j = 1; j <= h; j++) {
        for (let i = 1; i <= w; i++) {
            if (arr[j][i] >= 0) {
                colorCounts[arr[j][i]]++;
            }
        }
    }

    const indexMap = new Int32Array(palette.length).fill(-1);
    const newPalette: RGBA[] = [];
    for (let k = 0; k < palette.length; k++) {
        if (colorCounts[k] > 0) {
            indexMap[k] = newPalette.length;
            newPalette.push(palette[k]);
        }
    }

    if (newPalette.length < palette.length) {
        for (let j = 1; j <= h; j++) {
            for (let i = 1; i <= w; i++) {
                if (arr[j][i] >= 0) {
                    arr[j][i] = indexMap[arr[j][i]];
                }
            }
        }
        palette = newPalette;
    }

    return { array: arr, palette };
}

function sampleInitialPalette(imgd: TraceRaster, numColors: number): RGBA[] {
    const palette: RGBA[] = [];
    const ni = Math.ceil(Math.sqrt(numColors));
    const nj = Math.ceil(numColors / ni);
    const vx = imgd.width / (ni + 1);
    const vy = imgd.height / (nj + 1);
    for (let j = 0; j < nj; j++) {
        for (let i = 0; i < ni; i++) {
            if (palette.length >= numColors) {
                break;
            }
            const idx = Math.floor(((j + 1) * vy) * imgd.width + ((i + 1) * vx)) * 4;
            if (idx + 3 < imgd.data.length) {
                palette.push({
                    r: imgd.data[idx],
                    g: imgd.data[idx + 1],
                    b: imgd.data[idx + 2],
                    a: imgd.data[idx + 3]
                });
            }
        }
    }
    while (palette.length < numColors) {
        const idx = Math.floor(Math.random() * imgd.data.length / 4) * 4;
        palette.push({
            r: imgd.data[idx],
            g: imgd.data[idx + 1],
            b: imgd.data[idx + 2],
            a: imgd.data[idx + 3]
        });
    }
    return palette;
}

function layeringstep(ii: IndexedImage, colorNum: number): number[][] {
    const ah = ii.array.length;
    const aw = ii.array[0].length;
    const layer: number[][] = [];
    for (let j = 0; j < ah; j++) {
        layer[j] = new Array(aw).fill(0);
    }

    for (let j = 1; j < ah; j++) {
        for (let i = 1; i < aw; i++) {
            layer[j][i] =
                (ii.array[j - 1][i - 1] === colorNum ? 1 : 0) +
                (ii.array[j - 1][i] === colorNum ? 2 : 0) +
                (ii.array[j][i - 1] === colorNum ? 8 : 0) +
                (ii.array[j][i] === colorNum ? 4 : 0);
        }
    }

    return layer;
}

function pathscan(layer: number[][], pathomit: number): ScannedPath[] {
    const h = layer.length;
    const w = layer[0].length;
    const paths: ScannedPath[] = [];

    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            if (layer[j][i] !== 4 && layer[j][i] !== 11) {
                continue;
            }

            let px = i;
            let py = j;
            const path: ScannedPath = {
                points: [],
                boundingbox: [px, py, px, py],
                holechildren: [],
                isholepath: layer[j][i] === 11
            };
            let dir = 1;
            let pathfinished = false;

            while (!pathfinished) {
                path.points.push({ x: px - 1, y: py - 1, t: layer[py][px] });

                if (px - 1 < path.boundingbox[0]) { path.boundingbox[0] = px - 1; }
                if (px - 1 > path.boundingbox[2]) { path.boundingbox[2] = px - 1; }
                if (py - 1 < path.boundingbox[1]) { path.boundingbox[1] = py - 1; }
                if (py - 1 > path.boundingbox[3]) { path.boundingbox[3] = py - 1; }

                const lookuprow = PATHSCAN_LOOKUP[layer[py][px]][dir];
                layer[py][px] = lookuprow[0];
                dir = lookuprow[1];
                px += lookuprow[2];
                py += lookuprow[3];

                if (px - 1 === path.points[0].x && py - 1 === path.points[0].y) {
                    pathfinished = true;

                    if (path.points.length < pathomit) {
                        continue;
                    }

                    if (path.isholepath) {
                        let parentIdx = 0;
                        let parentBBox = [-1, -1, w + 1, h + 1];
                        for (let pi = 0; pi < paths.length; pi++) {
                            if (!paths[pi].isholepath &&
                                bboxIncludes(paths[pi].boundingbox, path.boundingbox) &&
                                bboxIncludes(parentBBox, paths[pi].boundingbox) &&
                                pointInPoly(path.points[0], paths[pi].points)) {
                                parentIdx = pi;
                                parentBBox = paths[pi].boundingbox;
                            }
                        }
                        paths[parentIdx].holechildren.push(paths.length);
                    }

                    paths.push(path);
                }
            }
        }
    }

    return paths;
}

function bboxIncludes(parent: number[], child: number[]): boolean {
    return parent[0] < child[0] && parent[1] < child[1] && parent[2] > child[2] && parent[3] > child[3];
}

function pointInPoly(point: { x: number; y: number }, poly: { x: number; y: number }[]): boolean {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        if (((poly[i].y > point.y) !== (poly[j].y > point.y)) &&
            (point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) {
            inside = !inside;
        }
    }
    return inside;
}

function internodes(paths: ScannedPath[], rightangleenhance: boolean): InterpolatedPath[] {
    const result: InterpolatedPath[] = [];
    for (const path of paths) {
        const ipath: InterpolatedPath = {
            points: [],
            boundingbox: path.boundingbox,
            holechildren: path.holechildren,
            isholepath: path.isholepath
        };

        const len = path.points.length;
        for (let i = 0; i < len; i++) {
            const nextIdx = (i + 1) % len;
            const nextIdx2 = (i + 2) % len;
            const prevIdx = (i - 1 + len) % len;
            const prevIdx2 = (i - 2 + len) % len;

            if (rightangleenhance && testRightAngle(path.points, prevIdx2, prevIdx, i, nextIdx, nextIdx2)) {
                if (ipath.points.length > 0) {
                    ipath.points[ipath.points.length - 1].linesegment = getDirection(
                        ipath.points[ipath.points.length - 1].x,
                        ipath.points[ipath.points.length - 1].y,
                        path.points[i].x,
                        path.points[i].y
                    );
                }

                ipath.points.push({
                    x: path.points[i].x,
                    y: path.points[i].y,
                    linesegment: getDirection(
                        path.points[i].x,
                        path.points[i].y,
                        (path.points[i].x + path.points[nextIdx].x) / 2,
                        (path.points[i].y + path.points[nextIdx].y) / 2
                    )
                });
            }

            ipath.points.push({
                x: (path.points[i].x + path.points[nextIdx].x) / 2,
                y: (path.points[i].y + path.points[nextIdx].y) / 2,
                linesegment: getDirection(
                    (path.points[i].x + path.points[nextIdx].x) / 2,
                    (path.points[i].y + path.points[nextIdx].y) / 2,
                    (path.points[nextIdx].x + path.points[nextIdx2].x) / 2,
                    (path.points[nextIdx].y + path.points[nextIdx2].y) / 2
                )
            });
        }

        result.push(ipath);
    }

    return result;
}

function testRightAngle(points: { x: number; y: number }[], i1: number, i2: number, i3: number, i4: number, i5: number): boolean {
    return ((points[i3].x === points[i1].x && points[i3].x === points[i2].x &&
             points[i3].y === points[i4].y && points[i3].y === points[i5].y) ||
            (points[i3].y === points[i1].y && points[i3].y === points[i2].y &&
             points[i3].x === points[i4].x && points[i3].x === points[i5].x));
}

function getDirection(x1: number, y1: number, x2: number, y2: number): number {
    if (x1 < x2) {
        if (y1 < y2) { return 1; }
        if (y1 > y2) { return 7; }
        return 0;
    }
    if (x1 > x2) {
        if (y1 < y2) { return 3; }
        if (y1 > y2) { return 5; }
        return 4;
    }
    if (y1 < y2) { return 2; }
    if (y1 > y2) { return 6; }
    return 8;
}

function tracepath(path: InterpolatedPath, ltres: number, qtres: number): TracedShape {
    const traced: TracedShape = {
        segments: [],
        boundingbox: path.boundingbox,
        holechildren: path.holechildren,
        isholepath: path.isholepath
    };

    let pcnt = 0;
    while (pcnt < path.points.length) {
        const segtype1 = path.points[pcnt].linesegment;
        let segtype2 = -1;
        let seqend = pcnt + 1;

        while (seqend < path.points.length - 1 &&
               (path.points[seqend].linesegment === segtype1 ||
                path.points[seqend].linesegment === segtype2 ||
                segtype2 === -1)) {
            if (path.points[seqend].linesegment !== segtype1 && segtype2 === -1) {
                segtype2 = path.points[seqend].linesegment;
            }
            seqend++;
        }

        if (seqend === path.points.length - 1) {
            seqend = 0;
        }

        traced.segments.push(...fitseq(path, ltres, qtres, pcnt, seqend));
        pcnt = seqend > 0 ? seqend : path.points.length;
    }

    return traced;
}

function fitseq(path: InterpolatedPath, ltres: number, qtres: number, seqstart: number, seqend: number): Segment[] {
    if (seqend > path.points.length || seqend < 0) {
        return [];
    }

    let tl = seqend - seqstart;
    if (tl < 0) {
        tl += path.points.length;
    }
    if (tl === 0) {
        return [];
    }

    const vx = (path.points[seqend].x - path.points[seqstart].x) / tl;
    const vy = (path.points[seqend].y - path.points[seqstart].y) / tl;
    let errorpoint = seqstart;
    let errorval = 0;
    let curvepass = true;
    let pcnt = (seqstart + 1) % path.points.length;

    while (pcnt !== seqend) {
        let pl = pcnt - seqstart;
        if (pl < 0) {
            pl += path.points.length;
        }
        const px = path.points[seqstart].x + vx * pl;
        const py = path.points[seqstart].y + vy * pl;
        const dist2 = (path.points[pcnt].x - px) ** 2 + (path.points[pcnt].y - py) ** 2;
        if (dist2 > ltres) {
            curvepass = false;
        }
        if (dist2 > errorval) {
            errorpoint = pcnt;
            errorval = dist2;
        }
        pcnt = (pcnt + 1) % path.points.length;
    }

    if (curvepass) {
        return [{
            type: 'L',
            x1: path.points[seqstart].x,
            y1: path.points[seqstart].y,
            x2: path.points[seqend].x,
            y2: path.points[seqend].y
        }];
    }

    const fitpoint = errorpoint;
    curvepass = true;
    errorval = 0;
    let ftl = fitpoint - seqstart;
    if (ftl < 0) {
        ftl += path.points.length;
    }

    const t = ftl / tl;
    const t1sq = (1 - t) * (1 - t);
    const t2dbl = 2 * (1 - t) * t;
    const t3sq = t * t;
    const cpx = (t1sq * path.points[seqstart].x + t3sq * path.points[seqend].x - path.points[fitpoint].x) / -t2dbl;
    const cpy = (t1sq * path.points[seqstart].y + t3sq * path.points[seqend].y - path.points[fitpoint].y) / -t2dbl;

    pcnt = (seqstart + 1) % path.points.length;
    while (pcnt !== seqend) {
        let pl = pcnt - seqstart;
        if (pl < 0) {
            pl += path.points.length;
        }
        const ct = pl / tl;
        const ct1 = (1 - ct) * (1 - ct);
        const ct2 = 2 * (1 - ct) * ct;
        const ct3 = ct * ct;
        const px = ct1 * path.points[seqstart].x + ct2 * cpx + ct3 * path.points[seqend].x;
        const py = ct1 * path.points[seqstart].y + ct2 * cpy + ct3 * path.points[seqend].y;
        const dist2 = (path.points[pcnt].x - px) ** 2 + (path.points[pcnt].y - py) ** 2;
        if (dist2 > qtres) {
            curvepass = false;
        }
        if (dist2 > errorval) {
            errorpoint = pcnt;
            errorval = dist2;
        }
        pcnt = (pcnt + 1) % path.points.length;
    }

    if (curvepass) {
        return [{
            type: 'Q',
            x1: path.points[seqstart].x,
            y1: path.points[seqstart].y,
            x2: cpx,
            y2: cpy,
            x3: path.points[seqend].x,
            y3: path.points[seqend].y
        }];
    }

    const splitpoint = fitpoint;
    return [
        ...fitseq(path, ltres, qtres, seqstart, splitpoint),
        ...fitseq(path, ltres, qtres, splitpoint, seqend)
    ];
}

function traceAndBuildSvg(
    ii: IndexedImage,
    width: number,
    height: number,
    ltres: number,
    qtres: number,
    pathomit: number,
    rightangleenhance: boolean,
    useCurves: boolean,
    onProgress?: (fraction: number) => void
): string {
    const svgPaths: string[] = [];
    const totalColors = Math.max(1, ii.palette.length);

    for (let colorNum = 0; colorNum < ii.palette.length; colorNum++) {
        const layer = layeringstep(ii, colorNum);
        const scannedPaths = pathscan(layer, pathomit);
        if (scannedPaths.length > 0) {
            const interpolated = internodes(scannedPaths, rightangleenhance);
            const tracedShapes = interpolated.map((path) => useCurves ? tracepath(path, ltres, qtres) : traceLineOnly(path));
            const fill = rgbaToHex(ii.palette[colorNum]);

            for (let shapeIndex = 0; shapeIndex < tracedShapes.length; shapeIndex++) {
                const shape = tracedShapes[shapeIndex];
                if (shape.isholepath || shape.segments.length < 2) {
                    continue;
                }

                let d = segmentsToPathData(shape.segments);
                for (const holeIdx of shape.holechildren) {
                    if (holeIdx < tracedShapes.length) {
                        const holePath = segmentsToPathData(tracedShapes[holeIdx].segments);
                        if (holePath) {
                            d += ` ${holePath}`;
                        }
                    }
                }

                if (d) {
                    svgPaths.push(`<path d="${d}" fill="${fill}" stroke="none" fill-rule="evenodd"/>`);
                }
            }
        }

        reportFraction(onProgress, colorNum + 1, totalColors, totalColors);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n${svgPaths.join('\n')}\n</svg>`;
}

function traceLineOnly(path: InterpolatedPath): TracedShape {
    const segments: Segment[] = [];
    for (let i = 0; i < path.points.length; i++) {
        const next = (i + 1) % path.points.length;
        segments.push({
            type: 'L',
            x1: path.points[i].x,
            y1: path.points[i].y,
            x2: path.points[next].x,
            y2: path.points[next].y
        });
    }
    return {
        segments,
        boundingbox: path.boundingbox,
        holechildren: path.holechildren,
        isholepath: path.isholepath
    };
}

function segmentsToPathData(segments: Segment[]): string {
    if (segments.length === 0) {
        return '';
    }
    let d = `M${roundCoord(segments[0].x1)} ${roundCoord(segments[0].y1)}`;
    for (const segment of segments) {
        if (segment.type === 'L') {
            d += ` L${roundCoord(segment.x2)} ${roundCoord(segment.y2)}`;
        } else {
            d += ` Q${roundCoord(segment.x2)} ${roundCoord(segment.y2)} ${roundCoord(segment.x3 ?? 0)} ${roundCoord(segment.y3 ?? 0)}`;
        }
    }
    d += ' Z';
    return d;
}

function rgbaToHex(color: RGBA): string {
    return `#${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
}

function hex(value: number): string {
    return value.toString(16).padStart(2, '0');
}

function roundCoord(value: number): number {
    return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, Math.round(value)));
}

function getDetailMultiplier(level: InternalTraceDetailLevel): number {
    switch (level) {
        case 'low':
            return 1.5;
        case 'high':
            return 0.5;
        case 'very-high':
            return 0.35;
        default:
            return 1.0;
    }
}

function normalizeInteger(value: unknown, fallback: number, min: number, max: number): number {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallback;
    }
    return clamp(numericValue, min, max);
}

function isPresetId(value: unknown): value is InternalTracePresetId {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(INTERNAL_PRESET_LIMITS, value);
}

function isDetailLevel(value: unknown): value is InternalTraceDetailLevel {
    return value === 'low' || value === 'medium' || value === 'high' || value === 'very-high';
}

function createProgressEmitter(onProgress?: ProgressHandler) {
    let lastStage = '';
    let lastProgress = -1;
    return (stage: string, progress: number) => {
        if (!onProgress) {
            return;
        }
        const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)));
        if (normalizedProgress === lastProgress && stage === lastStage) {
            return;
        }
        lastStage = stage;
        lastProgress = normalizedProgress;
        onProgress({ stage, progress: normalizedProgress });
    };
}

function reportFraction(onProgress: ((fraction: number) => void) | undefined, current: number, total: number, intervalBase: number) {
    if (!onProgress) {
        return;
    }
    const safeTotal = Math.max(1, total);
    const interval = Math.max(1, Math.floor(intervalBase / 24));
    if (current < safeTotal && current % interval !== 0) {
        return;
    }
    onProgress(Math.max(0, Math.min(1, current / safeTotal)));
}
