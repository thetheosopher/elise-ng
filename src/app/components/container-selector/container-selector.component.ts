import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { ContainerDTO } from '../../schematrix/classes/container-dto';

@Component({
    selector: 'app-container-selector',
    templateUrl: './container-selector.component.html',
    styleUrls: ['./container-selector.component.scss']
})
export class ContainerSelectorComponent implements OnInit {
    @ViewChild('closemodalbutton', { read: ElementRef, static: true })
    closeModalButtonRef: ElementRef;
    closeModalButton: HTMLButtonElement;

    containers: ContainerDTO[];
    containerName: string;
    isEnabled: boolean = true;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.closeModalButton = this.closeModalButtonRef.nativeElement;
        this.refreshContainers();
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
                    this.containers = containers;
                    this.isEnabled = true;
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

    createContainer() {
        this.apiService.createContainer({ Name: this.containerName }).subscribe({
            next: (newContainer) => {
                this.closeModalButton.click();
                this.refreshContainers();
            },
            error: (error) => {
                alert(error);
            }
        });

        // alert('foo');
    }
}
