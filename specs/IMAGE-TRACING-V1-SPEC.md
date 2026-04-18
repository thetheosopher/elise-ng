# Image Tracing V1 Specification (Historical)

> Status: Superseded by V2. The current product direction uses the built-in internal tracing engine documented in `specs/IMAGE-TRACING-V2-SPEC.md`. This document is retained as historical design context for the original ImageTracerJS-based release plan only.

## Overview

This specification defined an earlier first-release plan for bitmap image tracing in the Elise Angular model designer using ImageTracerJS as the tracing engine.

It no longer reflects the current implementation. The ImageTracerJS-based path has been removed from the application and replaced by the internal tracing engine described in `specs/IMAGE-TRACING-V2-SPEC.md`.

The feature allows a user to select a bitmap image, preview a traced vector result, and then reuse the existing vector import workflow to:

- import the traced result into the currently open model
- import it as a model element
- decompose it into editable elements
- save it as a new model in the currently selected container folder

This is a workflow and integration feature, not a custom tracing-engine project. The design intentionally reuses the current image-preview, vector-preview, and new-model save flows already present in the model designer.

## Historical Goals

- Add a user-facing image tracing workflow for bitmap files already supported by the designer.
- Produce strong default results for simple logos, icons, clipart, and flat illustrations.
- Support stylized posterized vector output for photographic images.
- Reuse the existing vector import path instead of creating a separate trace import system.
- Keep the tracing engine behind an app-local adapter so it can be replaced later.
- Ship a practical v1 without a large algorithm R&D effort.

## Historical Non-Goals

- Matching Adobe Illustrator Image Trace quality for photographic images.
- Building a custom internal tracing engine in v1.
- Adding backend tracing services.
- Adding AI segmentation or semantic cleanup.
- Exposing the full raw ImageTracerJS option surface in the first release.
- Replacing existing bitmap image-element import.

## Historical Product Positioning

The feature should be positioned clearly:

- Logos and clipart are expected to trace well.
- Photographs are expected to produce stylized posterized vector art.
- V1 is not intended to promise Illustrator-like high-fidelity photographic tracing.

## Current Architecture Fit

The existing application already has the import building blocks needed for this feature.

Relevant current flows:

- Bitmap file preview and action routing in `ModelDesignerComponent.loadImageActionModal()`.
- Existing bitmap actions in `ImageActionModalComponent`.
- Vector preview and action routing in `ModelDesignerComponent.showVectorActionModal()` and `ModelActionModalComponent`.
- Import-as-new-model naming and save behavior in `showImportVectorAsNewModelModal()`, `getCurrentNewModelFolderPath()`, and `saveNewModelToCurrentFolder()`.

The trace result should be converted to SVG text and then fed into the existing SVG import path rather than introducing another model import pipeline.

## User Stories

### Story 1: Trace Logo To Current Model

As a designer with a model already open,
I want to trace a simple bitmap logo,
so I can import it as editable vector content into my current design.

### Story 2: Trace Artwork As New Model

As a user browsing a container folder,
I want to trace an uploaded bitmap and save it as a new model in that folder,
so I can preserve the traced result as a reusable Elise model asset.

### Story 3: Stylize Photo Into Vector Art

As a user working with a photograph,
I want a small number of presets that turn it into posterized vector art,
so I can experiment quickly without managing dozens of low-level tracing options.

## Supported Inputs

Required v1 input formats:

- `.png`
- `.jpg`
- `.jpeg`
- `.gif`

Required v1 entry point:

- selecting a bitmap file from the current container folder file list

Deferred entry points:

- local bitmap file picker for trace-only import
- direct drag-and-drop tracing on the design surface

## UX Flow

### Flow A: Trace From Container File Selection

1. User selects a bitmap file in the container file list.
2. The existing image action modal opens.
3. The modal includes a new `Trace Image` action.
4. Choosing `Trace Image` opens a dedicated trace modal.
5. The user selects a preset and optionally adjusts limited advanced options.
6. The user previews the traced result.
7. The user confirms the traced result.
8. The traced SVG is routed into the existing vector action modal.
9. The user chooses whether to import into the current model or save as a new model.
10. If saving as a new model, the existing new-model naming modal opens with the image filename as the default model name.

