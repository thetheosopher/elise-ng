import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModelService } from '../../services/model.service';
import { SamplePreviewComponent } from '../sample-preview/sample-preview.component';

interface LandingLink {
    title: string;
    route: string;
    description: string;
    icon: string;
    eyebrow: string;
    requiresAuth?: boolean;
}

interface ShowcaseItem {
    type: string;
    id: string;
    title: string;
    description: string;
    route: string;
    animated: boolean;
    previewScale?: number;
}

interface FeatureFamily {
    icon: string;
    title: string;
    description: string;
}

interface DifferentiatorItem {
    icon: string;
    title: string;
    description: string;
}

@Component({
    imports: [CommonModule, RouterModule, SamplePreviewComponent],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    sampleCounts = {
        primitives: null as number | null,
        animations: null as number | null,
        sketches: null as number | null
    };

    heroAnimation!: ShowcaseItem;

    /** Featured live demos in the showcase strip */
    readonly showcaseItems: ShowcaseItem[] = [
        {
            type: 'animations',
            id: 'aurora-borealis',
            title: 'Aurora Borealis',
            description: 'Undulating ribbon polylines over a starfield — runtime animation with timer callbacks.',
            route: '/animations/aurora-borealis',
            animated: true,
            previewScale: 0.38
        },
        {
            type: 'animations',
            id: 'metaballs',
            title: 'Metaballs',
            description: 'Bouncing metaball blobs that merge and separate with color blending.',
            route: '/animations/metaballs',
            animated: true,
            previewScale: 0.44
        },
        {
            type: 'animations',
            id: 'spirograph',
            title: 'Spirograph',
            description: 'Progressive drawing with glowing pens — polyline paths, gradients, and easing curves.',
            route: '/animations/spirograph',
            animated: true,
            previewScale: 0.4
        },
        {
            type: 'sketches',
            id: 'flower',
            title: 'Flower Sketch',
            description: 'Progressive reveal of 12,000+ polygon strokes via the Sketcher engine.',
            route: '/sketches/flower',
            animated: true,
            previewScale: 0.38
        },
        {
            type: 'animations',
            id: 'lorenz-attractor',
            title: 'Lorenz Attractor',
            description: 'Chaotic system rendered as glowing evolving trails — real-time math visualization.',
            route: '/animations/lorenz-attractor',
            animated: true,
            previewScale: 0.42
        },
        {
            type: 'animations',
            id: 'dna-helix',
            title: 'DNA Helix',
            description: 'Rotating 3D double helix — color-coded base pairs with perspective transforms.',
            route: '/animations/dna-helix',
            animated: true,
            previewScale: 0.39
        }
    ];

    /** Ten major feature families from the library */
    readonly featureFamilies: FeatureFamily[] = [
        {
            icon: 'fa-project-diagram',
            title: 'Retained Scene Graph',
            description: 'Mutate elements and redraw — no immediate-mode command streams.'
        },
        {
            icon: 'fa-shapes',
            title: 'Rich Primitives',
            description: 'Rectangles, ellipses, arcs, arrows, rings, wedges, paths, polygons, text, images, sprites, and nested models.'
        },
        {
            icon: 'fa-palette',
            title: 'Advanced Styling',
            description: 'Gradients, image fills, model fills, shadows, blend modes, filters, clip paths, and dash patterns.'
        },
        {
            icon: 'fa-database',
            title: 'Resource System',
            description: 'Shared bitmaps, models, and locale-aware text resources with async loading.'
        },
        {
            icon: 'fa-desktop',
            title: 'Dual Runtime Renderers',
            description: 'Canvas and SVG rendering from the same retained model — choose the right target per use case.'
        },
        {
            icon: 'fa-drafting-compass',
            title: 'Design Surface',
            description: 'Selection, drag/resize/rotate, grid snapping, smart alignment, clipboard, undo/redo, and inline rich-text editing.'
        },
        {
            icon: 'fa-film',
            title: 'Animation Engine',
            description: 'Property tweens with 31 easing curves, sprite frame timelines, and pane transitions.'
        },
        {
            icon: 'fa-file-code',
            title: 'SVG Interop',
            description: 'Import SVG into the model graph and export models back to standards-compliant SVG markup.'
        },
        {
            icon: 'fa-layer-group',
            title: 'Surface Framework',
            description: 'Multi-pane application shell with canvas, HTML, image, video layers, buttons, and animated transitions.'
        },
        {
            icon: 'fa-puzzle-piece',
            title: 'Components & Commands',
            description: 'Reusable higher-order components and declarative command routing on interactive elements.'
        }
    ];

    /** Key differentiators for the comparison section */
    readonly differentiators: DifferentiatorItem[] = [
        {
            icon: 'fa-pen-nib',
            title: 'Built-in Design Surface',
            description: 'Not just a renderer — Elise includes a full browser-based authoring surface with tools, selection, undo/redo, and inline rich-text editing.'
        },
        {
            icon: 'fa-code-branch',
            title: 'One Model, Multiple Outputs',
            description: 'Render to canvas for performance, SVG for DOM inspection, or export to markup — all from the same retained model.'
        },
        {
            icon: 'fa-cubes',
            title: 'Nested Composition',
            description: 'Embed models inside models. Reusable ModelResources act as symbols for scalable scene composition.'
        },
        {
            icon: 'fa-layer-group',
            title: 'Application-Ready Surfaces',
            description: 'Build kiosks, signage, and interactive presentations with the Surface framework — panes, transitions, video layers, and navigation built in.'
        }
    ];

    readonly sampleLinks: LandingLink[] = [
        {
            title: 'Primitives',
            route: '/primitives',
            description: 'Core shapes, paths, text, and drawing fundamentals that anchor the rendering model.',
            icon: 'fa-draw-polygon',
            eyebrow: 'Foundation'
        },
        {
            title: 'Animations',
            route: '/animations',
            description: 'Kinetic demos from geometric systems to physics-inspired scenes and visual effects.',
            icon: 'fa-film',
            eyebrow: 'Motion'
        },
        {
            title: 'Sketches',
            route: '/sketches',
            description: 'Progressive-reveal compositions that show the Sketcher engine in expressive use.',
            icon: 'fa-pencil-ruler',
            eyebrow: 'Exploration'
        }
    ];

    readonly toolLinks: LandingLink[] = [
        {
            title: 'Model Designer',
            route: '/tests/model-designer',
            description: 'Compose models visually with layered editing, transforms, file workflows, and element controls.',
            icon: 'fa-drafting-compass',
            eyebrow: 'Authoring',
            requiresAuth: true
        },
        {
            title: 'Model Playground',
            route: '/tests/model-playground',
            description: 'Write model code directly, load reference samples, and iterate on rendering behavior in one workspace.',
            icon: 'fa-code',
            eyebrow: 'Scripting',
            requiresAuth: true
        },
        {
            title: 'Container Explorer',
            route: '/tests/container-explorer',
            description: 'Manage remote files and folders, upload assets, and inspect storage behind editing workflows.',
            icon: 'fa-folder-open',
            eyebrow: 'Storage',
            requiresAuth: true
        }
    ];

    readonly exploreLinks: LandingLink[] = [
        {
            title: 'View Tests',
            route: '/tests/view',
            description: 'Inspect rendering behavior through isolated view-focused harnesses and comparison scenarios.',
            icon: 'fa-binoculars',
            eyebrow: 'Inspection'
        },
        {
            title: 'Design Tests',
            route: '/tests/design',
            description: 'Validate design-surface behavior and editor interactions with focused test harnesses.',
            icon: 'fa-layer-group',
            eyebrow: 'Verification'
        },
        {
            title: 'Surface Tests',
            route: '/tests/surface',
            description: 'Review surface rendering and composition scenarios for low-level visual confirmation.',
            icon: 'fa-border-all',
            eyebrow: 'Rendering'
        }
    ];

    /** Code sample displayed in the code showcase section */
    readonly codeSample = `// Create a model and add styled elements
var model = elise.model(640, 360).setFill('#0f172a');

var card = elise.rectangle(32, 32, 280, 160)
    .setFill('#1e293b')
    .setStroke('#38bdf8,2')
    .setCornerRadii(16, 16, 8, 8)
    .setShadow({ color: 'rgba(56,189,248,0.2)', blur: 24, offsetX: 0, offsetY: 8 })
    .setInteractive(true);
model.add(card);

// Animate on interaction
card.animate({ opacity: 0.85, fill: '#334155' }, {
    duration: 400, easing: 'easeOutCubic'
});

// Render to canvas or SVG — same model, dual output
var view = elise.view(document.getElementById('host'), model);`;

    constructor(private modelService: ModelService) {
        this.heroAnimation = this.pickRandomAnimation();
    }

    ngOnInit() {
        forkJoin({
            primitives: this.modelService.listModels('primitives').pipe(catchError(() => of([]))),
            animations: this.modelService.listModels('animations').pipe(catchError(() => of([]))),
            sketches: this.modelService.listModels('sketches').pipe(catchError(() => of([])))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ primitives, animations, sketches }) => {
            this.sampleCounts = {
                primitives: primitives.length,
                animations: animations.length,
                sketches: sketches.length
            };
        });
    }

    trackByRoute(_index: number, item: LandingLink): string {
        return item.route;
    }

    trackByShowcase(_index: number, item: ShowcaseItem): string {
        return item.id;
    }

    trackByTitle(_index: number, item: FeatureFamily | DifferentiatorItem): string {
        return item.title;
    }

    private pickRandomAnimation(): ShowcaseItem {
        const animationItems = this.showcaseItems.filter(item => item.type === 'animations');
        const randomIndex = Math.floor(Math.random() * animationItems.length);
        return animationItems[randomIndex];
    }
}
