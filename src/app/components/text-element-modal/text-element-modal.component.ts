import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [CommonModule, FormsModule, NgbModule],
    selector: 'app-text-element-modal',
    templateUrl: './text-element-modal.component.html',
    styleUrls: ['./text-element-modal.component.scss']
})
export class TextElementModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    @Input()
    modalInfo: TextElementModalInfo;

    ngOnInit(): void {
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class TextElementModalInfo {
    fonts: string[];
    typeface: string;
    text: string;
    typesize: number;
    isBold: boolean;
    isItalic: boolean;
    halign: string;
    valign: string;
}