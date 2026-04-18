# Image Tracing V2 Specification

## Overview

V2 standardizes bitmap tracing on the built-in internal tracing engine and removes the legacy ImageTracerJS path entirely.

Tracing still produces SVG text first and then hands that SVG into the existing import flow, so downstream behavior remains the same: users can import into the current model, decompose into elements, or save the traced result as a new model.

## Goals

- Use a single built-in tracing engine implemented in TypeScript inside the project.
- Remove the ImageTracerJS dependency, modal, service, and engine-selection UI.
- Preserve the existing SVG-based import pipeline so tracing stays compatible with current model import behavior.
- Improve trace fidelity for flat artwork and stylized photo tracing while supporting up to 256 colors.

## Non-Goals

- Producing native Elise model output directly.
- WASM acceleration.

## Architecture

### Trace Flow

```
User clicks "Trace Image"
              │
              ▼
  ┌──────────────────────┐
  │ Internal Trace Modal │
  └──────────┬───────────┘
                         │
                         ▼
     ┌────────────────────────────┐
     │ Internal Trace Web Worker  │
     │ quantize, trace, fit paths │
     └─────────────┬──────────────┘
                   │
                   ▼
                 SVG text
                         │
                         ▼
  ┌────────────────────────┐
  │ openSvgActionModal()   │
  │ → existing SVG import  │
  └────────────────────────┘
```

### Files

| File | Purpose |
|------|---------|
| `src/app/services/internal-image-tracing-engine.ts` | Shared pure tracing engine used by both the app service and the worker |
| `src/app/services/internal-image-tracing.worker.ts` | Web Worker host for CPU-heavy tracing stages |
| `src/app/services/internal-image-tracing.service.ts` | Internal tracing engine service |
| `src/app/components/internal-trace-image-modal/` | Trace dialog for the internal engine |
| `src/app/components/model-designer/model-designer.component.ts` | Routes all trace requests directly to the internal trace modal |

## Internal Tracing Engine

The internal tracer now runs its heavy processing stages inside a dedicated Web Worker. The main thread still loads the source image and prepares raster input, but quantization, contour extraction, and curve fitting execute off the UI thread so progress updates remain live while tracing is in flight.

### Algorithm Pipeline

1. **Image Loading & Scaling** — Cross-origin-safe loading with preset-specific maximum long edge.
2. **Selective Gaussian Blur** — Edge-preserving blur smooths noisy regions without washing out strong boundaries.
3. **K-Means Color Quantization** — Deterministic palette seeding plus iterative refinement using rectilinear RGBA distance.
4. **Layer Separation** — Each palette color becomes its own indexed layer.
5. **Edge Node Encoding** — A 4-bit local neighborhood encoding marks contour transitions.
6. **Table-Driven Path Scan** — Encoded edge nodes are walked into closed paths.
7. **Sub-Pixel Interpolation** — Midpoint interpolation smooths traced geometry before fitting.
8. **Right-Angle Enhancement** — Preserves boxy geometry where appropriate.
9. **Recursive Curve Fitting** — Attempts line fitting first, then quadratic Bézier fitting, then recursively splits on max-error points.
10. **SVG Generation** — Emits filled compound paths with even-odd winding for holes.

### Presets

| Preset | Default Colors | Allowed Colors | Detail | Corner° | Despeckle |
|--------|----------------|----------------|--------|---------|-----------|
| Black & White | 2 | 2–8 | Medium | 60 | 8 |
| Logo | 8 | 2–64 | Medium | 55 | 4 |
| Detailed | 24 | 4–128 | Medium | 50 | 2 |
| Poster | 32 | 6–256 | Medium | 45 | 3 |
| Photo | 64 | 8–256 | Medium | 40 | 4 |
| High Resolution Photo | 256 | 16–256 | Very High | 32 | 1 |

### Advanced Controls

| Control | Range | Description |
|---------|-------|-------------|
| Number of Colors | 2–256 (preset constrained) | Palette size for quantization |
| Detail Level | Low / Medium / High / Very High | Adjusts fitting thresholds and path omission |
| Corner Threshold | 10–90° | Controls how aggressively corners are preserved |
| Despeckle Size | 0–50 | Removes tiny traced regions |
| Curve Fitting | Quadratic Curves / Straight Lines | Switches between smoothed curves and polygonal output |

The modal remembers the most recently used trace settings in browser storage and restores them the next time tracing is opened.

## Internal Trace Modal

The modal contains:

- Source image preview and traced preview
- Preset selector with descriptive text
- Expandable advanced options
- Live tracing progress fed from the Web Worker during heavy processing
- Trace preview, continue, and cancel actions
- Traced dimensions, shape count, and color count summary

The modal title is **"Trace Image (Internal Tracer)"**.

## Integration With Model Designer

`imageActionTrace()` in `ModelDesignerComponent` now lazy-loads only `InternalTraceImageModalComponent`.

On success, the modal returns SVG text and a traced path, and `openSvgActionModal()` continues the existing import flow unchanged.

`importLocalTraceImageAtPoint()` inherits the same behavior because it delegates to `imageActionTrace()`.

## Acceptance Criteria

- Clicking "Trace Image" opens the internal trace modal directly.
- No engine-selection prompt is shown.
- No ImageTracerJS service, modal, or package dependency remains in the app.
- The internal tracer supports up to 256 colors where preset limits allow it.
- A high-resolution photo preset is available with 256 colors and very high detail defaults.
- Heavy tracing stages execute in a Web Worker so progress updates stay live while tracing runs.
- Traced SVG output still routes through the existing vector import flow.
- Importing traced results into the current model still works.
- Saving traced results as a new model still works.
- All presets are selectable and produce visibly different output.
- Advanced options change the trace result when re-run.
- The most recently selected trace options are restored when the trace modal is opened again.
- The build produces zero errors.

## Future Considerations

- **Direct Elise Model Generation** — Bypass SVG parsing and emit Elise paths directly.
- **Web Worker Offloading** — Move heavy tracing stages off the UI thread.
- **WASM Acceleration** — Optimize the hottest tracing stages if needed.
- **Cubic Curve Fitting** — Improve smoothness over the current quadratic fitting approach.
