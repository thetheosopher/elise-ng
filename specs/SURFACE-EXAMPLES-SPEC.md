# Surface Examples Specification

## Overview

Create a set of compelling, self-contained Surface-based application examples that demonstrate how the Elise surface layer can be used to build marketing kiosk and interactive presentation applications. These examples are accessible from a new **Surface Examples** item under the top-level **Explore** menu.

## Goals

- Demonstrate reliable surface features in realistic application scenarios without depending on fragile layer combinations
- Show how surfaces link to each other via pane replacement with transitions to form multi-screen apps
- Provide inspiring starting points for developers building kiosk or marketing applications
- Use locally cached public-domain assets downloaded from NASA so the demos remain self-contained and offline-friendly

## Architecture

### New Components

| Component | Path | Purpose |
|---|---|---|
| `SurfaceExamplesComponent` | `components/surface-examples/` | Grid listing page (same card layout as surface-tests) |
| `SurfaceExampleHarnessComponent` | `components/surface-example-harness/` | Viewer harness for running an individual example |

### New Service

| Service | Path | Purpose |
|---|---|---|
| `SurfaceExampleService` | `services/surface-example.service.ts` | Registers and provides the example catalogue (mirrors `SurfaceTestService` pattern) |

### Routing

| Route | Component |
|---|---|
| `examples/surface` | `SurfaceExamplesComponent` |
| `examples/surface/:id` | `SurfaceExampleHarnessComponent` |

### Menu

Add **Surface Examples** to the Explore dropdown in `header.component.html`, linking to `/examples/surface`.

## Example Applications

### Example 1: NASA Exhibit Wall

A multi-screen museum or lobby experience that demonstrates:
- **Hero screen**: Full-bleed NASA Earth image with branded title and primary CTA buttons
- **Story grid**: Four story cards backed by locally cached NASA photography, each opening a focused story screen
- **Story screen**: Full-screen hero image, supporting copy, and a direct transition into a showreel
- **Auto tour**: Self-running animation reel suitable for unattended signage

**Surface features used**: `Surface`, `SurfaceTextElement`, `SurfaceImageLayer`, `SurfaceAnimationLayer`, `SurfacePane`, `surface.normalImageSource`, `surface.backgroundColor`

**Assets used**: local NASA public-domain images in `assets/examples/surface/nasa/`

### Example 2: Mission Briefing Console

A guided briefing application for trade shows, visitor centers, or executive demos that demonstrates:
- **Briefing home**: Launch-themed opener with two clear actions
- **Module dashboard**: Three visual modules that move quickly into focused briefings
- **Detail screen**: Full-screen chapter view with copy panel and reel launch action
- **Hands-off reel**: Combined slideshow for unattended playback in a kiosk or lobby mode

**Surface features used**: `Surface`, `SurfaceTextElement`, `SurfaceImageLayer`, `SurfaceAnimationLayer`, `SurfacePane`, `surface.normalImageSource`

**Assets used**: local NASA public-domain images in `assets/examples/surface/nasa/`

## Implementation Plan

1. **Create assets** – Download and cache public-domain NASA images under `assets/examples/surface/nasa/`
2. **Create `SurfaceExampleService`** – Register both examples following the `SurfaceTestService` pattern
3. **Create `SurfaceExamplesComponent`** – Grid listing page (reuses `_sample-grid.scss` card layout)
4. **Create `SurfaceExampleHarnessComponent`** – Viewer page with breadcrumb and surface harness
5. **Create `SurfaceExamplePreviewComponent`** – Lazy thumbnail preview for grid cards
6. **Register routes** in `app.config.ts`
7. **Add menu item** in `header.component.html`

## Implementation Notes

- The original pass used more experimental layer combinations and produced a runtime failure where an element reached the renderer without a valid size.
- The final implementation stays close to proven `SurfaceTestService` patterns: full-surface background images, clickable text elements, clickable image layers, animation layers, and pane swaps.
- All example media is local once downloaded, so the demos do not depend on live remote URLs.

## Surface API Quick Reference (from tests)

| Feature | API |
|---|---|
| Create surface | `new Surface(width, height)` |
| Background image | `surface.normalImageSource = ':path'` |
| Background color | `surface.backgroundColor = '#hex'` |
| Text element | `SurfaceTextElement.create(id, x, y, w, h, text, clickHandler)` |
| Button element | `SurfaceButtonElement.create(id, x, y, w, h, clickHandler)` |
| Radio button | `SurfaceButtonElement.createRadioButton(group, id, x, y, w, h, handler)` |
| Checkbox | `SurfaceButtonElement.createCheckbox(id, x, y, w, h, handler)` |
| Image layer | `SurfaceImageLayer.create(id, x, y, w, h, src, handler)` |
| HTML layer | `SurfaceHtmlLayer.create(id, x, y, w, h, url)` |
| Video layer | `SurfaceVideoLayer.create(id, x, y, w, h, src)` |
| Animation layer | `SurfaceAnimationLayer.create(id, x, y, w, h, autoStart, clickHandler, startFrame, frameAdvanced)` |
| Animation frame | `anim.addFrame(id, imageSrc, x, y, w, h, duration, transition, transitionDuration, hold)` |
| Hidden layer | `SurfaceHiddenLayer.create(id, x, y, w, h, handler)` |
| Radio strip | `SurfaceRadioStrip.create(id, x, y, w, h, sx, sy, sw, sh, handler)` |
| Pane | `SurfacePane.create(id, x, y, w, h, childSurface)` |
| Replace pane | `pane.replaceSurface(newSurface, callback, transition, duration)` |
| Text properties | `text.textAlignment`, `text.typeSize`, `text.typeFace`, `text.color` |
| Opacity | `surface.setOpacity(value)` |
| Initialized event | `surface.initialized.add(handler)` |
