import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    InternalImageTracingService,
    InternalTraceOptions,
    InternalTraceProgress,
    InternalTracePresetDefinition,
    InternalTraceResult
} from '../../services/internal-image-tracing.service';

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-internal-trace-image-modal',
    templateUrl: './internal-trace-image-modal.component.html',
    styleUrls: ['./internal-trace-image-modal.component.scss']
})
export class InternalTraceImageModalComponent implements OnInit, OnDestroy {

    constructor(
        public activeModal: NgbActiveModal,
        private tracingService: InternalImageTracingService) {
    }

    @Input()
    modalInfo!: InternalTraceImageModalInfo;

    presetDefinitions: InternalTracePresetDefinition[] = [];
    traceOptions!: InternalTraceOptions;
    traceResult?: InternalTraceResult;
    tracedPreviewSource = '';
    sourceInfo = '';
    traceError = '';
    isBusy = false;
    showAdvancedOptions = false;
    traceProgress = 0;
    traceProgressLabel = 'Preparing image';
    traceCompleted = false;
    private completionBadgeTimer?: ReturnType<typeof setTimeout>;

    ngOnInit(): void {
        this.presetDefinitions = this.tracingService.getPresetDefinitions();
        this.traceOptions = this.tracingService.getInitialOptions();
        if (this.modalInfo?.image?.naturalWidth && this.modalInfo?.image?.naturalHeight) {
            this.sourceInfo = `${this.modalInfo.image.naturalWidth}x${this.modalInfo.image.naturalHeight}`;
        }
        void this.traceImage();
    }

    ngOnDestroy(): void {
        if (this.completionBadgeTimer) {
            clearTimeout(this.completionBadgeTimer);
            this.completionBadgeTimer = undefined;
        }
    }

    get selectedPreset() {
        return this.presetDefinitions.find(p => p.id === this.traceOptions.presetId);
    }

    get tracedInfo() {
        if (!this.traceResult) {
            return '';
        }
        return `${this.traceResult.tracedWidth}x${this.traceResult.tracedHeight} • ${this.traceResult.estimatedComplexity} shapes • ${this.traceResult.colorCount} colors`;
    }

    onPresetChanged() {
        this.traceOptions = this.tracingService.getDefaultOptions(this.traceOptions.presetId);
        this.onOptionsChanged();
    }

    onOptionsChanged() {
        this.tracingService.rememberOptions(this.traceOptions);
    }

    async traceImage() {
        this.isBusy = true;
        this.traceError = '';
        this.traceResult = undefined;
        this.tracedPreviewSource = '';
        this.traceProgress = 4;
        this.traceProgressLabel = 'Preparing image';
        this.traceCompleted = false;
        if (this.completionBadgeTimer) {
            clearTimeout(this.completionBadgeTimer);
            this.completionBadgeTimer = undefined;
        }

        this.onOptionsChanged();

        try {
            const result = await this.tracingService.traceImageSource(
                this.modalInfo.source,
                this.traceOptions,
                this.modalInfo.image,
                (progress: InternalTraceProgress) => {
                    this.traceProgress = progress.progress;
                    this.traceProgressLabel = progress.stage;
                }
            );
            this.traceResult = result;
            this.sourceInfo = `${result.sourceWidth}x${result.sourceHeight}`;
            this.tracedPreviewSource = this.buildSvgDataUrl(result.svgText);
            this.traceCompleted = true;
            this.completionBadgeTimer = setTimeout(() => {
                this.traceCompleted = false;
                this.completionBadgeTimer = undefined;
            }, 1800);
        }
        catch (error) {
            this.traceError = error instanceof Error ? error.message : String(error ?? 'Image tracing failed.');
        }
        finally {
            this.isBusy = false;
        }
    }

    commit() {
        if (!this.traceResult) {
            return;
        }

        this.activeModal.close({
            ...this.traceResult,
            tracedPath: this.getTracedPath(this.modalInfo.path)
        } as InternalTraceImageModalResult);
    }

    private buildSvgDataUrl(svgText: string) {
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    }

    private getTracedPath(path: string) {
        const extensionIndex = path.lastIndexOf('.');
        if (extensionIndex === -1) {
            return `${path}.svg`;
        }
        return `${path.substring(0, extensionIndex)}.svg`;
    }
}

export class InternalTraceImageModalInfo {
    source!: string;
    path!: string;
    image?: HTMLImageElement;
}

export interface InternalTraceImageModalResult extends InternalTraceResult {
    tracedPath: string;
}
