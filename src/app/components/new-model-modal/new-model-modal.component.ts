import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule],
    selector: 'app-new-model-modal',
    templateUrl: './new-model-modal.component.html',
    styleUrls: ['./new-model-modal.component.scss']
})
export class NewModelModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: NewModelModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class NewModelModalInfo {
    name: string;
    width = 1024;
    height = 768;
}
