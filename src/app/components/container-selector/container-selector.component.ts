import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';

declare var $: any;

@Component({
    selector: 'app-container-selector',
    templateUrl: './container-selector.component.html',
    styleUrls: ['./container-selector.component.scss']
})
export class ContainerSelectorComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    containers: ContainerDTO[];
    containerName: string;
    isEnabled: boolean = true;
    isContainerSelected: boolean = false;
    creatingContainer: boolean = false;
    deletingContainer: boolean = false;
    isLoggedIn: boolean = false;

    errorMessage: string;

    @Output() public containerSelected: EventEmitter<ContainerDTO | null> = new EventEmitter();

    @Input() public selectedContainer: ContainerDTO = { Name: 'Select Container' };

    ngOnInit() {
        $('[data-toggle="tooltip"]').tooltip();
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
                    /*
                    containers.unshift({
                        ContainerID: null,
                        Name: 'Select Container'
                    })
                    */
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

    createContainer(newcontainerform) {
        this.creatingContainer = true;
        const newContainer = { Name: this.containerName };
        this.apiService.createContainer(newContainer).subscribe({
            next: (newContainer) => {
                this.creatingContainer = false;
                $("#newContainerModal").modal('hide');
                this.selectedContainer = newContainer;
                this.refreshContainers();
                newcontainerform.reset();
            },
            error: (error) => {
                this.creatingContainer = false;
                $("#newContainerModal").modal('hide');
                this.errorMessage = error;
                $('#errorModal').modal();
            }
        });
    }

    deleteContainer() {
        this.deletingContainer = true;
        this.apiService.deleteContainer(this.selectedContainer.ContainerID).subscribe({
            next: () => {
                this.deletingContainer = false;
                $("#deleteContainerModal").modal('hide');
                this.selectedContainer = { Name: 'Select Container' };
                this.refreshContainers();
            },
            error: (error) => {
                this.deletingContainer = false;
                $("#deleteContainerModal").modal('hide');
                this.errorMessage = error;
                $('#errorModal').modal();
            }
        });
    }
}
