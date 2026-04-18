import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Model } from 'elise-graphics/lib/core/model';
import { Region } from 'elise-graphics/lib/core/Region';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { DesignController } from 'elise-graphics/lib/design/design-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { UndoState } from 'elise-graphics';
import { GridType } from 'elise-graphics';

import { EliseDesignComponent } from '../../elise/design/elise-design.component';
import { DesignTestService } from '../../services/design-test.service';
import { ISampleDesigner } from '../../interfaces/sample-designer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface GridTypeOption {
    label: string;
    value: GridType;
}

@Component({
    imports: [CommonModule, FormsModule, RouterModule, EliseDesignComponent],
    selector: 'app-elise-design-harness',
    templateUrl: './elise-design-harness.component.html',
    styleUrls: ['./elise-design-harness.component.scss']
})
export class EliseDesignHarnessComponent implements OnInit, ISampleDesigner {
    @ViewChild('elise', { read: ElementRef, static: true })
    eliseViewElementRef: ElementRef;

    _model: Model;
    _title: string;
    _description: string;

    eliseView: EliseDesignComponent;
    controller: DesignController;
    lastMessage = '-';
    testId: string | null = null;

    scale = 1;
    background = 'white';
    gridType = GridType.None;
    viewMouseX: number;
    viewMouseY: number;
    mouseOverView = false;
    displayModel = true;
    formattedJson: string;
    selectionEnabled: boolean;
    canUndo = false;
    canRedo = false;

    readonly gridTypeOptions: GridTypeOption[] = [
        { label: 'None', value: GridType.None },
        { label: 'Dots', value: GridType.Dots },
        { label: 'Lines', value: GridType.Lines }
    ];

    constructor(
        private _designTestService: DesignTestService,
        private _route: ActivatedRoute,
        private toasterService: ToastrService) {
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
            model.prepareResources(null, (result) => {
                if (result) {
                    for (const el of model.elements) {
                        el.setInteractive(true);
                    }
                    this._model = model;
                    if (this.displayModel) {
                        this.formattedJson = model.formattedJSON();
                    }
                }
                else {
                    this.toasterService.error('Error loading model resources.');
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
        this.testId = id;
        if (id) {
            this._designTestService.configure(this, id);
        }
    }

    get showComponentPlacementHint(): boolean {
        return this.testId === 'create_component'
            || this.testId === 'image_component'
            || this.testId === 'upload_component';
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
        if (this.controller) {
            this.controller.setGridType(this.gridType);
        }
        this.syncUndoState();
    }

    gridTypeChanged() {
        if (!this.controller) {
            return;
        }

        this.controller.setGridType(this.gridType);
        this.controller.draw();
    }

    undoChanged(state: UndoState) {
        this.canUndo = state?.canUndo ?? false;
        this.canRedo = state?.canRedo ?? false;
    }

    undo() {
        if (!this.controller?.undo()) {
            this.syncUndoState();
            return;
        }

        this.afterUndoRedo('Undo');
    }

    redo() {
        if (!this.controller?.redo()) {
            this.syncUndoState();
            return;
        }

        this.afterUndoRedo('Redo');
    }

    modelUpdated(model: Model) {
        if (this.displayModel) {
            this.formattedJson = model.formattedJSON();
        }
    }

    private afterUndoRedo(action: string) {
        if (this.displayModel && this.model) {
            this.formattedJson = this.model.formattedJSON();
        }
        this.syncUndoState();
        this.log(`${action} applied`);
    }

    private syncUndoState() {
        this.canUndo = this.controller?.canUndo ?? false;
        this.canRedo = this.controller?.canRedo ?? false;
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
