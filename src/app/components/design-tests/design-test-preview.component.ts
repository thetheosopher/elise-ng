import { AfterViewInit, Component, DestroyRef, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Model } from 'elise-graphics/lib/core/model';
import { DesignController, GridType } from 'elise-graphics';
import { EliseDesignComponent } from '../../elise/design/elise-design.component';
import { DesignSample } from '../../interfaces/design-sample';
import { ISampleDesigner } from '../../interfaces/sample-designer';

@Component({
    imports: [CommonModule, EliseDesignComponent],
    selector: 'app-design-test-preview',
    templateUrl: './design-test-preview.component.html',
    styleUrls: ['./design-test-preview.component.scss']
})
export class DesignTestPreviewComponent implements AfterViewInit, OnDestroy {
    private readonly destroyRef = inject(DestroyRef);
    private readonly previewWidth = 220;
    private readonly previewHeight = 132;
    private readonly previewPadding = 12;

    @ViewChild('previewHost', { static: true })
    previewHost: ElementRef<HTMLElement>;

    @Input({ required: true }) test: DesignSample;

    model: Model | null = null;
    background: 'grid' | 'black' | 'white' | 'gray' = 'white';
    scale = 1;
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
        }, {
            rootMargin: '160px 0px'
        });

        this.observer.observe(this.previewHost.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }

    controllerSet(controller: DesignController | null): void {
        if (!controller) {
            return;
        }

        controller.setGridType(GridType.None);
        controller.draw();
    }

    backgroundClass() {
        return {
            grid: this.background === 'grid',
            black: this.background === 'black',
            white: this.background === 'white',
            gray: this.background === 'gray'
        };
    }

    private loadPreview(): void {
        if (this.hasRequestedLoad || !this.test) {
            return;
        }

        this.hasRequestedLoad = true;

        try {
            const viewer = this.createPreviewDesigner();
            this.test.configure(viewer);
            viewer.model.prepareResources(null, (result) => {
                this.isLoaded = true;
                if (!result) {
                    this.model = null;
                    this.loadFailed = true;
                    return;
                }

                this.model = viewer.model;
                this.background = viewer.background as 'grid' | 'black' | 'white' | 'gray';
                this.scale = this.computeScale(viewer.model);
                this.loadFailed = false;
            });
        }
        catch {
            this.isLoaded = true;
            this.loadFailed = true;
            this.model = null;
        }
    }

    private createPreviewDesigner(): ISampleDesigner {
        return {
            title: this.test.title,
            description: this.test.description,
            model: Model.create(320, 320),
            scale: 1,
            displayModel: false,
            background: 'white'
        };
    }

    private computeScale(model: Model): number {
        const size = model.getSize();
        const availableWidth = Math.max(this.previewWidth - (this.previewPadding * 2), 1);
        const availableHeight = Math.max(this.previewHeight - (this.previewPadding * 2), 1);
        const widthScale = availableWidth / Math.max(size.width, 1);
        const heightScale = availableHeight / Math.max(size.height, 1);
        return Math.min(widthScale, heightScale, 1);
    }
}
