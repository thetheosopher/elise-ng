import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

    uploads: Upload[] = [];

    uploadQueued: EventEmitter<Upload> = new EventEmitter();
    uploadForced: EventEmitter<Upload> = new EventEmitter();
    uploadRemoved: EventEmitter<Upload> = new EventEmitter();
    uploadStarted: EventEmitter<Upload> = new EventEmitter();
    uploadCompleted: EventEmitter<Upload> = new EventEmitter();
    uploadAborted: EventEmitter<Upload> = new EventEmitter();
    uploadFailed: EventEmitter<Upload> = new EventEmitter();
    uploadProgress: EventEmitter<Upload> = new EventEmitter();
	enabled: boolean = true;
	uploadCounter: number = 0;
	maxActive: number = 4;
	activeUploads: number = 0;

	constructor() {
		this.queue = this.queue.bind(this);
		this.immediate = this.immediate.bind(this);
		this.start = this.start.bind(this);
		this.pause = this.pause.bind(this);
		this.remove = this.remove.bind(this);
		this.removeById = this.removeById.bind(this);
		this.removeFinished = this.removeFinished.bind(this);
		this.removeAll = this.removeAll.bind(this);
		this.onUploadProgress = this.onUploadProgress.bind(this);
		this.beginNext = this.beginNext.bind(this);
		this.onUploadProgress = this.onUploadProgress.bind(this);
		this.onUploadStarted = this.onUploadStarted.bind(this);
		this.onUploadCompleted = this.onUploadCompleted.bind(this);
		this.onUploadAborted = this.onUploadAborted.bind(this);
		this.onUploadFailed = this.onUploadFailed.bind(this);
	}

	queue(upload: Upload) {
		upload.state = UploadState.create(UploadStateCode.QUEUED, 0, "Queued");
		upload.id = this.uploadCounter++;
		this.uploads.push(upload);
        this.uploadQueued.emit(upload);
		this.beginNext();
	};

	immediate(upload: Upload) {
	    upload.state = UploadState.create(UploadStateCode.UPLOADING, 0, "Immediate Upload");
	    upload.id = this.uploadCounter++;
	    upload.isImmediate = true;

	    // Insert after completed and any other immediate, but before any queued
	    let i = 0, index = 0;
        while(i < this.uploads.length) {
            let u = this.uploads[i];
	        let code = u.state.code;
	        if (!u.isImmediate && (code === UploadStateCode.QUEUED)) {
	            break;
	        }
	        i++;
	        index++;
	    }

	    this.uploads.splice(index, 0, upload);

        // Call upload forced event
        this.uploadForced.emit(upload);

	    // Create XMLHttpRequest for upload
	    let xhr = new XMLHttpRequest();
	    upload.request = xhr;

	    // Attach to monitor upload progress
	    xhr.upload.addEventListener("progress", (evt: any) => {
	        if (evt.lengthComputable) {
	            var percent = (evt.loaded / evt.total) * 100;
	            upload.state = UploadState.create(UploadStateCode.UPLOADING, percent, upload.name + " [" + percent + "%]");
                this.uploadProgress.emit(upload);
	        }
	    }, false);

	    // Monitor file completion
	    xhr.addEventListener("load", () => {
	        upload.state = UploadState.create(UploadStateCode.COMPLETED, 100, upload.name + " completed successfully.");

	        // If status is in 400-500 range, report as error
	        if (xhr.status >= 400) {
	            upload.state = UploadState.create(UploadStateCode.FAILED, upload.state.percent, upload.name + " failed. " + xhr.statusText);
	            this.onUploadFailed(upload);
                upload.callback.emit(new UploadResult(upload, false));
	            if (upload.removeOnFailure) {
	                this.remove(upload);
	            }
	        }
	        else {
	            this.onUploadCompleted(upload);
                upload.callback.emit(new UploadResult(upload, true));
	            if (upload.removeOnSuccess) {
	                this.remove(upload);
	            }
	        }
	    }, false);

	    // Monitor file cancellation
	    xhr.addEventListener("abort", () => {
	        upload.state = UploadState.create(UploadStateCode.ABORTED, upload.state.percent, upload.name + " aborted. " + xhr.statusText);
	        this.onUploadAborted(upload);
            upload.callback.emit(new UploadResult(upload, false));
	        if (upload.removeOnFailure) {
	            this.remove(upload);
	        }
	    }, false);

	    // Monitor upload failure
	    xhr.addEventListener("error", () => {
	        upload.state = UploadState.create(UploadStateCode.FAILED, upload.state.percent, upload.name + " failed. " + xhr.statusText);
	        this.onUploadFailed(upload);
            upload.callback.emit(new UploadResult(upload, false));
	        if (upload.removeOnFailure) {
	            this.remove(upload);
	        }
	    }, false);

	    // Open request and set any assigned headers
	    xhr.open(upload.method, upload.url, true);
	    upload.headers.forEach((header) => {
	        xhr.setRequestHeader(header.name, header.value);
	    });

	    // Increment active uploads
	    this.activeUploads++;

	    // Set upload state to uploading
	    upload.state = UploadState.create(UploadStateCode.UPLOADING, 0, upload.name + " starting.");

	    // Call start event
	    this.onUploadStarted(upload);

	    // Upload file or data
	    var blob;
	    if (upload.file) {
	        // If file upload
	        if (upload.type) {
	            xhr.setRequestHeader("content-type", upload.type);
	        }
	        xhr.send(upload.file);
	    }
	    else {
	        // Data (blob) upload
	        if (upload.type) {
	            blob = new Blob([upload.data], { type: upload.type });
	            xhr.setRequestHeader("content-type", upload.type);
	        }
	        else {
	            blob = new Blob([upload.data], { "type": "" });
	        }
	        xhr.send(blob);
	    }

	};

	start() {
		this.enabled = true;
		this.beginNext();
	}

	pause() {
		this.enabled = false;
	}

	remove(upload: Upload) {
		let index = this.uploads.indexOf(upload);
		if(index !== -1) {
			if (upload.state.code === UploadStateCode.UPLOADING) {
				upload.request.abort();
			}
			this.uploads.splice(index, 1);
            this.uploadRemoved.emit(upload);
		}
	}

	removeById(id: number) {
	    let found = null;
	    this.uploads.forEach((upload) => {
	        if (upload.id === id) {
	            found = upload;
	        }
	    });
	    if (found) {
	        this.remove(found);
	    }
	}

	removeFinished() {
	    let finished: Upload[] = [];
	    this.uploads.forEach((upload) => {
	        switch (upload.state.code) {
	            case UploadStateCode.COMPLETED:
	            case UploadStateCode.ABORTED:
	            case UploadStateCode.FAILED:
	                finished.push(upload);
	                break;
	        }
	    });
	    finished.forEach((upload) => {
	        this.remove(upload);
	    });
	}

	removeAll() {
	    let trash: Upload[] = [];
	    this.uploads.forEach((upload) => {
	        trash.push(upload);
	    });
	    trash.forEach((upload) => {
	        this.remove(upload);
	    });
	}

	onUploadProgress(e: Upload) {
		this.uploadProgress.emit(e);
	}

	onUploadStarted(upload: Upload) {
		this.uploadStarted.emit(upload);
	}

	onUploadCompleted(upload: Upload) {
	    this.activeUploads--;
		this.uploadCompleted.emit(upload);
		this.beginNext();
	}

	onUploadAborted(upload: Upload) {
	    this.activeUploads--;
		this.uploadAborted.emit(upload);
		this.beginNext();
	}

	onUploadFailed(upload: Upload) {
	    this.activeUploads--;
		this.uploadFailed.emit(upload);
		this.beginNext();
	}

	beginNext() {

	    // Exit if disabled
	    if (!this.enabled) { return; }

	    // Exit if max active reached
	    if (this.activeUploads >= this.maxActive) { return; }

	    // Look for next file to upload
		let nextUpload = null, upload: Upload;
		let l = this.uploads.length;
		for (let i = 0; i < l; i++) {
			upload = this.uploads[i];
			if (upload.state.code === UploadStateCode.QUEUED) {
				nextUpload = upload;
				break;
			}
		}

		// Return if nothing to upload
		if (nextUpload === null) {
			return;
		}

		// Create XMLHttpRequest for upload
		let xhr = new XMLHttpRequest();
		upload.request = xhr;

		// Attach to monitor upload progress
		xhr.upload.addEventListener("progress", (evt: any) => {
			if (evt.lengthComputable) {
				var percent = (evt.loaded / evt.total) * 100;
				upload.state = UploadState.create(UploadStateCode.UPLOADING, percent, upload.name + " [" + percent + "%]");
				this.onUploadProgress(upload);
			}
		}, false);

		// Monitor file completion
		xhr.addEventListener("load", () => {
			upload.state = UploadState.create(UploadStateCode.COMPLETED, 100, upload.name + " completed successfully.");

		    // If status is in 400-500 range, report as error
			if (xhr.status >= 400) {
			    upload.state = UploadState.create(UploadStateCode.FAILED, upload.state.percent, upload.name + " failed. " + xhr.statusText);
			    this.onUploadFailed(upload);
                upload.callback.emit(new UploadResult(upload, false));
			    if (upload.removeOnFailure) {
			        this.remove(upload);
			    }
            }
			else {
			    this.onUploadCompleted(upload);
                upload.callback.emit(new UploadResult(upload, true));
			    if (upload.removeOnSuccess) {
			        this.remove(upload);
			    }
			}
		}, false);

		// Monitor file cancellation
		xhr.addEventListener("abort", () => {
			upload.state = UploadState.create(UploadStateCode.ABORTED, upload.state.percent, upload.name + " aborted. " + xhr.statusText);
			this.onUploadAborted(upload);
            upload.callback.emit(new UploadResult(upload, false));
			if (upload.removeOnFailure) {
			    this.remove(upload);
			}
		}, false);

		// Monitor upload failure
		xhr.addEventListener("error", () => {
			upload.state = UploadState.create(UploadStateCode.FAILED, upload.state.percent, upload.name + " failed. " + xhr.statusText);
			this.onUploadFailed(upload);
            upload.callback.emit(new UploadResult(upload, false));
			if (upload.removeOnFailure) {
			    this.remove(upload);
			}
		}, false);

		// Open request and set any assigned headers
		xhr.open(upload.method, upload.url, true);
		upload.headers.forEach((header) => {
			xhr.setRequestHeader(header.name, header.value);
		});

		// Increment active uploads
		this.activeUploads++;

		// Set upload state to uploading
		upload.state = UploadState.create(UploadStateCode.UPLOADING, 0, upload.name + " starting.");

		// Call start event
		this.onUploadStarted(upload);

	    // Upload file or data
		var blob;
		if (upload.file) {
			// If file upload
		    if (upload.type) {
		        xhr.setRequestHeader("content-type", upload.type);
		    }
		    xhr.send(upload.file);
		}
		else {
			// Data (blob) upload
			if (upload.type) {
				blob = new Blob([upload.data], { type: upload.type });
			    xhr.setRequestHeader("content-type", upload.type);
			}
			else {
			    blob = new Blob([upload.data], { "type": "" });
			}
			xhr.send(blob);
		}
	}
}

