import { Point } from './core/point';
import { Size } from './core/size';
import { FillInfo } from './fill/fill-info';
import { ControllerEvent } from './controller/controller-event';
import { ElementCommand } from './command/element-command';
import { CommandEventTrigger } from './command/command-event-trigger';
import { ElementCommandHandler } from './command/element-command-handler';
import { StrokeInfo } from './core/stroke-info';
import { Region } from './core/region';
import { Matrix2D } from './core/matrix-2d';
import { Color } from './core/color';
import { Model } from './core/model';
import { ResourceState } from './resource/resource';
import { BitmapResource } from './resource/bitmap-resource';
import { TextResource } from './resource/text-resource';
import { ModelResource } from './resource/model-resource';
import { SpriteFrame } from './elements/sprite-frame';
import { SpriteState } from './elements/sprite-state';
import { SpriteElement } from './elements/sprite-element';
import { LineElement } from './elements/line-element';
import { ImageElement } from './elements/image-element';
import { EllipseElement } from './elements/ellipse-element';
import { RectangleElement } from './elements/rectangle-element';
import { PolylineElement } from './elements/polyline-element';
import { PolygonElement } from './elements/polygon-element';
import { PathElement } from './elements/path-element';
import { TextElement } from './elements/text-element';
import { ModelElement } from './elements/model-element';
import { WindingMode } from './core/winding-mode';
import { LinearGradientFill } from './fill/linear-gradient-fill';
import { RadialGradientFill } from './fill/radial-gradient-fill';
import { GradientFillStop } from './fill/gradient-fill-stop';
import { Utility } from './core/utility';
import { FillFactory } from './fill/fill-factory';
import { TransitionRenderer } from './transitions/transitions';
import { Sketcher } from './sketcher/sketcher';

export default {
    Point: Point,
    Size: Size,
    FillInfo: FillInfo,
    FillFactory: FillFactory,
    ControllerEvent: ControllerEvent,
    ElementCommand: ElementCommand,
    CommandEventTrigger: CommandEventTrigger,
    ElementCommandHandler: ElementCommandHandler,
    StrokeInfo: StrokeInfo,
    Region: Region,
    Matrix2D: Matrix2D,
    Color: Color,
    ResourceState: ResourceState,
    BitmapResource: BitmapResource,
    TextResource: TextResource,
    ModelResource: ModelResource,
    SpriteFrame: SpriteFrame,
    SpriteState: SpriteState,
    Sprite: SpriteElement,
    Line: LineElement,
    Image: ImageElement,
    Ellipse: EllipseElement,
    Rectangle: RectangleElement,
    Polyline: PolylineElement,
    Polygon: PolygonElement,
    PathElement: PathElement,
    TextElement: TextElement,
    ModelElement: ModelElement,
    WindingMode: WindingMode,
    LinearGradientFill: LinearGradientFill,
    RadialGradientFill: RadialGradientFill,
    GradientFillStop: GradientFillStop,
    TransitionRenderer: TransitionRenderer,
    Sketcher: Sketcher,
    Model: Model,
    newId: Utility.guid,
    point: Point.create,
    size: Size.create,
    color: Color.create,
    region: Region.create,
    matrix2D: Matrix2D.create,
    model: Model.create,
    line: LineElement.create,
    rectangle: RectangleElement.create,
    sprite: SpriteElement.create,
    spriteFrame: SpriteFrame.create,
    image: ImageElement.create,
    ellipse: EllipseElement.create,
    polyline: PolylineElement.create,
    polygon: PolygonElement.create,
    path: PathElement.create,
    text: TextElement.create,
    innerModel: ModelElement.create,
    linearGradientFill: LinearGradientFill.create,
    radialGradientFill: RadialGradientFill.create,
    gradientFillStop: GradientFillStop.create,
    bitmapResource: BitmapResource.create,
    embeddedTextResource: TextResource.createFromText,
    uriTextResource: TextResource.createFromUri,
    modelResource: ModelResource.create,
    sketcher: Sketcher.create,
    log: function(output: string) {
        console.log(output);
    },
    requestAnimationFrame: false
};
