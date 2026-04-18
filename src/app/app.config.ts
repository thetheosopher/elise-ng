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
import { SurfaceExamplesComponent } from './components/surface-examples/surface-examples.component';
import { SurfaceExampleHarnessComponent } from './components/surface-example-harness/surface-example-harness.component';
import { SchematrixApiTestsComponent } from './components/schematrix-api-tests/schematrix-api-tests.component';
import { SendPasswordResetCodeComponent } from './components/send-password-reset-code/send-password-reset-code.component';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authInterceptor } from './interceptors/auth.interceptor';
import { DocsComponent } from './components/docs/docs.component';

// Getting Started pages
import { IntroductionPageComponent } from './components/docs/pages/getting-started/introduction-page.component';
import { QuickStartPageComponent } from './components/docs/pages/getting-started/quick-start-page.component';
import { CoreConceptsPageComponent } from './components/docs/pages/getting-started/core-concepts-page.component';
import { ArchitecturePageComponent } from './components/docs/pages/getting-started/architecture-page.component';
import { CoordinateSystemPageComponent } from './components/docs/pages/getting-started/coordinate-system-page.component';
import { ModelFormatPageComponent } from './components/docs/pages/getting-started/model-format-page.component';

// Element pages
import { ElementOverviewPageComponent } from './components/docs/pages/elements/element-overview-page.component';
import { RectanglePageComponent } from './components/docs/pages/elements/rectangle-page.component';
import { EllipsePageComponent } from './components/docs/pages/elements/ellipse-page.component';
import { LinePageComponent } from './components/docs/pages/elements/line-page.component';
import { PolylinePageComponent } from './components/docs/pages/elements/polyline-page.component';
import { PolygonPageComponent } from './components/docs/pages/elements/polygon-page.component';
import { PathPageComponent } from './components/docs/pages/elements/path-page.component';
import { ArcPageComponent } from './components/docs/pages/elements/arc-page.component';
import { ArrowPageComponent } from './components/docs/pages/elements/arrow-page.component';
import { WedgePageComponent } from './components/docs/pages/elements/wedge-page.component';
import { RingPageComponent } from './components/docs/pages/elements/ring-page.component';
import { RegularPolygonPageComponent } from './components/docs/pages/elements/regular-polygon-page.component';
import { TextPageComponent } from './components/docs/pages/elements/text-page.component';
import { RichTextPageComponent } from './components/docs/pages/elements/rich-text-page.component';
import { TextPathPageComponent } from './components/docs/pages/elements/text-path-page.component';
import { ImagePageComponent } from './components/docs/pages/elements/image-page.component';
import { ModelElementPageComponent } from './components/docs/pages/elements/model-element-page.component';
import { SpritePageComponent } from './components/docs/pages/elements/sprite-page.component';

// Styling pages
import { StylingOverviewPageComponent } from './components/docs/pages/styling/styling-overview-page.component';
import { ColorFillsPageComponent } from './components/docs/pages/styling/color-fills-page.component';
import { LinearGradientsPageComponent } from './components/docs/pages/styling/linear-gradients-page.component';
import { RadialGradientsPageComponent } from './components/docs/pages/styling/radial-gradients-page.component';
import { ImageFillsPageComponent } from './components/docs/pages/styling/image-fills-page.component';
import { ModelFillsPageComponent } from './components/docs/pages/styling/model-fills-page.component';
import { StrokesPageComponent } from './components/docs/pages/styling/strokes-page.component';
import { OpacityPageComponent } from './components/docs/pages/styling/opacity-page.component';
import { ShadowsPageComponent } from './components/docs/pages/styling/shadows-page.component';
import { BlendModesPageComponent } from './components/docs/pages/styling/blend-modes-page.component';
import { FiltersPageComponent } from './components/docs/pages/styling/filters-page.component';
import { ClipPathsPageComponent } from './components/docs/pages/styling/clip-paths-page.component';
import { TransformsPageComponent } from './components/docs/pages/styling/transforms-page.component';

