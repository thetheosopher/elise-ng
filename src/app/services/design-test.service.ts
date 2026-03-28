import { Injectable } from '@angular/core';

import { Model } from 'elise-graphics/lib/core/model';
import { DesignSample } from '../interfaces/design-sample';
import { Observable, of } from 'rxjs';
import { ISampleDesigner } from '../interfaces/sample-designer';
import { PolylineElement } from 'elise-graphics/lib/elements/polyline-element';
import { PolygonElement } from 'elise-graphics/lib/elements/polygon-element';
import { Point } from 'elise-graphics/lib/core/point';
import { ComponentRegistry } from 'elise-graphics/lib/design/component/component-registry';
import { GenericComponentProps } from 'elise-graphics/lib/design/component/generic-component-props';
import { DesignController } from 'elise-graphics/lib/design/design-controller';
import { Region } from 'elise-graphics/lib/core/region';
import { ElementBase } from 'elise-graphics/lib/elements/element-base';
import { Component } from 'elise-graphics/lib/design/component/component';
import { NavigateComponentProps } from 'elise-graphics/lib/design/component/navigate-component-props';
import { HtmlComponentProps } from 'elise-graphics/lib/design/component/html-component-props';
import { ComponentElement } from 'elise-graphics/lib/design/component/component-element';
import { ElementDragArgs } from 'elise-graphics/lib/elements/element-drag-args';
import { WindingMode } from 'elise-graphics/lib/core/winding-mode';
import { Color } from 'elise-graphics/lib/core/color';

import { loremipsum } from './loremipsum';
import { yinyang } from './yinyang';

import elise from 'elise-graphics';

function defaultModel(): Model {
    const model = Model.create(320, 320);
    return model;
}

const starterComponentRegion = {
    x: 48,
    y: 64,
    width: 224,
    height: 128
};

function drawstar(element: PolylineElement | PolygonElement, xcenter: number, ycenter: number, radius: number) {
    const numpoints = 5;
    const angle = Math.PI * 4 / numpoints;
    for (let i = 0; i < numpoints + 1; i++) {
        const x = xcenter + radius * Math.cos(i * angle - Math.PI / 2);
        const y = ycenter + radius * Math.sin(i * angle - Math.PI / 2);
        element.addPoint(Point.create(x, y));
    }
}

