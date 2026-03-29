import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, NamedColor } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';

interface StrokePreset {
    label: string;
    description: string;
    summary: string;
    values: Partial<StrokeModalInfo>;
}

@Component({
    imports: [CommonModule, FormsModule, ColorPickerDirective, ColorSelectorComponent],
    selector: 'app-stroke-modal',
    templateUrl: './stroke-modal.component.html',
    styleUrls: ['./stroke-modal.component.scss']
})
export class StrokeModalComponent implements OnInit {

    readonly strokePresets: StrokePreset[] = [
        {
            label: 'Hairline',
            description: 'A clean single-pixel outline for precise diagrams and layout guides.',
            summary: '1px solid · Butt · Miter',
            values: { strokeType: 'color', width: 1, color: '#111827ff', dashPatternText: '', lineCap: 'butt', lineJoin: 'miter', miterLimit: 10 }
        },
        {
            label: 'Soft Round',
            description: 'A rounded medium stroke for sketches, icons, and friendly UI shapes.',
            summary: '4px solid · Round · Round',
            values: { strokeType: 'color', width: 4, color: '#0f766eff', dashPatternText: '', lineCap: 'round', lineJoin: 'round', miterLimit: 10 }
        },
        {
            label: 'Dashed Rail',
            description: 'A steady dashed pattern for guides, borders, and supporting marks.',
            summary: '3px dash 16,8 · Butt · Miter',
            values: { strokeType: 'color', width: 3, color: '#475569ff', dashPatternText: '16, 8', lineCap: 'butt', lineJoin: 'miter', miterLimit: 10 }
        },
        {
            label: 'Marching Dots',
            description: 'A dotted rhythm using round caps for callouts and selection states.',
            summary: '3px dash 1,10 · Round · Round',
            values: { strokeType: 'color', width: 3, color: '#2563ebff', dashPatternText: '1, 10', lineCap: 'round', lineJoin: 'round', miterLimit: 10 }
        },
        {
            label: 'Poster Frame',
            description: 'A strong square-capped outline for badges, posters, and emphasis blocks.',
            summary: '6px solid · Square · Bevel',
            values: { strokeType: 'color', width: 6, color: '#7c2d12ff', dashPatternText: '', lineCap: 'square', lineJoin: 'bevel', miterLimit: 10 }
        },
        {
            label: 'No Stroke',
            description: 'Remove the outline entirely while keeping the rest of the element intact.',
            summary: 'None',
            values: { strokeType: 'none' }
        }
    ];

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
        if (this.hasNoSupportedSelectionTargets) {
            this.modalInfo.applyToSelected = false;
        }
    }

    commit() {
        this.modalInfo.width = this.getNormalizedWidth(this.modalInfo.width);
        this.modalInfo.dashPatternText = this.normalizeDashPatternText(this.modalInfo.dashPatternText);
        this.modalInfo.lineCap = this.normalizeLineCap(this.modalInfo.lineCap);
        this.modalInfo.lineJoin = this.normalizeLineJoin(this.modalInfo.lineJoin);
        this.modalInfo.miterLimit = this.getNormalizedMiterLimit(this.modalInfo.miterLimit);
        if (this.hasNoSupportedSelectionTargets) {
            this.modalInfo.applyToSelected = false;
        }
        this.activeModal.close(this.modalInfo);
    }

    get hasPartialSelectionCoverage() {
        return this.modalInfo.selectedElementCount > 0
            && this.modalInfo.supportedSelectedElementCount > 0
            && this.modalInfo.unsupportedSelectedElementCount > 0;
    }

    get hasNoSupportedSelectionTargets() {
        return this.modalInfo.selectedElementCount > 0 && this.modalInfo.supportedSelectedElementCount === 0;
    }

    onColorSelected(event) {
        if (this.modalInfo.namedColor) {
            this.modalInfo.color = (this.modalInfo.namedColor.color as Color).toHexString();
        }
    }

    colorPickerChange(event: string) {
        this.modalInfo.color = event;
    }

    applyStrokePreset(preset: StrokePreset) {
        this.modalInfo.strokeType = preset.values.strokeType ?? 'color';
        if (this.modalInfo.strokeType === 'none') {
            return;
        }

        this.modalInfo.width = this.getNormalizedWidth(preset.values.width);
        this.modalInfo.color = preset.values.color ?? this.modalInfo.color ?? '#000000ff';
        this.modalInfo.dashPatternText = this.normalizeDashPatternText(preset.values.dashPatternText);
        this.modalInfo.lineCap = this.normalizeLineCap(preset.values.lineCap);
        this.modalInfo.lineJoin = this.normalizeLineJoin(preset.values.lineJoin);
        this.modalInfo.miterLimit = this.getNormalizedMiterLimit(preset.values.miterLimit);
    }

    isStrokePresetActive(preset: StrokePreset) {
        const strokeType = preset.values.strokeType ?? 'color';
        if (this.modalInfo.strokeType !== strokeType) {
            return false;
        }

        if (strokeType === 'none') {
            return true;
        }

        return this.getNormalizedWidth(this.modalInfo.width) === this.getNormalizedWidth(preset.values.width)
            && (this.modalInfo.color ?? '').toLowerCase() === (preset.values.color ?? '').toLowerCase()
            && this.normalizeDashPatternText(this.modalInfo.dashPatternText) === this.normalizeDashPatternText(preset.values.dashPatternText)
            && this.normalizeLineCap(this.modalInfo.lineCap) === this.normalizeLineCap(preset.values.lineCap)
            && this.normalizeLineJoin(this.modalInfo.lineJoin) === this.normalizeLineJoin(preset.values.lineJoin)
            && this.getNormalizedMiterLimit(this.modalInfo.miterLimit) === this.getNormalizedMiterLimit(preset.values.miterLimit);
    }

    get strokeSummary() {
        return {
            width: this.modalInfo.strokeType === 'none' ? 'None' : `${this.getNormalizedWidth(this.modalInfo.width)}px`,
            dash: this.modalInfo.strokeType === 'none'
                ? 'Off'
                : (this.normalizeDashPatternText(this.modalInfo.dashPatternText) || 'Solid'),
            join: this.modalInfo.strokeType === 'none'
                ? 'Off'
                : `${this.normalizeLineCap(this.modalInfo.lineCap)} / ${this.normalizeLineJoin(this.modalInfo.lineJoin)}`
        };
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
    mixedValueLabels: string[] = [];
    supportedSelectedElementCount = 0;
    unsupportedSelectedElementCount = 0;
}