export class UploadHeader {
    name: string;
    value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

export enum UploadStateCode {
	QUEUED = 0,
	UPLOADING = 1,
	FAILED = 2,
	ABORTED = 3,
	COMPLETED = 4
}

export class UploadState {

    code: UploadStateCode;
    percent: number;
    message: string;

    constructor(code: UploadStateCode, percent: number, message: string) {
        this.code = code;
        this.percent = percent;
        this.message = message;
    }

	static create(code: UploadStateCode, percent: number, message: string) {
	    return new UploadState(code, percent, message);
	}
}

export class UploadEvent<T> {
    private handlers: { (u: Upload, data?: T): void; }[] = [];

    public add(handler: { (u: Upload, data?: T): void }) {
        this.handlers.push(handler);
    }

    public remove(handler: any): void {
        let index = this.handlers.indexOf(handler);
        if(index > -1) {
            this.handlers.splice(index, 1);
        }
    }

    public hasListeners(): boolean {
        return this.handlers.length > 0;
    }

    public clear(): void  {
        this.handlers.splice(0, this.handlers.length);
    }

    public trigger(u: Upload, data?: T) {
        this.handlers.slice(0).forEach(h => h(u, data));
    }
}

export class UploadResult {
    constructor(public upload: Upload, public success: boolean) {
    }
}

export class Upload {