### Flow B: Trace Into Current Open Model

1. A model is open in the designer.
2. The user selects and traces a bitmap file.
3. The vector action modal defaults to importing into the current model.
4. The user can choose:
   - `Import As Model Element`
   - `Decompose Into Elements`

### Flow C: Trace As New Model

1. A container folder is selected and no model is open.
2. The user selects and traces a bitmap file.
3. The vector action modal defaults to `new-model`.
4. The naming modal opens using the original image file name without extension.
5. The traced result is saved through the existing model save pipeline to the current folder.

## UI Requirements

### Image Action Modal

The existing image action modal must gain a new action button:

- `Trace Image`

The current actions must remain available:

- `View`
- `Create Element`
- `Add Resource`

Tracing must be additive, not a replacement.

### Trace Image Modal

Create a dedicated trace modal component.

Required content:

- source image preview
- source dimensions
- trace preset selector
- traced preview area
- busy/loading state while tracing
- summary text describing the current preset behavior
- action buttons for cancel, retrace, and continue

Allowed but intentionally limited advanced options for v1:

- number of colors
- detail level
- smoothing level

The modal must not expose the full raw ImageTracerJS option set in v1.

### User Messaging

Required user guidance:

- Logos and clipart typically trace best.
- Photos produce stylized vector art.
- Large or detailed images may generate complex output that is slower to edit.

## Preset Model

The UI should expose app-level presets rather than library-level option names.

Required presets:

- `Logo`
- `Detailed Logo`
- `Grayscale Photo`
- `Posterized Photo`

These presets should be opinionated defaults that optimize for editability and predictable output.

## Concrete ImageTracerJS Mappings

These mappings define the default implementation contract for v1.

### 1. Logo

Intended for:

- monochrome logos
- icons
- flat artwork with strong boundaries

Behavior targets:

- low palette size
- low noise
- preserved corners
- simpler shapes over tiny artifact retention

Default ImageTracerJS options:

```ts
{
  colorsampling: 0,
  numberofcolors: 2,
  colorquantcycles: 2,
  mincolorratio: 0,
  layering: 0,
  ltres: 0.5,
  qtres: 0.5,
  pathomit: 12,
  rightangleenhance: true,
  linefilter: true,
  blurradius: 0,
  blurdelta: 20,
  strokewidth: 0,
  roundcoords: 1,
  viewbox: false,
  desc: false
}
```

### 2. Detailed Logo

Intended for:

- multicolor marks
- badges
- richer clipart
- flat illustrations with more internal detail

Behavior targets:

- moderate color retention
- more detail than `Logo`
- still bounded enough to remain editable

Default ImageTracerJS options:

```ts
{
  colorsampling: 2,
  numberofcolors: 8,
  colorquantcycles: 3,
  mincolorratio: 0,
  layering: 0,
  ltres: 0.25,
  qtres: 0.25,
  pathomit: 4,
  rightangleenhance: true,
  linefilter: false,
  blurradius: 1,
  blurdelta: 24,
  strokewidth: 0,
  roundcoords: 1,
  viewbox: false,
  desc: false
}
```

### 3. Grayscale Photo

Intended for:

- portraits
- grayscale photography
- photo-derived stylized art with limited tonal bands

Behavior targets:

- limited grayscale palette
- moderate smoothing
- reduced path noise
- recognizable tonal posterization

Default ImageTracerJS options:

```ts
{
  colorsampling: 0,
  numberofcolors: 7,
  colorquantcycles: 2,
  mincolorratio: 0,
  layering: 0,
  ltres: 1.5,
  qtres: 1.5,
  pathomit: 10,
  rightangleenhance: false,
  linefilter: true,
  blurradius: 3,
  blurdelta: 48,
  strokewidth: 0,
  roundcoords: 1,
  viewbox: false,
  desc: false
}
```

### 4. Posterized Photo

Intended for:

- color photographs
- stylized hero-image treatments
- illustrative photo-to-vector transformations

Behavior targets:

- bounded color palette
- strong smoothing and flattening
- explicit tradeoff toward lower complexity

Default ImageTracerJS options:

```ts
{
  colorsampling: 2,
  numberofcolors: 12,
  colorquantcycles: 2,
  mincolorratio: 0,
  layering: 0,
  ltres: 2.5,
  qtres: 2.5,
  pathomit: 16,
  rightangleenhance: false,
  linefilter: true,
  blurradius: 4,
  blurdelta: 64,
  strokewidth: 0,
  roundcoords: 1,
  viewbox: false,
  desc: false
}
```

## Advanced Option Mapping

If the v1 modal exposes limited advanced controls, they must map to the concrete engine options in a controlled way.

### Number Of Colors

- `Logo`: clamp to `2..4`
- `Detailed Logo`: clamp to `4..12`
- `Grayscale Photo`: clamp to `4..10`
- `Posterized Photo`: clamp to `6..16`

Mapped field:

- `numberofcolors`

### Detail Level

UI values:

- `Low`
- `Medium`
- `High`

Mapped behavior:

- `Low`: increase `ltres`, increase `qtres`, increase `pathomit`
- `Medium`: use preset defaults
- `High`: decrease `ltres`, decrease `qtres`, decrease `pathomit`

Suggested multiplier rules:

```ts
Low:    { ltres: x * 1.5, qtres: x * 1.5, pathomit: ceil(p * 1.5) }
Medium: { ltres: x,       qtres: x,       pathomit: p }
High:   { ltres: x * 0.6, qtres: x * 0.6, pathomit: max(0, floor(p * 0.5)) }
```

### Smoothing Level

UI values:

- `Low`
- `Medium`
- `High`

Mapped behavior:

- `Low`: minimal blur, lower `blurdelta`
- `Medium`: use preset defaults
- `High`: more blur, higher `blurdelta`

Suggested mapping:

```ts
Low:    { blurradius: max(0, r - 1), blurdelta: max(16, d - 16) }
Medium: { blurradius: r,             blurdelta: d }
High:   { blurradius: min(5, r + 1), blurdelta: min(128, d + 16) }
```

## Trace Engine Abstraction

Introduce an app-local adapter or service for image tracing.

Suggested responsibilities:

- accept an `HTMLImageElement`, `ImageBitmap`, or `ImageData`
- downscale the image when guardrails require it
- map app presets to ImageTracerJS option objects
- generate SVG output
- return tracing metadata useful to the modal and telemetry

Suggested result shape:

```ts
interface TraceImageResult {
  svgText: string;
  preset: TracePresetId;
  sourceWidth: number;
  sourceHeight: number;
  tracedWidth: number;
  tracedHeight: number;
  estimatedComplexity?: number;
}
```

Suggested preset enum:

```ts
type TracePresetId = 'logo' | 'detailed-logo' | 'grayscale-photo' | 'posterized-photo';
```

The rest of the UI must depend on the local service rather than directly importing ImageTracerJS in components.

## Integration Strategy

The traced bitmap result should be treated as imported SVG content.

Recommended flow:

1. Load the existing bitmap into a canvas.
2. Produce `ImageData`.
3. Run ImageTracerJS using the selected preset.
4. Receive SVG text.
5. Feed the SVG text into the existing `openSvgActionModal()` path.
6. Reuse the current vector action modal and new-model save path.

This keeps behavior aligned with SVG imports and minimizes new branches in `ModelDesignerComponent`.

## Proposed File-Level Changes

### New Components And Services

Suggested additions:

- `src/app/components/trace-image-modal/`
- `src/app/services/image-tracing.service.ts`
- `src/app/interfaces/trace-image-result.ts` or equivalent colocated model

### Existing Files Expected To Change

- `src/app/components/image-action-modal/image-action-modal.component.ts`
  - add `Trace Image` action
  - extend modal result action enum

- `src/app/components/model-designer/model-designer.component.ts`
  - route new image trace action
  - open trace modal
  - hand traced SVG into the existing vector import flow

- `src/app/components/model-action-modal/model-action-modal.component.ts`
  - no major flow change expected if traced output uses the existing SVG source path

- `package.json`
  - add `imagetracerjs`

## Guardrails

### Source Downscaling

V1 should enforce a maximum trace input size before processing.

Recommended defaults:

- maximum long edge before downscaling: `1600px`
- target long edge for photo presets after downscaling: `1200px`
- target long edge for logo presets after downscaling: `1600px`

### Complexity Warning

The trace modal should warn when a traced result is likely to be hard to edit.

Acceptable v1 approaches:

- estimate complexity from generated SVG path count
- estimate complexity from traced layer/path metadata if accessible
- use a coarse post-trace heuristic rather than a perfect model

Suggested warning thresholds:

- moderate warning above `250` path-like shapes
- strong warning above `600` path-like shapes

### Failure Handling

Required handled failures:

- bitmap load failure
- invalid image data
- trace exception
- traced SVG parse failure in the existing SVG importer

Failure behavior:

- preserve the source image trace modal if possible
- show an actionable error message
- do not remove the standard bitmap import path

## Performance Requirements

### Required For V1

- common logo tracing must feel responsive in the browser
- medium-sized photo tracing must not hang the UI for an unacceptable duration
- guardrails must bound path count and input size

### Deferred But Supported By Design

- tracing in a web worker
- cancellable live preview while the user changes options rapidly

The architecture must keep worker migration straightforward by keeping the trace engine behind a service boundary.

## Acceptance Criteria

### Core Behavior

- Selecting a bitmap file from the container file list offers `Trace Image`.
- The trace modal shows both the source preview and a traced preview.
- The user can choose among the four required presets.
- Accepting a trace result routes through the existing vector import flow.
- The user can import the traced result into the current model.
- The user can save the traced result as a new model in the current folder.
- The naming modal defaults the new model name from the original image filename.

### Quality

For logos and clipart:

- output is generally recognizable and editable
- defaults do not produce excessive noise on common flat artwork

For photographs:

- output is visibly stylized and posterized
- output remains within acceptable complexity bounds on representative images
- UI copy does not imply photo-fidelity or Illustrator parity

### Performance

- representative logo inputs remain responsive
- representative medium photo inputs are acceptable with guardrails applied
- large images are automatically downscaled or constrained

## Test Corpus

Use a fixed sample corpus during implementation and acceptance.

Minimum corpus:

- 3 monochrome logos
- 3 multicolor logos or clipart images
- 2 noisy or scanned logos
- 2 grayscale photos
- 2 color photographs

Evaluate each sample for:

- visual quality
- editability
- import correctness
- output complexity
- responsiveness

## Test Strategy

### Unit Tests

Add focused unit coverage for:

- image action modal routing for the new trace action
- trace modal preset defaults and option mapping
- model designer handoff from trace result to SVG/vector import flow
- new-model default naming from image filename

### Manual Validation

Verify:

- trace to current model as model element
- trace to current model and decompose into elements
- trace to new model in current folder
- failure behavior on invalid or complex images

## Risks

### Photographic Expectation Risk

Users may expect Illustrator-quality photo tracing.

Mitigation:

- clear preset naming
- explicit product copy
- acceptance criteria that frame photo output as stylized vector art

### Complexity Risk

Photos can generate too many shapes and become hard to edit.

Mitigation:

- downscaling
- capped color counts
- preset tuning
- complexity warnings

### Main-Thread Blocking Risk

Tracing large images may cause UI stalls.

Mitigation:

- guardrails first
- worker migration path preserved in the design

### Third-Party Coupling Risk

Direct use of ImageTracerJS in components would make replacement harder.

Mitigation:

- isolate it behind a local service or adapter

## Historical Implementation Order

1. Add `Trace Image` to the existing image action modal.
2. Add a local image tracing service that wraps ImageTracerJS.
3. Add the trace image modal with preset-based preview.
4. Route accepted traced SVG into the existing SVG/vector import flow.
5. Add guardrails and complexity warnings.
6. Tune presets against the test corpus.
7. Decide whether worker offload is necessary before broad rollout.

## Historical Recommendation

At the time this document was written, the recommendation was to proceed with an ImageTracerJS-based v1 for logos, clipart, and stylized posterized photo effects while keeping the engine swappable.

That recommendation is obsolete. The current codebase standardizes on the internal tracing engine, and new work should follow `specs/IMAGE-TRACING-V2-SPEC.md` instead of reviving the external ImageTracerJS path.
