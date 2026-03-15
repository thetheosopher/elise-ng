import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ApiService } from './schematrix/services/api.service';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AlertComponent } from './components/alert/alert.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
    imports: [RouterModule, HeaderComponent, AlertComponent, FooterComponent],
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
