import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Surface } from 'elise-graphics/lib/surface/surface';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { SurfaceViewController } from 'elise-graphics/lib/surface/surface-view-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { TimerParameters } from 'elise-graphics/lib/core/timer-parameters';

import { EliseSurfaceComponent } from '../../elise/surface/elise-surface.component';
import { SurfaceTestService } from '../../services/surface-test.service';
import { ISurfaceViewer } from '../../interfaces/surface-viewer';

@Component({
  selector: 'app-elise-surface-harness',
  templateUrl: './elise-surface-harness.component.html',
  styleUrls: ['./elise-surface-harness.component.scss']
})
export class EliseSurfaceHarnessComponent implements OnInit, ISurfaceViewer {

    @ViewChild('elise', { read: ElementRef, static: true })
    eliseViewElementRef: ElementRef;

    _surface: Surface;
    _title: string;
    _description: string;
    _transition = 'fade';
    _transitionDisplay = false;

    eliseSurface: EliseSurfaceComponent;
    controller: SurfaceViewController;
    lastMessage = '-';

    scale = 1;
    opacity = 1;
    background = 'gray';
    viewTime = 0;
    viewMouseX: number;
    viewMouseY: number;
    timerEnabled = false;
    mouseOverView = false;
    displayModel = true;
    errorMessage: string;

    constructor(private _surfaceTestService: SurfaceTestService, private _route: ActivatedRoute) {
        this._title = 'Elise Surface Component Test Harness';
        this._description = 'Tests Elise surface component public interface';
        this._surface = Surface.create(320, 320, '', 1.0);
    }

    @Input()
    set transitionDisplay(transitionDisplay: boolean) {
        this._transitionDisplay = transitionDisplay;
    }

    get transitionDisplay() {
        return this._transitionDisplay;
    }

    @Input()
    set transition(transition: string) {
        this._transition = transition;
        const id = this._route.snapshot.paramMap.get('id');
        this._surfaceTestService.configure(this, id);
        this.log(transition);
    }

    get transition() {
        return this._transition;
    }

    @Input()
    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    @Input()
    set description(description: string) {
        this._description = description;
    }

    get description(): string {
        return this._description;
    }

    @Input()
    set surface(surface: Surface) {
        if (surface !== this._surface) {
            const self = this;
            self._surface = surface;
        }
    }

    get surface(): Surface {
        return this._surface;
    }

    ngOnInit() {
        this.eliseSurface = this.eliseViewElementRef.nativeElement;
        const id = this._route.snapshot.paramMap.get('id');
        if (id) {
            this._surfaceTestService.configure(this, id);
        }
    }

    backgroundClass() {
        return {
            'view-host': true,
            grid: this.background === 'grid',
            black: this.background === 'black',
            white: this.background === 'white',
            gray: this.background === 'gray'
        };
    }

    timerTick(e: TimerParameters) {
        this.viewTime = e.elapsedTime;
    }

    mouseEnteredView(e: PointEventParameters) {
        this.mouseOverView = true;
        this.log(`Mouse Entered Surface`);
    }

    mouseLeftView(e: PointEventParameters) {
        this.mouseOverView = false;
        this.log(`Mouse Left Surface`);
    }

    mouseMovedView(e: PointEventParameters) {
        this.viewMouseX = Math.round(e.point.x);
        this.viewMouseY = Math.round(e.point.y);
    }

    mouseDownView(e: PointEventParameters) {
        // this.log(`Mouse Down View: ${e.point.x}:${e.point.y}`);
    }

    mouseUpView(e: PointEventParameters) {
        // this.log(`Mouse Up View: ${e.point.x}:${e.point.y}`);
    }

    mouseEnteredElement(e: ElementBase) {
        // this.log(`Mouse entered element: ${e.describe()}`);
    }

    mouseLeftElement(e: ElementBase) {
        // this.log(`Mouse left element: ${e.describe()}`);
    }

    mouseDownElement(e: ElementBase) {
        // this.log(`Mouse down element: ${e.describe()}`);
    }

    mouseUpElement(e: ElementBase) {
        // this.log(`Mouse up element: ${e.describe()}`);
    }

    elementClicked(e: ElementBase) {
        // this.log(`Element clicked: ${e.describe()}`);
    }

    controllerSet(controller: SurfaceViewController) {
        this.controller = controller;
    }

    log(message: string) {
        this.lastMessage = message;
    }
}
