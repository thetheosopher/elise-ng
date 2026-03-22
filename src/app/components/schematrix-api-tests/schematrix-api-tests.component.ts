import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from '../../schematrix/services/api.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    imports: [CommonModule],
    selector: 'app-schematrix-api-tests',
    templateUrl: './schematrix-api-tests.component.html',
    styleUrls: ['./schematrix-api-tests.component.scss']
})
export class SchematrixApiTestsComponent implements OnInit {

    private readonly destroyRef = inject(DestroyRef);

    constructor(private apiService: ApiService) { }

    apiHealthStatus: string;

    statusClass = 'text-primary';

    checkHealth() {
        this.statusClass = 'text-primary';
        this.apiHealthStatus = 'Checking status...';
        this.apiService.checkHealth().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
