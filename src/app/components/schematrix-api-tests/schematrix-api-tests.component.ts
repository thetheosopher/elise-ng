import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';

@Component({
    selector: 'app-schematrix-api-tests',
    templateUrl: './schematrix-api-tests.component.html',
    styleUrls: ['./schematrix-api-tests.component.scss']
})
export class SchematrixApiTestsComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    apiHealthStatus: string;

    statusClass = 'text-primary';

    checkHealth() {
        this.statusClass = 'text-primary';
        this.apiHealthStatus = 'Checking status...';
        this.apiService.checkHealth().subscribe({
            next: (apiStatus) => {
                this.apiHealthStatus = apiStatus;
                this.statusClass = 'text-primary';
            },
            error: (er) => {
                this.apiHealthStatus = 'Error checking health status.';
                this.statusClass = 'text-danger';
            }
        });
    }

    ngOnInit() {
    }

}
