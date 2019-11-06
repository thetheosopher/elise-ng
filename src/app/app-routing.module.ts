import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignTestsComponent } from './components/design-tests/design-tests.component';
import { EliseDesignHarnessComponent } from './components/elise-design-harness/elise-design-harness.component';
import { EliseViewHarnessComponent } from './components/elise-view-harness/elise-view-harness.component';
import { EliseSurfaceHarnessComponent } from './components/elise-surface-harness/elise-surface-harness.component';
import { PrimitivesComponent } from './components/primitives/primitives.component';
import { PrimitiveComponent } from './components/primitive/primitive.component';
import { RandomSketchesComponent } from './components/random-sketches/random-sketches.component';
import { RedGreenBlueComponent } from './components/redgreenblue/redgreenblue.component';
import { SampleComponent } from './components/sample/sample.component';
import { SamplesComponent } from './components/samples/samples.component';
import { SketchComponent } from './components/sketch/sketch.component';
import { SketchesComponent } from './components/sketches/sketches.component';
import { ViewTestsComponent } from './components/view-tests/view-tests.component';
import { SurfaceTestsComponent } from './components/surface-tests/surface-tests.component';

const routes: Routes = [
    { path: '', redirectTo: '/primitives', pathMatch: 'full' },
    { path: 'primitives', component: PrimitivesComponent },
    { path: 'primitives/:id', component: PrimitiveComponent },
    { path: 'samples', component: SamplesComponent },
    { path: 'samples/:id', component: SampleComponent },
    { path: 'sketches', component: SketchesComponent },
    { path: 'sketches/:id', component: SketchComponent },
    { path: 'tests/design', component: DesignTestsComponent },
    { path: 'tests/design/:id', component: EliseDesignHarnessComponent },
    { path: 'tests/view', component: ViewTestsComponent },
    { path: 'tests/view/:id', component: EliseViewHarnessComponent },
    { path: 'tests/surface', component: SurfaceTestsComponent },
    { path: 'tests/surface/:id', component: EliseSurfaceHarnessComponent },
    { path: 'redgreenblue', component: RedGreenBlueComponent },
    { path: 'random-sketches', component: RandomSketchesComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
