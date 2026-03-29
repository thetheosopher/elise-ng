import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindingMode } from 'elise-graphics';

type GeometryElementType = 'rectangle' | 'polygon' | 'path';

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-geometry-modal',
    templateUrl: './geometry-modal.component.html',
    styleUrls: ['./geometry-modal.component.scss']
})
export class GeometryModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: GeometryModalInfo;

    readonly windingOptions = [
        { label: 'Non-zero', value: WindingMode.NonZero, description: 'Use the default winding rule for nested segments.' },
        { label: 'Even-odd', value: WindingMode.EvenOdd, description: 'Alternate fill inside overlapping loops and cutouts.' }
    ];

    ngOnInit() {
        this.modalInfo.geometryType = this.modalInfo.geometryType ?? 'rectangle';
        this.modalInfo.elementDescription = (this.modalInfo.elementDescription ?? '').trim();
        this.modalInfo.cornerRadiusTopLeft = this.normalizeRadius(this.modalInfo.cornerRadiusTopLeft);
        this.modalInfo.cornerRadiusTopRight = this.normalizeRadius(this.modalInfo.cornerRadiusTopRight);
        this.modalInfo.cornerRadiusBottomRight = this.normalizeRadius(this.modalInfo.cornerRadiusBottomRight);
        this.modalInfo.cornerRadiusBottomLeft = this.normalizeRadius(this.modalInfo.cornerRadiusBottomLeft);
        this.modalInfo.windingMode = this.normalizeWindingMode(this.modalInfo.windingMode);
    }

    commit() {
        this.modalInfo.cornerRadiusTopLeft = this.normalizeRadius(this.modalInfo.cornerRadiusTopLeft);
        this.modalInfo.cornerRadiusTopRight = this.normalizeRadius(this.modalInfo.cornerRadiusTopRight);
        this.modalInfo.cornerRadiusBottomRight = this.normalizeRadius(this.modalInfo.cornerRadiusBottomRight);
        this.modalInfo.cornerRadiusBottomLeft = this.normalizeRadius(this.modalInfo.cornerRadiusBottomLeft);
        this.modalInfo.windingMode = this.normalizeWindingMode(this.modalInfo.windingMode);
        this.activeModal.close(this.modalInfo);
    }

    applyUniformCornerRadius(radius: number) {
        const normalizedRadius = this.normalizeRadius(radius);
        this.modalInfo.cornerRadiusTopLeft = normalizedRadius;
        this.modalInfo.cornerRadiusTopRight = normalizedRadius;
        this.modalInfo.cornerRadiusBottomRight = normalizedRadius;
        this.modalInfo.cornerRadiusBottomLeft = normalizedRadius;
    }

    get isRectangle() {
        return this.modalInfo.geometryType === 'rectangle';
    }

    get supportsWinding() {
        return this.modalInfo.geometryType === 'polygon' || this.modalInfo.geometryType === 'path';
    }

    private normalizeRadius(radius?: number) {
        const normalizedRadius = Number(radius);
        if (!Number.isFinite(normalizedRadius)) {
            return 0;
        }
        return Math.max(0, normalizedRadius);
    }

    private normalizeWindingMode(windingMode?: WindingMode) {
        return windingMode === WindingMode.EvenOdd ? WindingMode.EvenOdd : WindingMode.NonZero;
    }
}

export class GeometryModalInfo {
    geometryType: GeometryElementType = 'rectangle';
    elementDescription = '';
    cornerRadiusTopLeft = 0;
    cornerRadiusTopRight = 0;
    cornerRadiusBottomRight = 0;
    cornerRadiusBottomLeft = 0;
    windingMode: WindingMode = WindingMode.NonZero;
}
