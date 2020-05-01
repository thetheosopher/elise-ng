import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { EliseModule } from './elise/elise.module';
import { SchematrixModule } from './schematrix/schematrix.module';
import { TreeModule } from 'angular-tree-component';
import { AngularSplitModule } from 'angular-split';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { RedGreenBlueComponent } from './components/redgreenblue/redgreenblue.component';
import { PrimitiveComponent } from './components/primitive/primitive.component';
import { SketchComponent } from './components/sketch/sketch.component';
import { SampleComponent } from './components/sample/sample.component';
import { PrimitivesComponent } from './components/primitives/primitives.component';
import { SamplesComponent } from './components/samples/samples.component';
import { SketchesComponent } from './components/sketches/sketches.component';
import { SketchUrlComponent } from './components/sketch-url/sketch-url.component';
import { RandomSketchesComponent } from './components/random-sketches/random-sketches.component';
import { EliseViewHarnessComponent } from './components/elise-view-harness/elise-view-harness.component';
import { ViewTestsComponent } from './components/view-tests/view-tests.component';
import { EliseDesignHarnessComponent } from './components/elise-design-harness/elise-design-harness.component';
import { DesignTestsComponent } from './components/design-tests/design-tests.component';
import { SurfaceTestsComponent } from './components/surface-tests/surface-tests.component';
import { EliseSurfaceHarnessComponent } from './components/elise-surface-harness/elise-surface-harness.component';
import { SchematrixApiTestsComponent } from './components/schematrix-api-tests/schematrix-api-tests.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { ResendRegistrationCodeComponent } from './components/resend-registration-code/resend-registration-code.component';
import { SendPasswordResetCodeComponent } from './components/send-password-reset-code/send-password-reset-code.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContainerSelectorComponent } from './components/container-selector/container-selector.component';
import { ContainerTreeComponent } from './components/container-tree/container-tree.component';
import { ContainerExplorerComponent } from './components/container-explorer/container-explorer.component';
import { ProgressComponent } from './components/progress/progress.component';
import { DndDirective } from './directives/dnd.directive';
import { AlertComponent } from './components/alert/alert.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ModelDesignerComponent } from './components/model-designer/model-designer.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';
import { NewFolderModalComponent } from './components/new-folder-modal/new-folder-modal.component';
import { DeleteFolderModalComponent, DeleteFolderModalInfo } from './components/delete-folder-modal/delete-folder-modal.component';
import { DeleteFileModalComponent } from './components/delete-file-modal/delete-file-modal.component';
import { NewContainerModalComponent } from './components/new-container-modal/new-container-modal.component';
import { DeleteContainerModalComponent } from './components/delete-container-modal/delete-container-modal.component';
import { ImageActionModalComponent } from './components/image-action-modal/image-action-modal.component';
import { NewModelModalComponent } from './components/new-model-modal/new-model-modal.component';
import { ModelActionModalComponent } from './components/model-action-modal/model-action-modal.component';
import { StrokeModalComponent } from './components/stroke-modal/stroke-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        RedGreenBlueComponent,
        PrimitiveComponent,
        SketchComponent,
        SampleComponent,
        PrimitivesComponent,
        SamplesComponent,
        SketchesComponent,
        SketchUrlComponent,
        RandomSketchesComponent,
        EliseViewHarnessComponent,
        ViewTestsComponent,
        EliseDesignHarnessComponent,
        DesignTestsComponent,
        SurfaceTestsComponent,
        EliseSurfaceHarnessComponent,
        SchematrixApiTestsComponent,
        LoginComponent,
        RegisterComponent,
        HeaderComponent,
        ConfirmRegistrationComponent,
        ResendRegistrationCodeComponent,
        SendPasswordResetCodeComponent,
        FooterComponent,
        ContainerSelectorComponent,
        ContainerTreeComponent,
        ContainerExplorerComponent,
        ProgressComponent,
        DndDirective,
        AlertComponent,
        ChangePasswordComponent,
        ModelDesignerComponent,
        FileListComponent,
        UploadListComponent,
        ColorSelectorComponent,
        NewFolderModalComponent,
        DeleteFolderModalComponent,
        DeleteFileModalComponent,
        NewContainerModalComponent,
        DeleteContainerModalComponent,
        ImageActionModalComponent,
        NewModelModalComponent,
        ModelActionModalComponent,
        StrokeModalComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        EliseModule,
        SchematrixModule,
        NgbModule,
        TreeModule.forRoot(),
        AngularSplitModule.forRoot(),
        ToastrModule.forRoot()
    ],
    bootstrap: [ AppComponent ],
    entryComponents: [
        DeleteFolderModalComponent,
        NewFolderModalComponent,
        DeleteFileModalComponent,
        NewContainerModalComponent,
    ]
})
export class AppModule {}
