import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, ModelResource, BitmapResource, NamedColor } from 'elise-graphics';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';

@Component({
    imports: [CommonModule, FormsModule, ColorPickerDirective, ColorSelectorComponent],
    selector: 'app-fill-modal',
    templateUrl: './fill-modal.component.html',
    styleUrls: ['./fill-modal.component.scss']
})
export class FillModalComponent implements OnInit {

    readonly defaultGradientStart = '#000000ff';
    readonly defaultGradientEnd = '#ffffffff';

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
        this.ensureGradientStops();
    }

    commit() {
        this.modalInfo.opacity = this.normalizeOpacity(this.modalInfo.opacity);
        this.modalInfo.scale = this.normalizeScale(this.modalInfo.scale);
        this.modalInfo.fillOffsetX = this.normalizeNumber(this.modalInfo.fillOffsetX);
        this.modalInfo.fillOffsetY = this.normalizeNumber(this.modalInfo.fillOffsetY);
        this.ensureGradientStops();
        this.activeModal.close(this.modalInfo);
    }

    colorPickerChange(event) {
        this.modalInfo.color = event;
    }

    onColorSelected(event) {
        if(this.modalInfo.namedColor) {
            this.modalInfo.color = (this.modalInfo.namedColor.color as Color).toHexString();
        }
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
