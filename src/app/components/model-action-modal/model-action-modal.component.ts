import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'elise-graphics/lib/core/model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EliseViewComponent } from '../../elise/view/elise-view.component';

@Component({
    imports: [CommonModule, FormsModule, EliseViewComponent],
    selector: 'app-model-action-modal',
    templateUrl: './model-action-modal.component.html',
    styleUrls: ['./model-action-modal.component.scss']
})
export class ModelActionModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: ModelActionModalInfo;

    ngOnInit(): void {
        if (!this.modalInfo.importMode) {
            this.modalInfo.importMode = 'embed';
        }
        if (!this.modalInfo.importTarget) {
            this.modalInfo.importTarget = this.modalInfo.canEmbed ? 'current-model' : 'new-model';
        }
    }

    get title() {
        const baseTitle = this.modalInfo.sourceType === 'model' ? 'Model Action' : `${this.sourceTypeLabel} Import`;
        const fileName = this.sourceFileName;
        return fileName ? `${baseTitle} - ${fileName}` : baseTitle;
    }

    get sourceTypeLabel() {
        return this.modalInfo.sourceType === 'wmf' ? 'WMF' : 'SVG';
    }

    get sourceFileName() {
        const sourcePath = this.modalInfo?.path?.trim();
        if (!sourcePath) {
            return '';
        }

        const normalizedPath = sourcePath.split('?')[0].split('#')[0];
        const pathSegments = normalizedPath.split(/[\\/]/);
        return pathSegments[pathSegments.length - 1] || '';
    }

    get editLabel() {
        return this.modalInfo.sourceType === 'model' ? 'Edit Model' : 'Open As Model';
    }

    get createLabel() {
        if (this.modalInfo.sourceType === 'model') {
            return 'Embed Model';
        }
        return this.modalInfo.importMode === 'decompose' ? 'Decompose Into Elements' : 'Import As Model Element';
    }

    get showImportTarget() {
        return this.modalInfo.sourceType !== 'model' && this.modalInfo.canCreateNew && this.modalInfo.canEmbed;
    }

    get showImportMode() {
        return this.modalInfo.sourceType !== 'model' && this.modalInfo.canDecompose && this.modalInfo.importTarget === 'current-model';
    }

    get isImportingIntoCurrentModel() {
        return this.modalInfo.importTarget === 'current-model';
    }

    get isImportingAsNewModel() {
        return this.modalInfo.importTarget === 'new-model';
    }

    actionEdit() {
        this.modalInfo.action = 'edit';
        this.activeModal.close(this.modalInfo);
    }

    actionCreateElement() {
        this.modalInfo.action = 'create-element';
        this.activeModal.close(this.modalInfo);
    }

    actionAddResource() {
        this.modalInfo.action = 'add-resource';
        this.activeModal.close(this.modalInfo);
    }

    actionCreateModel() {
        this.modalInfo.action = 'create-model';
        this.activeModal.close(this.modalInfo);
    }
}

export class ModelActionModalInfo {
    canEmbed: boolean;
    canEdit = true;
    canDecompose = false;
    canCreateNew = false;
    action: string;
    sourceType: 'model' | 'svg' | 'wmf' = 'model';
    importMode: 'embed' | 'decompose' = 'embed';
    importTarget: 'new-model' | 'current-model' = 'new-model';
    containerID: string | null;
    containerName: string | null;
    scale: number;
    path: string;
    model: Model;
    info: string;
}
