import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../schematrix/services/api.service';

export const authGuard: CanActivateFn = (_route, state) => {
    const apiService = inject(ApiService);
    const router = inject(Router);

    if (apiService.isLoggedIn) {
        return true;
    }

    if (apiService.localStorageAvailable) {
        try {
            const loginString = localStorage.getItem('login');
            if (loginString) {
                return true;
            }
        }
        catch {
            // Fall through to redirect.
        }
    }

    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
    });
};
