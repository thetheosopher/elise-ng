import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'elise-graphics/lib/core/model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EliseViewComponent } from '../../elise/view/elise-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [CommonModule, FormsModule, EliseViewComponent, NgbModule],
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
    }

    get title() {
        const baseTitle = this.modalInfo.sourceType === 'svg' ? 'SVG Import' : 'Model Action';
        const fileName = this.sourceFileName;
        return fileName ? `${baseTitle} - ${fileName}` : baseTitle;
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
        return this.modalInfo.sourceType === 'svg' ? 'Open As Model' : 'Edit Model';
    }

    get createLabel() {
        if (this.modalInfo.sourceType !== 'svg') {
            return 'Embed Model';
        }
        return this.modalInfo.importMode === 'decompose' ? 'Decompose Into Elements' : 'Import As Model Element';
    }

    get showImportMode() {
        return this.modalInfo.sourceType === 'svg' && this.modalInfo.canDecompose;
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
}

export class ModelActionModalInfo {
    canEmbed: boolean;
    canEdit = true;
    canDecompose = false;
    action: string;
    sourceType: 'model' | 'svg' = 'model';
    importMode: 'embed' | 'decompose' = 'embed';
    containerID: string | null;
    containerName: string | null;
    scale: number;
    path: string;
    model: Model;
    info: string;
}
