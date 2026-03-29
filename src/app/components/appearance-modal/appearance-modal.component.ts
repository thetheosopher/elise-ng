import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerDirective } from 'ngx-color-picker';

interface BlendModeOption {
    label: string;
    value: GlobalCompositeOperation | '';
}

interface FilterPresetOption {
    label: string;
    value: string;
}

@Component({
    imports: [CommonModule, FormsModule, NgbModule, ColorPickerDirective],
    selector: 'app-appearance-modal',
    templateUrl: './appearance-modal.component.html',
    styleUrls: ['./appearance-modal.component.scss']
})
export class AppearanceModalComponent {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: AppearanceModalInfo;

    readonly blendModeOptions: BlendModeOption[] = [
        { label: 'Default', value: '' },
        { label: 'Multiply', value: 'multiply' },
        { label: 'Screen', value: 'screen' },
        { label: 'Overlay', value: 'overlay' },
        { label: 'Darken', value: 'darken' },
        { label: 'Lighten', value: 'lighten' },
        { label: 'Color Dodge', value: 'color-dodge' },
        { label: 'Color Burn', value: 'color-burn' },
        { label: 'Hard Light', value: 'hard-light' },
        { label: 'Soft Light', value: 'soft-light' },
        { label: 'Difference', value: 'difference' },
        { label: 'Exclusion', value: 'exclusion' },
        { label: 'Hue', value: 'hue' },
        { label: 'Saturation', value: 'saturation' },
        { label: 'Color', value: 'color' },
        { label: 'Luminosity', value: 'luminosity' }
    ];

    readonly blendModePresets: BlendModeOption[] = [
        { label: 'Default', value: '' },
        { label: 'Multiply', value: 'multiply' },
        { label: 'Screen', value: 'screen' },
        { label: 'Overlay', value: 'overlay' },
        { label: 'Difference', value: 'difference' }
    ];

    readonly filterPresets: FilterPresetOption[] = [
        { label: 'None', value: '' },
        { label: 'Blur', value: 'blur(3px)' },
        { label: 'Grayscale', value: 'grayscale(85%)' },
        { label: 'Sepia', value: 'sepia(65%)' },
        { label: 'Contrast', value: 'contrast(140%)' },
        { label: 'Saturate', value: 'saturate(160%)' }
    ];

    ngOnInit() {
        this.modalInfo.opacity = this.normalizeOpacity(this.modalInfo.opacity);
        this.modalInfo.shadowColor = this.modalInfo.shadowColor ?? '#00000055';
        this.modalInfo.shadowBlur = this.normalizeShadowBlur(this.modalInfo.shadowBlur);
        this.modalInfo.shadowOffsetX = this.normalizeShadowOffset(this.modalInfo.shadowOffsetX);
        this.modalInfo.shadowOffsetY = this.normalizeShadowOffset(this.modalInfo.shadowOffsetY);
        this.modalInfo.filter = this.normalizeFilter(this.modalInfo.filter);
        this.modalInfo.blendMode = this.modalInfo.blendMode ?? '';
        this.modalInfo.applyToModel = !!this.modalInfo.applyToModel;
        this.modalInfo.applyToSelected = !!this.modalInfo.applyToSelected;
        this.modalInfo.interactive = this.modalInfo.interactive !== false;
        this.modalInfo.shadowEnabled = !!this.modalInfo.shadowEnabled;
    }

    commit() {
        this.modalInfo.opacity = this.normalizeOpacity(this.modalInfo.opacity);
        this.modalInfo.shadowBlur = this.normalizeShadowBlur(this.modalInfo.shadowBlur);
        this.modalInfo.shadowOffsetX = this.normalizeShadowOffset(this.modalInfo.shadowOffsetX);
        this.modalInfo.shadowOffsetY = this.normalizeShadowOffset(this.modalInfo.shadowOffsetY);
        this.modalInfo.filter = this.normalizeFilter(this.modalInfo.filter);
        this.activeModal.close(this.modalInfo);
    }

    colorPickerChange(color: string) {
        this.modalInfo.shadowColor = color;
    }

    applyBlendModePreset(blendMode: GlobalCompositeOperation | '') {
        this.modalInfo.blendMode = blendMode;
    }

    applyFilterPreset(filter: string) {
        this.modalInfo.filter = filter;
    }

    get previewShadowStyle() {
        return this.modalInfo.shadowEnabled
            ? {
                boxShadow: `${this.modalInfo.shadowOffsetX}px ${this.modalInfo.shadowOffsetY}px ${this.modalInfo.shadowBlur}px ${this.modalInfo.shadowColor}`
            }
            : {};
    }

    private normalizeOpacity(opacity: number) {
        const normalized = Math.round(Number(opacity));
        if (!Number.isFinite(normalized)) {
            return 255;
        }
        return Math.max(0, Math.min(255, normalized));
    }

    private normalizeShadowBlur(blur: number) {
        const normalized = Number(blur);
        if (!Number.isFinite(normalized)) {
            return 12;
        }
        return Math.max(0, normalized);
    }

    private normalizeShadowOffset(offset: number) {
        const normalized = Number(offset);
        return Number.isFinite(normalized) ? normalized : 0;
    }

    private normalizeFilter(filter?: string) {
        return (filter ?? '').trim();
    }
}

export class AppearanceModalInfo {
    opacity = 255;
    interactive = true;
    blendMode: GlobalCompositeOperation | '' = '';
    filter = '';
    shadowEnabled = false;
    shadowColor = '#00000055';
    shadowBlur = 12;
    shadowOffsetX = 6;
    shadowOffsetY = 8;
    applyToModel = false;
    applyToSelected = true;
    selectedElementCount = 0;
}
