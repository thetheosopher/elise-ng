import { Injectable, EventEmitter, Output, Directive } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ContainerDTO } from '../classes/container-dto';
import { ContainerFolderDTO } from '../classes/container-folder-dto';
import { LoginDTO } from '../classes/login-dto';
import { RegistrationInfoDTO } from '../classes/registration-info-dto';
import { UserRegistrationDTO } from '../classes/user-registration-dto';
import { Observable } from 'rxjs';
import { ManifestDTO } from '../classes/manifest-dto';
import { SignedUrlRequestDTO } from '../classes/signed-url-request-dto';

@Directive()
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    baseUrl: string;
    localStorageAvailable: boolean;
    login: LoginDTO;
    isLoggedIn: boolean = false;
    refreshTimer: NodeJS.Timeout;
    refreshingToken: boolean;

    @Output() loginEvent = new EventEmitter<LoginDTO>();
    @Output() logoutEvent = new EventEmitter();
    @Output() errorEvent = new EventEmitter<string>();

    constructor(private http: HttpClient) {
        this.localStorageAvailable = this.storageAvailable();
        this.checkRefresh = this.checkRefresh.bind(this);
    }

    storageAvailable() {
        try {
            var storage = localStorage;
            var x = '$_test_$';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    checkHealth() {
        const url = this.baseUrl + '/api/';
        return this.http.get(url, { responseType: 'text' });
    }

    onLogin() {
        this.isLoggedIn = true;
        this.loginEvent.emit(this.login);
    }

    onLogout() {
        this.isLoggedIn = false;
        this.logoutEvent.emit();
    }

    onError(message: string) {
        this.errorEvent.emit(message);
    }

    private handleError(response: HttpErrorResponse) {
        if (response.error && !response.error.type) {
            this.onError(response.error);
        }
        else if (response.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            this.onError('Network Error: ' + response.error.message);
        }
        else if(response.error instanceof ProgressEvent) {
            this.onError('Unable To Process Request.');
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this.onError(
                `Error Code ${response.status}, ${response.error}`);
        }
    };

    authenticate(username: string, password: string) {
        if (!username.trim()) {
            this.onError('User name is required.');
            return;
        }
        if (!password) {
            this.onError('Password is required.');
            return;
        }

        // If valid, submit request
        const requestObject = {
            "Name": username,
            "Password": password
        };
        var requestString = JSON.stringify(requestObject);
        var url = this.baseUrl + '/api/authenticate/';
        this.http.post(url, requestString, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).subscribe({
            next: (loginDTO: LoginDTO) => {
                this.login = loginDTO;
                if (this.localStorageAvailable) {
                    localStorage.setItem('login', JSON.stringify(this.login));
                }
                this.onLogin();
                this.startRefreshTimer();
            },
            error: (response) => {
                this.handleError(response);
            }
        })
    }

    logout() {
        this.login = null;
        if (this.localStorageAvailable) {
            localStorage.removeItem('login');
        }
        this.onLogout();
        this.stopRefreshTimer();
    }

    startRefreshTimer() {
        if(this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        this.refreshTimer = setInterval(this.checkRefresh, 15000);
    }

    stopRefreshTimer() {
        if(this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    checkToken() {

        // If no storage or no existing token
        if (!this.localStorageAvailable) {
            this.onLogout();
            return;
        }
        else {
            const loginString = localStorage.getItem('login');
            if (loginString) {
                this.login = JSON.parse(localStorage.getItem('login'));
            }
            else {
                this.onLogout();
                return;
            }
        }

        const url = this.baseUrl + '/api/authenticated';
        this.http.get<LoginDTO>(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.login.Token
            },
            observe: 'response'
        }).subscribe({
            next: (response) => {
                const loginDTO = response.body;
                this.login.LoginID = loginDTO.LoginID;
                this.login.Name = loginDTO.Name;
                this.login.Alias = loginDTO.Alias;
                this.login.Email = loginDTO.Email;
                this.login.IsEnabled = loginDTO.IsEnabled;
                this.login.IsAdmin = loginDTO.IsAdmin;
                this.login.GrantFlags = loginDTO.GrantFlags;
                this.login.DenyFlags = loginDTO.DenyFlags;
                this.login.CreateTime = loginDTO.CreateTime;
                this.login.TokenExpiration = loginDTO.TokenExpiration;
                localStorage.setItem('login', JSON.stringify(this.login));
                this.isLoggedIn = true;
                this.loginEvent.emit(this.login);
                this.startRefreshTimer();
            },
            error: (response) => {
                this.stopRefreshTimer();
                const header = response.headers.get('WWW-Authenticate');
                if (header && header.indexOf('expired') != 1) {
                    this.errorEvent.emit('Session has expired.<br/>Please log in again.')
                    this.logoutEvent.emit();
                    return;
                }
                this.errorEvent.emit('Session is invalid. Please log in.');
                this.logoutEvent.emit();
            }
        });
    }

    remainingTokenMinutes(tokenExpiration: string) {
        const tokenDate = new Date(tokenExpiration);
        const nowDate = new Date();
        const tokenMilliSeconds = (tokenDate.getTime() - nowDate.getTime());
        const tokenMinutes = tokenMilliSeconds / 60000;
        return tokenMinutes;
    }

    checkRefresh() {
        if (!this.localStorageAvailable) {
            return;
        }
        else {
            const loginString = localStorage.getItem('login');
            if (loginString) {
                const login: LoginDTO = JSON.parse(localStorage.getItem('login'));
                const tokenMinutes = this.remainingTokenMinutes(login.TokenExpiration);
                if(tokenMinutes < 15) {
                    this.refreshToken();
                }
            }
            else {
                return;
            }
        }
    }

    refreshToken() {

        if(this.refreshingToken) {
            return;
        }

        // If no storage or no existing token
        if (!this.localStorageAvailable) {
            return;
        }
        else {
            const loginString = localStorage.getItem('login');
            if (loginString) {
                const login: LoginDTO = JSON.parse(localStorage.getItem('login'));
                const tokenMinutes = this.remainingTokenMinutes(login.TokenExpiration);
                if(tokenMinutes > 15) {
                    return;
                }
            }
            else {
                return;
            }
        }

        this.refreshingToken = true;
        const url = this.baseUrl + '/api/refreshtoken';
        this.http.get<LoginDTO>(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.login.Token
            },
            observe: 'response'
        }).subscribe({
            next: (response) => {
                const loginDTO = response.body;
                this.login.LoginID = loginDTO.LoginID;
                this.login.Name = loginDTO.Name;
                this.login.Alias = loginDTO.Alias;
                this.login.Email = loginDTO.Email;
                this.login.IsEnabled = loginDTO.IsEnabled;
                this.login.IsAdmin = loginDTO.IsAdmin;
                this.login.GrantFlags = loginDTO.GrantFlags;
                this.login.DenyFlags = loginDTO.DenyFlags;
                this.login.CreateTime = loginDTO.CreateTime;
                this.login.TokenExpiration = loginDTO.TokenExpiration;
                localStorage.setItem('login', JSON.stringify(this.login));
                this.isLoggedIn = true;
                this.loginEvent.emit(this.login);
                this.refreshingToken = false;
            },
            error: (response) => {
                this.refreshingToken = false;
                const header = response.headers.get('WWW-Authenticate');
                if (header && header.indexOf('expired') != 1) {
                    this.errorEvent.emit('Session has expired.<br/>Please log in again.')
                    this.logoutEvent.emit();
                    return;
                }
                this.errorEvent.emit('Session is invalid. Please log in.');
                this.logoutEvent.emit();
            }
        });
    }

    checkNameInUse(name: string) {
        const observable = new Observable<RegistrationInfoDTO>((observer) => {
            if (name.trim().length == 0) {
                observer.complete();
                return;
            }
            if (name.trim().length > 256) {
                observer.error(new Error('Name too long.'));
                return;
            }
            const url = this.baseUrl + '/api/checknameavailability/' + encodeURIComponent(name) + '/';
            this.http.get(url).subscribe({
                next: (registrationInfoDTO: RegistrationInfoDTO) => {
                    observer.next(registrationInfoDTO);
                },
                error: (err) => {
                    observer.error(err);
                }
            });
        });
        return observable;
    }

    checkEmailInUse(email: string) {
        const observable = new Observable<RegistrationInfoDTO>((observer) => {
            if (email.trim().length == 0) {
                observer.complete();
                return;
            }
            if (email.trim().length > 256) {
                observer.error(new Error('Email too long.'));
                return;
            }
            const url = this.baseUrl + '/api/checkemailavailability/' + encodeURIComponent(email) + '/';
            this.http.get(url).subscribe({
                next: (registrationInfoDTO: RegistrationInfoDTO) => {
                    observer.next(registrationInfoDTO);
                },
                error: (err) => {
                    observer.error(err);
                }
            });
        });
        return observable;
    }

    register(userRegistrationDTO: UserRegistrationDTO) {
        const observable = new Observable<UserRegistrationDTO>((observer) => {
            var requestString = JSON.stringify(userRegistrationDTO);
            const url = this.baseUrl + '/api/register/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (userRegistrationDTO: UserRegistrationDTO) => {
                    observer.next(userRegistrationDTO);
                },
                error: (response) => {
                    if (response.error && !response.error.type) {
                        observer.error(response.error);
                    }
                    else {
                        observer.error(response.statusCode);
                    }
                }
            })
        });
        return observable;
    }

    confirmRegistration(userRegistrationDTO: UserRegistrationDTO) {
        const observable = new Observable<LoginDTO>((observer) => {
            var minimal = new UserRegistrationDTO;
            minimal.Name = userRegistrationDTO.Name;
            minimal.Code = userRegistrationDTO.Code;
            var requestString = JSON.stringify(minimal);
            const url = this.baseUrl + '/api/confirmregistration/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (loginDTO: LoginDTO) => {
                    observer.next(loginDTO);
                },
                error: (response) => {
                    if (response.error && !response.error.type) {
                        observer.error(response.error.Message);
                    }
                    else {
                        observer.error(response.statusText);
                    }
                }
            })
        });
        return observable;
    }

    resendRegistrationCode(userRegistrationDTO: UserRegistrationDTO) {
        const observable = new Observable<UserRegistrationDTO>((observer) => {
            var requestString = JSON.stringify(userRegistrationDTO);
            const url = this.baseUrl + '/api/resendregistrationmessage/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (userRegistrationDTO: UserRegistrationDTO) => {
                    observer.next(userRegistrationDTO);
                },
                error: (response) => {
                    if (response.error && !response.error.type) {
                        observer.error(response.error.Message);
                    }
                    else {
                        observer.error(response.statusText);
                    }
                }
            })
        });
        return observable;
    }

    sendPasswordResetCode(loginDTO: LoginDTO) {
        const observable = new Observable<UserRegistrationDTO>((observer) => {
            var requestString = JSON.stringify(loginDTO);
            const url = this.baseUrl + '/api/sendpasswordresetcode/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (userRegistrationDTO: UserRegistrationDTO) => {
                    observer.next(userRegistrationDTO);
                },
                error: (response) => {
                    if (response.error && !response.error.type) {
                        observer.error(response.error.Message);
                    }
                    else {
                        observer.error(response.statusText);
                    }
                }
            })
        });
        return observable;
    }

    resetPassword(loginDTO: LoginDTO) {
        const observable = new Observable<string>((observer) => {
            var requestString = JSON.stringify(loginDTO);
            const url = this.baseUrl + '/api/resetpassword/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (result: string) => {
                    observer.next(result);
                },
                error: (response) => {
                    if (response.error && !response.error.type) {
                        observer.error(response.error.Message);
                    }
                    else {
                        observer.error(response.statusText);
                    }
                }
            })
        });
        return observable;
    }

    changePassword(loginDTO: LoginDTO) {
        const observable = new Observable<String>((observer) => {
            var requestString = JSON.stringify(loginDTO);
            const url = this.baseUrl + '/api/changepassword/';
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: (result) => {
                    observer.next('OK');
                },
                error: (response) => {
                    if(response.status === 401) {
                        observer.error('Password update failed');
                    }
                    else if (response.error && !response.error.type) {
                        observer.error(response.error.Message);
                    }
                    else {
                        observer.error(response.statusText);
                    }
                }
            })
        });
        return observable;
    }

    listContainers() {
        const observable = new Observable<ContainerDTO[]>((observer) => {
            const url = this.baseUrl + '/api/container/';
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            this.http.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: (containers: ContainerDTO[]) => {
                    observer.next(containers);
                },
                error: (er) => {
                    observer.error(er);
                }
            });
        });
        return observable;
    }

    createContainer(containerDTO: ContainerDTO) {
        const observable = new Observable<ContainerDTO>((observer) => {
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            var requestString = JSON.stringify(containerDTO);
            const url = this.baseUrl + '/api/container/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: (containerDTO: ContainerDTO) => {
                    observer.next(containerDTO);
                },
                error: (response) => {
                    observer.error('Unable to create container. Please ensure name is unique and contains valid characters.');
                }
            })
        });
        return observable;
    }

    deleteContainer(containerID: string) {
        const observable = new Observable((observer) => {
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            const url = this.baseUrl + '/api/container/' + encodeURIComponent(containerID);
            this.http.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: () => {
                    observer.next();
                },
                error: (response) => {
                    observer.error('Unable to delete container.');
                }
            })
        });
        return observable;
    }

    getContainerManifest(containerID: string, full: boolean = false, rootPath: string = '/', includeFiles: boolean = false, includeGetUrls: boolean = false, includePutUrls: boolean = false) {
        const observable = new Observable<ManifestDTO>((observer) => {
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            let url = this.baseUrl + '/api/container/manifest/' + containerID + '?';
            if (includeFiles) {
                url += 'includeFiles=true';
            }
            else {
                url += 'includeFiles=false';
            }
            if (full) {
                url += '&full=true';
            }
            if (rootPath) {
                url += '&rootPath=' + encodeURIComponent(rootPath);
            }
            if (includeGetUrls) {
                url += '&includeGetUrls=true';
            }
            if (includePutUrls) {
                url += '&includePutUrls=true';
            }
            this.http.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: (manifest: ManifestDTO) => {
                    observer.next(manifest);
                },
                error: (er) => {
                    observer.error(er);
                }
            });
        });
        return observable;
    }

    getSignedUrl(urlRequest: SignedUrlRequestDTO) {
        const observable = new Observable<SignedUrlRequestDTO>((observer) => {
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            var requestString = JSON.stringify(urlRequest);
            const url = this.baseUrl + '/api/container/getsignedurl';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: (signedUrlRequest: SignedUrlRequestDTO) => {
                    observer.next(signedUrlRequest);
                },
                error: (response) => {
                    observer.error('Unable to retrieve signed URL.');
                }
            })
        });
        return observable;
    }

    createFolder(containerFolderDTO: ContainerFolderDTO) {
        const observable = new Observable<ContainerFolderDTO>((observer) => {
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            var requestString = JSON.stringify(containerFolderDTO);
            const url = this.baseUrl + '/api/container/folder/';
            this.http.post(url, requestString, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: (containerFolderDTO: ContainerFolderDTO) => {
                    observer.next(containerFolderDTO);
                },
                error: (response) => {
                    observer.error('Unable to create folder. Please ensure name is unique and contains valid characters.');
                }
            })
        });
        return observable;
    }

    deleteFolder(containerID: string, path: string) {
        const observable = new Observable<ContainerFolderDTO>((observer) => {
            if (!this.login || !this.login.Token) {
                observer.error(new Error('Not logged in.'));
                return;
            }
            const url = this.baseUrl + '/api/container/folder/?ContainerID=' + encodeURIComponent(containerID) + '&path=' + encodeURIComponent(path);
            this.http.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.login.Token
                }
            }).subscribe({
                next: () => {
                    observer.next();
                },
                error: (response) => {
                    observer.error('Unable to delete folder.');
                }
            })
        });
        return observable;
    }
}
