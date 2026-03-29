import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export type ModelExportFormat = 'svg' | 'png' | 'jpeg' | 'webp';

interface ExportFormatOption {
    label: string;
    value: ModelExportFormat;
}

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-export-model-modal',
    templateUrl: './export-model-modal.component.html',
    styleUrls: ['./export-model-modal.component.scss']
})
export class ExportModelModalComponent {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: ExportModelModalInfo;

    readonly formatOptions: ExportFormatOption[] = [
        { label: 'SVG', value: 'svg' },
        { label: 'PNG', value: 'png' },
        { label: 'JPEG', value: 'jpeg' },
        { label: 'WebP', value: 'webp' }
    ];

    ngOnInit() {
        this.modalInfo.scale = this.normalizeScale(this.modalInfo.scale);
        this.modalInfo.quality = this.normalizeQuality(this.modalInfo.quality);
        this.modalInfo.fileName = this.normalizeFileName(this.modalInfo.fileName, this.modalInfo.format);
    }

    get isRasterFormat() {
        return this.modalInfo.format !== 'svg';
    }

    get supportsQuality() {
        return this.modalInfo.format === 'jpeg' || this.modalInfo.format === 'webp';
    }

    get estimatedWidth() {
        return Math.max(1, Math.round(this.modalInfo.modelWidth * (this.modalInfo.scale / 100)));
    }

    get estimatedHeight() {
        return Math.max(1, Math.round(this.modalInfo.modelHeight * (this.modalInfo.scale / 100)));
    }

    onFormatChanged() {
        this.modalInfo.fileName = this.normalizeFileName(this.modalInfo.fileName, this.modalInfo.format);
    }

    commit() {
        this.modalInfo.scale = this.normalizeScale(this.modalInfo.scale);
        this.modalInfo.quality = this.normalizeQuality(this.modalInfo.quality);
        this.modalInfo.fileName = this.normalizeFileName(this.modalInfo.fileName, this.modalInfo.format);
        this.activeModal.close(this.modalInfo);
    }

    private normalizeScale(scale?: number) {
        const normalized = Math.round(Number(scale));
        if (!Number.isFinite(normalized)) {
            return 100;
        }
        return Math.max(10, Math.min(800, normalized));
    }

    private normalizeQuality(quality?: number) {
        const normalized = Math.round(Number(quality));
        if (!Number.isFinite(normalized)) {
            return 92;
        }
        return Math.max(1, Math.min(100, normalized));
    }

    private normalizeFileName(fileName: string, format: ModelExportFormat) {
        const trimmed = (fileName ?? '').trim() || 'model';
        const extension = this.getExtensionForFormat(format);
        const currentExtensionIndex = trimmed.lastIndexOf('.');
        const baseName = currentExtensionIndex > 0 ? trimmed.substring(0, currentExtensionIndex) : trimmed;
        return `${baseName}${extension}`;
    }

    private getExtensionForFormat(format: ModelExportFormat) {
        switch (format) {
            case 'jpeg':
                return '.jpg';
            case 'webp':
                return '.webp';
            case 'svg':
                return '.svg';
            default:
                return '.png';
        }
    }
}

export class ExportModelModalInfo {
    format: ModelExportFormat = 'png';
    fileName = 'model.png';
    scale = 100;
    quality = 92;
    modelWidth = 0;
    modelHeight = 0;
}
