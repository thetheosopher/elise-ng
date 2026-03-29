import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, ModelResource, BitmapResource, NamedColor } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';

interface FillPreset {
    label: string;
    description: string;
    summary: string;
    values: Partial<FillModalInfo> & { gradientStops?: FillModalGradientStopInfo[] };
}

@Component({
    imports: [CommonModule, FormsModule, ColorPickerDirective, ColorSelectorComponent],
    selector: 'app-fill-modal',
    templateUrl: './fill-modal.component.html',
    styleUrls: ['./fill-modal.component.scss']
})
export class FillModalComponent implements OnInit {

    readonly defaultGradientStart = '#000000ff';
    readonly defaultGradientEnd = '#ffffffff';
    readonly fillPresets: FillPreset[] = [
        {
            label: 'Paper',
            description: 'A neutral opaque fill for clean surfaces and cards.',
            summary: 'Solid white',
            values: { fillType: 'color', color: '#fffdf7ff', opacity: 255 }
        },
        {
            label: 'Accent Wash',
            description: 'A slightly transparent accent fill for overlays and callouts.',
            summary: 'Solid teal 88%',
            values: { fillType: 'color', color: '#0f766ee0', opacity: 224 }
        },
        {
            label: 'Sunrise',
            description: 'A warm diagonal blend for hero panels and decorative frames.',
            summary: 'Linear 3 stops',
            values: {
                fillType: 'linearGradient',
                opacity: 255,
                gradientStops: [
                    { color: '#fb7185ff', offset: 0 },
                    { color: '#f59e0bff', offset: 0.52 },
                    { color: '#fde68aff', offset: 1 }
                ],
                linearGradientStartX: 0,
                linearGradientStartY: 0,
                linearGradientEndX: 100,
                linearGradientEndY: 100
            }
        },
        {
            label: 'Ocean Drift',
            description: 'A cool horizontal blend for backgrounds and diagrams.',
            summary: 'Linear 3 stops',
            values: {
                fillType: 'linearGradient',
                opacity: 255,
                gradientStops: [
                    { color: '#0f766eff', offset: 0 },
                    { color: '#0ea5e9ff', offset: 0.48 },
                    { color: '#dbeafeff', offset: 1 }
                ],
                linearGradientStartX: 0,
                linearGradientStartY: 50,
                linearGradientEndX: 100,
                linearGradientEndY: 50
            }
        },
        {
            label: 'Spotlight',
            description: 'A bright center glow fading toward the outer edge.',
            summary: 'Radial 3 stops',
            values: {
                fillType: 'radialGradient',
                opacity: 255,
                gradientStops: [
                    { color: '#ffffffff', offset: 0 },
                    { color: '#bfdbfeff', offset: 0.42 },
                    { color: '#1d4ed8ff', offset: 1 }
                ],
                radialGradientCenterX: 50,
                radialGradientCenterY: 50,
                radialGradientFocusX: 50,
                radialGradientFocusY: 45,
                radialGradientRadiusX: 60,
                radialGradientRadiusY: 60
            }
        },
        {
            label: 'Vignette',
            description: 'A dark edge treatment that pulls focus toward the center.',
            summary: 'Radial 3 stops',
            values: {
                fillType: 'radialGradient',
                opacity: 255,
                gradientStops: [
                    { color: '#00000000', offset: 0 },
                    { color: '#0f172a55', offset: 0.62 },
                    { color: '#0f172acc', offset: 1 }
                ],
                radialGradientCenterX: 50,
                radialGradientCenterY: 50,
                radialGradientFocusX: 50,
                radialGradientFocusY: 50,
                radialGradientRadiusX: 72,
                radialGradientRadiusY: 72
            }
        }
    ];

    constructor(public activeModal: NgbActiveModal) {
     }

    @Input()
    modalInfo: FillModalInfo;

    ngOnInit(): void {
        this.modalInfo.fillType = this.modalInfo.fillType ?? 'color';
        this.modalInfo.color = this.modalInfo.color ?? '#ffffffff';
        this.modalInfo.opacity = this.normalizeOpacity(this.modalInfo.opacity);
        this.modalInfo.scale = this.normalizeScale(this.modalInfo.scale);
        this.modalInfo.fillOffsetX = this.normalizeNumber(this.modalInfo.fillOffsetX);
        this.modalInfo.fillOffsetY = this.normalizeNumber(this.modalInfo.fillOffsetY);
        this.modalInfo.applyToModel = !!this.modalInfo.applyToModel;
        this.modalInfo.applyToSelected = !!this.modalInfo.applyToSelected;
        if (this.hasNoSupportedSelectionTargets) {
            this.modalInfo.applyToSelected = false;
        }
        this.ensureGradientStops();
    }

