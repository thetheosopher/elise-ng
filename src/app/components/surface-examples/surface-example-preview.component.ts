import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Surface } from 'elise-graphics/lib/surface/surface';
import { EliseSurfaceComponent } from '../../elise/surface/elise-surface.component';
import { SurfaceSample } from '../../interfaces/surface-sample';
import { ISurfaceViewer } from '../../interfaces/surface-viewer';

@Component({
    imports: [CommonModule, EliseSurfaceComponent],
    selector: 'app-surface-example-preview',
    templateUrl: './surface-example-preview.component.html',
    styleUrls: ['./surface-example-preview.component.scss']
})
export class SurfaceExamplePreviewComponent implements AfterViewInit, OnDestroy {
    private readonly previewWidth = 220;
    private readonly previewHeight = 132;
    private readonly previewPadding = 12;

    @ViewChild('previewHost', { static: true })
    previewHost!: ElementRef<HTMLElement>;

    @Input({ required: true }) example!: SurfaceSample;

    surface: Surface | null = null;
    scale = 1;
    opacity = 1;
    loadFailed = false;
    isLoaded = false;

    private observer?: IntersectionObserver;
    private hasRequestedLoad = false;

    ngAfterViewInit(): void {
        if (typeof IntersectionObserver === 'undefined') {
            this.loadPreview();
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                this.loadPreview();
                this.observer?.disconnect();
                this.observer = undefined;
            }
        }, { rootMargin: '160px 0px' });

        this.observer.observe(this.previewHost.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }

    private loadPreview(): void {
        if (this.hasRequestedLoad || !this.example) {
            return;
        }

        this.hasRequestedLoad = true;

        try {
            const viewer = this.createPreviewViewer();
            this.example.configure(viewer);
            this.surface = viewer.surface;
            this.opacity = viewer.opacity;
            this.scale = this.computeScale(viewer.surface);
            this.isLoaded = true;
            this.loadFailed = false;
        } catch {
            this.isLoaded = true;
            this.loadFailed = true;
            this.surface = null;
        }
    }

    private createPreviewViewer(): ISurfaceViewer {
        return {
            title: this.example.title,
            description: this.example.description,
            surface: Surface.create(640, 480, '', 1),
            scale: 1,
            opacity: 1,
            transition: 'fade',
            transitionDisplay: false,
            log: () => undefined
        };
    }

    private computeScale(surface: Surface): number {
        const sizedSurface = surface as Surface & { width?: number; height?: number };
        const width = Math.max(sizedSurface.width ?? 640, 1);
        const height = Math.max(sizedSurface.height ?? 480, 1);
        const availableWidth = Math.max(this.previewWidth - (this.previewPadding * 2), 1);
        const availableHeight = Math.max(this.previewHeight - (this.previewPadding * 2), 1);
        const widthScale = availableWidth / width;
        const heightScale = availableHeight / height;
        return Math.min(widthScale, heightScale, 1);
    }
}
