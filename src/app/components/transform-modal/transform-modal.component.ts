import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type TransformMode = 'none' | 'translate' | 'scale' | 'rotate' | 'skew' | 'matrix' | 'custom';

interface TransformPreset {
    label: string;
    description: string;
    mode: TransformMode;
    values?: Partial<TransformModalInfo>;
}

interface TransformPresetGroup {
    label: string;
    description: string;
    presets: TransformPreset[];
}

interface TransformModeOption {
    label: string;
    value: TransformMode;
}

interface ParsedTransform {
    mode: TransformMode;
    values: Partial<TransformModalInfo>;
}

interface MatrixDecomposition {
    scaleX: number;
    scaleY: number;
    rotation: number;
    skewX: number;
    translationX: number;
    translationY: number;
    determinant: number;
}

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-transform-modal',
    templateUrl: './transform-modal.component.html',
    styleUrls: ['./transform-modal.component.scss']
})
export class TransformModalComponent {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: TransformModalInfo;

    validationMessage = '';
    matrixDecomposition?: MatrixDecomposition;

    readonly modeOptions: TransformModeOption[] = [
        { label: 'None', value: 'none' },
        { label: 'Translate', value: 'translate' },
        { label: 'Scale', value: 'scale' },
        { label: 'Rotate', value: 'rotate' },
        { label: 'Skew', value: 'skew' },
        { label: 'Matrix', value: 'matrix' },
        { label: 'Raw Text', value: 'custom' }
    ];

    readonly presetGroups: TransformPresetGroup[] = [
        {
            label: 'Position',
            description: 'Quick translation nudges for layout and spacing adjustments.',
            presets: [
                {
                    label: 'Reset',
                    description: 'Clear the current transform.',
                    mode: 'none'
                },
                {
                    label: 'Move Left',
                    description: 'Shift 24px on the x axis.',
                    mode: 'translate',
                    values: { translateX: -24, translateY: 0 }
                },
                {
                    label: 'Move Right',
                    description: 'Shift 24px on the x axis.',
                    mode: 'translate',
                    values: { translateX: 24, translateY: 0 }
                },
                {
                    label: 'Move Up',
                    description: 'Shift 24px on the y axis.',
                    mode: 'translate',
                    values: { translateX: 0, translateY: -24 }
                },
                {
                    label: 'Move Down',
                    description: 'Shift 24px on the y axis.',
                    mode: 'translate',
                    values: { translateX: 0, translateY: 24 }
                },
                {
                    label: 'Drift Diagonal',
                    description: 'Shift 18px on both axes for layered compositions.',
                    mode: 'translate',
                    values: { translateX: 18, translateY: 18 }
                }
            ]
        },
        {
            label: 'Scale And Mirror',
            description: 'Common scale moves for emphasis, compression, and reflection.',
            presets: [
                {
                    label: 'Half Scale',
                    description: 'Reduce evenly to 50%.',
                    mode: 'scale',
                    values: { scaleX: 0.5, scaleY: 0.5 }
                },
                {
                    label: 'Double Scale',
                    description: 'Scale equally to 200%.',
                    mode: 'scale',
                    values: { scaleX: 2, scaleY: 2 }
                },
                {
                    label: 'Stretch Wide',
                    description: 'Widen without increasing height.',
                    mode: 'scale',
                    values: { scaleX: 1.35, scaleY: 1 }
                },
                {
                    label: 'Stretch Tall',
                    description: 'Increase height without widening.',
                    mode: 'scale',
                    values: { scaleX: 1, scaleY: 1.35 }
                },
                {
                    label: 'Mirror X',
                    description: 'Flip horizontally around the local origin.',
                    mode: 'scale',
                    values: { scaleX: -1, scaleY: 1 }
                },
                {
                    label: 'Mirror Y',
                    description: 'Flip vertically around the local origin.',
                    mode: 'scale',
                    values: { scaleX: 1, scaleY: -1 }
                }
            ]
        },
        {
            label: 'Rotate And Skew',
            description: 'Useful angular presets for badges, labels, and italicized treatments.',
            presets: [
                {
                    label: 'Quarter Turn',
                    description: 'Rotate 90 degrees clockwise.',
                    mode: 'rotate',
                    values: { rotateAngle: 90 }
                },
                {
                    label: 'Quarter Back',
                    description: 'Rotate 90 degrees counterclockwise.',
                    mode: 'rotate',
                    values: { rotateAngle: -90 }
                },
                {
                    label: 'Half Turn',
                    description: 'Rotate 180 degrees.',
                    mode: 'rotate',
                    values: { rotateAngle: 180 }
                },
                {
                    label: 'Tilt Right',
                    description: 'A subtle 15 degree rotation.',
                    mode: 'rotate',
                    values: { rotateAngle: 15 }
                },
                {
                    label: 'Italic Skew',
                    description: 'Apply a gentle x skew.',
                    mode: 'skew',
                    values: { skewX: -12, skewY: 0 }
                },
                {
                    label: 'Shear Down',
                    description: 'Push the lower edge with a small y skew.',
                    mode: 'skew',
                    values: { skewX: 0, skewY: 12 }
                }
            ]
        },
        {
            label: 'Matrix Combos',
            description: 'Affine combinations that package multiple effects into a single matrix.',
            presets: [
                {
                    label: 'Identity Matrix',
                    description: 'Reset matrix coefficients to identity.',
                    mode: 'matrix',
                    values: {
                        matrixM11: 1,
                        matrixM12: 0,
                        matrixM21: 0,
                        matrixM22: 1,
                        matrixOffsetX: 0,
                        matrixOffsetY: 0
                    }
                },
                {
                    label: 'Poster Lean',
                    description: 'A slight clockwise lean plus horizontal drift.',
                    mode: 'matrix',
                    values: {
                        matrixM11: 0.98,
                        matrixM12: 0.18,
                        matrixM21: -0.12,
                        matrixM22: 0.98,
                        matrixOffsetX: 16,
                        matrixOffsetY: -6
                    }
                },
                {
                    label: 'Isometric Hint',
                    description: 'Compress and skew into a faux isometric attitude.',
                    mode: 'matrix',
                    values: {
                        matrixM11: 0.86,
                        matrixM12: 0.42,
                        matrixM21: -0.42,
                        matrixM22: 0.86,
                        matrixOffsetX: 0,
                        matrixOffsetY: 0
                    }
                },
                {
                    label: 'Swing Card',
                    description: 'Combine mild rotation, skew, and lift for mockups.',
                    mode: 'matrix',
                    values: {
                        matrixM11: 0.92,
                        matrixM12: 0.22,
                        matrixM21: -0.18,
                        matrixM22: 0.96,
                        matrixOffsetX: 8,
                        matrixOffsetY: -10
                    }
                }
            ]
        }
    ];

