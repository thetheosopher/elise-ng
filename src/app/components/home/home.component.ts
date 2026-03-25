import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModelService } from '../../services/model.service';

interface LandingLink {
    title: string;
    route: string;
    description: string;
    icon: string;
    eyebrow: string;
    requiresAuth?: boolean;
}

@Component({
    imports: [CommonModule, RouterModule],
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

    readonly sampleLinks: LandingLink[] = [
        {
            title: 'Primitives',
            route: '/primitives',
            description: 'Explore the core shapes, paths, text, and drawing fundamentals that anchor the Elise rendering model.',
            icon: 'fa-draw-polygon',
            eyebrow: 'Foundation'
        },
        {
            title: 'Animations',
            route: '/animations',
            description: 'Move through kinetic demos ranging from geometric systems to physics-inspired scenes and visual effects.',
            icon: 'fa-wand-magic-sparkles',
            eyebrow: 'Motion'
        },
        {
            title: 'Sketches',
            route: '/sketches',
            description: 'Browse looser experiments and compositional studies that show how the library behaves in expressive use.',
            icon: 'fa-pen-ruler',
            eyebrow: 'Exploration'
        }
    ];

    readonly toolLinks: LandingLink[] = [
        {
            title: 'Model Designer',
            route: '/tests/model-designer',
            description: 'Compose models visually with layered editing, transforms, file workflows, and element controls.',
            icon: 'fa-compass-drafting',
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
            description: 'Manage remote files and folders, upload assets, and inspect the storage structure behind editing workflows.',
            icon: 'fa-folder-tree',
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
            description: 'Review surface rendering and composition scenarios when you need low-level visual confirmation.',
            icon: 'fa-border-all',
            eyebrow: 'Rendering'
        }
    ];

    constructor(private modelService: ModelService) {}

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
}
