import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { Model } from 'elise-graphics/lib/core/model';
import { LineElement } from 'elise-graphics/lib/elements/line-element';
import { RectangleElement } from 'elise-graphics/lib/elements/rectangle-element';
import { EllipseElement } from 'elise-graphics/lib/elements/ellipse-element';
import { PointEventParameters } from 'elise-graphics/lib/core/point-event-parameters';
import { ViewController } from 'elise-graphics/lib/view/view-controller';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';

import { EliseViewComponent } from '../../elise/view/elise-view.component';

@Component({
  selector: 'app-redgreenblue',
  templateUrl: './redgreenblue.component.html',
  styleUrls: ['./redgreenblue.component.scss']
})
export class RedGreenBlueComponent implements OnInit, AfterViewInit {

    @ViewChild('elise', { read: ElementRef, static: true }) eliseViewElementRef: ElementRef;

    model: Model;

    eliseView: EliseViewComponent;
    controller: ViewController;
    logMessages: string[] = [];

    ngOnInit() {
        this.eliseView = this.eliseViewElementRef.nativeElement;
        this.createModel();
        // this.model = Model.create(100, 100).setFill('Yellow');
    }

    ngAfterViewInit() {
        // this.eliseView = this.eliseViewElementRef.nativeElement;
    }

    createModel() {
        const model = Model.create(640, 480);
        model.setFill('Yellow');

        LineElement.create(10, 10, 630, 470).setStroke('Black,4').addTo(model);
        RectangleElement.create(100, 10, 400, 200).setFill('Blue').addTo(model);
        EllipseElement.create(320, 240, 200, 100).setFill('Orange').addTo(model);

        this.model = model;
    }

    mouseEnteredView(e: PointEventParameters) {
        this.log(`Mouse Entered View`);
    }

    mouseLeftView(e: PointEventParameters) {
        this.log(`Mouse Left View`);
    }

    mouseMovedView(e: PointEventParameters) {
        this.log(`Mouse Moved View: ${e.point.x}:${e.point.y}`);
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
        this.logMessages.push(message);
        while(this.logMessages.length > 20) {
            this.logMessages.shift();
        }
    }

    red() {
        this.model.setFill('Red');
        this.controller.draw();
    }

    green() {
        this.model.setFill('Green');
        this.controller.draw();
    }

    blue() {
        this.model.setFill('Blue');
        this.controller.draw();
    }
}
