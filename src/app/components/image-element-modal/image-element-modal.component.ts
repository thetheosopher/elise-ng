import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BitmapResource } from 'elise-graphics/lib/resource/bitmap-resource';
import { ContainerUrlProxy } from '../../schematrix/classes/container-url-proxy';

@Component({
    selector: 'app-image-element-modal',
    templateUrl: './image-element-modal.component.html',
    styleUrls: ['./image-element-modal.component.scss']
})
export class ImageElementModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    isEnabled = true;

    @Input()
    modalInfo: ImageElementModalInfo;

    ngOnInit(): void {
    }

    onResourceSelected(event) {
        const resource = this.modalInfo.selectedResource;
        if(!resource) {
            return;
        }
        if(resource.image) {
            this.modalInfo.source = resource.image.src;
        }
        else {
            this.modalInfo.urlProxy.getUrl(resource.uri, (success, url) => {
                if(success) {
                    this.modalInfo.source = url;
                }
            });
        }
    }

    imagePreviewLoaded(event) {
        this.modalInfo.selectedResource.image = event.target.cloneNode(true);
        this.modalInfo.info = event.target.naturalWidth + 'x' + event.target.naturalHeight;
    }

    compareResources(resourceA: BitmapResource, resourceB: BitmapResource) {
        try {
            return resourceA.key === resourceB.key;
        }
        catch {
            return false;
        }
    }

    commit() {
        this.activeModal.close(this.modalInfo);
    }
}

export class ImageElementModalInfo {
    resources: BitmapResource[];
    selectedResource: BitmapResource;
    source: string;
    urlProxy: ContainerUrlProxy;
    info: string;
    opacity = 255;
    lockAspect = true;
}
