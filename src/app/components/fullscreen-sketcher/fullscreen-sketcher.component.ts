import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef,
    Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Model } from 'elise-graphics/lib/core/model';
import { Sketcher } from 'elise-graphics/lib/sketcher/sketcher';
import { default as elise } from 'elise-graphics';
import { EliseViewComponent } from '../../elise/view/elise-view.component';

@Component({
    imports: [CommonModule, FormsModule, EliseViewComponent],
    selector: 'app-fullscreen-sketcher',
    templateUrl: './fullscreen-sketcher.component.html',
    styleUrls: ['./fullscreen-sketcher.component.scss']
})
export class FullscreenSketcherComponent implements OnInit, OnDestroy {
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    /** A raw model to sketch (will be cloned internally). */
    @Input() sourceModel: Model | undefined;

    /** JS model code that produces a model with a Sketcher already attached. */
    @Input() modelCode: string | undefined;

    /** Emitted when the user exits the fullscreen sketcher. */
    @Output() closed = new EventEmitter<void>();

    @ViewChild('sketcherHost', { read: ElementRef, static: true })
    sketcherHostRef!: ElementRef<HTMLDivElement>;

    @ViewChild('contextMenu', { read: ElementRef, static: false })
    contextMenuRef: ElementRef<HTMLDivElement> | undefined;

    model: Model | undefined;
    scale = 1;
    private clonedSourceModel: Model | undefined;
    private onFullscreenChangeBound: (() => void) | undefined;

    // Sketcher parameters
    timerDelay = 20;
    strokeBatchSize = 128;
    fillBatchSize = 32;
    strokeOpacity = 128;
    sketchColor = false;
    repeat = true;
    repeatDelay = 10000;
    fillDelay = 5000;

    // Context menu
    contextMenuVisible = false;
    contextMenuX = 0;
    contextMenuY = 0;

    ngOnInit(): void {
        if (!this.sourceModel && !this.modelCode) { return; }

        if (this.modelCode) {
            this.buildFromCode();
        } else {
            // Clone so the caller's model is never affected
            this.clonedSourceModel = Model.parse(this.sourceModel!.rawJSON());
            this.buildSketcher();
        }

        this.onFullscreenChangeBound = this.onFullscreenChange.bind(this);
        document.addEventListener('fullscreenchange', this.onFullscreenChangeBound);

        setTimeout(() => this.enterFullscreen());
    }

    ngOnDestroy(): void {
        if (this.onFullscreenChangeBound) {
            document.removeEventListener('fullscreenchange', this.onFullscreenChangeBound);
        }
    }

    private computeScale(targetModel: Model): number {
        const modelSize = targetModel.getSize();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        return Math.min(vw / modelSize!.width, vh / modelSize!.height);
    }

    private initialParamsLoaded = false;

    /** Build from JS model code (sketch samples) — creates a fresh model with Sketcher attached. */
    private buildFromCode(): void {
        let capturedSketcher: Sketcher | undefined;
        const originalSketcherFactory = elise.sketcher;
        const proxyElise = Object.create(elise);
        proxyElise.sketcher = (...args: Parameters<typeof elise.sketcher>) => {
            const s = originalSketcherFactory(...args);
            capturedSketcher = s;
            return s;
        };

        const modelFunction = new Function('elise', this.modelCode!);
        const freshModel = modelFunction(proxyElise) as Model;

        if (capturedSketcher) {
            if (!this.initialParamsLoaded) {
                this.initialParamsLoaded = true;
                this.timerDelay = capturedSketcher.timerDelay;
                this.strokeBatchSize = capturedSketcher.strokeBatchSize;
                this.fillBatchSize = capturedSketcher.fillBatchSize;
                this.strokeOpacity = capturedSketcher.strokeOpacity;
                this.sketchColor = capturedSketcher.sketchColor;
                this.repeat = capturedSketcher.repeat;
                this.repeatDelay = capturedSketcher.repeatDelay;
                this.fillDelay = capturedSketcher.fillDelay;
            } else {
                capturedSketcher.timerDelay = this.timerDelay;
                capturedSketcher.strokeBatchSize = this.strokeBatchSize;
                capturedSketcher.fillBatchSize = this.fillBatchSize;
                capturedSketcher.strokeOpacity = this.strokeOpacity;
                capturedSketcher.sketchColor = this.sketchColor;
                capturedSketcher.repeat = this.repeat;
                capturedSketcher.repeatDelay = this.repeatDelay;
                capturedSketcher.fillDelay = this.fillDelay;
            }
        }

        this.scale = this.computeScale(freshModel);
        freshModel.prepareResources(undefined, (result) => {
            if (result) {
                this.model = freshModel;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /** Build from a cloned source model (designer) — wraps in a new Sketcher. */
    private buildSketcher(): void {
        this.scale = this.computeScale(this.clonedSourceModel!);
        const modelSize = this.clonedSourceModel!.getSize();
        const drawModel = Model.create(modelSize!.width, modelSize!.height);
        drawModel.setFill('Black');
        const sketcher = new Sketcher(this.clonedSourceModel!).addTo(drawModel);
        sketcher.timerDelay = this.timerDelay;
        sketcher.strokeBatchSize = this.strokeBatchSize;
        sketcher.fillBatchSize = this.fillBatchSize;
        sketcher.strokeOpacity = this.strokeOpacity;
        sketcher.sketchColor = this.sketchColor;
        sketcher.repeat = this.repeat;
        sketcher.repeatDelay = this.repeatDelay;
        sketcher.fillDelay = this.fillDelay;
        this.model = drawModel;
    }

    restartSketch(): void {
        this.closeContextMenu();
        this.model = undefined;
        this.changeDetectorRef.detectChanges();
        if (this.modelCode) {
            this.buildFromCode();
        } else {
            // Re-clone from original input for a clean restart
            this.clonedSourceModel = Model.parse(this.sourceModel!.rawJSON());
            this.buildSketcher();
        }
        this.changeDetectorRef.detectChanges();
    }

    private enterFullscreen(): void {
        const el = this.sketcherHostRef?.nativeElement;
        if (el?.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
        }
    }

    private onFullscreenChange(): void {
        if (!document.fullscreenElement) {
            this.closed.emit();
        }
    }

    @HostListener('document:keydown.escape')
    onEscapeKey(): void {
        if (this.contextMenuVisible) {
            this.closeContextMenu();
            return;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        } else {
            this.closed.emit();
        }
    }

    @HostListener('window:resize')
    onResize(): void {
        if (this.model) {
            this.scale = this.computeScale(this.model);
        }
    }

    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.contextMenuX = event.clientX;
        this.contextMenuY = event.clientY;
        this.contextMenuVisible = true;
        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
            const menuEl = this.contextMenuRef?.nativeElement;
            if (!menuEl || !this.contextMenuVisible) { return; }
            const padding = 12;
            this.contextMenuX = Math.max(padding, Math.min(event.clientX, window.innerWidth - menuEl.offsetWidth - padding));
            this.contextMenuY = Math.max(padding, Math.min(event.clientY, window.innerHeight - menuEl.offsetHeight - padding));
            this.changeDetectorRef.detectChanges();
        });
    }

    closeContextMenu(): void {
        this.contextMenuVisible = false;
    }

    @HostListener('document:mousedown', ['$event'])
    onDocumentMouseDown(event: MouseEvent): void {
        if (!this.contextMenuVisible) { return; }
        const target = event.target as Node;
        const menuEl = this.contextMenuRef?.nativeElement;
        if (target && menuEl?.contains(target)) { return; }
        this.closeContextMenu();
    }

    applyAndRestart(): void {
        this.restartSketch();
    }
}
