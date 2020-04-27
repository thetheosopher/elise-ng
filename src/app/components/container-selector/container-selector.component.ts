import { Component, OnInit, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../schematrix/services/api.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';
import { ToastrService } from 'ngx-toastr';
import { NewContainerModalComponent, NewContainerModalInfo } from '../new-container-modal/new-container-modal.component';
import { DeleteContainerModalComponent, DeleteContainerModalInfo } from '../delete-container-modal/delete-container-modal.component';

@Component({
    selector: 'app-container-selector',
    templateUrl: './container-selector.component.html',
    styleUrls: ['./container-selector.component.scss']
})
export class ContainerSelectorComponent implements OnInit {

    constructor(private apiService: ApiService,
        private toasterService: ToastrService,
        private modalService: NgbModal) { }

    containers: ContainerDTO[];
    isEnabled: boolean = true;
    isContainerSelected: boolean = false;
    isLoggedIn: boolean = false;

    @Output() public containerSelected: EventEmitter<ContainerDTO | null> = new EventEmitter();

    @Input() public selectedContainer: ContainerDTO = { Name: 'Select Container' };

    ngOnInit() {
        this.isLoggedIn = this.apiService.isLoggedIn;
        this.refreshContainers();
    }

    onContainerSelected(event) {
        if (this.selectedContainer.ContainerID) {
            this.containerSelected.emit(this.selectedContainer);
            this.isContainerSelected = true;
            // console.log(`Container ${this.selectedContainer.Name} selected.`);
        }
        else {
            this.containerSelected.emit(null);
            this.isContainerSelected = false;
            // console.log('Container selection cleared.');
        }
    }

    compareContainers(containerA: ContainerDTO, containerB: ContainerDTO) {
        return containerA.ContainerID === containerB.ContainerID;
    }

    refreshContainers() {
        this.apiService.listContainers().subscribe({
            next: (containers) => {
                if (!containers || containers.length == 0) {
                    this.containers = [
                        {
                            ContainerID: null,
                            Name: 'No Containers'
                        }];
                    this.isEnabled = false;
                }
                else {
                    const currentlySelected = this.selectedContainer;
                    this.selectedContainer = { Name: 'Select Container' };
                    containers.unshift(this.selectedContainer);
                    this.containers = containers;
                    this.isEnabled = true;
                    this.selectedContainer = currentlySelected;
                    this.onContainerSelected(null);
                }
            },
            error: (error) => {
                this.containers = [
                    {
                        ContainerID: null,
                        Name: 'No Containers'
                    }];
                this.isEnabled = false;
            }
        })
    }

    showNewContainerModal() {
        const modalInfo = new NewContainerModalInfo();
        const modal = this.modalService.open(NewContainerModalComponent);
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: NewContainerModalInfo) => {
            this.createContainer(result);
        }, (cancelReason) => {
        })
    }

    createContainer(modalInfo: NewContainerModalInfo) {
        const newContainer = { Name: modalInfo.name };
        this.apiService.createContainer(newContainer).subscribe({
            next: (newContainer) => {
                this.selectedContainer = newContainer;
                this.refreshContainers();
            },
            error: (error) => {
                this.toasterService.error(error, 'Create Container Failed');
            }
        });
    }

    showDeleteContainerModal() {
        const modalInfo = new DeleteContainerModalInfo();
        modalInfo.name = this.selectedContainer.Name;
        modalInfo.containerID = this.selectedContainer.ContainerID;
        const modal = this.modalService.open(DeleteContainerModalComponent);
        modal.componentInstance.modalInfo = modalInfo;
        modal.result.then((result: DeleteContainerModalInfo) => {
            this.deleteContainer(result);
        }, (cancelReason) => {
        })
    }

    deleteContainer(modalInfo: DeleteContainerModalInfo) {
        this.apiService.deleteContainer(modalInfo.containerID).subscribe({
            next: () => {
                this.toasterService.success(modalInfo.name, 'Container Deleted');
                this.selectedContainer = { Name: 'Select Container' };
                this.refreshContainers();
            },
            error: (error) => {
                this.toasterService.error(error, 'Delete Container Failed')
            }
        });
    }
}
