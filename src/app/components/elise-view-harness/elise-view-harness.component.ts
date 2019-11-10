import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Model } from 'elise-graphics/lib/core/model';
import { ViewController } from 'elise-graphics/lib/view/view-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { TimerParameters } from 'elise-graphics/lib/core/timer-parameters';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';

import { EliseViewComponent } from '../../elise/view/elise-view.component';
import { ViewTestService } from '../../services/view-test.service';
import { ISampleViewer } from '../../interfaces/sample-viewer';

@Component({
    selector: 'app-elise-view-harness',
    templateUrl: './elise-view-harness.component.html',
    styleUrls: [ './elise-view-harness.component.scss' ]
})
export class EliseViewHarnessComponent implements OnInit, ISampleViewer {
    @ViewChild('elise', { read: ElementRef })
    eliseViewElementRef: ElementRef;

    _model: Model;
    _title: string;
    _description: string;

    eliseView: EliseViewComponent;
    controller: ViewController;
    lastMessage = '-';

    scale = 1;
    background = 'gray';
    viewTime = 0;
    viewMouseX: number;
    viewMouseY: number;
    timerEnabled = false;
    mouseOverView = false;
    displayModel = true;
    formattedJson: string;
    errorMessage: string;
    codeString: string;

    constructor(private _viewTestService: ViewTestService, private _route: ActivatedRoute) {
        this._title = 'Elise View Component Test Harness';
        this._description = 'Tests Elise view component public interface';
        this._model = Model.create(320, 320);
        this.formattedJson = this._model.formattedJSON();
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
    set model(model: Model) {
        if (model !== this._model) {
            const self = this;
            model.prepareResources(null, function(result) {
                if (result) {
                    self._model = model;
                    if (self.displayModel) {
                        self.formattedJson = model.formattedJSON();
                    }
                }
                else {
                    self.errorMessage = 'Error loading model resources.';
                }
            });
        }
    }

    get model(): Model {
        return this._model;
    }

    ngOnInit() {
        this.eliseView = this.eliseViewElementRef.nativeElement;
        const id = this._route.snapshot.paramMap.get('id');
        if (id) {
            this._viewTestService.configure(this, id);
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
        this.log(`Mouse Entered View`);
    }

    mouseLeftView(e: PointEventParameters) {
        this.mouseOverView = false;
        this.log(`Mouse Left View`);
    }

    mouseMovedView(e: PointEventParameters) {
        this.viewMouseX = Math.round(e.point.x);
        this.viewMouseY = Math.round(e.point.y);
    }

    mouseDownView(e: PointEventParameters) {
        this.log(`Mouse Down View: ${e.point.x}:${e.point.y}`);
    }

    mouseUpView(e: PointEventParameters) {
        this.log(`Mouse Up View: ${e.point.x}:${e.point.y}`);
    }

    mouseEnteredElement(e: ElementBase) {
        this.log(`Mouse entered element: ${e.describe()}`);
    }

    mouseLeftElement(e: ElementBase) {
        this.log(`Mouse left element: ${e.describe()}`);
    }

    mouseDownElement(e: ElementBase) {
        this.log(`Mouse down element: ${e.describe()}`);
    }

    mouseUpElement(e: ElementBase) {
        this.log(`Mouse up element: ${e.describe()}`);
    }

    elementClicked(e: ElementBase) {
        this.log(`Element clicked: ${e.describe()}`);
    }

    controllerSet(controller: ViewController) {
        this.controller = controller;
    }

    log(message: string) {
        this.lastMessage = message;
    }
}