    readonly presetCount = this.presetGroups.reduce((count, group) => count + group.presets.length, 0);

    ngOnInit() {
        this.modalInfo.transformText = (this.modalInfo.transformText ?? '').trim();
        this.modalInfo.mode = 'none';
        this.ensureDefaults();
        this.applyParsedTransform(this.modalInfo.transformText);
    }

    onModeChanged() {
        this.validationMessage = '';
        this.ensureDefaults();
        if (this.modalInfo.mode === 'custom') {
            this.updateDerivedState();
            return;
        }

        if (this.modalInfo.mode === 'none') {
            this.modalInfo.transformText = '';
            this.updateDerivedState();
            return;
        }

        this.modalInfo.transformText = this.buildTransformText();
        this.updateDerivedState();
    }

    onTransformTextChanged() {
        this.validationMessage = '';
        if (this.modalInfo.mode === 'custom') {
            this.updateDerivedState();
            return;
        }

        this.modalInfo.transformText = this.buildTransformText();
        this.updateDerivedState();
    }

    commit() {
        this.validationMessage = '';

        if (this.modalInfo.mode === 'custom') {
            const normalized = (this.modalInfo.transformText ?? '').trim();
            if (normalized.length > 0) {
                const parsed = this.parseTransform(normalized);
                if (!parsed) {
                    this.validationMessage = 'Use one supported transform command: translate, scale, rotate, skew, or matrix.';
                    return;
                }
            }
            this.modalInfo.transformText = normalized;
        }
        else {
            this.modalInfo.transformText = this.buildTransformText();
        }

        this.activeModal.close(this.modalInfo);
    }

    get supportsOrigin() {
        return this.modalInfo.mode === 'scale'
            || this.modalInfo.mode === 'rotate'
            || this.modalInfo.mode === 'skew'
            || this.modalInfo.mode === 'matrix';
    }

    get previewTransformText() {
        if (this.modalInfo.mode === 'custom') {
            return (this.modalInfo.transformText ?? '').trim() || 'none';
        }

        return this.buildTransformText() || 'none';
    }

    get hasMatrixDecomposition() {
        return this.modalInfo.mode === 'matrix' && !!this.matrixDecomposition;
    }

    get activeModeLabel() {
        return this.modeOptions.find((option) => option.value === this.modalInfo.mode)?.label ?? 'None';
    }