// Animation pages
import { AnimationOverviewPageComponent } from './components/docs/pages/animation/animation-overview-page.component';
import { PropertyTweensPageComponent } from './components/docs/pages/animation/property-tweens-page.component';
import { EasingCurvesPageComponent } from './components/docs/pages/animation/easing-curves-page.component';
import { TimerCallbacksPageComponent } from './components/docs/pages/animation/timer-callbacks-page.component';
import { SpriteAnimationPageComponent } from './components/docs/pages/animation/sprite-animation-page.component';
import { FrameTransitionsPageComponent } from './components/docs/pages/animation/frame-transitions-page.component';

// Resources pages
import { ResourceOverviewPageComponent } from './components/docs/pages/resources/resource-overview-page.component';
import { BitmapResourcesPageComponent } from './components/docs/pages/resources/bitmap-resources-page.component';
import { ModelResourcesPageComponent } from './components/docs/pages/resources/model-resources-page.component';
import { TextResourcesPageComponent } from './components/docs/pages/resources/text-resources-page.component';
import { ResourceManagerPageComponent } from './components/docs/pages/resources/resource-manager-page.component';

// Rendering pages
import { RenderingOverviewPageComponent } from './components/docs/pages/rendering/rendering-overview-page.component';
import { CanvasRenderingPageComponent } from './components/docs/pages/rendering/canvas-rendering-page.component';
import { SvgRenderingPageComponent } from './components/docs/pages/rendering/svg-rendering-page.component';
import { ModelSerializationPageComponent } from './components/docs/pages/rendering/model-serialization-page.component';

// Design Surface pages
import { DesignOverviewPageComponent } from './components/docs/pages/design-surface/design-overview-page.component';
import { DesignControllerPageComponent } from './components/docs/pages/design-surface/design-controller-page.component';
import { DesignToolsPageComponent } from './components/docs/pages/design-surface/design-tools-page.component';
import { SelectionPageComponent } from './components/docs/pages/design-surface/selection-page.component';
import { UndoRedoPageComponent } from './components/docs/pages/design-surface/undo-redo-page.component';
import { GridSnappingPageComponent } from './components/docs/pages/design-surface/grid-snapping-page.component';
import { ClipboardPageComponent } from './components/docs/pages/design-surface/clipboard-page.component';
import { TextEditingPageComponent } from './components/docs/pages/design-surface/text-editing-page.component';
import { PointEditingPageComponent } from './components/docs/pages/design-surface/point-editing-page.component';
import { ComponentsPageComponent } from './components/docs/pages/design-surface/components-page.component';

// Surface Framework pages
import { SurfaceOverviewPageComponent } from './components/docs/pages/surface/surface-overview-page.component';
import { SurfaceElementsPageComponent } from './components/docs/pages/surface/surface-elements-page.component';
import { SurfaceImageLayerPageComponent } from './components/docs/pages/surface/surface-image-layer-page.component';
import { SurfaceHtmlLayerPageComponent } from './components/docs/pages/surface/surface-html-layer-page.component';
import { SurfaceVideoLayerPageComponent } from './components/docs/pages/surface/surface-video-layer-page.component';
import { SurfaceAnimationLayerPageComponent } from './components/docs/pages/surface/surface-animation-layer-page.component';
import { SurfaceTextElementPageComponent } from './components/docs/pages/surface/surface-text-element-page.component';
import { SurfaceButtonElementPageComponent } from './components/docs/pages/surface/surface-button-element-page.component';
import { SurfaceRadioStripPageComponent } from './components/docs/pages/surface/surface-radio-strip-page.component';
import { SurfaceHiddenLayerPageComponent } from './components/docs/pages/surface/surface-hidden-layer-page.component';
import { SurfaceTransitionsPageComponent } from './components/docs/pages/surface/surface-transitions-page.component';
import { SurfaceCommandsPageComponent } from './components/docs/pages/surface/surface-commands-page.component';

