import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Surface } from 'elise-graphics/lib/surface/surface';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { SurfaceViewController } from 'elise-graphics/lib/surface/surface-view-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { TimerParameters } from 'elise-graphics/lib/core/timer-parameters';

import { EliseSurfaceComponent } from '../../elise/surface/elise-surface.component';
import { SurfaceExampleService } from '../../services/surface-example.service';
import { ISurfaceViewer } from '../../interfaces/surface-viewer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    imports: [CommonModule, FormsModule, RouterModule, EliseSurfaceComponent],
    selector: 'app-surface-example-harness',
    templateUrl: './surface-example-harness.component.html',
    styleUrls: ['./surface-example-harness.component.scss']
})
export class SurfaceExampleHarnessComponent implements OnInit, ISurfaceViewer {

    @ViewChild('elise', { read: ElementRef, static: true })
    eliseViewElementRef!: ElementRef;

    _surface: Surface;
    _title: string;
    _description: string;
    _transition = 'fade';
    _transitionDisplay = false;

    eliseSurface!: EliseSurfaceComponent;
    controller!: SurfaceViewController;
    lastMessage = '-';

    scale = 1;
    opacity = 1;
    background = 'black';
    viewMouseX = 0;
    viewMouseY = 0;
    mouseOverView = false;

    constructor(
        private surfaceExampleService: SurfaceExampleService,
        private route: ActivatedRoute,
        private toasterService: ToastrService) {
        this._title = 'Surface Example';
        this._description = '';
        this._surface = Surface.create(640, 480, '', 1.0);
    }

    set transitionDisplay(transitionDisplay: boolean) {
        this._transitionDisplay = transitionDisplay;
    }

    get transitionDisplay() {
        return this._transitionDisplay;
    }

    set transition(transition: string) {
        this._transition = transition;
    }

    get transition() {
        return this._transition;
    }

    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    set description(description: string) {
        this._description = description;
    }

    get description(): string {
        return this._description;
    }

    set surface(surface: Surface) {
        if (surface !== this._surface) {
            this._surface = surface;
        }
    }

    get surface(): Surface {
        return this._surface;
    }

    ngOnInit() {
        this.eliseSurface = this.eliseViewElementRef.nativeElement;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.surfaceExampleService.configure(this, id);
        }
    }

    backgroundClass() {
        return {
            'view-host': true,
            'border': true,
            grid: this.background === 'grid',
            black: this.background === 'black',
            white: this.background === 'white',
            gray: this.background === 'gray'
        };
    }

    timerTick(e: TimerParameters) {}

    mouseEnteredView(e: PointEventParameters) {
        this.mouseOverView = true;
    }

    mouseLeftView(e: PointEventParameters) {
        this.mouseOverView = false;
    }

    mouseMovedView(e: PointEventParameters) {
        this.viewMouseX = Math.round(e.point?.x ?? 0);
        this.viewMouseY = Math.round(e.point?.y ?? 0);
    }

    mouseDownView(e: PointEventParameters) {}
    mouseUpView(e: PointEventParameters) {}
    mouseEnteredElement(e: ElementBase) {}
    mouseLeftElement(e: ElementBase) {}
    mouseDownElement(e: ElementBase) {}
    mouseUpElement(e: ElementBase) {}
    elementClicked(e: ElementBase) {}

    controllerSet(controller: SurfaceViewController) {
        this.controller = controller;
    }

    log(message: string) {
        this.lastMessage = message;
    }
}
