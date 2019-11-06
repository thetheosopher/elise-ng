import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../elise/core/model';
import { Region } from '../../elise/core/Region';
import { EliseDesignComponent } from '../../elise/design/elise-design.component';
import { PointEventParameters } from '../../elise/core/point-event-parameters';
import { DesignController } from '../../elise/design/design-controller';
import { ElementBase } from '../../elise/elements/element-base';
import { DesignTestService } from '../../services/design-test.service';
import { ISampleDesigner } from '../../interfaces/sample-designer';
import { ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-elise-design-harness',
    templateUrl: './elise-design-harness.component.html',
    styleUrls: [ './elise-design-harness.component.scss' ]
})
export class EliseDesignHarnessComponent implements OnInit, ISampleDesigner {
    @ViewChild('elise', { read: ElementRef })
    eliseViewElementRef: ElementRef;

    _model: Model;
    _title: string;
    _description: string;

    eliseView: EliseDesignComponent;
    controller: DesignController;
    lastMessage = '-';

    scale = 1;
    background = 'black';
    viewMouseX: number;
    viewMouseY: number;
    mouseOverView = false;
    displayModel = true;
    formattedJson: string;
    errorMessage: string;
    codeString: string;
    selectionEnabled: boolean;

    constructor(private _designTestService: DesignTestService, private _route: ActivatedRoute) {
        this._title = 'Elise Design Component Test Harness';
        this._description = 'Tests Elise design component public interface';
        this._model = Model.create(320, 320);
        this.formattedJson = this._model.formattedJSON();
        this.selectionEnabled = true;
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
            this._designTestService.configure(this, id);
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

    controllerSet(controller: DesignController) {
        this.controller = controller;
    }

    selectionChanged(c: number) {
        this.log(`Selection Changed: ${c} items`);
    }

    elementCreated(r: Region) {
        this.log(`Element created (${r.x},${r.y}) ${r.width}x${r.height}`);
    }

    log(message: string) {
        this.lastMessage = message;
    }
}
