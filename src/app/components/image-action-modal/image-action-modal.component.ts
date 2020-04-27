import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-image-action-modal',
    templateUrl: './image-action-modal.component.html',
    styleUrls: ['./image-action-modal.component.scss']
})
export class ImageActionModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    imagePreviewInfo: string;

    @Input()
    modalInfo: ImageActionModalInfo;

    ngOnInit(): void {
    }

    imagePreviewLoaded(event) {
        this.modalInfo.image = event.target;
        this.imagePreviewInfo = event.target.naturalWidth + 'x' + event.target.naturalHeight;
    }

    imageActionView() {
        this.modalInfo.action = 'view';
        this.activeModal.close(this.modalInfo);
    }

    imageActionCreateElement() {
        this.modalInfo.action = 'create-element';
        this.activeModal.close(this.modalInfo);
    }

    imageActionAddResource() {
        this.modalInfo.action = 'add-resource';
        this.activeModal.close(this.modalInfo);
    }
}

export class ImageActionModalInfo {
    source: string;
    canEmbed: boolean;
    action: string;
    containerID: string;
    path: string;
    image: HTMLImageElement;
}