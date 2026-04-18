import { Injectable } from '@angular/core';

export interface DocsPage {
    id: string;
    title: string;
    route: string;
    category: string;
    categoryTitle: string;
    icon?: string;
}

export interface DocsCategory {
    id: string;
    title: string;
    icon: string;
    pages: DocsPage[];
}

@Injectable({
    providedIn: 'root'
})
export class DocsService {

    readonly categories: DocsCategory[] = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: 'fa-rocket',
            pages: [
                { id: 'introduction', title: 'Introduction', route: '/docs/getting-started/introduction', category: 'getting-started', categoryTitle: 'Getting Started' },
                { id: 'quick-start', title: 'Quick Start', route: '/docs/getting-started/quick-start', category: 'getting-started', categoryTitle: 'Getting Started' },
                { id: 'core-concepts', title: 'Core Concepts', route: '/docs/getting-started/core-concepts', category: 'getting-started', categoryTitle: 'Getting Started' },
                { id: 'architecture', title: 'Architecture', route: '/docs/getting-started/architecture', category: 'getting-started', categoryTitle: 'Getting Started' },
                { id: 'coordinate-system', title: 'Coordinate System', route: '/docs/getting-started/coordinate-system', category: 'getting-started', categoryTitle: 'Getting Started' },
                { id: 'model-format', title: 'Model Format', route: '/docs/getting-started/model-format', category: 'getting-started', categoryTitle: 'Getting Started' }
            ]
        },
        {
            id: 'elements',
            title: 'Elements',
            icon: 'fa-shapes',
            pages: [
                { id: 'element-overview', title: 'Element Overview', route: '/docs/elements/element-overview', category: 'elements', categoryTitle: 'Elements' },
                { id: 'rectangle', title: 'Rectangle', route: '/docs/elements/rectangle', category: 'elements', categoryTitle: 'Elements' },
                { id: 'ellipse', title: 'Ellipse', route: '/docs/elements/ellipse', category: 'elements', categoryTitle: 'Elements' },
                { id: 'line', title: 'Line', route: '/docs/elements/line', category: 'elements', categoryTitle: 'Elements' },
                { id: 'polyline', title: 'Polyline', route: '/docs/elements/polyline', category: 'elements', categoryTitle: 'Elements' },
                { id: 'polygon', title: 'Polygon', route: '/docs/elements/polygon', category: 'elements', categoryTitle: 'Elements' },
                { id: 'path', title: 'Path', route: '/docs/elements/path', category: 'elements', categoryTitle: 'Elements' },
                { id: 'arc', title: 'Arc', route: '/docs/elements/arc', category: 'elements', categoryTitle: 'Elements' },
                { id: 'arrow', title: 'Arrow', route: '/docs/elements/arrow', category: 'elements', categoryTitle: 'Elements' },
                { id: 'wedge', title: 'Wedge', route: '/docs/elements/wedge', category: 'elements', categoryTitle: 'Elements' },
                { id: 'ring', title: 'Ring', route: '/docs/elements/ring', category: 'elements', categoryTitle: 'Elements' },
                { id: 'regular-polygon', title: 'Regular Polygon', route: '/docs/elements/regular-polygon', category: 'elements', categoryTitle: 'Elements' },
                { id: 'text', title: 'Text', route: '/docs/elements/text', category: 'elements', categoryTitle: 'Elements' },
                { id: 'rich-text', title: 'Rich Text', route: '/docs/elements/rich-text', category: 'elements', categoryTitle: 'Elements' },
                { id: 'text-path', title: 'Text Path', route: '/docs/elements/text-path', category: 'elements', categoryTitle: 'Elements' },
                { id: 'image', title: 'Image', route: '/docs/elements/image', category: 'elements', categoryTitle: 'Elements' },
                { id: 'model-element', title: 'Model Element', route: '/docs/elements/model-element', category: 'elements', categoryTitle: 'Elements' },
                { id: 'sprite', title: 'Sprite', route: '/docs/elements/sprite', category: 'elements', categoryTitle: 'Elements' }
            ]
        },
        {
            id: 'styling',
            title: 'Styling',
            icon: 'fa-palette',
            pages: [
                { id: 'styling-overview', title: 'Styling Overview', route: '/docs/styling/styling-overview', category: 'styling', categoryTitle: 'Styling' },
                { id: 'color-fills', title: 'Color Fills', route: '/docs/styling/color-fills', category: 'styling', categoryTitle: 'Styling' },
                { id: 'linear-gradients', title: 'Linear Gradients', route: '/docs/styling/linear-gradients', category: 'styling', categoryTitle: 'Styling' },
                { id: 'radial-gradients', title: 'Radial Gradients', route: '/docs/styling/radial-gradients', category: 'styling', categoryTitle: 'Styling' },
                { id: 'image-fills', title: 'Image Fills', route: '/docs/styling/image-fills', category: 'styling', categoryTitle: 'Styling' },
                { id: 'model-fills', title: 'Model Fills', route: '/docs/styling/model-fills', category: 'styling', categoryTitle: 'Styling' },
                { id: 'strokes', title: 'Strokes', route: '/docs/styling/strokes', category: 'styling', categoryTitle: 'Styling' },
                { id: 'opacity', title: 'Opacity', route: '/docs/styling/opacity', category: 'styling', categoryTitle: 'Styling' },
                { id: 'shadows', title: 'Shadows', route: '/docs/styling/shadows', category: 'styling', categoryTitle: 'Styling' },
                { id: 'blend-modes', title: 'Blend Modes', route: '/docs/styling/blend-modes', category: 'styling', categoryTitle: 'Styling' },
                { id: 'filters', title: 'Filters', route: '/docs/styling/filters', category: 'styling', categoryTitle: 'Styling' },
                { id: 'clip-paths', title: 'Clip Paths', route: '/docs/styling/clip-paths', category: 'styling', categoryTitle: 'Styling' },
                { id: 'transforms', title: 'Transforms', route: '/docs/styling/transforms', category: 'styling', categoryTitle: 'Styling' }
            ]
        },
        {
            id: 'animation',
            title: 'Animation',
            icon: 'fa-film',
            pages: [
                { id: 'animation-overview', title: 'Animation Overview', route: '/docs/animation/animation-overview', category: 'animation', categoryTitle: 'Animation' },
                { id: 'property-tweens', title: 'Property Tweens', route: '/docs/animation/property-tweens', category: 'animation', categoryTitle: 'Animation' },
                { id: 'easing-curves', title: 'Easing Curves', route: '/docs/animation/easing-curves', category: 'animation', categoryTitle: 'Animation' },
                { id: 'timer-callbacks', title: 'Timer Callbacks', route: '/docs/animation/timer-callbacks', category: 'animation', categoryTitle: 'Animation' },
                { id: 'sprite-animation', title: 'Sprite Animation', route: '/docs/animation/sprite-animation', category: 'animation', categoryTitle: 'Animation' },
                { id: 'frame-transitions', title: 'Frame Transitions', route: '/docs/animation/frame-transitions', category: 'animation', categoryTitle: 'Animation' }
            ]
        },
        {
            id: 'resources',
            title: 'Resources',
            icon: 'fa-database',
            pages: [
                { id: 'resource-overview', title: 'Resource Overview', route: '/docs/resources/resource-overview', category: 'resources', categoryTitle: 'Resources' },
                { id: 'bitmap-resources', title: 'Bitmap Resources', route: '/docs/resources/bitmap-resources', category: 'resources', categoryTitle: 'Resources' },
                { id: 'model-resources', title: 'Model Resources', route: '/docs/resources/model-resources', category: 'resources', categoryTitle: 'Resources' },
                { id: 'text-resources', title: 'Text Resources', route: '/docs/resources/text-resources', category: 'resources', categoryTitle: 'Resources' },
                { id: 'resource-manager', title: 'Resource Manager', route: '/docs/resources/resource-manager', category: 'resources', categoryTitle: 'Resources' }
            ]
        },
        {
            id: 'rendering',
            title: 'Rendering',
            icon: 'fa-desktop',
            pages: [
                { id: 'rendering-overview', title: 'Rendering Overview', route: '/docs/rendering/rendering-overview', category: 'rendering', categoryTitle: 'Rendering' },
                { id: 'canvas-rendering', title: 'Canvas Rendering', route: '/docs/rendering/canvas-rendering', category: 'rendering', categoryTitle: 'Rendering' },
                { id: 'svg-rendering', title: 'SVG Rendering', route: '/docs/rendering/svg-rendering', category: 'rendering', categoryTitle: 'Rendering' },
                { id: 'model-serialization', title: 'Model Serialization', route: '/docs/rendering/model-serialization', category: 'rendering', categoryTitle: 'Rendering' }
            ]
        },
        {
            id: 'design-surface',
            title: 'Design Surface',
            icon: 'fa-drafting-compass',
            pages: [
                { id: 'design-overview', title: 'Design Surface Overview', route: '/docs/design-surface/design-overview', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'design-controller', title: 'Design Controller', route: '/docs/design-surface/design-controller', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'design-tools', title: 'Design Tools', route: '/docs/design-surface/design-tools', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'selection', title: 'Selection & Manipulation', route: '/docs/design-surface/selection', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'undo-redo', title: 'Undo & Redo', route: '/docs/design-surface/undo-redo', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'grid-snapping', title: 'Grid & Snapping', route: '/docs/design-surface/grid-snapping', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'clipboard', title: 'Clipboard Operations', route: '/docs/design-surface/clipboard', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'text-editing', title: 'Text Editing', route: '/docs/design-surface/text-editing', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'point-editing', title: 'Point Editing', route: '/docs/design-surface/point-editing', category: 'design-surface', categoryTitle: 'Design Surface' },
                { id: 'components', title: 'Components', route: '/docs/design-surface/components', category: 'design-surface', categoryTitle: 'Design Surface' }
            ]
        },
        {
            id: 'surface',
            title: 'Surface Framework',
            icon: 'fa-layer-group',
            pages: [
                { id: 'surface-overview', title: 'Surface Overview', route: '/docs/surface/surface-overview', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-elements', title: 'Surface Elements', route: '/docs/surface/surface-elements', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-image-layer', title: 'Image Layers', route: '/docs/surface/surface-image-layer', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-html-layer', title: 'HTML Layers', route: '/docs/surface/surface-html-layer', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-video-layer', title: 'Video Layers', route: '/docs/surface/surface-video-layer', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-animation-layer', title: 'Animation Layers', route: '/docs/surface/surface-animation-layer', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-text-element', title: 'Text Elements', route: '/docs/surface/surface-text-element', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-button-element', title: 'Button Elements', route: '/docs/surface/surface-button-element', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-radio-strip', title: 'Radio Strips', route: '/docs/surface/surface-radio-strip', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-hidden-layer', title: 'Hidden Layers', route: '/docs/surface/surface-hidden-layer', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-transitions', title: 'Transitions', route: '/docs/surface/surface-transitions', category: 'surface', categoryTitle: 'Surface Framework' },
                { id: 'surface-commands', title: 'Commands & Navigation', route: '/docs/surface/surface-commands', category: 'surface', categoryTitle: 'Surface Framework' }
            ]
        },
        {
            id: 'import-export',
            title: 'Import & Export',
            icon: 'fa-file-code',
            pages: [
                { id: 'svg-import', title: 'SVG Import', route: '/docs/import-export/svg-import', category: 'import-export', categoryTitle: 'Import & Export' },
                { id: 'svg-export', title: 'SVG Export', route: '/docs/import-export/svg-export', category: 'import-export', categoryTitle: 'Import & Export' },
                { id: 'wmf-import', title: 'WMF Import', route: '/docs/import-export/wmf-import', category: 'import-export', categoryTitle: 'Import & Export' }
            ]
        },
        {
            id: 'sketcher',
            title: 'Sketcher',
            icon: 'fa-pencil-ruler',
            pages: [
                { id: 'sketcher-overview', title: 'Sketcher Engine', route: '/docs/sketcher/sketcher-overview', category: 'sketcher', categoryTitle: 'Sketcher' }
            ]
        },
        {
            id: 'tools',
            title: 'Tools & Guides',
            icon: 'fa-tools',
            pages: [
                { id: 'model-designer-guide', title: 'Model Designer Guide', route: '/docs/tools/model-designer-guide', category: 'tools', categoryTitle: 'Tools & Guides' },
                { id: 'container-explorer-guide', title: 'Container Explorer Guide', route: '/docs/tools/container-explorer-guide', category: 'tools', categoryTitle: 'Tools & Guides' },
                { id: 'model-playground-guide', title: 'Model Playground Guide', route: '/docs/tools/model-playground-guide', category: 'tools', categoryTitle: 'Tools & Guides' }
            ]
        }
    ];

    getAllPages(): DocsPage[] {
        return this.categories.flatMap(cat => cat.pages);
    }

    getPage(categoryId: string, pageId: string): DocsPage | undefined {
        const category = this.categories.find(c => c.id === categoryId);
        return category?.pages.find(p => p.id === pageId);
    }

    getCategory(categoryId: string): DocsCategory | undefined {
        return this.categories.find(c => c.id === categoryId);
    }

    getNextPage(categoryId: string, pageId: string): DocsPage | undefined {
        const allPages = this.getAllPages();
        const currentIndex = allPages.findIndex(p => p.category === categoryId && p.id === pageId);
        return currentIndex >= 0 && currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : undefined;
    }

    getPreviousPage(categoryId: string, pageId: string): DocsPage | undefined {
        const allPages = this.getAllPages();
        const currentIndex = allPages.findIndex(p => p.category === categoryId && p.id === pageId);
        return currentIndex > 0 ? allPages[currentIndex - 1] : undefined;
    }
}