const tests: DesignSample[] = [
    {
        id: 'bare',
        title: 'Blank Model',
        description: 'Tests blank model creation with any elements.',
        configure: (viewer) => {
            viewer.model = defaultModel();
        }
    },
    {
        id: 'line',
        title: 'Line Element',
        description: 'Tests line element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.line(10, 10, 310, 310).setStroke('Gold,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle',
        title: 'Rectangle Element',
        description: 'Tests rectangle element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(10, 10, 200, 200).setFill('Gold').addTo(model);
            elise.rectangle(110, 110, 200, 200).setFill('0.75;Blue').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rounded_rectangle',
        title: 'Rounded Rectangle Element',
        description: 'Tests rounded rectangle element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(10, 10, 200, 200).setCornerRadius(24).setFill('Gold').addTo(model);
            elise.rectangle(110, 110, 200, 200).setCornerRadius(24).setFill('0.75;Blue').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse',
        title: 'Ellipse Element',
        description: 'Tests Ellipse element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(110, 110, 100, 100).setFill('Gold').addTo(model);
            elise.ellipse(210, 210, 100, 100).setFill('0.75;Blue').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polyline',
        title: 'Polyline Element',
        description: 'Tests polyline element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            const p = elise.polyline();
            const radius = 150;
            const xc = 160;
            const yc = 170;
            drawstar(p, xc, yc, radius);
            p.setStroke('Gold,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polygon',
        title: 'Polygon Element (Non-Zero Winding)',
        description: 'Tests polygon rendering with default non-zero winding.',
        configure: (viewer) => {
            const model = defaultModel();
            const p = elise.polygon();
            const radius = 150;
            const xc = 160;
            const yc = 170;
            drawstar(p, xc, yc, radius);
            p.setStroke('Gold,2').setFill('Blue').setWinding(WindingMode.NonZero).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polygon2',
        title: 'Polygon Element (Even-Odd Winding)',
        description: 'Tests polygon rendering with even-odd winding.',
        configure: (viewer) => {
            const model = defaultModel();
            const p = elise.polygon();
            const radius = 150;
            const xc = 160;
            const yc = 170;
            drawstar(p, xc, yc, radius);
            p.setStroke('Gold,2').setFill('Blue').setWinding(WindingMode.EvenOdd).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'path',
        title: 'Path Element (Non-Zero Winding)',
        description: 'Tests path element rendering with default non-zero winding.',
        configure: (viewer) => {
            const model = defaultModel();
            const p = elise.path();
            p.commands = 'm160,20 l248,291 l17,124 l303,124 l72,291 l160,20 z';
            p.setWinding(WindingMode.NonZero).setFill('Blue').setStroke('Gold,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'path2',
        title: 'Path Element (Even-Odd Winding)',
        description: 'Tests path element rendering with even-odd winding.',
        configure: (viewer) => {
            const model = defaultModel();
            const p = elise.path();
            p.commands = 'm160,20 l248,291 l17,124 l303,124 l72,291 l160,20 z';
            p.setWinding(WindingMode.EvenOdd).setFill('Blue').setStroke('Gold,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'complexpath',
        title: 'Complex Path Element',
        description: 'Tests multiple shape path element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            const p = elise.path();
            p.commands = yinyang;
            p.setFill('Blue').setStroke('Gold,2').scale(2, 2).translate(4, 10).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'textalignment',
        title: 'Text Element Alignment',
        description: 'Tests text element alignment options.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 10;
            let y = 10;
            const width = 300;
            const height = 30;
            const margin = 4;
            const fontSize = 18;
            const fontFill = 'White';
            const typeface = 'sans-serif';
            const borderStroke = 'Black';

            const alignments = [
                'Left,Top',
                'Left,Middle',
                'Left,Bottom',
                'Center,Top',
                'Center,Middle',
                'Center,Bottom',
                'Right,Top',
                'Right,Middle',
                'Right,Bottom'
            ];

            for (let i = 0; i < alignments.length; i++) {
                elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
                elise
                    .text(alignments[i], x, y, width, height)
                    .setTypesize(fontSize)
                    .setTypeface(typeface)
                    .setAlignment(alignments[i])
                    .setFill(fontFill)
                    .addTo(model);
                y += height + margin;
            }
            viewer.model = model;
        }
    },
    {
        id: 'richtext',
        title: 'Rich Text Element',
        description: 'Demonstrates selecting, moving, resizing, and duplicating text elements that contain rich text runs.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('#f3f4f6');

            elise.rectangle(16, 16, 288, 110).setCornerRadius(18).setFill('#ffffff').setStroke('#94a3b8,2').addTo(model);
            const heading = elise.text(' ', 30, 30, 260, 82)
                .setFill('#1f2937')
                .setAlignment('center,middle')
                .setRichText([
                    { text: 'Edit ', typeface: 'Coda Caption', typesize: 24 },
                    { text: 'Rich', typeface: 'Coda Caption', typesize: 30, typestyle: 'bold', decoration: 'underline' },
                    { text: ' Text', typeface: 'Georgia', typesize: 30, typestyle: 'italic' }
                ]);
            model.add(heading);

            elise.rectangle(16, 144, 288, 150).setCornerRadius(20).setFill('#ecfeff').setStroke('#0891b2,2').addTo(model);
            const body = elise.text(' ', 32, 160, 256, 120)
                .setFill('#164e63')
                .setAlignment('left,top')
                .setRichText([
                    { text: 'Drag or resize this element to verify ', typesize: 18 },
                    { text: 'rich text', typeface: 'Coda Caption', typesize: 20, typestyle: 'bold' },
                    { text: ' survives editing, including ', typesize: 18 },
                    { text: 'letter spacing', typesize: 16, letterSpacing: 1.6 },
                    { text: ' and ', typesize: 18 },
                    { text: 'decoration', typesize: 18, decoration: 'underline' },
                    { text: '.', typesize: 18 }
                ]);
            model.add(body);

            viewer.model = model;
        }
    },
    {
        id: 'arrangecommands',
        title: 'Arrange Commands',
        description: 'Tests bring forward, send backward, bring to front, and send to back on overlapping selections.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('#f8fafc');

            elise.rectangle(56, 56, 160, 160).setCornerRadius(18).setFill('#60a5fa').setStroke('#1d4ed8,2').addTo(model);
            elise.ellipse(120, 110, 82, 82).setFill('#f97316').setStroke('#c2410c,2').addTo(model);
            elise.rectangle(146, 146, 130, 96).setCornerRadius(16).setFill('#22c55e').setStroke('#15803d,2').addTo(model);
            elise.text('Arrange', 104, 120, 120, 42).setFill('#ffffff').setTypeface('Coda Caption').setTypesize(24).addTo(model);

            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.selectAll();
                controller.draw();
            });

            viewer.model = model;
        }
    },
    {
        id: 'nudgecommands',
        title: 'Nudge Commands',
        description: 'Tests keyboard or toolbar nudging for location and size adjustments on selected elements.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('#f1f5f9');

            elise.rectangle(34, 34, 250, 250).setStroke('#cbd5e1,2').addTo(model);
            elise.rectangle(62, 60, 88, 72).setCornerRadius(12).setFill('#2563eb').addTo(model);
            elise.rectangle(174, 80, 92, 56).setCornerRadius(12).setFill('#f59e0b').addTo(model);
            elise.ellipse(116, 196, 34, 34).setFill('#ec4899').addTo(model);
            elise.text('Use nudge commands to adjust the selected layout.', 46, 254, 228, 38).setFill('#334155').setTypesize(16).setAlignment('center,middle').addTo(model);

            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.selectAll();
                controller.draw();
            });

            viewer.model = model;
        }
    },
    {
        id: 'clippathinteraction',
        title: 'Clip Path Interaction',
        description: 'Tests that clipped elements remain selectable and editable in the designer.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('#e2e8f0');

            elise.rectangle(26, 28, 126, 126)
                .setFill('#0ea5e9')
                .setClipPath({
                    units: 'objectBoundingBox',
                    commands: ['m0.5,0', 'l1,0.38', 'l0.82,1', 'l0.18,1', 'l0,0.38', 'z']
                })
                .addTo(model);

            elise.ellipse(236, 92, 60, 60)
                .setFill('#f97316')
                .setClipPath({ commands: ['m200,60', 'l272,60', 'l298,92', 'l272,124', 'l200,124', 'l174,92', 'z'] })
                .addTo(model);

            elise.text('Clipped element handles should stay predictable.', 34, 204, 252, 74)
                .setFill('#1f2937')
                .setTypesize(20)
                .setAlignment('center,middle')
                .setClipPath({ units: 'objectBoundingBox', commands: ['m0.08,0', 'l1,0', 'l0.92,1', 'l0,1', 'z'] })
                .addTo(model);

            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.selectAll();
                controller.draw();
            });

            viewer.model = model;
        }
    },
    {
        id: 'styledstrokeediting',
        title: 'Styled Stroke Editing',
        description: 'Tests selection and editing workflows on elements with dash, cap, and join styling.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('#ffffff');

            elise.line(42, 62, 282, 62).setStroke('#2563eb,16').setLineCap('round').setStrokeDash([24, 14]).addTo(model);
            elise.rectangle(44, 112, 108, 100).setStroke('#7c3aed,10').setStrokeDash([16, 10]).setCornerRadius(14).addTo(model);

            const polyline = elise.polyline();
            polyline.addPoint(elise.point(188, 212));
            polyline.addPoint(elise.point(236, 118));
            polyline.addPoint(elise.point(284, 212));
            polyline.setStroke('#dc2626,18').setLineJoin('round').addTo(model);

            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.selectAll();
                controller.draw();
            });

            viewer.model = model;
        }
    },
    {
        id: 'shadowpreservation',
        title: 'Shadow Preservation',
        description: 'Tests that duplicate, move, resize, and delete workflows preserve shadow styling until explicitly changed.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('#f8fafc');

            elise.rectangle(34, 34, 112, 94).setCornerRadius(18).setFill('#38bdf8').setShadow({ color: '#0f172a66', blur: 16, offsetX: 8, offsetY: 10 }).addTo(model);
            elise.ellipse(234, 92, 46, 46).setFill('#f97316').setShadow({ color: '#7c2d1266', blur: 12, offsetX: 8, offsetY: 8 }).addTo(model);
            elise.text('Shadow', 58, 190, 204, 52).setFill('#1f2937').setTypeface('Coda Caption').setTypesize(32).setShadow({ color: '#11182766', blur: 10, offsetX: 6, offsetY: 8 }).addTo(model);

            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.selectAll();
                controller.draw();
            });

            viewer.model = model;
        }
    },
    {
        id: 'images',
        title: 'Image Element',
        description: 'Tests image element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setBasePath('./assets/models/primitives');
            const br1 = elise.bitmapResource('clouds', ':./assets/test/images/clouds.jpg').addTo(model);
            elise.image(br1, 0, 0, 320, 320).addTo(model);

            const br2 = elise.bitmapResource('bulb', '/images/bulb.png').addTo(model);
            elise.image(br2, 0, 0, 160, 160).addTo(model);

            viewer.model = model;
        }
    },
    {
        id: 'sprite',
        title: 'Sprite Element',
        description: 'Tests sprite element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.name);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const sprite = elise.sprite(10, 10, spriteWidth * 2, spriteHeight * 2).addTo(model);
            sprite.createSheetFrames(
                'santa',
                imageWidth,
                imageHeight,
                spriteWidth,
                spriteHeight,
                frameCount,
                0.05,
                null,
                0
            );
            viewer.model = model;
        }
    },
    {
        id: 'model',
        title: 'Model Element',
        description: 'Tests model element rendering.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32);
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 32, 128, 128, 128).addTo(model);
            elise.innerModel('m1', 192, 64, 92, 92).addTo(model);
            elise.innerModel('m1', 224, 192, 48, 48).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle_translate',
        title: 'Rectangle Translation',
        description: 'Tests rectangle element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(60, 60, 160, 160).setStroke('White,3').addTo(model);
            elise.rectangle(60, 60, 160, 160).setStroke('Gold,3').setTransform('translate(40,40)').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle_scale',
        title: 'Rectangle Scale',
        description: 'Tests rectangle element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(100, 100, 80, 80).setStroke('Gold').setTransform('scale(2)').addTo(model);
            elise.rectangle(100, 100, 80, 80).setStroke('Blue').setTransform('scale(2(40,40))').addTo(model);
            elise.rectangle(100, 100, 80, 80).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle_rotate',
        title: 'Rectangle Rotate',
        description: 'Tests rectangle element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(120, 100, 120, 120).setStroke('Gold,3').setTransform('rotate(45)').addTo(model);
            elise.rectangle(120, 100, 120, 120).setStroke('Blue,3').setTransform('rotate(45(60,60))').addTo(model);
            elise.rectangle(120, 100, 120, 120).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle_skew_x',
        title: 'Rectangle Skew X',
        description: 'Tests rectangle element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(80, 100, 120, 120).setStroke('Gold,3').setTransform('skew(30,0)').addTo(model);
            elise.rectangle(80, 100, 120, 120).setStroke('Blue,3').setTransform('skew(30,0(60,60))').addTo(model);
            elise.rectangle(80, 100, 120, 120).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle_skew_y',
        title: 'Rectangle Skew Y',
        description: 'Tests rectangle element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(100, 100, 120, 120).setStroke('Gold,3').setTransform('skew(0,30)').addTo(model);
            elise.rectangle(100, 100, 120, 120).setStroke('Blue,3').setTransform('skew(0,30(60,60))').addTo(model);
            elise.rectangle(100, 100, 120, 120).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangle_matrix',
        title: 'Rectangle Matrix Transform',
        description: 'Tests rectangle element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(160, 100, 120, 120).setStroke('Gold,5').setTransform('matrix(-1,0,0,1,0,0)').addTo(model);
            elise
                .rectangle(160, 100, 120, 120)
                .setStroke('Blue,5')
                .setTransform('matrix(-1,0,0,1,0,0(60,60))')
                .addTo(model);
            elise.rectangle(160, 100, 120, 120).setStroke('White,1.5').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse_translate',
        title: 'Ellipse Translation',
        description: 'Tests ellipse element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(140, 140, 120, 60).setStroke('Gold,3').setTransform('translate(40,40)').addTo(model);
            elise.ellipse(140, 140, 120, 60).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse_scale',
        title: 'Ellipse Scale',
        description: 'Tests ellipse element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(140, 140, 50, 25).setStroke('Gold').setTransform('scale(2)').addTo(model);
            elise.ellipse(140, 140, 50, 25).setStroke('Blue').setTransform('scale(2(50,25))').addTo(model);
            elise.ellipse(140, 140, 50, 25).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse_rotate',
        title: 'Ellipse Rotate',
        description: 'Tests ellipse element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(190, 140, 120, 60).setStroke('Gold,2').setTransform('rotate(45)').addTo(model);
            elise.ellipse(190, 140, 120, 60).setStroke('Blue,2').setTransform('rotate(45(120,60))').addTo(model);
            elise.ellipse(190, 140, 120, 60).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse_skew_x',
        title: 'Ellipse Skew X',
        description: 'Tests ellipse element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(140, 160, 100, 100).setStroke('Gold,2').setTransform('skew(30,0)').addTo(model);
            elise.ellipse(140, 160, 100, 100).setStroke('Blue,2').setTransform('skew(30,0(100,100))').addTo(model);
            elise.ellipse(140, 160, 100, 100).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse_skew_y',
        title: 'Ellipse Skew Y',
        description: 'Tests ellipse element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(160, 140, 100, 100).setStroke('Gold,2').setTransform('skew(0,30)').addTo(model);
            elise.ellipse(160, 140, 100, 100).setStroke('Blue,2').setTransform('skew(0,30(100,100))').addTo(model);
            elise.ellipse(160, 140, 100, 100).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipse_matrix',
        title: 'Ellipse Matrix Transform',
        description: 'Tests ellipse element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(220, 160, 60, 30).setStroke('Gold,5').setTransform('matrix(-1,0,0,1,0,0)').addTo(model);
            elise
                .ellipse(220, 160, 60, 30)
                .setStroke('Blue,5')
                .setTransform('matrix(-1,0,0,1,0,0(60,30))')
                .addTo(model);
            elise.ellipse(220, 160, 60, 30).setStroke('White,1.5').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polyline_translate',
        title: 'Polyline Translation',
        description: 'Tests polyline element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 60;
            const xc = 120;
            const yc = 120;
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,2').addTo(model);
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold,2').setTransform('translate(90,90)').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polyline_scale',
        title: 'Polyline Scale',
        description: 'Tests polyline element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 50;
            const xc = 140;
            const yc = 140;
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White').addTo(model);
            p1.getBounds();
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold').setTransform('scale(2)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polyline();
            drawstar(p3, xc, yc, radius);
            p3.setStroke('Blue').setTransform('scale(2(' + b.width / 2 + ',' + b.height / 2 + '))').addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polyline_rotate',
        title: 'Polyline Rotate',
        description: 'Tests polyline element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 80;
            const xc = 200;
            const yc = 160;
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,2').addTo(model);
            p1.getBounds();
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold,2').setTransform('rotate(45)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polyline();
            drawstar(p3, xc, yc, radius);
            p3.setStroke('Blue,2').setTransform('rotate(45(' + b.width / 2 + ',' + b.height / 2 + '))').addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polyline_skew_x',
        title: 'Polyline Skew X',
        description: 'Tests polyline element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 100;
            const xc = 130;
            const yc = 160;
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold,2').setTransform('skew(30,0)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polyline();
            drawstar(p3, xc, yc, radius);
            p3.setStroke('Blue,2').setTransform('skew(30,0(' + b.width / 2 + ',' + b.height / 2 + '))').addTo(model);
            p3.getBounds();
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,1').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polyline_skew_y',
        title: 'Polyline Skew Y',
        description: 'Tests polyline element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 100;
            const xc = 160;
            const yc = 130;
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold,2').setTransform('skew(0,30)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polyline();
            drawstar(p3, xc, yc, radius);
            p3.setStroke('Blue,2').setTransform('skew(0,30(' + b.width / 2 + ',' + b.height / 2 + '))').addTo(model);
            p3.getBounds();
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,1').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polyline_matrix',
        title: 'Polyline Matrix Transform',
        description: 'Tests polyline element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 72;
            const xc = 230;
            const yc = 160;
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold,3').setTransform('matrix(-1,0,0,1,0,0)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polyline();
            drawstar(p3, xc, yc, radius);
            p3
                .setStroke('Blue,3')
                .setTransform('matrix(-1,0,0,1,0,0(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,1.5').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygon_translate',
        title: 'Polygon Translation',
        description: 'Tests polygon element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 60;
            const xc = 120;
            const yc = 120;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White,2').setFill('0.4;White').addTo(model);
            const p2 = elise.polygon();
            drawstar(p2, xc, yc, radius);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold,2')
                .setFill('0.4;Gold')
                .setTransform('translate(90,90)')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polygon_scale',
        title: 'Polygon Scale',
        description: 'Tests polygon element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 50;
            const xc = 140;
            const yc = 140;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White').setFill('0.4;White').addTo(model);
            p1.getBounds();
            const p2 = elise.polygon();
            drawstar(p2, xc, yc, radius);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold')
                .setFill('0.4;Gold')
                .setTransform('scale(2)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polygon();
            drawstar(p3, xc, yc, radius);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue')
                .setFill('0.4;Blue')
                .setTransform('scale(2(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygon_rotate',
        title: 'Polygon Rotate',
        description: 'Tests polygon element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 80;
            const xc = 200;
            const yc = 160;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White,2').setFill('0.4;White').addTo(model);
            p1.getBounds();
            const p2 = elise.polygon();
            drawstar(p2, xc, yc, radius);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold,2')
                .setFill('0.4;Gold')
                .setTransform('rotate(45)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polygon();
            drawstar(p3, xc, yc, radius);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue,2')
                .setFill('0.4;Blue')
                .setTransform('rotate(45(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygon_skew_x',
        title: 'Polygon Skew X',
        description: 'Tests polygon element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 100;
            const xc = 130;
            const yc = 160;
            const p2 = elise.polygon();
            drawstar(p2, xc, yc, radius);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold,2')
                .setFill('0.4;Gold')
                .setTransform('skew(30,0)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polygon();
            drawstar(p3, xc, yc, radius);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue,2')
                .setFill('0.4;Blue')
                .setTransform('skew(30,0(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White,1').setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygon_skew_y',
        title: 'Polygon Skew Y',
        description: 'Tests polygon element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 100;
            const xc = 160;
            const yc = 130;
            const p2 = elise.polygon();
            drawstar(p2, xc, yc, radius);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold,2')
                .setFill('0.4;Gold')
                .setTransform('skew(0,30)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polygon();
            drawstar(p3, xc, yc, radius);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue,2')
                .setFill('0.4;Blue')
                .setTransform('skew(0,30(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White,1').setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygon_matrix',
        title: 'Polygon Matrix Transform',
        description: 'Tests polygon element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 72;
            const xc = 230;
            const yc = 160;
            const p2 = elise.polygon();
            drawstar(p2, xc, yc, radius);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold,3')
                .setFill('0.4;Gold')
                .setTransform('matrix(-1,0,0,1,0,0)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polygon();
            drawstar(p3, xc, yc, radius);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue,3')
                .setFill('0.4;Blue')
                .setTransform('matrix(-1,0,0,1,0,0(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White,1.5').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'path_translate',
        title: 'Path Translation',
        description: 'Tests path element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(25, 25);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White,2').setFill('0.4;White').addTo(model);
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(25, 25);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold,2')
                .setFill('0.4;Gold')
                .setTransform('translate(120,120)')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'path_scale',
        title: 'Path Scale',
        description: 'Tests path element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(80, 80).scale(0.7, 0.7);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White').setFill('0.4;White').addTo(model);
            p1.getBounds();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(80, 80).scale(0.7, 0.7);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold')
                .setFill('0.4;Gold')
                .setTransform('scale(2)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(80, 80).scale(0.7, 0.7);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue')
                .setFill('0.4;Blue')
                .setTransform('scale(2(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'path_rotate',
        title: 'Path Rotate',
        description: 'Tests path element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(120, 60);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White').setFill('0.4;White').addTo(model);
            p1.getBounds();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(120, 60);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold')
                .setFill('0.4;Gold')
                .setTransform('rotate(45)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(120, 60);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue')
                .setFill('0.4;Blue')
                .setTransform('rotate(45(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'path_skew_x',
        title: 'Path Skew X',
        description: 'Tests path element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(60, 80);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold')
                .setFill('0.4;Gold')
                .setTransform('skew(30,0)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(60, 80);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue')
                .setFill('0.4;Blue')
                .setTransform('skew(30,0(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(60, 80);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White').setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'path_skew_y',
        title: 'Path Skew Y',
        description: 'Tests path element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(80, 60);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold')
                .setFill('0.4;Gold')
                .setTransform('skew(0,30)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(80, 60);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue')
                .setFill('0.4;Blue')
                .setTransform('skew(0,30(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(80, 60);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White').setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'path_matrix',
        title: 'Path Matrix Transform',
        description: 'Tests path element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(154, 60);
            p2
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Gold')
                .setFill('0.4;Gold')
                .setTransform('matrix(-1,0,0,1,0,0)')
                .addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(154, 60);
            p3
                .setWinding(WindingMode.EvenOdd)
                .setStroke('Blue')
                .setFill('0.4;Blue')
                .setTransform('matrix(-1,0,0,1,0,0(' + b.width / 2 + ',' + b.height / 2 + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(154, 60);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White').setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'text_translate',
        title: 'Text Translation',
        description: 'Tests text element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('LemonChiffon');
            const x = 40;
            const y = 40;
            const width = 120;
            const height = 120;
            const fontSize = 14;
            const typeface = 'Times New Roman';
            const tr = elise.embeddedTextResource('r', loremipsum).addTo(model);
            elise
                .text(tr, x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Black')
                .addTo(model);
            elise
                .text(tr, x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Gold')
                .setTransform('translate(120,120)')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'text_scale',
        title: 'Text Scale',
        description: 'Tests text element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('LemonChiffon');
            const x = 90;
            const y = 90;
            const width = 80;
            const height = 80;
            const fontSize = 14;
            const typeface = 'Times New Roman';
            const tr = elise.embeddedTextResource('r', loremipsum).addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Black')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('scale(2)')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Blue')
                .setTransform('scale(2(40,40))')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'text_rotate',
        title: 'Text Rotate',
        description: 'Tests text element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('LemonChiffon');
            const x = 120;
            const y = 80;
            const width = 120;
            const height = 120;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            const tr = elise.embeddedTextResource('r', loremipsum).addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Black')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('rotate(45)')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Blue')
                .setTransform('rotate(45(60,60))')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'text_skew_x',
        title: 'Text Skew X',
        description: 'Tests text element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('LemonChiffon');
            const x = 60;
            const y = 60;
            const width = 160;
            const height = 160;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            const tr = elise.embeddedTextResource('r', loremipsum).addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Black')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('skew(30,0)')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Blue')
                .setTransform('skew(30,0(80,80))')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'text_skew_y',
        title: 'Text Skew Y',
        description: 'Tests text element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('LemonChiffon');
            const x = 80;
            const y = 60;
            const width = 160;
            const height = 160;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            const tr = elise.embeddedTextResource('r', loremipsum).addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Black')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('skew(0,30)')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Blue')
                .setTransform('skew(0,30(80,80))')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'text_matrix',
        title: 'Text Matrix Transform',
        description: 'Tests text element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill('LemonChiffon');
            const x = 140;
            const y = 80;
            const width = 120;
            const height = 160;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            const tr = elise.embeddedTextResource('r', loremipsum).addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Black')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('matrix(-1,0,0,1,0,0)')
                .addTo(model);
            elise.text(tr,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Blue')
                .setTransform('matrix(-1,0,0,1,0,0(80,80))')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'image_translate',
        title: 'Image Translation',
        description: 'Tests image element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 40;
            const y = 40;
            const width = 120;
            const height = 120;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(model);
            elise.image(br, x, y, width, height).addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('translate(120,120)').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'image_scale',
        title: 'Image Scale',
        description: 'Tests image element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 80;
            const y = 70;
            const width = 120;
            const height = 120;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(model);
            elise.image(br, x, y, width, height).addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('scale(2)').addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('scale(2(60,60))').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'image_rotate',
        title: 'Image Rotate',
        description: 'Tests image element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 110;
            const y = 60;
            const width = 180;
            const height = 180;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(model);
            elise.image(br, x, y, width, height).addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('rotate(45)').addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('rotate(45(90,90))').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'image_skew_x',
        title: 'Image Skew X',
        description: 'Tests image element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 60;
            const y = 60;
            const width = 180;
            const height = 180;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(model);
            elise.image(br, x, y, width, height).addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('skew(30,0)').addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('skew(30,0(90,90))').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'image_skew_y',
        title: 'Image Skew Y',
        description: 'Tests image element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 70;
            const y = 40;
            const width = 180;
            const height = 180;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(model);
            elise.image(br, x, y, width, height).addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('skew(0,30)').addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('skew(0,30(90,90))').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'image_matrix',
        title: 'Image Matrix Transform',
        description: 'Tests image element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 160;
            const y = 80;
            const width = 120;
            const height = 120;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(model);
            elise.image(br, x, y, width, height).addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('matrix(-1,0,0,1,0,0)').addTo(model);
            elise.image(br, x, y, width, height).setOpacity(0.5).setTransform('matrix(-1,0,0,1,0,0(60,60))').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'sprite_translate',
        title: 'Sprite Translation',
        description: 'Tests sprite element translation.',
        configure: (viewer) => {
            const model = defaultModel();

            model.setFill(Color.DarkGreen);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 1;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;

            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);

            const s2 = elise.sprite(10, 10, spriteWidth, spriteHeight).addTo(model);
            const s1 = elise.sprite(10, 10, spriteWidth, spriteHeight).setTransform('translate(120,120)') .addTo(model);

            // Make sprite frames
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);

            viewer.model = model;
        }
    },
    {
        id: 'sprite_scale',
        title: 'Sprite Scale',
        description: 'Tests sprite element scaling.',
        configure: (viewer) => {
            const model = defaultModel();

            model.setFill(Color.DarkGreen);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 1;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;

            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);

            const s2 = elise.sprite(80, 80, spriteWidth, spriteHeight).addTo(model);
            const s1 = elise.sprite(80, 80, spriteWidth, spriteHeight)
                .setTransform('scale(2(' + spriteWidth / 2 + ',' + spriteHeight / 2 + '))').addTo(model);

            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);

            viewer.model = model;
        }
    },
    {
        id: 'sprite_rotate',
        title: 'Sprite Rotate',
        description: 'Tests sprite element rotation.',
        configure: (viewer) => {
            const model = defaultModel();

            model.setFill(Color.DarkGreen);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 1;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;

            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);

            const s2 = elise.sprite(20, 80, spriteWidth, spriteHeight).addTo(model);
            const s1 = elise.sprite(120, 80, spriteWidth, spriteHeight)
                .setTransform('rotate(45(' + spriteWidth / 2 + ',' + spriteHeight / 2 + '))').addTo(model);

            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);

            viewer.model = model;
        }
    },
    {
        id: 'sprite_skew_x',
        title: 'Sprite Skew X',
        description: 'Tests sprite element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();

            model.setFill(Color.DarkGreen);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 1;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;

            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);

            const s2 = elise.sprite(20, 80, spriteWidth, spriteHeight).addTo(model);
            const s1 = elise.sprite(120, 80, spriteWidth, spriteHeight).setTransform('skew(30,0)').addTo(model);

            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);

            viewer.model = model;
        }
    },
    {
        id: 'sprite_skew_y',
        title: 'Sprite Skew Y',
        description: 'Tests sprite element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();

            model.setFill(Color.DarkGreen);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 1;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;

            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);

            const s2 = elise.sprite(20, 80, spriteWidth, spriteHeight).addTo(model);
            const s1 = elise.sprite(120, 80, spriteWidth, spriteHeight).setTransform('skew(0,30)').addTo(model);

            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);

            viewer.model = model;
        }
    },
    {
        id: 'sprite_matrix',
        title: 'Sprite Matrix Transform',
        description: 'Tests sprite element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();

            model.setFill(Color.DarkGreen);
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 1;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;

            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);

            const s2 = elise.sprite(160, 80, spriteWidth, spriteHeight).addTo(model);
            const s1 = elise.sprite(160, 80, spriteWidth, spriteHeight).setTransform('matrix(-1,0,0,1,0,0)').addTo(model);

            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);

            viewer.model = model;
        }
    },
    {
        id: 'model_translate',
        title: 'Model Translation',
        description: 'Tests model element translation.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 32, 32, 128, 128).addTo(model);
            elise.innerModel('m1', 32, 32, 128, 128).setTransform('translate(120,120)').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'model_scale',
        title: 'Model Scale',
        description: 'Tests model element scaling.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 96, 96, 80, 80).addTo(model);
            elise.innerModel('m1', 96, 96, 80, 80).setTransform('scale(2)').setOpacity(0.75).addTo(model);
            elise.innerModel('m1', 96, 96, 80, 80).setTransform('scale(2(40,40))').setOpacity(0.75).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'model_rotate',
        title: 'Model Rotate',
        description: 'Tests model element rotation.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 120, 60, 160, 160).addTo(model);
            elise.innerModel('m1', 120, 60, 160, 160).setTransform('rotate(45)').setOpacity(0.75).addTo(model);
            elise.innerModel('m1', 120, 60, 160, 160).setTransform('rotate(45(80,80))').setOpacity(0.75).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'model_skew_x',
        title: 'Model Skew X',
        description: 'Tests model element horizontal skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 60, 60, 160, 160).addTo(model);
            elise.innerModel('m1', 60, 60, 160, 160).setTransform('skew(30,0))').setOpacity(0.75).addTo(model);
            elise.innerModel('m1', 60, 60, 160, 160).setTransform('skew(30,0(80,80))').setOpacity(0.75).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'model_skew_y',
        title: 'Model Skew Y',
        description: 'Tests model element vertical skewing.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 80, 60, 160, 160).addTo(model);
            elise.innerModel('m1', 80, 60, 160, 160).setTransform('skew(0,30))').setOpacity(0.75).addTo(model);
            elise.innerModel('m1', 80, 60, 160, 160).setTransform('skew(0,30(80,80))').setOpacity(0.75).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'model_matrix',
        title: 'Model Matrix Transform',
        description: 'Tests model element matrix transform.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 160, 80, 160, 160).addTo(model);
            elise.innerModel('m1', 160, 80, 160, 160).setTransform('matrix(-1,0,0,1,0,0)').setOpacity(0.75).addTo(model);
            elise.innerModel('m1', 160, 80, 160, 160).setTransform('matrix(-1,0,0,1,0,0(80,80))').setOpacity(0.75).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'create_component',
        title: 'Generic Component Test',
        description: 'Tests generic component creation and rendering.',
        configure: (viewer) => {
            let seeded = false;
            if(!ComponentRegistry.isComponentRegistered('generic')) {
                ComponentRegistry.registerComponent('generic', new GenericComponentProps());
            }
            const model = defaultModel();
            model.setStroke('Black,3').setFill('#f2f2f2');
            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.elementCreated.add((c: DesignController, region?: Region) => {
                    c.addComponentElement('generic', elise.newId(), region.x, region.y, region.width, region.height, null,
                    function(el: ElementBase) {
                    });
                });
                controller.selectionEnabled = false;
                controller.activeComponent = ComponentRegistry.getComponent('generic');
                if(!seeded) {
                    seeded = true;
                    controller.addComponentElement(
                        'generic',
                        elise.newId(),
                        starterComponentRegion.x,
                        starterComponentRegion.y,
                        starterComponentRegion.width,
                        starterComponentRegion.height,
                        null,
                        function(_el: ElementBase) {
                        });
                }
            });
            viewer.model = model;
        }
    },
    {
        id: 'image_component',
        title: 'Image Based Component Test',
        description: 'Tests image based component creation and rendering.',
        configure: (viewer) => {
            let seeded = false;

            Component.baseImagePath = ':./assets/components/';
            if(!ComponentRegistry.isComponentRegistered('navigate')) {
                ComponentRegistry.registerComponent('navigate', new NavigateComponentProps());
            }
            ComponentRegistry.initializeAll(function(success) {
                console.log('Components initialized: ' + success);
            });

            const model = defaultModel();

            model.setStroke('Black,3').setFill('#f2f2f2');

            model.controllerAttached.add(function(_model, controller: DesignController) {
                controller.elementCreated.add((c: DesignController, region: Region) => {
                    controller.addComponentElement('navigate', elise.newId(), region.x, region.y, region.width, region.height, null,
                    function(el: ElementBase) {
                    });
                });
                controller.selectionEnabled = false;
                controller.activeComponent = ComponentRegistry.getComponent('navigate');
                if(!seeded) {
                    seeded = true;
                    controller.addComponentElement(
                        'navigate',
                        elise.newId(),
                        starterComponentRegion.x,
                        starterComponentRegion.y,
                        starterComponentRegion.width,
                        starterComponentRegion.height,
                        null,
                        function(_el: ElementBase) {
                        });
                }
            });

            viewer.model = model;
        }
    },
    {
        id: 'upload_component',
        title: 'Upload Component Test',
        description: 'Tests upload based component creation and rendering.',
        configure: (viewer) => {
            let seeded = false;

            const elementsWithUploads: ElementBase[] = [];
            let controller: DesignController;

            const simulateUpload = function(el: ComponentElement) {
                if(elementsWithUploads.indexOf(el) !== -1) {
                    return;
                }

                // Add to elements with uploads
                elementsWithUploads.push(el);

                // Simulate an upload
                el.component.onUploadStart(el);
                controller.draw();

                el.component.onComponentUploadProgress(el, 0);
                let percent = 0;
                const timerhandle = setInterval(function() {
                    percent++;
                    if(percent >= 100) {
                        clearInterval(timerhandle);
                        el.component.onUploadComplete(el, true);
                        elementsWithUploads.splice(elementsWithUploads.indexOf(el), 1);
                    }
                    else {
                        el.component.onComponentUploadProgress(el, percent);
                    }
                    controller.draw();
                }, 100);
            };

            Component.baseImagePath = ':./assets/components/';
            if(!ComponentRegistry.isComponentRegistered('html')) {
                ComponentRegistry.registerComponent('html', new HtmlComponentProps());
            }
            ComponentRegistry.initializeAll(function(success) {
                console.log('Design components initialized: ' + success);
            });

            const model = defaultModel();

            model.setStroke('Black,3').setFill('#f2f2f2');

            model.controllerAttached.add(function(_model, _controller: DesignController) {
                controller = _controller;
                _controller.elementCreated.add((c: DesignController, region: Region) => {
                    _controller.addComponentElement('html', elise.newId(), region.x, region.y, region.width, region.height, null,
                    function(el: ComponentElement) {
                        simulateUpload(el);
                    });
                });
                controller.elementDrop.add(function(__controller: DesignController, args: ElementDragArgs) {
                    const el = args.element as ComponentElement;
                    simulateUpload(el);
                });
                controller.selectionEnabled = false;
                controller.activeComponent = ComponentRegistry.getComponent('html');
                if(!seeded) {
                    seeded = true;
                    controller.addComponentElement(
                        'html',
                        elise.newId(),
                        starterComponentRegion.x,
                        starterComponentRegion.y,
                        starterComponentRegion.width,
                        starterComponentRegion.height,
                        null,
                        function(el: ComponentElement) {
                            simulateUpload(el);
                        });
                }
            });
            viewer.model = model;
        }
    }
];

@Injectable({
    providedIn: 'root'
})
export class DesignTestService {
    constructor() {}

    configure(designer: ISampleDesigner, modelId: string) {
        const test = tests.find((s) => s.id === modelId);
        designer.title = test.title;
        designer.description = test.description;
        test.configure(designer);
    }

    tests(): Observable<DesignSample[]> {
        return of(tests);
    }

    test(id: string): Observable<DesignSample> {
        return of(tests.find((s) => s.id === id));
    }
}