// Import/Export pages
import { SvgImportPageComponent } from './components/docs/pages/import-export/svg-import-page.component';
import { SvgExportPageComponent } from './components/docs/pages/import-export/svg-export-page.component';
import { WmfImportPageComponent } from './components/docs/pages/import-export/wmf-import-page.component';

// Sketcher pages
import { SketcherOverviewPageComponent } from './components/docs/pages/sketcher/sketcher-overview-page.component';

// Tools pages
import { ModelDesignerGuidePageComponent } from './components/docs/pages/tools/model-designer-guide-page.component';
import { ContainerExplorerGuidePageComponent } from './components/docs/pages/tools/container-explorer-guide-page.component';
import { ModelPlaygroundGuidePageComponent } from './components/docs/pages/tools/model-playground-guide-page.component';

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
    { path: 'examples/surface', component: SurfaceExamplesComponent },
    { path: 'examples/surface/:id', component: SurfaceExampleHarnessComponent },
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
    { path: 'tests/model-playground', component: ModelPlaygroundComponent },
    {
        path: 'docs',
        component: DocsComponent,
        children: [
            { path: '', redirectTo: 'getting-started/introduction', pathMatch: 'full' },
            // Getting Started
            { path: 'getting-started/introduction', component: IntroductionPageComponent },
            { path: 'getting-started/quick-start', component: QuickStartPageComponent },
            { path: 'getting-started/core-concepts', component: CoreConceptsPageComponent },
            { path: 'getting-started/architecture', component: ArchitecturePageComponent },
            { path: 'getting-started/coordinate-system', component: CoordinateSystemPageComponent },
            { path: 'getting-started/model-format', component: ModelFormatPageComponent },
            // Elements
            { path: 'elements/element-overview', component: ElementOverviewPageComponent },
            { path: 'elements/rectangle', component: RectanglePageComponent },
            { path: 'elements/ellipse', component: EllipsePageComponent },
            { path: 'elements/line', component: LinePageComponent },
            { path: 'elements/polyline', component: PolylinePageComponent },
            { path: 'elements/polygon', component: PolygonPageComponent },
            { path: 'elements/path', component: PathPageComponent },
            { path: 'elements/arc', component: ArcPageComponent },
            { path: 'elements/arrow', component: ArrowPageComponent },
            { path: 'elements/wedge', component: WedgePageComponent },
            { path: 'elements/ring', component: RingPageComponent },
            { path: 'elements/regular-polygon', component: RegularPolygonPageComponent },
            { path: 'elements/text', component: TextPageComponent },
            { path: 'elements/rich-text', component: RichTextPageComponent },
            { path: 'elements/text-path', component: TextPathPageComponent },
            { path: 'elements/image', component: ImagePageComponent },
            { path: 'elements/model-element', component: ModelElementPageComponent },
            { path: 'elements/sprite', component: SpritePageComponent },
            // Styling
            { path: 'styling/styling-overview', component: StylingOverviewPageComponent },
            { path: 'styling/color-fills', component: ColorFillsPageComponent },
            { path: 'styling/linear-gradients', component: LinearGradientsPageComponent },
            { path: 'styling/radial-gradients', component: RadialGradientsPageComponent },
            { path: 'styling/image-fills', component: ImageFillsPageComponent },
            { path: 'styling/model-fills', component: ModelFillsPageComponent },
            { path: 'styling/strokes', component: StrokesPageComponent },
            { path: 'styling/opacity', component: OpacityPageComponent },
            { path: 'styling/shadows', component: ShadowsPageComponent },
            { path: 'styling/blend-modes', component: BlendModesPageComponent },
            { path: 'styling/filters', component: FiltersPageComponent },
            { path: 'styling/clip-paths', component: ClipPathsPageComponent },
            { path: 'styling/transforms', component: TransformsPageComponent },
            // Animation
            { path: 'animation/animation-overview', component: AnimationOverviewPageComponent },
            { path: 'animation/property-tweens', component: PropertyTweensPageComponent },
            { path: 'animation/easing-curves', component: EasingCurvesPageComponent },
            { path: 'animation/timer-callbacks', component: TimerCallbacksPageComponent },
            { path: 'animation/sprite-animation', component: SpriteAnimationPageComponent },
            { path: 'animation/frame-transitions', component: FrameTransitionsPageComponent },
            // Resources
            { path: 'resources/resource-overview', component: ResourceOverviewPageComponent },
            { path: 'resources/bitmap-resources', component: BitmapResourcesPageComponent },
            { path: 'resources/model-resources', component: ModelResourcesPageComponent },
            { path: 'resources/text-resources', component: TextResourcesPageComponent },
            { path: 'resources/resource-manager', component: ResourceManagerPageComponent },
            // Rendering
            { path: 'rendering/rendering-overview', component: RenderingOverviewPageComponent },
            { path: 'rendering/canvas-rendering', component: CanvasRenderingPageComponent },
            { path: 'rendering/svg-rendering', component: SvgRenderingPageComponent },
            { path: 'rendering/model-serialization', component: ModelSerializationPageComponent },
            // Design Surface
            { path: 'design-surface/design-overview', component: DesignOverviewPageComponent },
            { path: 'design-surface/design-controller', component: DesignControllerPageComponent },
            { path: 'design-surface/design-tools', component: DesignToolsPageComponent },
            { path: 'design-surface/selection', component: SelectionPageComponent },
            { path: 'design-surface/undo-redo', component: UndoRedoPageComponent },
            { path: 'design-surface/grid-snapping', component: GridSnappingPageComponent },
            { path: 'design-surface/clipboard', component: ClipboardPageComponent },
            { path: 'design-surface/text-editing', component: TextEditingPageComponent },
            { path: 'design-surface/point-editing', component: PointEditingPageComponent },
            { path: 'design-surface/components', component: ComponentsPageComponent },
            // Surface Framework
            { path: 'surface/surface-overview', component: SurfaceOverviewPageComponent },
            { path: 'surface/surface-elements', component: SurfaceElementsPageComponent },
            { path: 'surface/surface-image-layer', component: SurfaceImageLayerPageComponent },
            { path: 'surface/surface-html-layer', component: SurfaceHtmlLayerPageComponent },
            { path: 'surface/surface-video-layer', component: SurfaceVideoLayerPageComponent },
            { path: 'surface/surface-animation-layer', component: SurfaceAnimationLayerPageComponent },
            { path: 'surface/surface-text-element', component: SurfaceTextElementPageComponent },
            { path: 'surface/surface-button-element', component: SurfaceButtonElementPageComponent },
            { path: 'surface/surface-radio-strip', component: SurfaceRadioStripPageComponent },
            { path: 'surface/surface-hidden-layer', component: SurfaceHiddenLayerPageComponent },
            { path: 'surface/surface-transitions', component: SurfaceTransitionsPageComponent },
            { path: 'surface/surface-commands', component: SurfaceCommandsPageComponent },
            // Import/Export
            { path: 'import-export/svg-import', component: SvgImportPageComponent },
            { path: 'import-export/svg-export', component: SvgExportPageComponent },
            { path: 'import-export/wmf-import', component: WmfImportPageComponent },
            // Sketcher
            { path: 'sketcher/sketcher-overview', component: SketcherOverviewPageComponent },
            // Tools & Guides
            { path: 'tools/model-designer-guide', component: ModelDesignerGuidePageComponent },
            { path: 'tools/container-explorer-guide', component: ContainerExplorerGuidePageComponent },
            { path: 'tools/model-playground-guide', component: ModelPlaygroundGuidePageComponent }
        ]
    },
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
