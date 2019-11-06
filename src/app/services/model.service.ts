import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelInfo } from './model-info';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    constructor(private http: HttpClient) {}

    getModel(type: string, id: string) {
        const url = `assets/models/${type}/${id}.js`;
        return this.http.get(url, { responseType: 'text' });
    }

    getModelDescription(type: string, id: string) {
        const url = `assets/models/${type}/${id}.html`;
        return this.http.get(url, { responseType: 'text' });
    }

    listModels(type: string) {
        const url = `assets/models/${type}/index.json`;
        return this.http.get<ModelInfo[]>(url);
    }

    getRemoteModel(url: string) {
        return this.http.get(url, { responseType: 'text' });
    }
}
