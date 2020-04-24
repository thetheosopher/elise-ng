import { UrlProxy } from 'elise-graphics/lib/resource/url-proxy';
import { ApiService } from '../services/api.service';
import { SignedUrlRequestDTO } from './signed-url-request-dto';

export class ContainerUrlProxy extends UrlProxy {

    constructor(private apiService: ApiService, private containerID: string) {
        super();
    }

    getUrl(url: string, callback:(success: boolean, url: string) => void) {
        const urlRequest = new SignedUrlRequestDTO();
        urlRequest.ContainerID = this.containerID;
        urlRequest.Path = url;
        urlRequest.Verb = 'get';
        this.apiService.getSignedUrl(urlRequest).subscribe({
            next: (signedUrlRequest) => {
                callback(true, signedUrlRequest.Url);
            },
            error: (error) => {
                callback(false, null);
            }
        });
    };
}