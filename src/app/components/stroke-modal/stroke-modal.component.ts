import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, NamedColor } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';

@Component({
    imports: [CommonModule, FormsModule, ColorPickerDirective, ColorSelectorComponent],
    selector: 'app-stroke-modal',
    templateUrl: './stroke-modal.component.html',
    styleUrls: ['./stroke-modal.component.scss']
})
export class StrokeModalComponent implements OnInit {

    readonly lineCapOptions: Array<{ value: CanvasLineCap; label: string }> = [
        { value: 'butt', label: 'Butt' },
        { value: 'round', label: 'Round' },
        { value: 'square', label: 'Square' }
    ];

    readonly lineJoinOptions: Array<{ value: CanvasLineJoin; label: string }> = [
        { value: 'miter', label: 'Miter' },
        { value: 'round', label: 'Round' },
        { value: 'bevel', label: 'Bevel' }
    ];

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: StrokeModalInfo;

    ngOnInit(): void {
        this.modalInfo.strokeType = this.modalInfo.strokeType ?? 'color';
        this.modalInfo.width = this.getNormalizedWidth(this.modalInfo.width);
        this.modalInfo.color = this.modalInfo.color ?? '#000000ff';
        this.modalInfo.dashPatternText = this.normalizeDashPatternText(this.modalInfo.dashPatternText);
        this.modalInfo.lineCap = this.normalizeLineCap(this.modalInfo.lineCap);
        this.modalInfo.lineJoin = this.normalizeLineJoin(this.modalInfo.lineJoin);
        this.modalInfo.miterLimit = this.getNormalizedMiterLimit(this.modalInfo.miterLimit);
        this.modalInfo.applyToModel = !!this.modalInfo.applyToModel;
        this.modalInfo.applyToSelected = !!this.modalInfo.applyToSelected;
    }

    commit() {
        this.modalInfo.width = this.getNormalizedWidth(this.modalInfo.width);
        this.modalInfo.dashPatternText = this.normalizeDashPatternText(this.modalInfo.dashPatternText);
        this.modalInfo.lineCap = this.normalizeLineCap(this.modalInfo.lineCap);
        this.modalInfo.lineJoin = this.normalizeLineJoin(this.modalInfo.lineJoin);
        this.modalInfo.miterLimit = this.getNormalizedMiterLimit(this.modalInfo.miterLimit);
        this.activeModal.close(this.modalInfo);
    }

    onColorSelected(event) {
        if (this.modalInfo.namedColor) {
            this.modalInfo.color = (this.modalInfo.namedColor.color as Color).toHexString();
        }
    }

    colorPickerChange(event: string) {
        this.modalInfo.color = event;
    }

    get previewStrokeDashArray(): string | null {
        const dashPatternText = this.normalizeDashPatternText(this.modalInfo.dashPatternText);
        return dashPatternText.length > 0 ? dashPatternText.replace(/,/g, ' ') : null;
    }

    get showMiterLimit(): boolean {
        return this.modalInfo.lineJoin === 'miter';
    }

    private getNormalizedWidth(width?: number): number {
        const normalizedWidth = Number(width);
        return Number.isFinite(normalizedWidth) && normalizedWidth > 0 ? normalizedWidth : 1;
    }

    private getNormalizedMiterLimit(miterLimit?: number): number {
        const normalizedMiterLimit = Number(miterLimit);
        return Number.isFinite(normalizedMiterLimit) && normalizedMiterLimit > 0 ? normalizedMiterLimit : 10;
    }

    private normalizeDashPatternText(dashPatternText?: string): string {
        if (!dashPatternText) {
            return '';
        }

        return dashPatternText
            .split(/[\s,]+/)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value >= 0)
            .join(', ');
    }

    private normalizeLineCap(lineCap?: CanvasLineCap): CanvasLineCap {
        return lineCap === 'round' || lineCap === 'square' ? lineCap : 'butt';
    }

    private normalizeLineJoin(lineJoin?: CanvasLineJoin): CanvasLineJoin {
        return lineJoin === 'round' || lineJoin === 'bevel' ? lineJoin : 'miter';
    }
}

export class StrokeModalInfo {
    strokeType = 'color';
    width?: number;
    color: string;
    namedColor: NamedColor;
    dashPatternText = '';
    lineCap: CanvasLineCap = 'butt';
    lineJoin: CanvasLineJoin = 'miter';
    miterLimit = 10;
    applyToModel: boolean;
    applyToSelected: boolean;
    selectedElementCount: number;
}
