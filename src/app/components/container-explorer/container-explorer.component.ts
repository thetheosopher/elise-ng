import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../schematrix/services/api.service';
import { UploadService, UploadState, UploadStateCode, Upload, UploadEvent } from '../../services/upload.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { ContainerTreeComponent } from '../../components/container-tree/container-tree.component';
import { SignedUrlRequestDTO } from '../../schematrix/classes/signed-url-request-dto';
import { AlertService } from '../../services/alert.service';

declare var $: any;

@Component({
    selector: 'app-container-explorer',
    templateUrl: './container-explorer.component.html',
    styleUrls: ['./container-explorer.component.scss']
})
export class ContainerExplorerComponent implements OnInit, AfterViewInit {

    @ViewChild(ContainerTreeComponent, { static: true }) containerTree: ContainerTreeComponent;

    @ViewChildren('fileUploadInput', { read: ElementRef }) fileUploadInputRefs: QueryList<ElementRef>;

    fileUploadInputElement: HTMLInputElement;

    @Output() public selectedFolderPath?: string;

    selectedContainerID: string | null;
    folderFiles?: ManifestFileDTO[];
    uploads: Upload[] = [];

    constructor(
        private apiService: ApiService,
        private uploadService: UploadService,
        private http: HttpClient,
        private alertService: AlertService) {
    }

    ngOnInit() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    ngAfterViewInit() {
        this.fileUploadInputRefs.changes.subscribe((refs: QueryList<ElementRef>) => {
            if(refs.length > 0) {
                this.fileUploadInputElement = refs.first.nativeElement;
            }
            else {
                this.fileUploadInputElement = undefined;
            }
        });
    }

    onContainerSelected(container: ContainerDTO | null) {
        if (container) {
            // console.log('Host container selected: ' + container.Name);
            this.selectedContainerID = container.ContainerID;
            this.selectedFolderPath = null;
            this.containerTree.containerID = container.ContainerID;
            this.containerTree.refresh();
        }
        else {
            // console.log('Host container cleared');
            this.selectedContainerID = null;
            this.selectedFolderPath = null;
            this.containerTree.containerID = null;
            this.containerTree.refresh();
        }
    }

    onFolderPathSelected(folderPath: string | null) {
        this.selectedFolderPath = folderPath;
        this.listFolderFiles();
        this.refreshUploads();
    }

    listFolderFiles() {
        this.folderFiles = null;
        if (!this.selectedContainerID) {
            return;
        }
        this.apiService.getContainerManifest(this.selectedContainerID, false, this.selectedFolderPath, true, true, false).subscribe({
            next: (manifest: ManifestDTO) => {
                this.folderFiles = [];
                if (manifest.Files) {
                    manifest.Files.forEach(file => {
                        this.folderFiles.push(file);
                    });
                }
            },
            error: (err) => {
                this.onError(err);
            }
        });
    }

    onError(error) {
        console.log(error);
        this.alertService.error(error, { id: 'container-explorer' });
    }

    onFileDropped($event) {
        this.uploadFiles($event);
    }

    uploadFiles(files: File[]) {
        for (const file of files) {
            this.uploadFile(file);
        }
        this.fileUploadInputElement.value = null;
    }

    selectFile(file) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFolderPath + file;
        urlRequest.ContentType = file.type;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                window.open(signedUrlRequest.Url);
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    downloadFile(file) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFolderPath + file;
        urlRequest.ContentType = file.type;
        urlRequest.ContentDisposition = "attachment;filename=" + file;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                window.open(signedUrlRequest.Url);
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    deleteFile(file) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFolderPath + file;
        urlRequest.ContentType = file.type;
        urlRequest.Verb = 'delete';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                this.http.delete(signedUrlRequest.Url).subscribe({
                    next: () => {
                        const deletedFile = this.folderFiles.find(f => f.Name === file);
                        if(deletedFile) {
                            this.folderFiles.splice(this.folderFiles.indexOf(deletedFile), 1);
                        }
                    }
                })
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    uploadFile(file: File) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.selectedContainerID;
        urlRequest.Path = this.selectedFolderPath + file.name;
        urlRequest.ContentType = file.type;
        urlRequest.Verb = 'put';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                // Start upload using signed URL
                const upload = new Upload(file.name, file.type, file.size, signedUrlRequest.Url);
                upload.containerID = this.selectedContainerID;
                upload.folderPath = this.selectedFolderPath;
                upload.file = file;
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.subscribe({
                    next: (result) => {
                        if (result.success) {
                            console.log('Upload callback: Success');
                            this.alertService.success(`Upload of ${upload.name} succeeded.`, { autoClose: true, id: 'container-explorer' });
                            if(upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code == UploadStateCode.FAILED) {
                                this.onError(`Upload of ${upload.name} failed.`);
                            }
                            if (upload.state.code == UploadStateCode.ABORTED) {
                                this.onError(`Upload of ${upload.name} was aborted.`);
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index != -1) {
                            this.uploads.splice(index, 1);
                        }
                    }
                });
                this.uploads.push(upload);
                // upload.state = new UploadState(UploadStateCode.QUEUED, 50, '');
                this.uploadService.queue(upload);
            },
            error: (error) => {
                this.onError(error);
            }
        });
    }

    refreshUploads() {
        this.uploads = [];
        if(this.uploadService.uploads) {
            this.uploadService.uploads.forEach(upload => {
                if(upload.containerID === this.selectedContainerID && upload.folderPath === this.selectedFolderPath) {
                    this.uploads.push(upload);
                }
            })
        }
    }

    cancelUpload(upload: Upload) {
        this.uploadService.remove(upload);
        this.refreshUploads();
    }
}