    applyPreset(preset: TransformPreset) {
        this.validationMessage = '';
        this.resetTransformValues();
        this.modalInfo.mode = preset.mode;
        if (preset.values) {
            Object.assign(this.modalInfo, preset.values);
        }
        if (preset.mode === 'none') {
            this.modalInfo.transformText = '';
        }
        else if (preset.mode === 'custom') {
            this.modalInfo.transformText = (preset.values?.transformText ?? '').trim();
        }
        else {
            this.modalInfo.transformText = this.buildTransformText();
        }
        this.updateDerivedState();
    }

    private applyParsedTransform(transformText: string) {
        const parsed = this.parseTransform(transformText);
        if (!parsed) {
            this.modalInfo.mode = transformText.length > 0 ? 'custom' : 'none';
            this.updateDerivedState();
            return;
        }

        this.resetTransformValues();
        this.modalInfo.mode = parsed.mode;
        Object.assign(this.modalInfo, parsed.values);
        this.updateDerivedState();
    }

    private buildTransformText() {
        switch (this.modalInfo.mode) {
            case 'translate':
                return `translate(${this.normalizeNumber(this.modalInfo.translateX)},${this.normalizeNumber(this.modalInfo.translateY)})`;
            case 'scale': {
                const scaleX = this.normalizeNumber(this.modalInfo.scaleX, 1);
                const scaleY = this.normalizeNumber(this.modalInfo.scaleY, scaleX);
                return `scale(${scaleX},${scaleY}${this.getOriginSuffix()})`;
            }
            case 'rotate':
                return `rotate(${this.normalizeNumber(this.modalInfo.rotateAngle)}${this.getOriginSuffix()})`;
            case 'skew':
                return `skew(${this.normalizeNumber(this.modalInfo.skewX)},${this.normalizeNumber(this.modalInfo.skewY)}${this.getOriginSuffix()})`;
            case 'matrix':
                return `matrix(${this.normalizeNumber(this.modalInfo.matrixM11, 1)},${this.normalizeNumber(this.modalInfo.matrixM12)},${this.normalizeNumber(this.modalInfo.matrixM21)},${this.normalizeNumber(this.modalInfo.matrixM22, 1)},${this.normalizeNumber(this.modalInfo.matrixOffsetX)},${this.normalizeNumber(this.modalInfo.matrixOffsetY)}${this.getOriginSuffix()})`;
            default:
                return '';
        }
    }

    private getOriginSuffix() {
        const originX = this.normalizeNumber(this.modalInfo.originX);
        const originY = this.normalizeNumber(this.modalInfo.originY);
        if (originX === 0 && originY === 0) {
            return '';
        }
        return `(${originX},${originY})`;
    }

    private parseTransform(transformText: string): ParsedTransform | null {
        if (!transformText) {
            return { mode: 'none', values: {} };
        }

        let match = transformText.match(/^translate\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\)$/i);
        if (match) {
            return {
                mode: 'translate',
                values: {
                    translateX: Number(match[1]),
                    translateY: Number(match[2])
                }
            };
        }

