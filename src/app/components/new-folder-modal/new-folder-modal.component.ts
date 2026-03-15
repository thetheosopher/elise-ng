import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule],
    selector: 'app-new-folder-modal',
    templateUrl: './new-folder-modal.component.html'
})
export class NewFolderModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: NewFolderModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class NewFolderModalInfo {
    parent: string;
    name: string;
}

