import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ApiService } from './schematrix/services/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.apiService.baseUrl = environment.schematrixBaseUrl;
    }
}
