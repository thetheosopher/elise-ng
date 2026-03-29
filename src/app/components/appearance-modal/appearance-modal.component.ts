import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerDirective } from 'ngx-color-picker';

interface BlendModeOption {
    label: string;
    value: GlobalCompositeOperation | '';
}

interface FilterPresetOption {
    label: string;
    value: string;
}

interface AppearancePreset {
    label: string;
    description: string;
    summary: string;
    values: {
        opacity: number;
        blendMode: GlobalCompositeOperation | '';
        filter: string;
        shadowEnabled: boolean;
        shadowColor: string;
        shadowBlur: number;
        shadowOffsetX: number;
        shadowOffsetY: number;
        interactive: boolean;
    };
}

@Component({
    imports: [CommonModule, FormsModule, ColorPickerDirective],
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

    readonly appearancePresets: AppearancePreset[] = [
        {
            label: 'Neutral',
            description: 'Reset to a clean default look with no extra effects.',
            summary: 'Opacity 100% · Default blend · No filter',
            values: {
                opacity: 255,
                blendMode: '',
                filter: '',
                shadowEnabled: false,
                shadowColor: '#00000055',
                shadowBlur: 12,
                shadowOffsetX: 6,
                shadowOffsetY: 8,
                interactive: true
            }
        },
        {
            label: 'Soft Elevation',
            description: 'A gentle shadow and slightly reduced opacity for layered cards and panels.',
            summary: 'Opacity 94% · Default blend · Soft shadow',
            values: {
                opacity: 240,
                blendMode: '',
                filter: '',
                shadowEnabled: true,
                shadowColor: '#0f172a30',
                shadowBlur: 18,
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                interactive: true
            }
        },
        {
            label: 'Ink Multiply',
            description: 'Use multiply compositing with a print-like contrast bump for illustrations and overlays.',
            summary: 'Opacity 92% · Multiply · Contrast + Sepia',
            values: {
                opacity: 235,
                blendMode: 'multiply',
                filter: 'contrast(118%) sepia(14%)',
                shadowEnabled: false,
                shadowColor: '#00000055',
                shadowBlur: 12,
                shadowOffsetX: 6,
                shadowOffsetY: 8,
                interactive: true
            }
        },
        {
            label: 'Atmospheric Glow',
            description: 'A brightened screen blend with a cool glow for accent elements and badges.',
            summary: 'Opacity 100% · Screen · Brightness + Saturate',
            values: {
                opacity: 255,
                blendMode: 'screen',
                filter: 'brightness(112%) saturate(128%)',
                shadowEnabled: true,
                shadowColor: '#67e8f960',
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                interactive: true
            }
        },
        {
            label: 'Frosted Overlay',
            description: 'A softened, slightly desaturated treatment for translucent overlay layers.',
            summary: 'Opacity 88% · Screen · Blur + Grayscale',
            values: {
                opacity: 224,
                blendMode: 'screen',
                filter: 'blur(1px) grayscale(18%) brightness(108%)',
                shadowEnabled: true,
                shadowColor: '#ffffff55',
                shadowBlur: 14,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                interactive: true
            }
        }
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

    applyAppearancePreset(preset: AppearancePreset) {
        this.modalInfo.opacity = this.normalizeOpacity(preset.values.opacity);
        this.modalInfo.blendMode = preset.values.blendMode;
        this.modalInfo.filter = this.normalizeFilter(preset.values.filter);
        this.modalInfo.shadowEnabled = preset.values.shadowEnabled;
        this.modalInfo.shadowColor = preset.values.shadowColor;
        this.modalInfo.shadowBlur = this.normalizeShadowBlur(preset.values.shadowBlur);
        this.modalInfo.shadowOffsetX = this.normalizeShadowOffset(preset.values.shadowOffsetX);
        this.modalInfo.shadowOffsetY = this.normalizeShadowOffset(preset.values.shadowOffsetY);
        this.modalInfo.interactive = preset.values.interactive;
    }

    isAppearancePresetActive(preset: AppearancePreset) {
        return this.normalizeOpacity(this.modalInfo.opacity) === this.normalizeOpacity(preset.values.opacity)
            && (this.modalInfo.blendMode ?? '') === preset.values.blendMode
            && this.normalizeFilter(this.modalInfo.filter) === this.normalizeFilter(preset.values.filter)
            && !!this.modalInfo.shadowEnabled === preset.values.shadowEnabled
            && (this.modalInfo.shadowColor ?? '') === preset.values.shadowColor
            && this.normalizeShadowBlur(this.modalInfo.shadowBlur) === this.normalizeShadowBlur(preset.values.shadowBlur)
            && this.normalizeShadowOffset(this.modalInfo.shadowOffsetX) === this.normalizeShadowOffset(preset.values.shadowOffsetX)
            && this.normalizeShadowOffset(this.modalInfo.shadowOffsetY) === this.normalizeShadowOffset(preset.values.shadowOffsetY)
            && this.modalInfo.interactive === preset.values.interactive;
    }

    get effectSummary() {
        return {
            blendMode: this.modalInfo.blendMode || 'Default',
            filter: this.modalInfo.filter || 'None',
            shadow: this.modalInfo.shadowEnabled
                ? `${this.modalInfo.shadowBlur}px blur`
                : 'Off'
        };
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
    mixedValueLabels: string[] = [];
}
