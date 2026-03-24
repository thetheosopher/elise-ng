import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { DeleteFileModalComponent, DeleteFileModalInfo } from '../delete-file-modal/delete-file-modal.component';
import { CommonModule } from '@angular/common';

@Component({
    imports: [CommonModule],
    selector: 'app-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss']
})
export class FileListComponent {

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

    onSelectFile(event: Event, file: string) {
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

    trackByFileName(_index: number, file: ManifestFileDTO): string {
        return file.Name;
    }

    getFileIconClass(fileName: string): string {
        const ext = (fileName || '').split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'json': return 'fa-file-code';
            case 'svg': return 'fa-file-image';
            case 'png': case 'jpg': case 'jpeg': case 'gif': case 'webp': case 'bmp': return 'fa-file-image';
            case 'js': case 'ts': case 'html': case 'css': case 'scss': return 'fa-file-code';
            case 'pdf': return 'fa-file-pdf';
            case 'zip': case 'gz': case 'tar': case 'rar': return 'fa-file-archive';
            case 'txt': case 'md': return 'fa-file-alt';
            default: return 'fa-file';
        }
    }
}
