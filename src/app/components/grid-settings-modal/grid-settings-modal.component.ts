import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridType } from 'elise-graphics';

interface GridTypeOption {
    label: string;
    value: GridType;
}

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-grid-settings-modal',
    templateUrl: './grid-settings-modal.component.html'
})
export class GridSettingsModalComponent {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: GridSettingsModalInfo;

    readonly gridTypeOptions: GridTypeOption[] = [
        { label: 'None', value: GridType.None },
        { label: 'Dots', value: GridType.Dots },
        { label: 'Lines', value: GridType.Lines }
    ];

    commit() {
        this.modalInfo.gridSpacing = Math.max(1, Math.round(Number(this.modalInfo.gridSpacing) || 1));
        this.activeModal.close(this.modalInfo);
    }
}

export class GridSettingsModalInfo {
    snapToGrid = false;
    smartAlignmentEnabled = true;
    gridType = GridType.Lines;
    gridSpacing = 24;
}
