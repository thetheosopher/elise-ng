import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Upload } from '../../services/upload.service';

@Component({
    selector: 'app-upload-list',
    templateUrl: './upload-list.component.html',
    styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {

    @Input() uploads: Upload[] = [];

    @Output() public cancelUpload: EventEmitter<Upload> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onCancelUpload(upload: Upload) {
        this.cancelUpload.emit(upload);
    }

    formatBytes(bytes, decimals) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
