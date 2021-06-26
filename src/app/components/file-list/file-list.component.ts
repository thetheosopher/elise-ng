import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { DeleteFileModalComponent, DeleteFileModalInfo } from '../delete-file-modal/delete-file-modal.component';

@Component({
    selector: 'app-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

    @Input() public selectedFolderPath: string = null;
    @Input() public folderFiles?: ManifestFileDTO[];
    @Input() public allowDelete = true;
    @Input() public showDownload = true;
    @Input() public showSize = true;
    @Input() public showDate = true;
    @Input() public confirmFileDelete = true;
    @Output() public selectFile: EventEmitter<string> = new EventEmitter();
    @Output() public downloadFile: EventEmitter<string> = new EventEmitter();
    @Output() public deleteFile: EventEmitter<string> = new EventEmitter();

    selectedFile: string;

    constructor(private modalService: NgbModal) { }

    ngOnInit() {
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

    onSelectFile(file) {
        event.preventDefault();
        this.selectFile.emit(file);
    }

    onRequestDownloadFile(file) {
        this.downloadFile.emit(file);
    }

    onRequestDeleteFile(file) {
        if(this.confirmFileDelete) {
            const modalInfo = new DeleteFileModalInfo();
            modalInfo.path = file;
            const modal = this.modalService.open(DeleteFileModalComponent);
            modal.componentInstance.modalInfo = modalInfo;
            modal.result.then((result: DeleteFileModalInfo) => {
                this.deleteFile.emit(result.path);
            });
        }
        else {
            this.deleteFile.emit(file);
        }
    }
}
