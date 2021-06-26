import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelResource } from 'elise-graphics/lib/resource/model-resource';
import { ContainerUrlProxy } from '../../schematrix/classes/container-url-proxy';
import { Model } from 'elise-graphics/lib/core/model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-model-element-modal',
    templateUrl: './model-element-modal.component.html',
    styleUrls: ['./model-element-modal.component.scss']
})
export class ModelElementModalComponent {

    constructor(
        public activeModal: NgbActiveModal,
        private http: HttpClient,
        private toasterService: ToastrService) { }

    isEnabled = true;

    // @Input()
    modalInfo: ModelElementModalInfo;

    onError(error, title?) {
        console.log(error);
        this.toasterService.error(error, title);
    }

    onResourceSelected(event) {
        const resource = this.modalInfo.selectedResource;
        if(!resource) {
            return;
        }
        if(resource.model) {
            this.setModel(resource.model);
        }
        else {
            this.modalInfo.urlProxy.getUrl(resource.uri, (success, url) => {
                if(success) {
                    this.http.get(url, { responseType: 'text' }).subscribe({
                        next: (modelJson: string) => {
                            try {
                                const model = Model.parse(modelJson);
                                model.resourceManager.urlProxy = this.modalInfo.urlProxy;
                                model.prepareResources(null, (result) => {
                                    if (result) {
                                        this.modalInfo.selectedResource.model = model;
                                        this.setModel(model);
                                    }
                                    else {
                                        this.onError('Error loading preview model resources.');
                                    }
                                });
                            }
                            catch (error) {
                                this.onError(error);
                            }
                        },
                        error: (error) => {
                            this.onError(error);
                        }
                    });
                }
            });
        }
    }

    setModel(model: Model) {
        this.modalInfo.model = model;
        const wr = Math.min((window.innerWidth - 360), 1000) / model.getSize().width;
        const hr = (window.innerHeight - 360) / model.getSize().height;
        this.modalInfo.scale = Math.min(wr, hr);
        this.modalInfo.info = model.getSize().width + 'x' + model.getSize().height;
    }

    compareResources(resourceA: ModelResource, resourceB: ModelResource) {
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

export class ModelElementModalInfo {
    resources: ModelResource[];
    selectedResource: ModelResource;
    urlProxy: ContainerUrlProxy;
    model: Model;
    info: string;
    scale: number;
    opacity = 255;
    lockAspect = true;
}
