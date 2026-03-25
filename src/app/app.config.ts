import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { ContainerExplorerComponent } from './components/container-explorer/container-explorer.component';
import { DesignTestsComponent } from './components/design-tests/design-tests.component';
import { EliseDesignHarnessComponent } from './components/elise-design-harness/elise-design-harness.component';
import { EliseViewHarnessComponent } from './components/elise-view-harness/elise-view-harness.component';
import { EliseSurfaceHarnessComponent } from './components/elise-surface-harness/elise-surface-harness.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ModelDesignerComponent } from './components/model-designer/model-designer.component';
import { ModelPlaygroundComponent } from './components/model-playground/model-playground.component';
import { PrimitivesComponent } from './components/primitives/primitives.component';
import { PrimitiveComponent } from './components/primitive/primitive.component';
import { RandomSketchesComponent } from './components/random-sketches/random-sketches.component';
import { RedGreenBlueComponent } from './components/redgreenblue/redgreenblue.component';
import { ResendRegistrationCodeComponent } from './components/resend-registration-code/resend-registration-code.component';
import { RegisterComponent } from './components/register/register.component';
import { AnimationComponent } from './components/animation/animation.component';
import { AnimationsComponent } from './components/animations/animations.component';
import { SketchComponent } from './components/sketch/sketch.component';
import { SketchesComponent } from './components/sketches/sketches.component';
import { ViewTestsComponent } from './components/view-tests/view-tests.component';
import { SurfaceTestsComponent } from './components/surface-tests/surface-tests.component';
import { SchematrixApiTestsComponent } from './components/schematrix-api-tests/schematrix-api-tests.component';
import { SendPasswordResetCodeComponent } from './components/send-password-reset-code/send-password-reset-code.component';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'primitives', component: PrimitivesComponent },
    { path: 'primitives/:id', component: PrimitiveComponent },
    { path: 'animations', component: AnimationsComponent },
    { path: 'animations/:id', component: AnimationComponent },
    { path: 'sketches', component: SketchesComponent },
    { path: 'sketches/:id', component: SketchComponent },
    { path: 'tests/design', component: DesignTestsComponent },
    { path: 'tests/design/:id', component: EliseDesignHarnessComponent },
    { path: 'tests/view', component: ViewTestsComponent },
    { path: 'tests/view/:id', component: EliseViewHarnessComponent },
    { path: 'tests/surface', component: SurfaceTestsComponent },
    { path: 'tests/surface/:id', component: EliseSurfaceHarnessComponent },
    { path: 'redgreenblue', component: RedGreenBlueComponent },
    { path: 'random-sketches', component: RandomSketchesComponent },
    { path: 'api-tests', component: SchematrixApiTestsComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'confirm-registration', component: ConfirmRegistrationComponent },
    { path: 'resend-registration-code', component: ResendRegistrationCodeComponent },
    { path: 'send-password-reset-code', component: SendPasswordResetCodeComponent },
    { path: 'tests/container-explorer', component: ContainerExplorerComponent, canActivate: [authGuard] },
    { path: 'tests/model-designer', component: ModelDesignerComponent, canActivate: [authGuard] },
    { path: 'tests/model-playground', component: ModelPlaygroundComponent, canActivate: [authGuard] },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }
];

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withHashLocation()),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        provideToastr()
    ]
};
