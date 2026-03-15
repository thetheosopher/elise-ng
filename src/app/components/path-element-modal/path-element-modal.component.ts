import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule],
    selector: 'app-path-element-modal',
    templateUrl: './path-element-modal.component.html',
    styleUrls: ['./path-element-modal.component.scss']
})
export class PathElementModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: PathElementModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class PathElementModalInfo {
    commandString: string;
}
