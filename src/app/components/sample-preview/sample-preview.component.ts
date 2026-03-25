import { AfterViewInit, Component, DestroyRef, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Model } from 'elise-graphics/lib/core/model';
import { default as elise } from 'elise-graphics';
import { ModelService } from '../../services/model.service';
import { EliseViewComponent } from '../../elise/view/elise-view.component';

@Component({
    imports: [CommonModule, EliseViewComponent],
    selector: 'app-sample-preview',
    templateUrl: './sample-preview.component.html',
    styleUrls: ['./sample-preview.component.scss']
})
export class SamplePreviewComponent implements AfterViewInit, OnDestroy {
    private readonly destroyRef = inject(DestroyRef);

    @ViewChild('previewHost', { static: true })
    previewHost: ElementRef<HTMLElement>;

    @Input({ required: true }) type: string;
    @Input({ required: true }) id: string;
    @Input() previewMode: 'static' | 'animated' = 'static';
    @Input() backgroundStyle: 'grid' | 'white' = 'grid';
    @Input() timerEnabled = false;
    @Input() scale = 0.24;

    model: Model | null = null;
    loadFailed = false;
    isLoaded = false;

    private observer?: IntersectionObserver;
    private hasRequestedLoad = false;

    get usesAnimatedPreview(): boolean {
        return this.previewMode === 'animated' && this.timerEnabled;
    }

    constructor(private modelService: ModelService) {}

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

    private loadPreview() {
        if (this.hasRequestedLoad || !this.type || !this.id) {
            return;
        }

        this.hasRequestedLoad = true;
        this.modelService.getModel(this.type, this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (modelCode) => {
                try {
                    const modelFactory = new Function('elise', modelCode);
                    const model = modelFactory(elise) as Model;
                    model.prepareResources(null, (result) => {
                        this.isLoaded = true;
                        if (result) {
                            this.model = model;
                            this.loadFailed = false;
                        }
                        else {
                            this.model = null;
                            this.loadFailed = true;
                        }
                    });
                }
                catch {
                    this.isLoaded = true;
                    this.loadFailed = true;
                    this.model = null;
                }
            },
            error: () => {
                this.isLoaded = true;
                this.loadFailed = true;
                this.model = null;
            }
        });
    }
}