    commit() {
        this.modalInfo.opacity = this.normalizeOpacity(this.modalInfo.opacity);
        this.modalInfo.scale = this.normalizeScale(this.modalInfo.scale);
        this.modalInfo.fillOffsetX = this.normalizeNumber(this.modalInfo.fillOffsetX);
        this.modalInfo.fillOffsetY = this.normalizeNumber(this.modalInfo.fillOffsetY);
        this.ensureGradientStops();
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

    colorPickerChange(event) {
        this.modalInfo.color = event;
    }

    onColorSelected(event) {
        if(this.modalInfo.namedColor) {
            this.modalInfo.color = (this.modalInfo.namedColor.color as Color).toHexString();
        }
    }

    applyFillPreset(preset: FillPreset) {
        this.modalInfo.fillType = preset.values.fillType ?? 'color';
        this.modalInfo.color = preset.values.color ?? this.modalInfo.color;
        this.modalInfo.opacity = this.normalizeOpacity(preset.values.opacity ?? this.modalInfo.opacity);
        this.modalInfo.scale = this.normalizeScale(preset.values.scale ?? this.modalInfo.scale);
        this.modalInfo.fillOffsetX = this.normalizeNumber(preset.values.fillOffsetX ?? this.modalInfo.fillOffsetX);
        this.modalInfo.fillOffsetY = this.normalizeNumber(preset.values.fillOffsetY ?? this.modalInfo.fillOffsetY);

        if (preset.values.gradientStops) {
            this.modalInfo.gradientStops = this.normalizeGradientStops(preset.values.gradientStops);
        }

        this.modalInfo.linearGradientStartX = this.normalizeNumber(preset.values.linearGradientStartX ?? this.modalInfo.linearGradientStartX);
        this.modalInfo.linearGradientStartY = this.normalizeNumber(preset.values.linearGradientStartY ?? this.modalInfo.linearGradientStartY);
        this.modalInfo.linearGradientEndX = this.normalizeNumber(preset.values.linearGradientEndX ?? this.modalInfo.linearGradientEndX);
        this.modalInfo.linearGradientEndY = this.normalizeNumber(preset.values.linearGradientEndY ?? this.modalInfo.linearGradientEndY);

        this.modalInfo.radialGradientCenterX = this.normalizeNumber(preset.values.radialGradientCenterX ?? this.modalInfo.radialGradientCenterX);
        this.modalInfo.radialGradientCenterY = this.normalizeNumber(preset.values.radialGradientCenterY ?? this.modalInfo.radialGradientCenterY);
        this.modalInfo.radialGradientFocusX = this.normalizeNumber(preset.values.radialGradientFocusX ?? this.modalInfo.radialGradientFocusX);
        this.modalInfo.radialGradientFocusY = this.normalizeNumber(preset.values.radialGradientFocusY ?? this.modalInfo.radialGradientFocusY);
        this.modalInfo.radialGradientRadiusX = this.normalizeNumber(preset.values.radialGradientRadiusX ?? this.modalInfo.radialGradientRadiusX);
        this.modalInfo.radialGradientRadiusY = this.normalizeNumber(preset.values.radialGradientRadiusY ?? this.modalInfo.radialGradientRadiusY);
    }

    isFillPresetActive(preset: FillPreset) {
        const fillType = preset.values.fillType ?? 'color';
        if (this.modalInfo.fillType !== fillType) {
            return false;
        }

        if (fillType === 'color') {
            return (this.modalInfo.color ?? '').toLowerCase() === (preset.values.color ?? '').toLowerCase()
                && this.normalizeOpacity(this.modalInfo.opacity) === this.normalizeOpacity(preset.values.opacity ?? this.modalInfo.opacity);
        }

        if (fillType === 'linearGradient') {
            return this.areGradientStopsEqual(this.modalInfo.gradientStops, preset.values.gradientStops)
                && this.normalizeNumber(this.modalInfo.linearGradientStartX) === this.normalizeNumber(preset.values.linearGradientStartX)
                && this.normalizeNumber(this.modalInfo.linearGradientStartY) === this.normalizeNumber(preset.values.linearGradientStartY)
                && this.normalizeNumber(this.modalInfo.linearGradientEndX) === this.normalizeNumber(preset.values.linearGradientEndX)
                && this.normalizeNumber(this.modalInfo.linearGradientEndY) === this.normalizeNumber(preset.values.linearGradientEndY);
        }

        if (fillType === 'radialGradient') {
            return this.areGradientStopsEqual(this.modalInfo.gradientStops, preset.values.gradientStops)
                && this.normalizeNumber(this.modalInfo.radialGradientCenterX) === this.normalizeNumber(preset.values.radialGradientCenterX)
                && this.normalizeNumber(this.modalInfo.radialGradientCenterY) === this.normalizeNumber(preset.values.radialGradientCenterY)
                && this.normalizeNumber(this.modalInfo.radialGradientFocusX) === this.normalizeNumber(preset.values.radialGradientFocusX)
                && this.normalizeNumber(this.modalInfo.radialGradientFocusY) === this.normalizeNumber(preset.values.radialGradientFocusY)
                && this.normalizeNumber(this.modalInfo.radialGradientRadiusX) === this.normalizeNumber(preset.values.radialGradientRadiusX)
                && this.normalizeNumber(this.modalInfo.radialGradientRadiusY) === this.normalizeNumber(preset.values.radialGradientRadiusY);
        }

        return false;
    }

    get fillSummary() {
        return {
            type: this.modalInfo.fillType === 'linearGradient'
                ? 'Linear'
                : this.modalInfo.fillType === 'radialGradient'
                    ? 'Radial'
                    : this.modalInfo.fillType === 'color'
                        ? 'Solid'
                        : this.modalInfo.fillType,
            opacity: `${this.normalizeOpacity(this.modalInfo.opacity)}`,
            detail: this.modalInfo.fillType === 'linearGradient' || this.modalInfo.fillType === 'radialGradient'
                ? `${this.normalizeGradientStops(this.modalInfo.gradientStops).length} stops`
                : this.modalInfo.fillType === 'color'
                    ? 'Single color'
                    : 'Resource'
        };
    }

    onFillTypeChanged() {
        if (this.modalInfo.fillType === 'linearGradient' || this.modalInfo.fillType === 'radialGradient') {
            this.ensureGradientStops();
        }
    }

    gradientStopColorPickerChange(index: number, color: string) {
        if (!this.modalInfo.gradientStops[index]) {
            return;
        }

        this.modalInfo.gradientStops[index].color = color;
    }

    addGradientStop() {
        const gradientStops = this.normalizeGradientStops(this.modalInfo.gradientStops);
        const lastStop = gradientStops[gradientStops.length - 1];
        const previousStop = gradientStops[gradientStops.length - 2] ?? gradientStops[0];
        const newOffset = gradientStops.length < 2 ? 0.5 : (lastStop.offset + previousStop.offset) / 2;
        gradientStops.push({
            color: lastStop?.color ?? this.defaultGradientEnd,
            offset: this.normalizeOffset(newOffset)
        });
        this.modalInfo.gradientStops = this.normalizeGradientStops(gradientStops);
    }

    duplicateGradientStop(index: number) {
        const gradientStops = this.normalizeGradientStops(this.modalInfo.gradientStops);
        const stopToDuplicate = gradientStops[index];
        if (!stopToDuplicate) {
            return;
        }

        gradientStops.splice(index + 1, 0, {
            color: stopToDuplicate.color,
            offset: this.normalizeOffset(stopToDuplicate.offset)
        });
        this.modalInfo.gradientStops = this.normalizeGradientStops(gradientStops);
    }

    removeGradientStop(index: number) {
        if (this.modalInfo.gradientStops.length <= 2) {
            return;
        }

        this.modalInfo.gradientStops = this.normalizeGradientStops(
            this.modalInfo.gradientStops.filter((_, stopIndex) => stopIndex !== index)
        );
    }

    reverseGradientStops() {
        const reversedStops = this.normalizeGradientStops(this.modalInfo.gradientStops)
            .slice()
            .reverse()
            .map((stop) => ({
                color: stop.color,
                offset: this.normalizeOffset(1 - stop.offset)
            }));
        this.modalInfo.gradientStops = this.normalizeGradientStops(reversedStops);
    }

    evenlyDistributeGradientStops() {
        const gradientStops = this.normalizeGradientStops(this.modalInfo.gradientStops);
        if (gradientStops.length < 2) {
            return;
        }

        const step = 1 / (gradientStops.length - 1);
        this.modalInfo.gradientStops = gradientStops.map((stop, index) => ({
            color: stop.color,
            offset: this.normalizeOffset(step * index)
        }));
    }

    onOpacityChanged(event: Event) {
        const target = event.target as HTMLInputElement | null;
        const nextValue = Number(target?.value ?? this.modalInfo.opacity);
        this.modalInfo.opacity = this.normalizeOpacity(nextValue);
    }

    trackByIndex(index: number) {
        return index;
    }

    compareBitmapResources(resourceA: BitmapResource, resourceB: BitmapResource) {
        try {
            return resourceA.key === resourceB.key;
        }
        catch {
            return false;
        }
    }

    compareModelResources(resourceA: ModelResource, resourceB: ModelResource) {
        try {
            return resourceA.key === resourceB.key;
        }
        catch {
            return false;
        }
    }

    private ensureGradientStops() {
        this.modalInfo.gradientStops = this.normalizeGradientStops(this.modalInfo.gradientStops);
    }

    private normalizeGradientStops(stops?: FillModalGradientStopInfo[]) {
        const normalizedStops = (stops ?? [])
            .map((stop) => ({
                color: stop?.color?.trim() || this.defaultGradientStart,
                offset: this.normalizeOffset(stop?.offset)
            }))
            .sort((left, right) => left.offset - right.offset);

        if (normalizedStops.length === 0) {
            return [
                { color: this.defaultGradientStart, offset: 0 },
                { color: this.defaultGradientEnd, offset: 1 }
            ];
        }

        if (normalizedStops.length === 1) {
            return [
                { color: normalizedStops[0].color, offset: 0 },
                { color: normalizedStops[0].color, offset: 1 }
            ];
        }

        return normalizedStops;
    }

    private areGradientStopsEqual(left?: FillModalGradientStopInfo[], right?: FillModalGradientStopInfo[]) {
        const normalizedLeft = this.normalizeGradientStops(left);
        const normalizedRight = this.normalizeGradientStops(right);
        if (normalizedLeft.length !== normalizedRight.length) {
            return false;
        }

        return normalizedLeft.every((stop, index) => stop.color.toLowerCase() === normalizedRight[index].color.toLowerCase()
            && stop.offset === normalizedRight[index].offset);
    }

    private normalizeOffset(offset?: number) {
        const normalizedOffset = Number(offset);
        if (!Number.isFinite(normalizedOffset)) {
            return 0;
        }
        return Math.max(0, Math.min(1, normalizedOffset));
    }

    private normalizeOpacity(opacity?: number) {
        const normalizedOpacity = Math.round(Number(opacity));
        if (!Number.isFinite(normalizedOpacity)) {
            return 255;
        }
        return Math.max(0, Math.min(255, normalizedOpacity));
    }

    private normalizeScale(scale?: number) {
        const normalizedScale = Number(scale);
        if (!Number.isFinite(normalizedScale) || normalizedScale <= 0) {
            return 100;
        }
        return normalizedScale;
    }

    private normalizeNumber(value?: number) {
        const normalizedValue = Number(value);
        return Number.isFinite(normalizedValue) ? normalizedValue : 0;
    }
}

export class FillModalGradientStopInfo {
    color = '#000000ff';
    offset = 0;
}

export class FillModalInfo {
    scale = 100;
    fillType = 'color';
    applyToModel = false;
    applyToSelected = true;
    selectedElementCount = 0;
    mixedValueLabels: string[] = [];
    supportedSelectedElementCount = 0;
    unsupportedSelectedElementCount = 0;

    color = '#ffffffff';
    namedColor: NamedColor = new NamedColor('White', Color.White);
    gradientStops: FillModalGradientStopInfo[] = [
        { color: '#000000ff', offset: 0 },
        { color: '#ffffffff', offset: 1 }
    ];

    linearGradientStartX = 0;
    linearGradientStartY = 0;
    linearGradientEndX = 100;
    linearGradientEndY = 100;

    radialGradientCenterX = 50;
    radialGradientCenterY = 50;
    radialGradientFocusX = 50;
    radialGradientFocusY = 50;
    radialGradientRadiusX = 50;
    radialGradientRadiusY = 50;

    opacity = 255;
    fillOffsetX = 0;
    fillOffsetY = 0;
    bitmapResources: BitmapResource[] = [];
    selectedBitmapResource?: BitmapResource;
    modelResources: ModelResource[] = [];
    selectedModelResource?: ModelResource;
}
