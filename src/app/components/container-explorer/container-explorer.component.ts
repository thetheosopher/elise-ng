import { Component, DestroyRef, OnInit, ViewChild, ViewChildren, QueryList, Output, ElementRef, AfterViewInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../schematrix/services/api.service';
import { UploadService, UploadStateCode, Upload, UploadEvent } from '../../services/upload.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';
import { ManifestDTO } from '../../schematrix/classes/manifest-dto';
import { ManifestFileDTO } from '../../schematrix/classes/manifest-file-dto';
import { SignedUrlRequestDTO } from '../../schematrix/classes/signed-url-request-dto';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { ContainerSelectorComponent } from '../container-selector/container-selector.component';
import { ContainerTreeComponent } from '../container-tree/container-tree.component';
import { AlertComponent } from '../alert/alert.component';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { FileListComponent } from '../file-list/file-list.component';
import { DndDirective } from '../../directives/dnd.directive';
import { ContainerLocationService } from '../../services/container-location.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

@Component({
    imports: [CommonModule, NgbModule, AngularSplitModule, ContainerSelectorComponent, ContainerTreeComponent, AlertComponent, UploadListComponent, FileListComponent, DndDirective],
    selector: 'app-container-explorer',
    templateUrl: './container-explorer.component.html',
    styleUrls: ['./container-explorer.component.scss']
})
export class ContainerExplorerComponent implements OnInit, AfterViewInit {

    private readonly destroyRef = inject(DestroyRef);

    @ViewChild(ContainerTreeComponent, { static: true }) containerTree: ContainerTreeComponent;

    @ViewChildren('fileUploadInput', { read: ElementRef }) fileUploadInputRefs: QueryList<ElementRef>;

    fileUploadInputElement: HTMLInputElement;

    @Output() public selectedFolderPath?: string;

    selectedContainer: ContainerDTO = { Name: 'Select Container' };
    selectedContainerID: string | null;
    folderFiles?: ManifestFileDTO[];
    uploads: Upload[] = [];
    private restoringFolderPath: string | null = null;

    constructor(
        private apiService: ApiService,
        private uploadService: UploadService,
        private http: HttpClient,
        private toasterService: ToastrService,
        private containerLocationService: ContainerLocationService) {
    }

    ngOnInit() {
        const location = this.containerLocationService.getLocation();
        if (location.container) {
            this.selectedContainer = location.container;
            this.selectedContainerID = location.container.ContainerID;
            this.restoringFolderPath = location.folderPath;
        }
    }

    ngAfterViewInit() {
        this.fileUploadInputRefs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((refs: QueryList<ElementRef>) => {
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
            const restoredFolderPath = this.containerLocationService.getFolderPathForContainer(container.ContainerID);
            // console.log('Host container selected: ' + container.Name);
            this.selectedContainer = {
                ContainerID: container.ContainerID,
                Name: container.Name
            };
            this.selectedContainerID = container.ContainerID;
            this.selectedFolderPath = null;
            this.restoringFolderPath = restoredFolderPath;
            this.containerTree.containerID = container.ContainerID;
            this.containerLocationService.saveLocation(this.selectedContainer, restoredFolderPath);
            this.containerTree.refresh(restoredFolderPath ?? '/');
        }
        else {
            // console.log('Host container cleared');
            this.selectedContainer = { Name: 'Select Container' };
            this.selectedContainerID = null;
            this.selectedFolderPath = null;
            this.restoringFolderPath = null;
            this.containerTree.containerID = null;
            this.containerLocationService.clear();
            this.containerTree.refresh();
        }
    }

    onFolderPathSelected(folderPath: string | null) {
        if (folderPath === null && this.restoringFolderPath !== null) {
            return;
        }

        this.selectedFolderPath = folderPath;
        this.restoringFolderPath = null;
        this.containerLocationService.saveLocation(this.selectedContainerID ? this.selectedContainer : null, folderPath);
        this.listFolderFiles();
        this.refreshUploads();
    }

    listFolderFiles() {
        this.folderFiles = null;
        if (!this.selectedContainerID) {
            return;
        }
        this.apiService.getContainerManifest(this.selectedContainerID, false, this.selectedFolderPath, true, true, false).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    onError(error, title?) {
        console.log(error);
        this.toasterService.error(error, title);
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        urlRequest.ContentDisposition = 'attachment;filename="' + file + '"';
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                this.http.delete(signedUrlRequest.Url).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: () => {
                        const deletedFile = this.folderFiles.find(f => f.Name === file);
                        if(deletedFile) {
                            this.folderFiles.splice(this.folderFiles.indexOf(deletedFile), 1);
                        }
                        this.toasterService.success(file, 'File Deleted');
                    }
                });
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
        this.apiService.getSignedUrl(urlRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (signedUrlRequest) => {
                // Start upload using signed URL
                const upload = new Upload(file.name, file.type, file.size, signedUrlRequest.Url);
                upload.containerID = this.selectedContainerID;
                upload.folderPath = this.selectedFolderPath;
                upload.file = file;
                upload.removeOnFailure = true;
                upload.removeOnSuccess = true;
                upload.callback.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (result) => {
                        if (result.success) {
                            console.log('Upload callback: Success');
                            this.toasterService.success(upload.name, 'File Upload Complete');
                            if(upload.folderPath === this.selectedFolderPath) {
                                this.listFolderFiles();
                            }
                        }
                        else {
                            if (upload.state.code === UploadStateCode.FAILED) {
                                this.onError(`Upload of ${upload.name} failed.`);
                            }
                            if (upload.state.code === UploadStateCode.ABORTED) {
                                this.onError(`Upload of ${upload.name} was aborted.`);
                            }
                        }
                        const index = this.uploads.indexOf(upload);
                        if (index !== -1) {
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
            });
        }
    }

    cancelUpload(upload: Upload) {
        this.uploadService.remove(upload);
        this.refreshUploads();
    }
}
