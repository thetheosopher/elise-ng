# Elise-NG UI Design Review

> Comprehensive UI/UX audit and improvement plan for the Elise Library Demo application.
> Reviewed: March 2026 | Angular 20 · Bootstrap 5 · ng-bootstrap · Font Awesome

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Assessment](#current-state-assessment)
3. [Design System & Tokens](#design-system--tokens)
4. [Navigation & Information Architecture](#navigation--information-architecture)
5. [Landing Page](#landing-page)
6. [Sample Listing Pages](#sample-listing-pages)
7. [Sample Detail Pages](#sample-detail-pages)
8. [Model Designer](#model-designer)
9. [Model Playground](#model-playground)
10. [Container Explorer](#container-explorer)
11. [Authentication & Account Pages](#authentication--account-pages)
12. [Modal Dialogs](#modal-dialogs)
13. [Typography & Iconography](#typography--iconography)
14. [Responsive Design](#responsive-design)
15. [Accessibility](#accessibility)
16. [Technical Styling Debt](#technical-styling-debt)
17. [Implementation Priority](#implementation-priority)

---

## Executive Summary

The Elise-NG application is a **library demo and tooling application** showcasing the `elise-graphics` 2D rendering engine. It has ~50 components, 23 routes, and a rich set of features including primitives, animations, sketches, interactive design/view/surface test harnesses, a full model designer, a scripting playground, and a cloud container file explorer.

**The application is functionally complete but visually utilitarian.** The current design relies almost entirely on Bootstrap 5 defaults with minimal customization, extensive inline styles, no design tokens, and no unifying visual identity. The primary opportunity is to transform this from a developer-facing test harness into a polished showcase that demonstrates the library's capabilities while maintaining its functional depth.

### Key Findings

| Category | Rating | Summary |
|----------|--------|---------|
| Visual Identity | ⬜⬜⬜⬜⬜ | No logo, brand colors, or custom theme |
| Navigation | ⬛⬛⬜⬜⬜ | Functional but flat — no active states, mixed taxonomy |
| Sample Listings | ⬛⬜⬜⬜⬜ | Plain `<ul>` lists with no visual hierarchy (except Animations) |
| Sample Details | ⬛⬛⬜⬜⬜ | Functional but plain — no code highlighting, no fullscreen |
| Model Designer | ⬛⬛⬛⬜⬜ | Feature-rich but cramped toolbar, heavy borders |
| Model Playground | ⬛⬛⬛⬜⬜ | Good Load menu pattern, needs editor polish |
| Container Explorer | ⬛⬛⬜⬜⬜ | Functional, dated upload pattern |
| Auth Pages | ⬛⬛⬜⬜⬜ | Very narrow, no visual framing |
| Modals | ⬛⬛⬛⬜⬜ | Consistent structure, inconsistent details |
| Responsive | ⬛⬜⬜⬜⬜ | Minimal — split panels don't collapse |
| Accessibility | ⬛⬜⬜⬜⬜ | Missing ARIA labels, focus management |
| CSS Architecture | ⬛⬜⬜⬜⬜ | Inline styles, duplicated classes, no tokens |

---

## Current State Assessment

### What Works Well

- **Functional completeness** — Every feature works end-to-end
- **Consistent modal structure** — All modals follow the same header/body/footer pattern
- **ng-bootstrap integration** — Dropdowns, tooltips, tabs, and modals are properly used
- **Animations listing** — Uses CSS grid with responsive breakpoints (good pattern to extend)
- **Model Playground Load menu** — Multi-column responsive dropdown is well-designed
- **Split panel layout** — angular-split provides resizable panels in designer views
- **Form validation** — All forms have inline error messages with proper `required`/`pristine` checks

### What Needs Work

- **No visual identity** — "Elise Library Demos" plain text in a default dark navbar
- **No landing page** — Root redirects straight to Primitives list
- **Plain listing pages** — 4 of 5 sample listings are bare `<ul>` bullet lists
- **Inline styles everywhere** — 100+ instances of inline `style=` attributes across templates
- **Duplicated CSS** — `.grid`, `.black`, `.white`, `.gray`, `.fileover`, `.view-host` duplicated across 5+ components
- **Heavy borders** — `5px solid rgb(231, 231, 231)` border on split panels looks dated
- **No dark mode** — Important for a graphics/design tool
- **No active route highlighting** in navigation
- **Commented-out code** in production templates (header, model designer)
- **Inconsistent button semantics** — `btn-danger` used for both Cancel and destructive actions
- **No code highlighting** on sample detail pages

---

## Design System & Tokens

### Problem

There is no design system. Bootstrap defaults are used without customization. Every component that needs a color, spacing value, or shadow hard-codes it inline or in component SCSS with magic numbers.

### Suggested Improvements

#### 1. Create a `_variables.scss` partial with design tokens

```scss
// src/styles/_variables.scss

// Brand colors
$elise-primary: #3b82f6;        // Blue — canvas tool actions
$elise-primary-dark: #1e40af;
$elise-secondary: #6366f1;      // Indigo — interactive accents
$elise-accent: #8b5cf6;         // Violet — creative branding
$elise-success: #22c55e;
$elise-warning: #f59e0b;
$elise-danger: #ef4444;

// Neutral palette
$elise-gray-50: #f8fafc;
$elise-gray-100: #f1f5f9;
$elise-gray-200: #e2e8f0;
$elise-gray-300: #cbd5e1;
$elise-gray-500: #64748b;
$elise-gray-700: #334155;
$elise-gray-800: #1e293b;
$elise-gray-900: #0f172a;

// Canvas/editor surfaces
$canvas-border: $elise-gray-200;
$panel-border: $elise-gray-200;
$toolbar-bg: $elise-gray-50;
$editor-bg: $elise-gray-100;

// Typography
$font-display: 'Poiret One', sans-serif;
$font-body: system-ui, -apple-system, sans-serif;
$font-mono: 'Anonymous Pro', 'Fira Code', monospace;

// Spacing
$toolbar-height: 48px;
$toolbar-padding: 0.5rem 0.75rem;
$panel-gap: 4px;
$footer-height: 36px;

// Shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

// Border radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
```

#### 2. Override Bootstrap variables before import

```scss
// src/styles.scss

@use './styles/variables' as *;

// Bootstrap overrides
$primary: $elise-primary;
$body-bg: $elise-gray-50;
$navbar-dark-bg: $elise-gray-900;
$border-radius: $radius-sm;
$font-family-sans-serif: $font-body;
$font-family-monospace: $font-mono;

@use "bootstrap/scss/bootstrap";
// ...rest of imports
```

#### 3. Create shared utility classes

```scss
// src/styles/_utilities.scss

.canvas-grid       { background-image: url(/assets/images/grid.png); }
.canvas-black      { background-color: black; }
.canvas-white      { background-color: white; }
.canvas-gray       { background-color: gray; }

.panel-border      { border: 1px solid $panel-border; }
.toolbar           { /* shared toolbar class — see Toolbar section */ }
.page-content      { padding: 1.5rem 2rem; }
```

This eliminates the 5+ copies of `.grid`, `.black`, `.white`, `.gray` in component SCSS files.

---

## Navigation & Information Architecture

### Current Structure
```
Samples (dropdown)          Tests (dropdown)              Log In
├── Primitives              ├── View Tests
├── Animations              ├── Design Tests
└── Sketches                ├── Surface Tests
                            ├── Container Explorer
                            ├── Model Designer
                            ├── Model Playground
                            └── API Tests
```

### Problems

1. **"Tests" is misleading** — It bundles developer tests (View/Design/Surface) with real tools (Designer, Playground, Explorer)
2. **No active route highlighting** — User can't tell which section they're in
3. **Login state is a plain text link** — No visual indicator of auth state
4. **No visual grouping** within dropdowns (tests vs. tools)
5. **RedGreenBlue and Random Sketches are orphaned** — Not in any dropdown or visible nav
6. **Commented-out code** — Old `<li>` nav items still in the template

### Suggested Restructure

```
Home    Samples ▾         Tools ▾               [User Icon] ▾
        ├── Primitives    ├── Model Designer       ├── Account Info
        ├── Animations    ├── Model Playground      ├── Change Password
        └── Sketches      ├── Container Explorer    └── Log Out
                          └── API Tests
                                                  [Log In]  (when logged out)
        Explore ▾
        ├── View Tests
        ├── Design Tests
        └── Surface Tests
```

### Implementation Details

**a) Add `routerLinkActive` for active states:**
```html
<a ngbDropdownItem routerLink='/primitives' routerLinkActive='active'>Primitives</a>
```

**b) Show username when logged in:**
```html
<div ngbDropdown *ngIf="isLoggedIn">
    <button class="btn btn-link nav-link" ngbDropdownToggle>
        <span class="fas fa-user-circle"></span> {{loginDTO?.Alias || loginDTO?.Name}}
    </button>
    <div ngbDropdownMenu>
        <a ngbDropdownItem routerLink='/login'>Account Info</a>
        <a ngbDropdownItem routerLink='/change-password'>Change Password</a>
        <div class="dropdown-divider"></div>
        <button ngbDropdownItem (click)="logout()">Log Out</button>
    </div>
</div>
```

**c) Group navigation by purpose**, separating creative samples from developer-facing explorers and test harnesses.

**d) Remove all commented-out HTML** from the header template.

**e) Add a brand mark:**
```html
<a class='navbar-brand ps-3' routerLink='/'>
    <span class="fas fa-bezier-curve me-2"></span>Elise
</a>
```

---

## Landing Page

### Problem

There is no landing page. The root route (`/`) redirects to `/primitives`. A first-time visitor has no context about what Elise is, what the demos show, or how to navigate.

### Suggested Design

Create a `HomeComponent` at route `/` that serves as both a showcase entry point and a navigation hub.

**Layout:**

```
┌─────────────────────────────────────────────┐
│              [Hero Section]                 │
│    "Elise" — A 2D Graphics Engine           │
│    for the Web                              │
│    [Explore Samples]  [Open Playground]     │
├─────────────────────────────────────────────┤
│   ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│   │Primitives│  │Animations│  │ Sketches  │ │
│   │  card    │  │  card    │  │   card    │ │
│   │ N items  │  │ N items  │  │  N items  │ │
│   └──────────┘  └──────────┘  └──────────┘ │
├─────────────────────────────────────────────┤
│   ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│   │  Model   │  │  Model   │  │Container │ │
│   │ Designer │  │Playground│  │ Explorer  │ │
│   │   card   │  │   card   │  │   card    │ │
│   └──────────┘  └──────────┘  └──────────┘ │
├─────────────────────────────────────────────┤
│   ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│   │  View    │  │  Design  │  │ Surface   │ │
│   │  Tests   │  │  Tests   │  │  Tests    │ │
│   │   card   │  │   card   │  │   card    │ │
│   └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────┘
```

**Each card should include:**
- An icon or thumbnail (could be a small canvas rendering)
- Section name
- Brief one-line description
- Item count badge
- Click navigates to the listing page

**Hero section style:**
- Use the `Poiret One` display font (already imported but unused)
- Gradient or subtle animated background using the elise canvas
- Clear call-to-action buttons

---

## Sample Listing Pages

### Current State

| Page | Route | Layout |
|------|-------|--------|
| Primitives | `/primitives` | Plain `<ul>` bullet list |
| Animations | `/animations` | CSS grid, responsive — **best current pattern** |
| Sketches | `/sketches` | Plain `<ul>` bullet list |
| View Tests | `/tests/view` | Plain `<ul>` bullet list |
| Design Tests | `/tests/design` | Plain `<ul>` bullet list |
| Surface Tests | `/tests/surface` | Plain `<ul>` bullet list |

5 of 6 listing pages are bare bullet lists with `padding: 10px`.

### Suggested Improvements

#### a) Adopt Card Grid Layout (all listings)

Replace plain `<ul>` lists with a responsive card grid. Use the Animations component as the starting pattern and enhance it:

```html
<div class="page-content">
    <div class="page-header">
        <h2>Primitives</h2>
        <p class="text-muted">Fundamental 2D drawing elements — rectangles, ellipses, lines, polygons, paths, and text.</p>
    </div>
    <div class="sample-grid">
        <a *ngFor="let model of models; trackBy: trackByModelId"
           class="sample-card" [routerLink]="['/primitives', model.id]">
            <div class="sample-card-preview">
                <!-- Optional: small elise-view thumbnail -->
            </div>
            <div class="sample-card-body">
                <span class="sample-card-title">{{model.name}}</span>
            </div>
        </a>
    </div>
</div>
```

```scss
// src/styles/_sample-grid.scss

.sample-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
}

.sample-card {
    display: flex;
    flex-direction: column;
    border: 1px solid $elise-gray-200;
    border-radius: $radius-md;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.15s, border-color 0.15s;

    &:hover {
        border-color: $elise-primary;
        box-shadow: $shadow-md;
        text-decoration: none;
    }
}

.sample-card-title {
    font-weight: 500;
    font-size: 0.9rem;
}
```

#### b) Add Optional Live Thumbnail Previews

For primitives and simpler models, render a small (100×75) `<app-elise-view>` inline in each card. This creates a visually rich gallery effect. Use lazy rendering (IntersectionObserver) to avoid performance issues with many items.

For animations, show a static first-frame preview with a play indicator overlay.

#### c) Add Search/Filter

For pages with many items (Animations has 50+), add a text filter at the top:

```html
<input type="text" class="form-control mb-3" placeholder="Filter animations..."
       [(ngModel)]="filterText">
```

Filter the `models` array in the component using a simple `includes()` check on the name.

#### d) Add Item Count Badge

```html
<h2>Animations <span class="badge bg-secondary">{{models.length}}</span></h2>
```

---

## Sample Detail Pages

### Current State

Primitives, Animations, and Sketches detail pages share the same layout:
```
<h3>Back Link / Title</h3>
<div [innerHtml]="description"></div>
<div class="border" style="display: inline-block;">
    <app-elise-view ...></app-elise-view>
</div>
<pre>{{modelCode}}</pre>
```

### Problems

1. **Code blocks have no syntax highlighting** — Raw TypeScript/JSON in `<pre>` tags
2. **No copy-to-clipboard** for code
3. **Canvas has minimal framing** — Just a 1px border inline-block
4. **No fullscreen option** for the canvas
5. **No zoom controls** on sample views (only on test harnesses)
6. **Breadcrumb is manual** — `<a>Back</a> / Title` pattern
7. **Description is raw HTML** — Injected via `[innerHtml]` with no sanitization notice

### Suggested Improvements

#### a) Enhanced Canvas Container

```html
<div class="canvas-container">
    <div class="canvas-toolbar">
        <select [(ngModel)]="scale" class="form-select form-select-sm" style="width: auto;">
            <option [ngValue]="0.5">50%</option>
            <option [ngValue]="1">100%</option>
            <option [ngValue]="2">200%</option>
        </select>
        <select [(ngModel)]="background" class="form-select form-select-sm" style="width: auto;">
            <option value="grid">Grid</option>
            <option value="white">White</option>
            <option value="black">Black</option>
        </select>
        <button class="btn btn-sm btn-outline-secondary" (click)="toggleFullscreen()">
            <span class="fas fa-expand"></span>
        </button>
    </div>
    <div [ngClass]="backgroundClass()" class="canvas-viewport">
        <app-elise-view [model]="model" [scale]="scale"></app-elise-view>
    </div>
</div>
```

```scss
.canvas-container {
    display: inline-block;
    border: 1px solid $elise-gray-200;
    border-radius: $radius-md;
    overflow: hidden;
}

.canvas-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    background: $elise-gray-50;
    border-bottom: 1px solid $elise-gray-200;
}
```

#### b) Code Block with Syntax Highlighting

Add `ngx-highlightjs` or a lightweight Prism.js wrapper for TypeScript highlighting:

```html
<div class="code-block">
    <div class="code-block-header">
        <span class="code-block-label">TypeScript</span>
        <button class="btn btn-sm btn-ghost" (click)="copyCode()">
            <span class="fas fa-copy"></span> Copy
        </button>
    </div>
    <pre><code [highlight]="modelCode" language="typescript"></code></pre>
</div>
```

```scss
.code-block {
    border: 1px solid $elise-gray-200;
    border-radius: $radius-md;
    overflow: hidden;
    margin-top: 1rem;

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.375rem 0.75rem;
        background: $elise-gray-100;
        border-bottom: 1px solid $elise-gray-200;
        font-size: 0.8rem;
    }
}
```

#### c) Structured Page Layout

```html
<div class="page-content">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/primitives">Primitives</a></li>
            <li class="breadcrumb-item active">{{modelName}}</li>
        </ol>
    </nav>

    <h2>{{modelName}}</h2>
    <p class="text-muted" *ngIf="modelDescription" [innerHtml]="modelDescription"></p>

    <!-- Canvas -->
    <div class="canvas-container">...</div>

    <!-- Code -->
    <div class="code-block">...</div>
</div>
```

---

## Model Designer

### Current State

The Model Designer is the most complex view. It combines a container file browser (tree + file list), a full canvas editor with multiple tools, and tabbed secondary views (Model Text, Elements).

### Problems

1. **Toolbar is a single row of heterogeneous controls** — Select dropdowns, icon buttons, text buttons, and dropdowns all on one line with no visual grouping
2. **5px solid borders** on the split panel container look heavy and dated
3. **Title (`<h4>Model Designer</h4>`) floats right** — Unusual placement, visually disconnected
4. **Editor toolbar uses `<table>` layout** — Not responsive, semantically incorrect
5. **Nested dropdowns** (Edit > Move, Edit > Arrange, Edit > Resize) use inline styles
6. **No visual separator** between toolbar groups (file operations vs. drawing tools vs. property controls)
7. **Element list** has no selection highlight feedback
8. **Status bar** (busy spinner, path display) is inline with toolbar
9. **Upload input** uses deprecated Bootstrap 4 `custom-file` class
10. **Multiple commented-out code blocks** in the template

### Suggested Improvements

#### a) Restructure Toolbar with Visual Groups

Replace the flat row with grouped sections separated by subtle dividers:

```
┌──────────────────────────────────────────────────────────────┐
│ [Container▾] [📁+][📁−][📄+][💾][📥SVG] │ path/to/model    │
├──────────────────────────────────────────────────────────────┤
│ [Zoom▾][Surface▾][Edit▾] │ [Tool▾] │ [Stroke][■] [Fill] │  │
└──────────────────────────────────────────────────────────────┘
```

```scss
.toolbar {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: $toolbar-padding;
    background: $toolbar-bg;
    border-bottom: 1px solid $panel-border;
    flex-wrap: wrap;
}

.toolbar-group {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.toolbar-divider {
    width: 1px;
    height: 24px;
    background: $elise-gray-300;
    margin: 0 0.5rem;
}
```

#### b) Replace Table-Based Editor Controls with Flexbox

```html
<div class="editor-toolbar">
    <div class="toolbar-group">
        <select ...><!-- zoom --></select>
        <select ...><!-- background --></select>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
        <div ngbDropdown class="d-inline-block"><!-- Edit menu --></div>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
        <select ...><!-- tool --></select>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
        <button ...>Stroke</button>
        <div class="swatch" ...></div>
        <button ...>Fill</button>
    </div>
</div>
```

#### c) Lighten Split Panel Borders

Replace `border: 5px solid rgb(231, 231, 231)` with:

```scss
as-split {
    border: 1px solid $panel-border;
    border-radius: $radius-sm;
}
```

Override angular-split gutter styling:

```scss
::ng-deep .as-split-gutter {
    background-color: $elise-gray-100 !important;

    &:hover {
        background-color: $elise-gray-200 !important;
    }
}
```

#### d) Move Title to Left, Add Status Bar

```html
<div class="toolbar">
    <h5 class="toolbar-title">Model Designer</h5>
    <div class="toolbar-group">
        <!-- controls -->
    </div>
    <div class="toolbar-spacer"></div>
    <div class="toolbar-status">
        <span class="text-muted">{{selectedContainerName}}{{modelPath || selectedFolderPath}}</span>
        <span *ngIf="isBusy" class="spinner-border spinner-border-sm text-primary ms-2"></span>
    </div>
</div>
```

#### e) Modernize Upload Area

Replace deprecated `custom-file` with a drop zone:

```html
<div class="upload-zone" appDnd (fileDropped)="onFileDropped($event)">
    <input type="file" #fileUploadInput (change)="uploadFiles(fileUploadInput.files)" multiple>
    <span class="text-muted small">Drop files or click to upload</span>
</div>
```

#### f) Remove All Commented-Out Code

The template contains 5+ blocks of commented-out HTML from previous iterations. Remove them for cleanliness.

---

## Model Playground

### Current State

Similar to Model Designer but with a code editor (textarea) instead of a visual editor.

### Problems

1. **Same toolbar/border issues as Model Designer** — inherited visual debt
2. **Code editor is a plain `<textarea>`** — No syntax highlighting, no line numbers
3. **Load dropdown with 50+ items** — Well-organized as a 3-column grid (good!) but items are flat (no categories)
4. **Run button** is small and inline with the Load dropdown — Not prominent enough for the primary action
5. **View tab** shows the rendered output but shares zoom/background controls that are awkwardly placed

### Suggested Improvements

#### a) Enhanced Code Editor

Replace the plain `<textarea>` with Monaco editor or CodeMirror for:
- Syntax highlighting (TypeScript/JavaScript)
- Line numbers
- Auto-indent
- Basic autocomplete for the Elise API

If a full editor is too heavy, even a `<textarea>` with a monospace font and subtle styling would help:

```scss
.playground-editor {
    font-family: $font-mono;
    font-size: 13px;
    line-height: 1.5;
    border: 1px solid $elise-gray-200;
    border-radius: $radius-sm;
    padding: 0.75rem;
    background: $elise-gray-900;
    color: #e2e8f0;
    resize: none;
    tab-size: 4;
}
```

#### b) Prominent Run Button

```html
<button class="btn btn-success btn-sm" (click)="runScript()">
    <span class="fas fa-play me-1"></span> Run
</button>
```

#### c) Categorize Load Menu

Group the 50+ items with headers:

```html
<h6 class="dropdown-header">Physics & Simulation</h6>
<button ngbDropdownItem ...>Cloth Simulation</button>
<button ngbDropdownItem ...>Newton's Cradle</button>
...
<h6 class="dropdown-header">Generative Art</h6>
<button ngbDropdownItem ...>Fourier Flower</button>
...
```

Suggested categories:
- **Basic** — Blank Model, Line/Ellipse/Rotation/Gradient Animation
- **Generative Art** — Fourier Flower, Harmonograph, Spirograph, Maurer Rose, Superformula Bloom, etc.
- **Nature & Physics** — Fireflies, Flocking Swarm, Ocean Waves, Tornado, Snow, Raindrop Ripples, etc.
- **Simulation** — Conway Life Lab, Cloth Simulation, Reaction-Diffusion, Soft Body Blobs, etc.
- **Visual Effects** — Aurora Borealis, Digital Rain, Fractal Zoom, Kaleidoscope, Lava Lamp, Plasma, Stargate Tunnel, etc.
- **Data & Technical** — Heartbeat Monitor, RRT Pathfinding, Solar System Orrery, DNA Helix, etc.
- **Sprite & Image** — Multi Sprite, Sprite Transitions, Sprite Sheet Animation, etc.

---

## Container Explorer

### Current State

A file management view with container selection, folder tree, and file list.

### Problems

1. **Same heavy borders and toolbar issues** as Model Designer
2. **Duplicated toolbar HTML and styles** — Nearly identical to Model Designer's toolbar
3. **Upload input** uses deprecated Bootstrap 4 `custom-file` pattern
4. **File list** has no file type icons
5. **No visual distinction** between file types in the list

### Suggested Improvements

#### a) Add File Type Icons

```html
<div class="name">
    <span class="file-icon" [ngClass]="getFileIconClass(file.Name)"></span>
    <a href="#" (click)="onSelectFile($event, file.Name)">{{file.Name}}</a>
</div>
```

Map file extensions to Font Awesome icons:
- `.json` → `fa-file-code`
- `.svg` → `fa-file-image`
- `.png/.jpg` → `fa-file-image`
- default → `fa-file`

#### b) Extract Shared Toolbar Component

Create a shared `ToolbarComponent` or at minimum extract shared styles to avoid duplication between Container Explorer, Model Designer, and Model Playground.

#### c) Modernize File Upload

Same drop zone pattern suggested for Model Designer.

---

## Authentication & Account Pages

### Current State

Login, Register, Change Password, Confirm Registration, Resend Code, and Password Reset are all wrapped in `<div class="col-sm-4">` — a narrow left-aligned column with no visual framing.

### Problems

1. **Very narrow** — `col-sm-4` is ≈33% width, starting from the left edge
2. **No centering** — Forms sit in the top-left corner
3. **No card/panel framing** — Just raw form fields on the page background
4. **No form page icon** or visual identity
5. **No password strength indicator** on registration
6. **`<label>` elements** lack consistent `for` associations
7. **Action links** (Register, Reset Password, Login) are `btn-link` buttons — visually light

### Suggested Improvements

#### a) Center and Frame Forms

```html
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <div class="text-center mb-4">
                        <span class="fas fa-bezier-curve fa-2x text-primary"></span>
                        <h3 class="mt-2">Log In</h3>
                    </div>
                    <form ...>
                        <!-- form content -->
                    </form>
                </div>
                <div class="card-footer text-center text-muted small">
                    <a routerLink="/register">Create an account</a>
                    <span class="mx-2">·</span>
                    <a routerLink="/send-password-reset-code">Forgot password?</a>
                </div>
            </div>
        </div>
    </div>
</div>
```

#### b) Visual Form Enhancements

- Add input group icons (user icon for username, lock icon for password)
- Use floating labels (`form-floating`) for a modern look
- Add a password visibility toggle for password fields
- Link secondary action links in the card footer instead of inline `btn-link`

#### c) Consistent Page Structure

All auth pages should share the same centered card pattern with consistent widths.

---

## Modal Dialogs

### Current State

15 modal dialog components follow a consistent header/body/footer pattern using ng-bootstrap.

### Problems

1. **Button order inconsistency:**
   - Most modals: Primary → Danger (Cancel)
   - Delete modals: Danger (Delete) → Primary (Cancel)
   - This correctly emphasizes the destructive action but `btn-danger` for Cancel is semantically wrong elsewhere

2. **Cancel button uses `btn-danger`** in non-destructive modals (Fill, Stroke, Size, etc.) — Cancel is not a dangerous action

3. **No consistent sizing** — Some modals fit content, others are wide. No `size` property used on most.

4. **Color picker modals** are dense — lots of controls in a small space

5. **Image action modal** and **Model action modal** have action buttons in the body instead of the footer

### Suggested Improvements

#### a) Standardize Button Semantics

| Context | Primary Button | Secondary Button |
|---------|---------------|-----------------|
| Create/Edit | `btn-primary` "OK" / "Create" | `btn-outline-secondary` "Cancel" |
| Delete/Destroy | `btn-danger` "Delete" | `btn-outline-secondary` "Cancel" |
| Action selection | `btn-primary` (each action) | `btn-outline-secondary` "Cancel" |

Change all non-destructive Cancel buttons from `btn-danger` to `btn-outline-secondary`:

```html
<!-- Before -->
<button type="button" class="btn btn-danger" (click)="activeModal.dismiss('Cancel')">Cancel</button>

<!-- After -->
<button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss('Cancel')">Cancel</button>
```

#### b) Move Action Buttons to Footer (Action Modals)

In image-action-modal and model-action-modal, move the action buttons from the body into the modal footer for consistency:

```html
<div class="modal-footer">
    <button class="btn btn-primary" (click)="actionEdit()" *ngIf="modalInfo.canEdit">{{editLabel}}</button>
    <button class="btn btn-primary" (click)="actionCreateElement()" *ngIf="modalInfo.canEmbed">{{createLabel}}</button>
    <button class="btn btn-outline-primary" (click)="actionAddResource()" *ngIf="modalInfo.canEmbed">Add Resource</button>
    <button class="btn btn-outline-secondary" (click)="activeModal.dismiss('Cancel')">Cancel</button>
</div>
```

#### c) Add Modal Sizes

Use ng-bootstrap's `size` option for consistency:
- Small modals (delete confirmations, new folder): `size: 'sm'`
- Standard modals (size, new model, action): default
- Large modals (fill, stroke, text element, image element): `size: 'lg'`

---

## Typography & Iconography

### Current State

- Four Google Fonts imported: Anonymous Pro, Coda, Coda Caption, Poiret One
- One custom font: Matrix (web font from assets)
- **None of these are visibly used anywhere** — Bootstrap default `system-ui` is the active font
- h3 used for page titles, h4 for toolbar titles
- Code blocks use browser default monospace

### Suggested Improvements

#### a) Define a Typographic Hierarchy

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Brand/Display | Poiret One | 1.75rem | 400 | Navbar brand, landing hero |
| Page Title | System UI | 1.5rem | 600 | h2 on listing/detail pages |
| Section Title | System UI | 1.25rem | 600 | h3 for subsections |
| Toolbar Title | System UI | 1rem | 600 | h5 in toolbars |
| Body Text | System UI | 0.95rem | 400 | General content |
| Code | Anonymous Pro | 0.85rem | 400 | Code blocks, playground |
| Small/Meta | System UI | 0.8rem | 400 | File sizes, timestamps |

#### b) Apply Code Font to Code Blocks

```scss
pre, code, .code-block, #playgroundText {
    font-family: $font-mono;
}
```

#### c) Use Poiret One for Brand Elements

```scss
.navbar-brand {
    font-family: $font-display;
    font-size: 1.5rem;
    letter-spacing: 0.05em;
}
```

#### d) Remove Unused Font Imports

If Coda, Coda Caption, and Matrix are not used, remove them from `styles.scss` and `assets/fonts/` to reduce page weight.

#### e) Icon Consistency

Currently, Font Awesome is used for toolbar buttons. Standardize:
- **Navigation icons:** `fa-fw` (fixed width) for alignment in dropdowns
- **Toolbar icons:** `fa-lg` instead of `fa-2x` for a slightly smaller, more refined look
- **Action icons:** Ensure all icon-only buttons have both `ngbTooltip` and `aria-label`

---

## Responsive Design

### Current State

- **Animations grid:** Has responsive breakpoints (4→2→1 columns) ✓
- **Model Playground Load menu:** Has responsive breakpoints ✓
- **Everything else:** No responsive treatment

### Problems

1. **Split panels** (angular-split) don't collapse on small screens — Model Designer, Model Playground, and Container Explorer are unusable on mobile
2. **Table-based editor toolbar** wraps and breaks on narrow viewports
3. **Auth forms** use `col-sm-4` which is very narrow but doesn't center
4. **Footer** is `fixed-bottom` with text-sm-center — may overlap content on some heights
5. **Navbar toggler** exists but dropdowns inside may not work properly on mobile

### Suggested Improvements

#### a) Collapse Split Panels Below Breakpoint

```scss
@media (max-width: 768px) {
    as-split[direction="horizontal"] {
        flex-direction: column !important;
    }

    as-split-area {
        flex: none !important;
        width: 100% !important;
    }
}
```

Or conditionally switch `direction` from `horizontal` to `vertical`:

```html
<as-split [direction]="isMobile ? 'vertical' : 'horizontal'" ...>
```

#### b) Responsive Toolbar

Wrap toolbar into rows on small screens:

```scss
.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
}
```

#### c) Fix Footer Overlap

Replace the fixed footer with a sticky footer pattern:

```scss
:host {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

router-outlet + * {
    flex: 1;
}

app-footer {
    margin-top: auto;
}
```

This eliminates the need for `margin-bottom: 36px` on the main container.

#### d) Responsive Auth Forms

```html
<div class="col-sm-8 col-md-6 col-lg-4 mx-auto">
```

---

## Accessibility

### Current Gaps

1. **Icon-only buttons** rely solely on `ngbTooltip` for labels — tooltips are not announced by screen readers
2. **No skip-to-content link** at page top
3. **Dropdowns** use `ngbDropdown` which handles ARIA, but custom dropdowns (nested edit menus) may not
4. **Canvas components** have no accessible description
5. **Color picker** interactions lack keyboard navigation descriptions
6. **Route changes** don't announce page transitions
7. **Form labels** exist but some use `<label>` without `for` attribute matching `id`

### Suggested Improvements

#### a) Add `aria-label` to All Icon Buttons

```html
<button class='btn btn-light py-0 px-1' [disabled]='selectedFolderPath == null'
    aria-label="New Folder" (click)="containertree.showNewFolderModal()">
    <span placement="bottom" ngbTooltip="New Folder" class='fas fa-folder-plus fa-2x'></span>
</button>
```

#### b) Skip-to-Content Link

```html
<!-- index.html or app.component.html -->
<a class="visually-hidden-focusable" href="#main-content">Skip to content</a>
<app-header></app-header>
<main id="main-content">
    <router-outlet></router-outlet>
</main>
```

#### c) Canvas ARIA Description

```html
<app-elise-view [model]="model" role="img"
    [attr.aria-label]="'Canvas rendering: ' + modelName">
</app-elise-view>
```

#### d) Title Service for Route Changes

```typescript
// In each page component
constructor(private title: Title) {
    this.title.setTitle('Primitives — Elise');
}
```

Or use Angular's router title strategy:

```typescript
{ path: 'primitives', component: PrimitivesComponent, title: 'Primitives — Elise' },
```

---

## Technical Styling Debt

### 1. Inline Styles

**Scope:** 100+ instances across all templates

**Examples of common inline styles to extract:**

| Inline Style | Suggested Class |
|---|---|
| `style='padding: 10px;'` | `.page-content` |
| `style='height: calc(100vh - 131px);'` | `.full-height-view` |
| `style='display: inline-block;'` | `.d-inline-block` (Bootstrap) |
| `style='position: relative; top: 4px;'` | `.icon-align` |
| `style='margin-left: 4px;'` | `.ms-1` (Bootstrap) |
| `style='border: 5px solid rgb(231, 231, 231);'` | `.panel-border` |

**Approach:** Systematically extract inline styles into component SCSS or shared utilities. Prioritize the most-repeated patterns first.

### 2. Duplicated Component Styles

| Class | Duplicated In |
|-------|---------------|
| `.grid` | model-designer, model-playground, elise-design-harness, elise-view-harness, elise-surface-harness, fill-modal, stroke-modal, size-modal, image-action-modal, model-action-modal, image-element-modal, model-element-modal |
| `.black`, `.white`, `.gray` | model-designer, model-playground, elise-design-harness, elise-view-harness, elise-surface-harness |
| `.fileover` | model-designer, model-playground, container-explorer |
| `.view-host` | model-designer, model-playground, elise-design-harness, elise-view-harness, elise-surface-harness |
| `.files-list` / `.single-file` | file-list, upload-list |
| `h4 { float: right; ... }` | model-designer, model-playground, container-explorer |

**Solution:** Move all duplicated classes to `styles.scss` or a `_shared.scss` partial imported globally.

### 3. Commented-Out Code

Remove all commented-out HTML blocks:

| File | Lines | Content |
|------|-------|---------|
| header.component.html | ~20 lines | Old `<li>` nav items |
| model-designer.component.html | ~30 lines | Old file upload, old Edit menu, old mouse position display, old select mode checkbox, old last event div |
| model-playground.component.html | ~5 lines | Empty dropdown div |
| container-explorer.component.html | ~5 lines | Old file upload |

### 4. Deprecated Bootstrap Patterns

Replace Bootstrap 4 patterns with Bootstrap 5 equivalents:

| Deprecated | Replacement |
|---|---|
| `custom-file` / `custom-file-input` / `custom-file-label` | Standard `<input type="file" class="form-control">` |
| `form-control-range` | `form-range` |

### 5. Suggested File Structure

```
src/
  styles/
    _variables.scss         # Design tokens
    _utilities.scss         # Shared utility classes
    _sample-grid.scss       # Sample listing grid
    _canvas.scss            # Canvas container styles
    _toolbar.scss           # Shared toolbar styles
    _code-block.scss        # Code block styles
  styles.scss               # Imports all partials + Bootstrap
```

---

## Implementation Priority

### Phase 1 — Foundation (Low Risk, High Impact) ✅ COMPLETED

| # | Task | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1.1 | Create `_variables.scss` design tokens and wire into `styles.scss` | S | Sets foundation for all changes | ✅ Done |
| 1.2 | Extract duplicated classes (`.grid`, `.black`, backgrounds) to global styles | S | Eliminates duplication in 12+ files | ✅ Done |
| 1.3 | Replace `btn-danger` Cancel with `btn-outline-secondary` in non-destructive modals | S | Fixes semantic confusion | ✅ Done |
| 1.4 | Remove all commented-out HTML from templates | S | Code hygiene | ✅ Done |
| 1.5 | Replace deprecated `custom-file` and `form-control-range` | S | Bootstrap 5 compliance | ✅ Done |
| 1.6 | Add `aria-label` to all icon-only buttons | S | Quick accessibility win | ✅ Done |
| 1.7 | Add `routerLinkActive` to nav links | S | Fixes navigation feedback | ✅ Done |

### Phase 2 — Sample Pages (Medium Effort, High Visual Impact) ✅ COMPLETED

| # | Task | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 2.1 | Convert all listing pages to card grid layout | M | Transforms the visual first impression | ✅ Done |
| 2.2 | Add `page-content` wrapper class with consistent padding | S | Visual consistency across pages | ✅ Done |
| 2.3 | Add breadcrumb navigation to detail pages | S | Better wayfinding | ✅ Done |
| 2.4 | Add zoom/background controls to sample detail canvases | S | Feature parity with test harnesses | ✅ Done |
| 2.5 | Add item count badges to listing page headers | S | At-a-glance information | ✅ Done |
| 2.6 | Add filter/search input to Animations listing | S | Discoverability for 50+ items | ✅ Done |

### Phase 3 — Editor & Tooling Polish (Medium Effort) ✅ COMPLETED

| # | Task | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 3.1 | Restructure toolbars with flexbox groups and dividers | M | Cleaner, more professional editor look | ✅ Done |
| 3.2 | Lighten split panel borders (5px → 1px, style gutter) | S | Modern, lighter feel | ✅ Done |
| 3.3 | Move title left and add status bar section | S | Standard toolbar layout | ✅ Done |
| 3.4 | Modernize file upload areas (drop zone pattern) | M | Better UX and visual polish | ✅ Done |
| 3.5 | Add file type icons in file list | S | Visual information density | ✅ Done |
| 3.6 | Categorize Model Playground Load menu | M | Better organization for 50+ items | ✅ Done |
| 3.7 | Style playground textarea (dark, monospace) | S | Quick code editor upgrade | ✅ Done |

### Phase 4 — Authentication & Shell (Medium Effort) ✅ COMPLETED

| # | Task | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 4.1 | Center and card-frame all auth pages | M | Professional auth flow | ✅ Done |
| 4.2 | Add user dropdown menu in header (when logged in) | M | Better auth UX | ✅ Done |
| 4.3 | Restructure nav taxonomy (Samples / Tools / Explore) | M | Clearer information architecture | ✅ Done |
| 4.4 | Fix footer overlap with CSS sticky footer | S | Eliminates hardcoded margin | ✅ Done |
| 4.5 | Add brand icon and use display font in navbar | S | Visual identity | ✅ Done |

### Phase 5 — Landing & Advanced (Higher Effort)

| # | Task | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 5.1 | Create Home/Landing page component | L | First-visit experience | ✅ Done |
| 5.2 | Add live thumbnail previews to sample cards | L | Visually stunning gallery | ✅ Done |
| 5.3 | Add code syntax highlighting to detail pages | M | Developer-friendly presentation | |
| 5.4 | Add copy-to-clipboard for code blocks | S | Developer convenience | |
| 5.5 | Integrate Monaco editor for Model Playground | L | Professional code editing | |
| 5.6 | Add dark mode toggle | L | Important for graphics/design tool | |
| 5.7 | Add route titles for accessibility | S | Screen reader support | |
| 5.8 | Implement responsive panel collapse for mobile | M | Mobile usability | |
| 5.9 | Add skip-to-content link | S | Accessibility compliance | |
| 5.10 | Remove unused Google Font imports (Coda, Coda Caption) | S | Performance | ✅ Done (Phase 1) |

### Effort Key
- **S** = Small (< 1 hour)
- **M** = Medium (1–4 hours)
- **L** = Large (4+ hours)
