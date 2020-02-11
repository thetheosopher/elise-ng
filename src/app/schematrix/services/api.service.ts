import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContainerDTO } from '../classes/container-dto';
import { LoginDTO } from '../classes/login-dto';
import { RegistrationInfoDTO } from '../classes/registration-info-dto';
import { UserRegistrationDTO } from '../classes/user-registration-dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    baseUrl: string;
    localStorageAvailable: boolean;
    login: LoginDTO;
    isLoggedIn: boolean = false;

    @Output() loginEvent = new EventEmitter<LoginDTO>();
    @Output() logoutEvent = new EventEmitter();
    @Output() errorEvent = new EventEmitter<string>();

    constructor(private http: HttpClient) {
        this.localStorageAvailable = this.storageAvailable();
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
            },
            error: (response) => {
                if (response.error) {
                    this.onError(response.error.Message);
                }
                else {
                    this.onError(response.statusText);
                }
                // this.onLogout();
            }
        })
    }

    logout() {
        this.login = null;
        if (this.localStorageAvailable) {
            localStorage.removeItem('login');
        }
        this.onLogout();
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
        this.http.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.login.Token,
                'Access-Control-Expose-Headers': '*'
            }
        }).subscribe({
            next: (loginDTO: LoginDTO) => {
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
                this.loginEvent.emit(this.login);
            },
            error: (er) => {
                this.errorEvent.emit('Token expired. Please login.')
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
                error: (er) => {
                    observer.error(er);
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
                error: (er) => {
                    observer.error(er);
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
                    if (response.error) {
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
                    if (response.error) {
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
                    if (response.error) {
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
                    if (response.error) {
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
                    if (response.error) {
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
                    'Authorization': 'Bearer ' + this.login.Token,
                    'Access-Control-Expose-Headers': '*'
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
                    'Authorization': 'Bearer ' + this.login.Token,
                    'Access-Control-Expose-Headers': '*'
                }
            }).subscribe({
                next: (containerDTO: ContainerDTO) => {
                    observer.next(containerDTO);
                },
                error: (response) => {
                    observer.error('Unable to create container. Please ensure name is unique and contains valid characters.');
                    if (response.error) {
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
}
