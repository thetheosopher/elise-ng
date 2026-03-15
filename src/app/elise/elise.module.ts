import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EliseViewComponent } from './view/elise-view.component';
import { EliseDesignComponent } from './design/elise-design.component';
import { EliseSurfaceComponent } from './surface/elise-surface.component';

@NgModule({
    imports: [ CommonModule, EliseViewComponent, EliseDesignComponent, EliseSurfaceComponent ],
    exports: [ EliseViewComponent, EliseDesignComponent, EliseSurfaceComponent ]
})
export class EliseModule {}
