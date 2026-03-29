# Model Designer Enhancement Plan

## Goals

- Expand the Angular model designer so it exposes the most valuable capabilities already present in `elise-graphics`.
- Prioritize improvements that materially improve authoring workflows before tackling specialist editing features.
- Keep enhancements aligned with the current standalone Angular + ng-bootstrap architecture.

## Current Baseline

The designer already exposes:

- Core drawing tools: select, pen, line, rectangle, ellipse, arc, polyline, polygon, regular polygon, arrow, wedge, ring, text, image, model.
- Core edit operations: undo/redo, clipboard, reorder, align, distribute, resize, delete.
- Model and element dialogs: model size, stroke, fill, text, image, model, points, path commands, grid settings.
- SVG import and resource cleanup.

The library supports more than the designer currently surfaces, including:

- Export via `Model.toSVG()`, `Model.downloadAs()`, `Model.toDataURL()`, `Model.toBlob()`.
- Appearance/effects via `setOpacity()`, `setShadow()`, `setBlendMode()`, `setFilter()`, `setTransform()`, `setClipPath()`, `setInteractive()`.
- Richer text controls via `setLetterSpacing()`, `setTextDecoration()`, `setLineHeight()`, `setRichText()`, `setSource()`.
- Geometry refinements via rectangle `setCornerRadii()` and path/polygon `setWinding()`.
- Multi-stop gradients via `addFillStop()`.

## Implementation Strategy

### Phase 1: Reliability And Export

Scope:

- Fix the verified model-tool opacity unit mismatch.
- Add export actions for SVG and raster formats directly to the model designer toolbar.
- Keep these changes model-level and low risk.

Why first:

- Export completes the existing import/save workflow with minimal UI complexity.
- The opacity issue is a current bug, not just a missing enhancement.

Deliverables:

- Export dropdown in the model designer toolbar.
- `Export as SVG`, `Export as PNG`, `Export as JPEG`, `Export as WebP` actions.
- Correct 0-255 opacity handling for tool-created model elements.

### Phase 2: Unified Appearance Surface

Scope:

- Add a shared appearance dialog or inspector section for currently selected elements and model defaults.
- Expose element opacity, shadow, blend mode, filter, and interactivity.

Why second:

- These are high-value capabilities already implemented in the library and broadly applicable across element types.
- A shared surface avoids proliferating one-off dialogs.

Deliverables:

- Appearance modal or inspector section.
- Selection-aware editing for effects.
- Reuse of existing `applyToModel` / `applyToSelected` patterns from stroke and fill.

### Phase 3: Transform Editing

Scope:

- Add a transform editor for translate, rotate, scale, skew, and raw matrix entry.
- Support both structured controls and direct transform-string editing.

Why third:

- Transform support is one of the largest remaining functional gaps.
- It benefits many element types but needs careful UX to avoid making the editor harder to use.

Deliverables:

- Transform modal.
- Selection/model default application.
- Optional presets for common transforms.

### Phase 4: Text Authoring Upgrade

Scope:

- Expand the text element dialog with letter spacing, text decoration, line height, text resource binding, and rich text runs.

Why fourth:

- The current text dialog is much narrower than the underlying text engine.
- Text improvements are high-value but need more UI than the current modal provides.

Deliverables:

- Enhanced text properties dialog.
- Resource-backed text option.
- Rich text run editor with add/remove/reorder.

### Phase 5: Geometry And Fill Refinement

Scope:

- Add corner radius / corner radii editing for rectangles.
- Add winding mode editing for applicable path-based elements.
- Upgrade fill editing to support multi-stop gradients.

Why fifth:

- These are powerful but more specialized than export, effects, transforms, and text.

Deliverables:

- Rectangle geometry controls.
- Winding mode controls.
- Repeating gradient-stop editor UI.

### Phase 6: Advanced Masking And Clipping

Scope:

- Add clip-path authoring, starting with command-based editing and optional object-bounding-box helpers.

Why sixth:

- Very capable feature, but the UX complexity is significantly higher than the earlier phases.

Deliverables:

- Clip-path dialog.
- Command preview and validation.

## Detailed Work Items

### Phase 1 Work Items

1. Fix `showModelToolResourceModal()` opacity conversion so it matches the image tool flow.
2. Add toolbar export affordance in the top file-operations group.
3. Add export helpers in `ModelDesignerComponent`:
   - derive a stable file name from the current model path
   - download SVG from `model.toSVG()`
   - delegate raster export to `model.downloadAs()`
4. Add user-facing validation and error handling via existing toast/error patterns.

### Phase 2 Work Items

1. Create `appearance-modal` component.
2. Define modal info model for opacity, shadow, blend mode, filter, interactive.
3. Add `showAppearanceModal()` and shared apply helpers in `ModelDesignerComponent`.
4. Rehydrate effect state from selection similar to stroke/fill state loading.

### Phase 3 Work Items

1. Create `transform-modal` component.
2. Support structured fields plus raw transform text.
3. Add transform preview examples or presets.
4. Apply transforms to selection and model defaults.

### Phase 4 Work Items

1. Extend `TextElementModalInfo`.
2. Redesign `text-element-modal` to match the newer fill/stroke dialog style.
3. Add text resource selection / entry path.
4. Add rich text run management.

### Phase 5 Work Items

1. Extend size/geometry dialog or create a dedicated geometry modal.
2. Add per-corner rectangle radii editing.
3. Add winding selection for polygon/path elements.
4. Replace two-stop gradient UI with a repeating stop list.

### Phase 6 Work Items

1. Create `clip-path-modal`.
2. Provide object-bounding-box and user-space-on-use modes.
3. Add command validation and preview.

## Risks And Constraints

- `DesignTool` only carries a limited set of style defaults, so advanced defaults for newly created elements may require post-create stamping in the designer unless the library is extended.
- Transform, clip-path, and rich-text editing have the highest UX complexity and should not be rushed into the existing modal patterns unchanged.
- Grid rendering and some snap behavior remain library-side concerns and should stay out of this plan unless explicitly prioritized.

## Progress Update

Completed:

- Phase 1 reliability and export baseline.
- Toolbar export entry points for SVG, PNG, JPEG, and WebP.
- Export settings modal with raster scale and quality controls.
- Model-tool opacity conversion fix.
- Phase 2 follow-up for appearance presets and multi-selection rehydration.
- Phase 3 transform follow-up with quick presets and matrix decomposition hints.
- Phase 4 text authoring upgrade with resource binding, rich text runs, and advanced spacing/decoration controls.
- New-text stamping via `elementCreated()` so resource-backed and rich-text defaults carry into created text elements.
- Phase 5 geometry modal for rectangle corner radii and polygon/path winding rules.
- Phase 5 fill modal upgrade from two gradient endpoints to a repeating gradient-stop editor.
- Phase 5 geometry default stamping so new rectangles, polygons, and paths inherit the current corner-radius or winding defaults.
- Phase 6 clip-path modal with command editing, units, winding, transform, and selection/model application.
- Phase 6 clip-path follow-up with presets, validation warnings, inline preview, and command summaries.
- Bundle-budget recovery by lazy-loading the clip-path and geometry modals out of the initial designer chunk.
- Full Angular build validation after each implementation slice.

In progress:

- Phase 2 unified appearance surface final polish.
- Shared appearance modal presets for common blend and filter combinations.
- First-selected-element rehydration for multi-selection stroke, fill, appearance, and transform state.

Next recommended slice:

- Focus on any remaining appearance-surface polish, or move into richer transform and geometry presets now that clip-path authoring is in place.
