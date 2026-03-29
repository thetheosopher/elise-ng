import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindingMode } from 'elise-graphics';

type GeometryElementType = 'rectangle' | 'polygon' | 'path' | 'regularPolygon' | 'arrow' | 'ring' | 'arc' | 'wedge';

interface CornerPreset {
    label: string;
    description: string;
    radii: [number, number, number, number];
}

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

    readonly cornerPresets: CornerPreset[] = [
        { label: 'Square', description: 'Keep all four corners sharp.', radii: [0, 0, 0, 0] },
        { label: 'Soft', description: 'Apply a light 12px radius across the shape.', radii: [12, 12, 12, 12] },
        { label: 'Rounded', description: 'Use a stronger 24px radius on all corners.', radii: [24, 24, 24, 24] },
        { label: 'Capsule', description: 'Max out the radii for pill-like edges.', radii: [9999, 9999, 9999, 9999] },
        { label: 'Top Cap', description: 'Round only the top pair of corners.', radii: [24, 24, 0, 0] },
        { label: 'Bottom Cap', description: 'Round only the bottom pair of corners.', radii: [0, 0, 24, 24] },
        { label: 'Diagonal Fold', description: 'Round opposite corners for a folded-card feel.', radii: [24, 0, 24, 0] },
        { label: 'Ticket Stub', description: 'Use smaller left corners and stronger right corners.', radii: [10, 28, 28, 10] }
    ];

    ngOnInit() {
        this.modalInfo.geometryType = this.modalInfo.geometryType ?? 'rectangle';
        this.modalInfo.elementDescription = (this.modalInfo.elementDescription ?? '').trim();
        this.modalInfo.cornerRadiusTopLeft = this.normalizeRadius(this.modalInfo.cornerRadiusTopLeft);
        this.modalInfo.cornerRadiusTopRight = this.normalizeRadius(this.modalInfo.cornerRadiusTopRight);
        this.modalInfo.cornerRadiusBottomRight = this.normalizeRadius(this.modalInfo.cornerRadiusBottomRight);
        this.modalInfo.cornerRadiusBottomLeft = this.normalizeRadius(this.modalInfo.cornerRadiusBottomLeft);
        this.modalInfo.windingMode = this.normalizeWindingMode(this.modalInfo.windingMode);
        this.modalInfo.regularPolygonSides = this.normalizeSides(this.modalInfo.regularPolygonSides);
        this.modalInfo.regularPolygonInnerRadiusScale = this.normalizeScale(this.modalInfo.regularPolygonInnerRadiusScale, 1, 0.05, 1);
        this.modalInfo.regularPolygonRotation = this.normalizeAngle(this.modalInfo.regularPolygonRotation, -90);
        this.modalInfo.arrowHeadLengthScale = this.normalizeScale(this.modalInfo.arrowHeadLengthScale, 0.35, 0.1, 0.9);
        this.modalInfo.arrowShaftWidthScale = this.normalizeScale(this.modalInfo.arrowShaftWidthScale, 0.3, 0.05, 1);
        this.modalInfo.arrowHeadWidthScale = this.normalizeScale(
            this.modalInfo.arrowHeadWidthScale,
            0.7,
            Math.max(this.modalInfo.arrowShaftWidthScale + 0.05, 0.1),
            1
        );
        this.modalInfo.arrowShaftWidthScale = this.normalizeScale(
            this.modalInfo.arrowShaftWidthScale,
            0.3,
            0.05,
            Math.max(0.05, this.modalInfo.arrowHeadWidthScale)
        );
        this.modalInfo.ringInnerRadiusScale = this.normalizeScale(this.modalInfo.ringInnerRadiusScale, 0.55, 0.05, 0.95);
        this.modalInfo.arcStartAngle = this.normalizeAngle(this.modalInfo.arcStartAngle, 0);
        this.modalInfo.arcEndAngle = this.normalizeAngle(this.modalInfo.arcEndAngle, 90);
        this.modalInfo.wedgeStartAngle = this.normalizeAngle(this.modalInfo.wedgeStartAngle, 270);
        this.modalInfo.wedgeEndAngle = this.normalizeAngle(this.modalInfo.wedgeEndAngle, 90);
    }

    commit() {
        this.modalInfo.cornerRadiusTopLeft = this.normalizeRadius(this.modalInfo.cornerRadiusTopLeft);
        this.modalInfo.cornerRadiusTopRight = this.normalizeRadius(this.modalInfo.cornerRadiusTopRight);
        this.modalInfo.cornerRadiusBottomRight = this.normalizeRadius(this.modalInfo.cornerRadiusBottomRight);
        this.modalInfo.cornerRadiusBottomLeft = this.normalizeRadius(this.modalInfo.cornerRadiusBottomLeft);
        this.modalInfo.windingMode = this.normalizeWindingMode(this.modalInfo.windingMode);
        this.modalInfo.regularPolygonSides = this.normalizeSides(this.modalInfo.regularPolygonSides);
        this.modalInfo.regularPolygonInnerRadiusScale = this.normalizeScale(this.modalInfo.regularPolygonInnerRadiusScale, 1, 0.05, 1);
        this.modalInfo.regularPolygonRotation = this.normalizeAngle(this.modalInfo.regularPolygonRotation, -90);
        this.modalInfo.arrowHeadLengthScale = this.normalizeScale(this.modalInfo.arrowHeadLengthScale, 0.35, 0.1, 0.9);
        this.modalInfo.arrowShaftWidthScale = this.normalizeScale(this.modalInfo.arrowShaftWidthScale, 0.3, 0.05, 1);
        this.modalInfo.arrowHeadWidthScale = this.normalizeScale(
            this.modalInfo.arrowHeadWidthScale,
            0.7,
            Math.max(this.modalInfo.arrowShaftWidthScale + 0.05, 0.1),
            1
        );
        this.modalInfo.arrowShaftWidthScale = this.normalizeScale(
            this.modalInfo.arrowShaftWidthScale,
            0.3,
            0.05,
            Math.max(0.05, this.modalInfo.arrowHeadWidthScale)
        );
        this.modalInfo.ringInnerRadiusScale = this.normalizeScale(this.modalInfo.ringInnerRadiusScale, 0.55, 0.05, 0.95);
        this.modalInfo.arcStartAngle = this.normalizeAngle(this.modalInfo.arcStartAngle, 0);
        this.modalInfo.arcEndAngle = this.normalizeAngle(this.modalInfo.arcEndAngle, 90);
        this.modalInfo.wedgeStartAngle = this.normalizeAngle(this.modalInfo.wedgeStartAngle, 270);
        this.modalInfo.wedgeEndAngle = this.normalizeAngle(this.modalInfo.wedgeEndAngle, 90);
        this.activeModal.close(this.modalInfo);
    }

    applyUniformCornerRadius(radius: number) {
        const normalizedRadius = this.normalizeRadius(radius);
        this.modalInfo.cornerRadiusTopLeft = normalizedRadius;
        this.modalInfo.cornerRadiusTopRight = normalizedRadius;
        this.modalInfo.cornerRadiusBottomRight = normalizedRadius;
        this.modalInfo.cornerRadiusBottomLeft = normalizedRadius;
    }

    applyCornerPreset(preset: CornerPreset) {
        this.modalInfo.cornerRadiusTopLeft = this.normalizeRadius(preset.radii[0]);
        this.modalInfo.cornerRadiusTopRight = this.normalizeRadius(preset.radii[1]);
        this.modalInfo.cornerRadiusBottomRight = this.normalizeRadius(preset.radii[2]);
        this.modalInfo.cornerRadiusBottomLeft = this.normalizeRadius(preset.radii[3]);
    }

    get isRectangle() {
        return this.modalInfo.geometryType === 'rectangle';
    }

    get isRegularPolygon() {
        return this.modalInfo.geometryType === 'regularPolygon';
    }

    get isArrow() {
        return this.modalInfo.geometryType === 'arrow';
    }

    get isRing() {
        return this.modalInfo.geometryType === 'ring';
    }

    get isArc() {
        return this.modalInfo.geometryType === 'arc';
    }

    get isWedge() {
        return this.modalInfo.geometryType === 'wedge';
    }

    get supportsWinding() {
        return this.modalInfo.geometryType === 'polygon' || this.modalInfo.geometryType === 'path';
    }

    get supportsAngles() {
        return this.isArc || this.isWedge;
    }

    get geometryHeading() {
        switch (this.modalInfo.geometryType) {
            case 'rectangle':
                return 'Rectangle Geometry';
            case 'polygon':
            case 'path':
                return 'Fill Rule';
            case 'regularPolygon':
                return 'Regular Polygon Settings';
            case 'arrow':
                return 'Arrow Settings';
            case 'ring':
                return 'Ring Settings';
            case 'arc':
                return 'Arc Settings';
            case 'wedge':
                return 'Wedge Settings';
            default:
                return 'Geometry';
        }
    }

    get geometryDescription() {
        switch (this.modalInfo.geometryType) {
            case 'rectangle':
                return 'Tune each corner radius independently or start from a quick preset.';
            case 'polygon':
            case 'path':
                return 'Choose how overlapping segments determine the filled interior.';
            case 'regularPolygon':
                return 'Adjust the side count, star depth, and rotation for this regular polygon.';
            case 'arrow':
                return 'Balance the arrow head and shaft proportions without changing the overall bounds.';
            case 'ring':
                return 'Set the opening size for the annulus while keeping the outer ellipse fixed.';
            case 'arc':
                return 'Define the arc endpoints and sweep directly in degrees.';
            case 'wedge':
                return 'Set the start and end angles for the sector cutout.';
            default:
                return 'Adjust the selected geometry.';
        }
    }

    get impactDescription() {
        switch (this.modalInfo.geometryType) {
            case 'rectangle':
                return 'Corner radii reshape the selected rectangle without changing its bounds.';
            case 'polygon':
            case 'path':
                return 'The winding rule affects how fills behave in nested or overlapping contours.';
            case 'regularPolygon':
                return 'Sides change the profile, inner radius controls star depth, and rotation spins the shape in place.';
            case 'arrow':
                return 'Arrow proportions change the head and shaft silhouette while preserving the element size.';
            case 'ring':
                return 'Inner radius controls the hole size and visual weight of the ring.';
            case 'arc':
                return 'The selected arc redraws between the chosen start and end angles using a positive sweep.';
            case 'wedge':
                return 'The wedge spans from the center to the selected start and end angles.';
            default:
                return 'Geometry updates affect only the selected element.';
        }
    }

    get angleSectionTitle() {
        return this.isWedge ? 'Sector Angles' : 'Arc Angles';
    }

    get angleStartLabel() {
        return this.isWedge ? 'Start Angle' : 'Start Angle';
    }

    get angleEndLabel() {
        return this.isWedge ? 'End Angle' : 'End Angle';
    }

    get activeAngleStart() {
        return this.isWedge ? this.modalInfo.wedgeStartAngle : this.modalInfo.arcStartAngle;
    }

    get activeAngleEnd() {
        return this.isWedge ? this.modalInfo.wedgeEndAngle : this.modalInfo.arcEndAngle;
    }

    get angleSweep() {
        return this.positiveSweepDegrees(this.activeAngleStart, this.activeAngleEnd);
    }

    get windingLabel() {
        return this.modalInfo.windingMode === WindingMode.EvenOdd ? 'Even-odd' : 'Non-zero';
    }

    private normalizeRadius(radius?: number) {
        const normalizedRadius = Number(radius);
        if (!Number.isFinite(normalizedRadius)) {
            return 0;
        }
        return Math.max(0, normalizedRadius);
    }

    private normalizeSides(sides?: number) {
        const normalizedSides = Number(sides);
        if (!Number.isFinite(normalizedSides)) {
            return 5;
        }
        return Math.max(3, Math.round(normalizedSides));
    }

    private normalizeScale(value: number | undefined, fallback: number, min: number, max: number) {
        const normalizedValue = Number(value);
        if (!Number.isFinite(normalizedValue)) {
            return fallback;
        }
        return Math.min(max, Math.max(min, normalizedValue));
    }

    private normalizeAngle(angle: number | undefined, fallback: number) {
        const normalizedAngle = Number(angle);
        if (!Number.isFinite(normalizedAngle)) {
            return fallback;
        }
        return normalizedAngle;
    }

    private positiveSweepDegrees(startAngle: number, endAngle: number) {
        const normalizedStart = ((startAngle % 360) + 360) % 360;
        const normalizedEnd = ((endAngle % 360) + 360) % 360;
        let sweep = normalizedEnd - normalizedStart;
        if (sweep <= 0) {
            sweep += 360;
        }
        return sweep;
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
    regularPolygonSides = 5;
    regularPolygonInnerRadiusScale = 1;
    regularPolygonRotation = -90;
    arrowHeadLengthScale = 0.35;
    arrowHeadWidthScale = 0.7;
    arrowShaftWidthScale = 0.3;
    ringInnerRadiusScale = 0.55;
    arcStartAngle = 0;
    arcEndAngle = 90;
    wedgeStartAngle = 270;
    wedgeEndAngle = 90;
}
