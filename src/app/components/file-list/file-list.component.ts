import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';

declare var $: any;

@Component({
    selector: 'app-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

    @Input() public selectedFolderPath: string = null;

    @Input() public folderFiles?: ManifestFileDTO[];

    @Input() public allowDelete: boolean = true;

    @Input() public showDownload: boolean = true;

    @Input() public showSize: boolean = true;

    @Input() public showDate: boolean = true;

    @Input() public confirmFileDelete: boolean = true;

    @Output() public selectFile: EventEmitter<string> = new EventEmitter();

    @Output() public downloadFile: EventEmitter<string> = new EventEmitter();

    @Output() public deleteFile: EventEmitter<string> = new EventEmitter();

    selectedFile: string;

    constructor() { }

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
            this.selectedFile = file;
            $("#deleteFileModal").modal('show');
        }
        else {
            this.deleteFile.emit(file);
        }
    }

    onConfirmDeleteFile() {
        this.deleteFile.emit(this.selectedFile);
        $("#deleteFileModal").modal('hide');
    }
}
