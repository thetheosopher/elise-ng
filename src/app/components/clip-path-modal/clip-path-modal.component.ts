import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindingMode } from 'elise-graphics';

type ClipPathUnits = 'userSpaceOnUse' | 'objectBoundingBox';

interface ClipPathPreset {
    label: string;
    description: string;
    commandText: string;
    units: ClipPathUnits;
    windingMode?: WindingMode;
}

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-clip-path-modal',
    templateUrl: './clip-path-modal.component.html',
    styleUrls: ['./clip-path-modal.component.scss']
})
export class ClipPathModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: ClipPathModalInfo;

    validationMessage = '';
    validationWarnings: string[] = [];
    previewPathData = '';
    previewViewBox = '-0.08 -0.08 1.16 1.16';
    commandCount = 0;

    readonly unitsOptions: Array<{ label: string; value: ClipPathUnits; description: string }> = [
        { label: 'User Space', value: 'userSpaceOnUse', description: 'Interpret commands in the element\'s canvas coordinate space.' },
        { label: 'Object Bounding Box', value: 'objectBoundingBox', description: 'Use normalized 0-1 coordinates relative to the element bounds.' }
    ];

    readonly windingOptions = [
        { label: 'Non-zero', value: WindingMode.NonZero },
        { label: 'Even-odd', value: WindingMode.EvenOdd }
    ];

    readonly presets: ClipPathPreset[] = [
        {
            label: 'Hex Inset',
            description: 'A beveled hexagonal cut using normalized bounds.',
            units: 'objectBoundingBox',
            commandText: ['m0.14,0.1', 'l0.86,0.1', 'l0.96,0.5', 'l0.86,0.9', 'l0.14,0.9', 'l0.04,0.5', 'z'].join('\n')
        },
        {
            label: 'Slanted Card',
            description: 'A diagonal top-right / bottom-left crop.',
            units: 'objectBoundingBox',
            commandText: ['m0.08,0', 'l1,0', 'l0.92,1', 'l0,1', 'z'].join('\n')
        },
        {
            label: 'Diamond',
            description: 'A centered diamond mask for badges and callouts.',
            units: 'objectBoundingBox',
            commandText: ['m0.5,0', 'l1,0.5', 'l0.5,1', 'l0,0.5', 'z'].join('\n')
        },
        {
            label: 'Ticket Stub',
            description: 'A clipped card with side notches for labels or callouts.',
            units: 'objectBoundingBox',
            commandText: ['m0.12,0', 'l0.88,0', 'l1,0.26', 'l1,0.74', 'l0.88,1', 'l0.12,1', 'l0,0.74', 'l0,0.26', 'z'].join('\n')
        },
        {
            label: 'Star Burst',
            description: 'An angular burst shape for decorative badges.',
            units: 'objectBoundingBox',
            commandText: ['m0.5,0.02', 'l0.64,0.32', 'l0.98,0.36', 'l0.72,0.58', 'l0.8,0.96', 'l0.5,0.76', 'l0.2,0.96', 'l0.28,0.58', 'l0.02,0.36', 'l0.36,0.32', 'z'].join('\n')
        }
    ];

    ngOnInit() {
        this.modalInfo.clipPathEnabled = !!this.modalInfo.clipPathEnabled;
        this.modalInfo.commandText = this.normalizeCommandText(this.modalInfo.commandText);
        this.modalInfo.units = this.normalizeUnits(this.modalInfo.units);
        this.modalInfo.windingMode = this.normalizeWindingMode(this.modalInfo.windingMode);
        this.modalInfo.transformText = this.normalizeTransformText(this.modalInfo.transformText);
        this.modalInfo.applyToModel = !!this.modalInfo.applyToModel;
        this.modalInfo.applyToSelected = !!this.modalInfo.applyToSelected;
        this.refreshDerivedState();
    }

    commit() {
        this.modalInfo.commandText = this.normalizeCommandText(this.modalInfo.commandText);
        this.modalInfo.units = this.normalizeUnits(this.modalInfo.units);
        this.modalInfo.windingMode = this.normalizeWindingMode(this.modalInfo.windingMode);
        this.modalInfo.transformText = this.normalizeTransformText(this.modalInfo.transformText);

        this.refreshDerivedState();
        if (this.validationMessage.length > 0) {
            return;
        }

        this.activeModal.close(this.modalInfo);
    }

    applyPreset(preset: ClipPathPreset) {
        this.modalInfo.clipPathEnabled = true;
        this.modalInfo.units = preset.units;
        this.modalInfo.commandText = preset.commandText;
        this.modalInfo.windingMode = preset.windingMode ?? WindingMode.NonZero;
        this.refreshDerivedState();
    }

    clearClipPath() {
        this.modalInfo.clipPathEnabled = false;
        this.refreshDerivedState();
    }

    onClipPathEnabledChanged() {
        this.refreshDerivedState();
    }

    onCommandTextChanged() {
        this.refreshDerivedState();
    }

    onUnitsChanged() {
        this.refreshDerivedState();
    }

    onTransformTextChanged() {
        this.modalInfo.transformText = this.normalizeTransformText(this.modalInfo.transformText);
        this.refreshDerivedState();
    }

    get hasPreview() {
        return this.previewPathData.length > 0;
    }

    private normalizeCommandText(commandText?: string) {
        return (commandText ?? '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .join('\n');
    }

    private normalizeUnits(units?: ClipPathUnits) {
        return units === 'objectBoundingBox' ? 'objectBoundingBox' : 'userSpaceOnUse';
    }

    private normalizeWindingMode(windingMode?: WindingMode) {
        return windingMode === WindingMode.EvenOdd ? WindingMode.EvenOdd : WindingMode.NonZero;
    }

    private normalizeTransformText(transformText?: string) {
        return (transformText ?? '').trim();
    }

    private refreshDerivedState() {
        this.validationMessage = '';
        this.validationWarnings = [];

        const normalizedCommandText = this.normalizeCommandText(this.modalInfo.commandText);
        this.modalInfo.commandText = normalizedCommandText;
        const commands = this.parseCommands(normalizedCommandText);
        this.commandCount = commands.length;
        this.previewPathData = commands.join(' ');
        this.previewViewBox = this.buildPreviewViewBox(commands, this.modalInfo.units);

        if (!this.modalInfo.clipPathEnabled) {
            return;
        }

        if (commands.length === 0) {
            this.validationMessage = 'Add at least one clip-path command or disable clipping.';
            return;
        }

        if (!/^[mM]/.test(commands[0])) {
            this.validationMessage = 'The first clip-path command should start with a move command such as m or M.';
            return;
        }

        const invalidCommand = commands.find((command) => !/^[AaCcHhLlMmQqSsTtVvZz]/.test(command));
        if (invalidCommand) {
            this.validationMessage = `Unsupported command token: ${invalidCommand}`;
            return;
        }

        const numbers = commands.flatMap((command) => this.extractNumbers(command));
        if (this.modalInfo.units === 'objectBoundingBox' && numbers.some((value) => value < 0 || value > 1)) {
            this.validationWarnings.push('Object-bounding-box clips usually stay within 0 to 1 coordinates. Values outside that range can still work but will extend past the element bounds.');
        }

        if (this.modalInfo.transformText.length > 0) {
            this.validationWarnings.push('The inline preview shows raw commands only. The clip transform is still applied when you save.');
        }
    }

    private parseCommands(commandText: string) {
        return commandText
            .split(/\s+/)
            .map((command) => command.trim())
            .filter((command) => command.length > 0);
    }

    private buildPreviewViewBox(commands: string[], units: ClipPathUnits) {
        if (commands.length === 0) {
            return units === 'objectBoundingBox' ? '-0.08 -0.08 1.16 1.16' : '0 0 100 100';
        }

        if (units === 'objectBoundingBox') {
            return '-0.08 -0.08 1.16 1.16';
        }

        const numbers = commands.flatMap((command) => this.extractNumbers(command));
        if (numbers.length < 2) {
            return '0 0 100 100';
        }

        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let index = 0; index < numbers.length; index += 2) {
            xValues.push(numbers[index]);
            if (index + 1 < numbers.length) {
                yValues.push(numbers[index + 1]);
            }
        }

        if (xValues.length === 0 || yValues.length === 0) {
            return '0 0 100 100';
        }

        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const width = Math.max(1, maxX - minX);
        const height = Math.max(1, maxY - minY);
        const paddingX = Math.max(8, width * 0.12);
        const paddingY = Math.max(8, height * 0.12);
        return `${minX - paddingX} ${minY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`;
    }

    private extractNumbers(command: string) {
        const matches = command.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
        if (!matches) {
            return [];
        }
        return matches
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value));
    }
}

export class ClipPathModalInfo {
    clipPathEnabled = false;
    commandText = '';
    units: ClipPathUnits = 'userSpaceOnUse';
    windingMode: WindingMode = WindingMode.NonZero;
    transformText = '';
    applyToModel = false;
    applyToSelected = true;
    selectedElementCount = 0;
    mixedValueLabels: string[] = [];
}