        match = transformText.match(/^scale\(([-+]?\d*\.?\d+)(?:,\s*([-+]?\d*\.?\d+))?(?:\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\))?\)$/i);
        if (match) {
            return {
                mode: 'scale',
                values: {
                    scaleX: Number(match[1]),
                    scaleY: Number(match[2] ?? match[1]),
                    originX: Number(match[3] ?? 0),
                    originY: Number(match[4] ?? 0)
                }
            };
        }

        match = transformText.match(/^rotate\(([-+]?\d*\.?\d+)(?:\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\))?\)$/i);
        if (match) {
            return {
                mode: 'rotate',
                values: {
                    rotateAngle: Number(match[1]),
                    originX: Number(match[2] ?? 0),
                    originY: Number(match[3] ?? 0)
                }
            };
        }

        match = transformText.match(/^skew\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)(?:\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\))?\)$/i);
        if (match) {
            return {
                mode: 'skew',
                values: {
                    skewX: Number(match[1]),
                    skewY: Number(match[2]),
                    originX: Number(match[3] ?? 0),
                    originY: Number(match[4] ?? 0)
                }
            };
        }

        match = transformText.match(/^matrix\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)(?:\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\))?\)$/i);
        if (match) {
            return {
                mode: 'matrix',
                values: {
                    matrixM11: Number(match[1]),
                    matrixM12: Number(match[2]),
                    matrixM21: Number(match[3]),
                    matrixM22: Number(match[4]),
                    matrixOffsetX: Number(match[5]),
                    matrixOffsetY: Number(match[6]),
                    originX: Number(match[7] ?? 0),
                    originY: Number(match[8] ?? 0)
                }
            };
        }

        return null;
    }

    private ensureDefaults() {
        if (!this.modalInfo) {
            return;
        }

        this.modalInfo.translateX = this.normalizeNumber(this.modalInfo.translateX);
        this.modalInfo.translateY = this.normalizeNumber(this.modalInfo.translateY);
        this.modalInfo.scaleX = this.normalizeNumber(this.modalInfo.scaleX, 1);
        this.modalInfo.scaleY = this.normalizeNumber(this.modalInfo.scaleY, this.modalInfo.scaleX);
        this.modalInfo.rotateAngle = this.normalizeNumber(this.modalInfo.rotateAngle);
        this.modalInfo.skewX = this.normalizeNumber(this.modalInfo.skewX);
        this.modalInfo.skewY = this.normalizeNumber(this.modalInfo.skewY);
        this.modalInfo.originX = this.normalizeNumber(this.modalInfo.originX);
        this.modalInfo.originY = this.normalizeNumber(this.modalInfo.originY);
        this.modalInfo.matrixM11 = this.normalizeNumber(this.modalInfo.matrixM11, 1);
        this.modalInfo.matrixM12 = this.normalizeNumber(this.modalInfo.matrixM12);
        this.modalInfo.matrixM21 = this.normalizeNumber(this.modalInfo.matrixM21);
        this.modalInfo.matrixM22 = this.normalizeNumber(this.modalInfo.matrixM22, 1);
        this.modalInfo.matrixOffsetX = this.normalizeNumber(this.modalInfo.matrixOffsetX);
        this.modalInfo.matrixOffsetY = this.normalizeNumber(this.modalInfo.matrixOffsetY);
    }

    private resetTransformValues() {
        this.modalInfo.translateX = 0;
        this.modalInfo.translateY = 0;
        this.modalInfo.scaleX = 1;
        this.modalInfo.scaleY = 1;
        this.modalInfo.rotateAngle = 0;
        this.modalInfo.skewX = 0;
        this.modalInfo.skewY = 0;
        this.modalInfo.originX = 0;
        this.modalInfo.originY = 0;
        this.modalInfo.matrixM11 = 1;
        this.modalInfo.matrixM12 = 0;
        this.modalInfo.matrixM21 = 0;
        this.modalInfo.matrixM22 = 1;
        this.modalInfo.matrixOffsetX = 0;
        this.modalInfo.matrixOffsetY = 0;
    }

    private updateDerivedState() {
        this.matrixDecomposition = this.modalInfo.mode === 'matrix'
            ? this.decomposeMatrix(
                this.modalInfo.matrixM11,
                this.modalInfo.matrixM12,
                this.modalInfo.matrixM21,
                this.modalInfo.matrixM22,
                this.modalInfo.matrixOffsetX,
                this.modalInfo.matrixOffsetY)
            : undefined;
    }

    private decomposeMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): MatrixDecomposition | undefined {
        const normalizedA = this.normalizeNumber(a, 1);
        const normalizedB = this.normalizeNumber(b);
        const normalizedC = this.normalizeNumber(c);
        const normalizedD = this.normalizeNumber(d, 1);
        const determinant = normalizedA * normalizedD - normalizedB * normalizedC;
        const scaleX = Math.hypot(normalizedA, normalizedB);

        if (!Number.isFinite(scaleX) || scaleX === 0) {
            return undefined;
        }

        const rotation = Math.atan2(normalizedB, normalizedA) * (180 / Math.PI);
        const skewX = Math.atan2(normalizedA * normalizedC + normalizedB * normalizedD, scaleX * scaleX) * (180 / Math.PI);
        const scaleY = determinant / scaleX;

        return {
            scaleX,
            scaleY,
            rotation,
            skewX,
            translationX: this.normalizeNumber(tx),
            translationY: this.normalizeNumber(ty),
            determinant
        };
    }

    private normalizeNumber(value: number, fallback = 0) {
        const normalized = Number(value);
        if (!Number.isFinite(normalized)) {
            return fallback;
        }
        return normalized;
    }
}

export class TransformModalInfo {
    transformText = '';
    mode: TransformMode = 'none';
    selectedElementCount = 0;
    applyToModel = false;
    applyToSelected = true;
    mixedValueLabels: string[] = [];
    translateX = 0;
    translateY = 0;
    scaleX = 1;
    scaleY = 1;
    rotateAngle = 0;
    skewX = 0;
    skewY = 0;
    originX = 0;
    originY = 0;
    matrixM11 = 1;
    matrixM12 = 0;
    matrixM21 = 0;
    matrixM22 = 1;
    matrixOffsetX = 0;
    matrixOffsetY = 0;
}