    name: string;
    type: string;
    size: number;
    url: string;
    containerID: string;
    folderPath: string;
    callback: EventEmitter<UploadResult> = new EventEmitter();

    id: number; // Assigned by controller
    isImmediate: boolean = false;

    state: UploadState;
    method: string;
    headers: UploadHeader[];
    file: File;
    data: any;
    request: XMLHttpRequest;

    removeOnSuccess: boolean;
    removeOnFailure: boolean;

	constructor(name: string, type: string, size: number, url: string) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.url = url;

		this.state = null;
		this.method = "PUT";
		this.headers = [];
		this.file = null;
		this.data = null;
		this.request = null;
		this.removeOnSuccess = false;
		this.removeOnFailure = false;
	}

	static createFileUpload(name: string, type: string, size: number, url: string, file: File, callback: UploadEvent<boolean>) {
		let upload = new Upload(name, type, size, url);
		upload.file = file;
		return upload;
	}

	static createDataUpload(name: string, type: string, size: number, url: string, data: any, callback: UploadEvent<boolean>) {
		let upload = new Upload(name, type, size, url);
		upload.data = data;
		return upload;
	}

	addHeader(name: string, value: string) {
		this.headers.push(new UploadHeader(name, value));
	}

	wasSuccessful() {
	    if (this.state.code === UploadStateCode.COMPLETED) {
	        return true;
	    }
	    return false;
	}

	lastStatus() {
	    return this.state.message;
	}
}

