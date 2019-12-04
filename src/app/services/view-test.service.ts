import { Injectable } from '@angular/core';
import { Model } from 'elise-graphics/lib/core/model';
import { ViewSample } from '../interfaces/view-sample';
import { Observable, of } from 'rxjs';
import { ISampleViewer } from '../interfaces/sample-viewer';
import { PolylineElement } from 'elise-graphics/lib/elements/polyline-element';
import { PolygonElement } from 'elise-graphics/lib/elements/polygon-element';
import { Point } from 'elise-graphics/lib/core/point';
import { ViewController } from 'elise-graphics/lib/view/view-controller';
import { ElementCommandHandler } from 'elise-graphics/lib/command/element-command-handler';
import { TransitionRenderer } from 'elise-graphics/lib/transitions/transitions';
import { SpriteElement } from 'elise-graphics/lib/elements/sprite-element';
import { WindingMode } from 'elise-graphics/lib/core/winding-mode';
import { Color } from 'elise-graphics/lib/core/color';

import { loremipsum } from './loremipsum';
import { yinyang } from './yinyang';

import elise from 'elise-graphics/lib/index';

function defaultModel(): Model {
    const model = Model.create(320, 320);
    // model.setFill('Gray');
    return model;
}

function drawstar(element: PolylineElement | PolygonElement, xcenter: number, ycenter: number, radius: number) {
    const numpoints = 5;
    const angle = Math.PI * 4 / numpoints;
    for (let i = 0; i < numpoints + 1; i++) {
        const x = xcenter + radius * Math.cos(i * angle - Math.PI / 2);
        const y = ycenter + radius * Math.sin(i * angle - Math.PI / 2);
        element.addPoint(Point.create(x, y));
    }
}

const tests: ViewSample[] = [
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
        id: 'texttypeface',
        title: 'Text Element Typefaces',
        description: 'Tests text element internal and CSS typefaces options.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 10;
            let y = 10;
            const width = 300;
            const height = 30;
            const margin = 4;
            const fontSize = 24;
            const fontFill = 'White';
            const borderStroke = 'Gray';
            const alignment = 'center,middle';
            const typefaces = [
                'Serif',
                'Sans-Serif',
                'Monospace',
                'Courier',
                'Times New Roman',
                'Poiret One',
                'Coda',
                'Coda Caption',
                'Anonymous Pro'
            ];
            for (let i = 0; i < typefaces.length; i++) {
                elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
                elise
                    .text(typefaces[i], x, y, width, height)
                    .setTypesize(fontSize)
                    .setTypeface(typefaces[i])
                    .setAlignment(alignment)
                    .setFill(fontFill)
                    .addTo(model);
                y += height + margin;
            }
            viewer.model = model;
        }
    },
    {
        id: 'textsize',
        title: 'Test Element Size',
        description: 'Tests text element text sizing. Renders exactly twelve lines of text.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 10;
            const y = 10;
            const width = 300;
            const height = 300;
            const fontSize = 25;
            const fontFill = 'White';
            const borderStroke = 'Gray';
            const alignment = 'left,top';
            const typeface = 'Times New Roman';
            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text(loremipsum, x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setAlignment(alignment)
                .setFill(fontFill)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'textstyle',
        title: 'Text Element Style',
        description: 'Tests text element style options.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 10;
            let y = 10;
            const width = 300;
            const height = 30;
            const margin = 4;
            const fontSize = 18;
            const fontFill = 'White';
            let typeface = 'Times New Roman';
            const borderStroke = 'Gray';

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Normal', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Normal')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Italic', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Italic')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Bold', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Bold')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Bold,Italic', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Bold,Italic')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            typeface = 'Sans-Serif';

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Normal', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Normal')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Italic', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Italic')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Bold', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Bold')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Bold,Italic', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setTypestyle('Bold,Italic')
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;
            viewer.model = model;
        }
    },
    {
        id: 'textsource',
        title: 'Text Element Sources',
        description:
            'Tests text element text resource options including text property, model text resource, ' +
            'external resource relative to model resource base, external resource relative to web site ' +
            'base, and external HTTP/HTTPS AJAX resource.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setBasePath('./assets');
            const x = 10;
            let y = 10;
            const width = 300;
            const height = 50;
            const margin = 4;
            const fontSize = 18;
            const fontFill = 'White';
            const typeface = 'Sans-Serif';
            const borderStroke = Color.LightGray.name;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text('Direct Text Property', x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text(elise.embeddedTextResource('key1', 'Internal Text Resource').addTo(model), x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text(elise.uriTextResource('key2', '/test/text/testbase.txt').addTo(model), x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            elise
                .text(
                    elise.uriTextResource('key3', ':./assets/test/text/testserver.txt').addTo(model),
                    x,
                    y,
                    width,
                    height
                )
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            elise.rectangle(x, y, width, height).setStroke(borderStroke).addTo(model);
            const url = 'https://httpbin.org/ip';
            elise
                .text(elise.uriTextResource('key4', url).addTo(model), x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill(fontFill)
                .addTo(model);
            y += height + margin;

            viewer.model = model;
        }
    },
    {
        id: 'imageopacity',
        title: 'Image Element Opacity',
        description: 'Tests image element rendering with full and partial opacity.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.bitmapResource('bulb', ':./assets/models/primitives/images/bulb.png').addTo(model);
            elise.image('bulb', 10, 10, 128, 128).setInteractive(true).addTo(model);
            elise.image('bulb', 138, 138, 64, 64).setOpacity(0.6).setInteractive(true).addTo(model);
            elise.image('bulb', 234, 234, 32, 32).setOpacity(0.3).setInteractive(true).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'imagesource',
        title: 'Image Element Sources',
        description:
            'Tests image element bitmap source options including model relative resource,' +
            'site relative resource and external internet resource.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setBasePath('./assets/models/primitives');
            elise
                .image(elise.bitmapResource('clouds', ':./assets/test/images/clouds.jpg').addTo(model), 0, 0, 320, 320)
                .addTo(model);

            elise.image(elise.bitmapResource('bulb', '/images/bulb.png').addTo(model), 0, 0, 160, 160).addTo(model);

            elise
                .image(
                    elise
                        .bitmapResource('girl', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Sharbat_Gula.jpg')
                        .addTo(model),
                    0,
                    0,
                    203,
                    320
                )
                .setOpacity(0.5)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'spriteanimation',
        title: 'Sprite Element Animation',
        description: 'Tests sprite element frame animation using view timer.',
        configure: (viewer) => {
            const model = defaultModel();

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
            sprite.timer = 'tick';
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
            model.controllerAttached.add(function(_model: Model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick', function(
                    _controller: ViewController,
                    element,
                    command,
                    trigger,
                    parameters
                ) {
                    TransitionRenderer.spriteTransitionHandler(
                        _controller,
                        element as SpriteElement,
                        command,
                        trigger,
                        parameters
                    );
                });
                controller.startTimer(0);
            });

            viewer.timerEnabled = true;
            viewer.displayModel = false;
            viewer.model = model;
        }
    },
    {
        id: 'embeddedmodel',
        title: 'Embedded Model Resource',
        description: 'Tests model element rendering with embedded model resource.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setBasePath('./assets/models/primitives');
            const m1 = elise.model(32, 32);
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', '/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 32, 128, 128, 128).addTo(model);
            elise.innerModel('m1', 192, 64, 92, 92).setOpacity(0.5).addTo(model);
            elise.innerModel('m1', 224, 192, 48, 48).setOpacity(0.25).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'modelsources',
        title: 'Model Resource Sources',
        description: 'Tests model element rendering with site and model level external resources.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setBasePath('./assets/resources');
            elise
                .innerModel(
                    elise.modelResource('m1', ':./assets/resources/models/image-element/').addTo(model),
                    0,
                    0,
                    160,
                    160
                )
                .addTo(model);
            elise
                .innerModel(elise.modelResource('m2', '/models/polygon-element/').addTo(model), 160, 0, 160, 160)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'strokewidths',
        title: 'Stroke Widths',
        description: 'Tests integer stroke widths from 1 to 16.',
        configure: (viewer) => {
            const model = defaultModel();
            let y = 20;
            let width = 1;
            for (let i = 0; i < 17; i++) {
                elise.line(10, y, 310, y).setStroke('White,' + width).addTo(model);
                y += width * 2;
                width += 1;
            }
            viewer.model = model;
        }
    },
    {
        id: 'strokecolors',
        title: 'Stroke Colors',
        description: 'Tests stroke rendering of named colors and gray scale brightness.',
        configure: (viewer) => {
            const model = defaultModel();
            let y = 10;
            const x1 = 10;
            const x2 = 310;
            for (let i = 0; i < Color.NamedColors.length; i++) {
                elise.line(x1, y, x2, y).setStroke(Color.NamedColors[i].name).addTo(model);
                y++;
            }
            let b = 0;
            while (b < 255) {
                const c = elise.color(255, b, b, b);
                elise.line(x1, y, x2, y).setStroke(c.toHexString()).addTo(model);
                b += 2;
                y++;
            }
            viewer.model = model;
        }
    },
    {
        id: 'fillcolors',
        title: 'Fill Colors',
        description: 'Tests fill rendering of named colors and gray scale brightness.',
        configure: (viewer) => {
            const model = defaultModel();
            let x = 0;
            let y = 0;
            const w = 20;
            const h = 20;
            for (let i = 0; i < Color.NamedColors.length; i++) {
                elise.rectangle(x, y, w, h).setFill(Color.NamedColors[i].name).addTo(model);
                x += w;
                if (x > model.getSize().width - w) {
                    x = 0;
                    y += h;
                }
            }

            let b = 0;
            while (b < 256) {
                const c = elise.color(255, b, b, b);
                elise.rectangle(x, y, w, h).setFill(c.toHexString()).addTo(model);
                b += 3;
                x += w;
                if (x > model.getSize().width - w) {
                    x = 0;
                    y += h;
                }
            }
            viewer.model = model;
        }
    },
    {
        id: 'strokedshapes1',
        title: 'Stroked Shapes 1',
        description: 'Tests solid color stroked line, rectangle, ellipse, polyline and polygon elements.',
        configure: (viewer) => {
            const model = defaultModel();
            const stroke = 'Gold,2';
            elise.line(10, 10, 310, 10).setStroke(stroke).addTo(model);
            elise.rectangle(10, 20, 150, 150).setStroke(stroke).addTo(model);
            elise.ellipse(240, 95, 75, 75).setStroke(stroke).addTo(model);

            const pl = elise.polyline();
            pl.addPoint(elise.point(10, 180));
            pl.addPoint(elise.point(10, 310));
            pl.addPoint(elise.point(150, 245));
            pl.addPoint(elise.point(10, 180));
            pl.setStroke(stroke).addTo(model);

            const pg = elise.polygon();
            pg.addPoint(elise.point(310, 180));
            pg.addPoint(elise.point(310, 310));
            pg.addPoint(elise.point(170, 245));
            pg.addPoint(elise.point(310, 180));
            pg.setStroke(stroke).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'strokedshapes2',
        title: 'Stroked Shapes 2',
        description: 'Tests solid color stroked path and text element types.',
        configure: (viewer) => {
            const model = defaultModel();
            const stroke = 'Gold,2';
            const p = elise.path();
            p.commands = yinyang;
            p.setStroke(stroke).scale(1, 1).translate(78, 10).setInteractive(true).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 160)
                .setAlignment('Center,Middle')
                .setTypeface('Coda Caption')
                .setTypesize(32)
                .setStroke(stroke)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'filledshapes1',
        title: 'Filled Shapes 1',
        description: 'Tests solid color filled rectangle, ellipse and polygon element types.',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = 'White';
            elise.rectangle(10, 20, 150, 150).setFill(fill).addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill(fill).addTo(model);
            const radius = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.NonZero).setFill(fill).addTo(model);
            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, radius);
            p2.setWinding(WindingMode.EvenOdd).setFill(fill).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'filledshapes2',
        title: 'Filled Shapes 2',
        description: 'Tests solid color filled path and text stroked element types.',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = 'White';
            const p = elise.path();
            p.commands = yinyang;
            p.setFill(fill).scale(1, 1).translate(78, 10).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 160)
                .setAlignment('center,middle')
                .setTypeface('Coda Caption')
                .setTypesize(32)
                .setFill(fill)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'strokedfilled1',
        title: 'Stroked and Filled Shapes 1',
        description: 'Tests color stroked and filled rectangle, ellipse and polygon element types.',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = 'Blue';
            const stroke = 'Gold,4';

            elise.rectangle(10, 20, 150, 150).setFill(fill).setStroke(stroke).addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill(fill).setStroke(stroke).addTo(model);

            const radius = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.NonZero).setFill(fill).setStroke(stroke).addTo(model);

            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, radius);
            p2.setWinding(WindingMode.EvenOdd).setFill(fill).setStroke(stroke).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'strokedfilled2',
        title: 'Stroked and Filled Shapes 2',
        description: '',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = 'Blue';
            const stroke = 'Gold,2';
            const p = elise.path();
            p.commands = yinyang;
            p.setFill(fill).setStroke(stroke).scale(1, 1).translate(78, 10).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 160)
                .setAlignment('center,middle')
                .setTypeface('Coda Caption')
                .setTypesize(32)
                .setFill(fill)
                .setStroke(stroke)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'imagefilled1',
        title: 'Image Filled 1',
        description: 'Tests partial opacity and opaque image filled elements.',
        configure: (viewer) => {
            const model = defaultModel();
            viewer.background = 'grid';
            elise.bitmapResource('t1', ':./assets/test/images/texture1.png').addTo(model);
            elise.rectangle(10, 20, 150, 150).setFill('image(0.5;t1)').setStroke('Black').addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill('image(0.75;t1)').setStroke('Black').addTo(model);
            const radius = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, radius);
            p1.setWinding(WindingMode.NonZero).setFill('image(0.85;t1)').setStroke('Black').addTo(model);
            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, radius);
            p2.setWinding(WindingMode.EvenOdd).setFill('image(t1)').setStroke('Black').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'imagefilled2',
        title: 'Image Filled 2',
        description: 'Tests partial opacity and opaque image filled path and text elements.',
        configure: (viewer) => {
            const model = defaultModel();
            viewer.background = 'grid';
            elise.bitmapResource('t1', ':./assets/test/images/texture1.png').addTo(model);
            const p = elise.path();
            p.commands = yinyang;
            p.setFill('image(0.5;t1)').setStroke('Black').scale(1, 1).translate(78, 10).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 160)
                .setAlignment('center,middle')
                .setTypeface('Coda Caption')
                .setTypesize(32)
                .setFill('image(t1)')
                .setStroke('Black')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'fillscale',
        title: 'Fill Scale',
        description: 'Tests scaled image fill of rectangle, ellipse and polygon shapes.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.bitmapResource('t1', ':./assets/test/images/texture2.jpg').addTo(model);
            const fill = 'image(t1)';
            elise.rectangle(10, 20, 150, 150).setFill(fill).setFillScale(0.75).addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill(fill).setFillScale(0.5).addTo(model);
            const r = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, r);
            p1.setWinding(WindingMode.NonZero).setFill(fill).setFillScale(0.25).addTo(model);
            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, r);
            p2.setWinding(WindingMode.EvenOdd).setFill(fill).setFillScale(0.125).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'lineargradient1',
        title: 'Linear Gradient 1',
        description: 'Tests linear gradient filled rectangle, ellipse and polygon elements.',
        configure: (viewer) => {
            const model = defaultModel();
            viewer.background = 'white';
            const fill = elise.linearGradientFill('0,0', '150,150');
            fill.addFillStop('Black', 0);
            fill.addFillStop('White', 1);
            elise.rectangle(10, 20, 150, 150).setFill(fill).addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill(fill).addTo(model);
            const r = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, r);
            p1.setWinding(WindingMode.NonZero).setFill(fill).addTo(model);
            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, r);
            p2.setWinding(WindingMode.EvenOdd).setFill(fill).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'lineargradient2',
        title: 'Linear Gradient 2',
        description: 'Tests linear gradient filled path and text elements.',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = elise.linearGradientFill('0,0', '160,160');
            fill.addFillStop('Black', 0);
            fill.addFillStop('White', 1);
            const p = elise.path();
            p.commands = yinyang;
            p.setFill(fill).scale(1, 1).translate(78, 10).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 160)
                .setAlignment('center,middle')
                .setTypeface('Coda Caption')
                .setTypesize(32)
                .setFill(fill)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'radialgradient1',
        title: 'Radial Gradient 1',
        description: 'Test radial gradient filled rectangle, ellipse and polygon elements.',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = elise.radialGradientFill('80,80', '80,80', 120, 120);
            fill.addFillStop('White', 0);
            fill.addFillStop('Black', 1);
            elise.rectangle(10, 20, 150, 150).setFill(fill).addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill(fill).addTo(model);
            const r = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, r);
            p1.setWinding(WindingMode.NonZero).setFill(fill).addTo(model);
            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, r);
            p2.setWinding(WindingMode.EvenOdd).setFill(fill).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'radialgradient2',
        title: 'Radial Gradient 2',
        description: 'Tests radial gradient filled path and text elements.',
        configure: (viewer) => {
            const model = defaultModel();
            const fill = elise.radialGradientFill('80,80', '80,80', 120, 120);
            fill.addFillStop('White', 0);
            fill.addFillStop('Black', 1);
            const p = elise.path();
            p.commands = yinyang;
            p.setFill(fill).scale(1, 1).translate(78, 10).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 150)
                .setAlignment('center')
                .setTypeface('Sansita One')
                .setTypesize(36)
                .setFill(fill)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'modelfill1',
        title: 'Model Fill 1',
        description: 'Tests embedded model filled rectangle, ellipse and polygon elements.',
        configure: (viewer) => {
            const model = defaultModel();
            viewer.background = 'grid';
            const m1 = elise.model(32, 32);
            const stroke = '0.5;DarkGreen';
            m1.setFill('0.5;Green');
            m1.basePath = model.basePath;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 0, 0, 32, 32).addTo(m1);
            elise.ellipse(16, 16, 16, 16).setFill('0.3;White').addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            const fill = 'model(m1)';
            elise.rectangle(10, 20, 150, 150).setFill(fill).setStroke(stroke).addTo(model);
            elise.ellipse(240, 95, 75, 75).setFill(fill).setStroke(stroke).addTo(model);
            const r = 72;
            const yc = 250;
            let xc = 80;
            const p1 = elise.polygon();
            drawstar(p1, xc, yc, r);
            p1.setWinding(WindingMode.NonZero).setFill(fill).setStroke(stroke).addTo(model);
            const p2 = elise.polygon();
            xc = 240;
            drawstar(p2, xc, yc, r);
            p2.setWinding(WindingMode.EvenOdd).setFill(fill).setStroke(stroke).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'modelfill2',
        title: 'Model Fill 2',
        description: 'Tests embedded model filled path and text elements.',
        configure: (viewer) => {
            const model = defaultModel();
            viewer.background = 'grid';
            const stroke = '0.5;DarkGreen';
            const m1 = elise.model(32, 32);
            m1.setFill('0.5;Green');
            m1.basePath = model.basePath;
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 0, 0, 32, 32).addTo(m1);
            elise.ellipse(16, 16, 16, 16).setFill('0.3;White').addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            const fill = 'model(m1)';
            const p = elise.path();
            p.commands = yinyang;
            p.setFill(fill).setStroke(stroke).scale(1, 1).translate(78, 10).addTo(model);
            elise
                .text(loremipsum.substr(0, 55), 10, 160, 300, 160)
                .setAlignment('center,middle')
                .setTypeface('Coda Caption')
                .setTypesize(32)
                .setFill(fill)
                .setStroke(stroke)
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangletranslate',
        title: 'Rectangle Translate',
        description: 'Tests translate transform applied to rectangle element.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(60, 60, 160, 160).setStroke('White,3').addTo(model);
            elise.rectangle(60, 60, 160, 160).setStroke('Gold,3').setTransform('translate(40,40)').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectanglescale',
        title: 'Rectangle Scale',
        description: 'Tests scale transforms applied to rectangle element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(100, 100, 80, 80).setStroke('Gold').setTransform('scale(2)').addTo(model);
            elise.rectangle(100, 100, 80, 80).setStroke('Blue').setTransform('scale(2(40,40))').addTo(model);
            elise.rectangle(100, 100, 80, 80).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectanglerotate',
        title: 'Rectangle Rotate',
        description: 'Tests rotate transforms applied to rectangle element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(120, 100, 120, 120).setStroke('Gold,3').setTransform('rotate(45)').addTo(model);
            elise.rectangle(120, 100, 120, 120).setStroke('Blue,3').setTransform('rotate(45(60,60))').addTo(model);
            elise.rectangle(120, 100, 120, 120).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangleskewx',
        title: 'Rectangle Skew X',
        description: 'Tests horizontal skew transforms applied to rectangle element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(80, 100, 120, 120).setStroke('Gold,3').setTransform('skew(30,0)').addTo(model);
            elise.rectangle(80, 100, 120, 120).setStroke('Blue,3').setTransform('skew(30,0(60,60))').addTo(model);
            elise.rectangle(80, 100, 120, 120).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectangleskewy',
        title: 'Rectangle Skew Y',
        description: 'Tests vertical skew transforms applied to rectangle element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.rectangle(100, 100, 120, 120).setStroke('Gold,3').setTransform('skew(0,30)').addTo(model);
            elise.rectangle(100, 100, 120, 120).setStroke('Blue,3').setTransform('skew(0,30(60,60))').addTo(model);
            elise.rectangle(100, 100, 120, 120).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'rectanglematrix',
        title: 'Rectangle Matrix',
        description: 'Tests matrix transforms applied to rectangle element.',
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
        id: 'ellipsetranslate',
        title: 'Ellipse Translate',
        description: 'Tests translate transform applied to ellipse element.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(140, 140, 120, 60).setStroke('Gold,3').setTransform('translate(40,40)').addTo(model);
            elise.ellipse(140, 140, 120, 60).setStroke('White,3').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipsescale',
        title: 'Ellipse Scale',
        description: 'Tests scale transforms applied to ellipse element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(140, 140, 50, 25).setStroke('Gold').setTransform('scale(2)').addTo(model);
            elise.ellipse(140, 140, 50, 25).setStroke('Blue').setTransform('scale(2(50,25))').addTo(model);
            elise.ellipse(140, 140, 50, 25).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipserotate',
        title: 'Ellipse Rotate',
        description: 'Tests rotate transforms applied to ellipse element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(190, 140, 120, 60).setStroke('Gold,2').setTransform('rotate(45)').addTo(model);
            elise.ellipse(190, 140, 120, 60).setStroke('Blue,2').setTransform('rotate(45(120,60))').addTo(model);
            elise.ellipse(190, 140, 120, 60).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipseskewx',
        title: 'Ellipse Skew X',
        description: 'Tests horizontal skew transforms applied to ellipse element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(140, 160, 100, 100).setStroke('Gold,2').setTransform('skew(30,0)').addTo(model);
            elise.ellipse(140, 160, 100, 100).setStroke('Blue,2').setTransform('skew(30,0(100,100))').addTo(model);
            elise.ellipse(140, 160, 100, 100).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipseskewy',
        title: 'Ellipse Skew Y Transform',
        description: 'Tests vertical skew transforms applied to ellipse element relative to origin and center.',
        configure: (viewer) => {
            const model = defaultModel();
            elise.ellipse(160, 140, 100, 100).setStroke('Gold,2').setTransform('skew(0,30)').addTo(model);
            elise.ellipse(160, 140, 100, 100).setStroke('Blue,2').setTransform('skew(0,30(100,100))').addTo(model);
            elise.ellipse(160, 140, 100, 100).setStroke('White,2').addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'ellipsematrix',
        title: 'Ellipse Matrix Transform',
        description: 'Tests matrix transforms applied to ellipse element.',
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
        id: 'polylinetranslate',
        title: 'Polyline Translate',
        description: 'Tests translate transform applied to polyline element.',
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
        id: 'polylinescale',
        title: 'Polyline Scale',
        description: 'Tests scale transforms applied to polyline element.',
        configure: (viewer) => {
            const model = defaultModel();
            const radius = 50;
            const xc = 140;
            const yc = 140;
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White').addTo(model);
            const p2 = elise.polyline();
            drawstar(p2, xc, yc, radius);
            p2.setStroke('Gold').setTransform('scale(2)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.polyline();
            drawstar(p3, xc, yc, radius);
            p3
                .setStroke('Blue')
                .setTransform('scale(2(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'polylinerotate',
        title: 'Polyline Rotate',
        description: 'Tests rotate transforms applied to polyline element.',
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
            p3
                .setStroke('Blue,2')
                .setTransform('rotate(45(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polylineskewx',
        title: 'Polyline Skew X',
        description: 'Tests horizontal skew transforms applied to polyline element.',
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
            p3
                .setStroke('Blue,2')
                .setTransform('skew(30,0(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,1').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polylineskewy',
        title: 'Polyline Skew Y',
        description: 'Tests vertical skew transforms applied to polyline element.',
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
            p3
                .setStroke('Blue,2')
                .setTransform('skew(0,30(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            p3.getBounds();
            const p1 = elise.polyline();
            drawstar(p1, xc, yc, radius);
            p1.setStroke('White,1').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polylinematrix',
        title: 'Polyline Matrix',
        description: 'Tests matrix transforms applied to polyline element.',
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
                .setTransform('matrix(-1,0,0,1,0,0(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
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
        id: 'polygontranslate',
        title: 'Polygon Translate',
        description: 'Tests translate transform applied to polygon element.',
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
        id: 'polygonscale',
        title: 'Polygon Scale',
        description: 'Tests scale transforms applied to polygon element.',
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
                .setTransform('scale(2(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygonrotate',
        title: 'Polygon Rotate',
        description: 'Tests rotate transforms applied to polygon element.',
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
                .setTransform('rotate(45(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'polygonskewx',
        title: 'Polygon Skew X',
        description: 'Tests horizontal skew transforms applied to polygon element.',
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
                .setTransform('skew(30,0(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
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
        id: 'polygonskewy',
        title: 'Polygon Skew Y',
        description: 'Tests vertical skew transforms applied to polygon element.',
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
        id: 'polygonmatrix',
        title: 'Polygon Matrix',
        description: 'Tests matrix transforms applied to polygon element.',
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
                .setFill('0.4;White')
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
                .setTransform('matrix(-1,0,0,1,0,0(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
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
        id: 'pathtranslate',
        title: 'Path Translate',
        description: 'Tests translate transform applied to path element.',
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
        id: 'pathscale',
        title: 'Path Scale',
        description: 'Tests scale transforms applied to path element.',
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
        id: 'pathrotate',
        title: 'Path Rotate',
        description: 'Tests rotate transforms applied to path element.',
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
                .setTransform('rotate(45(' + Math.round(b.width / 2) + ',' + Math.round(b.height / 2) + '))')
                .addTo(model);
            p3.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'pathskewx',
        title: 'Path Skew X',
        description: 'Tests horizontal skew transforms applied to path element.',
        configure: (viewer) => {
            const model = defaultModel();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(60, 80);
            p2.setWinding(WindingMode.EvenOdd).setStroke('Gold').setFill('0.4;Gold')
                .setTransform('skew(30,0)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(60, 80);
            p3.setWinding(WindingMode.EvenOdd).setStroke('Blue').setFill('0.4;Blue')
                .setTransform('skew(30,0(' + b.width / 2 + ',' + b.height / 2 + '))').addTo(model);
            p3.getBounds();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(60, 80);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White')
                .setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'pathskewy',
        title: 'Path Skew Y',
        description: 'Tests vertical skew transforms applied to path element.',
        configure: (viewer) => {
            const model = defaultModel();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(80, 60);
            p2.setWinding(WindingMode.EvenOdd).setStroke('Gold').setFill('0.4;Gold')
                .setTransform('skew(0,30)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(80, 60);
            p3.setWinding(WindingMode.EvenOdd).setStroke('Blue').setFill('0.4;Blue')
                .setTransform('skew(0,30(' + b.width / 2 + ',' + b.height / 2 + '))').addTo(model);
            p3.getBounds();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(80, 60);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White')
                .setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'pathmatrix',
        title: 'Path Matrix',
        description: 'Tests matrix transforms applied to path element.',
        configure: (viewer) => {
            const model = defaultModel();
            const p2 = elise.path();
            p2.commands = yinyang;
            p2.translate(154, 60);
            p2.setWinding(WindingMode.EvenOdd).setStroke('Gold')
                .setFill('0.4;Gold').setFill('0.4;Gold')
                .setTransform('matrix(-1,0,0,1,0,0)').addTo(model);
            const b = p2.getBounds();
            const p3 = elise.path();
            p3.commands = yinyang;
            p3.translate(154, 60);
            p3.setWinding(WindingMode.EvenOdd).setStroke('Blue').setFill('0.4;Blue')
                .setTransform('matrix(-1,0,0,1,0,0(' + Math.round(b.width / 2) +
                ',' + Math.round(b.height / 2) + '))').addTo(model);
            p3.getBounds();
            const p1 = elise.path();
            p1.commands = yinyang;
            p1.translate(154, 60);
            p1.setWinding(WindingMode.EvenOdd).setStroke('White')
                .setFill('0.4;White').addTo(model);
            p1.getBounds();
            viewer.model = model;
        }
    },
    {
        id: 'texttranslate',
        title: 'Text Translate',
        description: 'Tests translate transform applied to text element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 40;
            const y = 40;
            const width = 120;
            const height = 120;
            const fontSize = 14;
            const typeface = 'Times New Roman';
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('White')
                .addTo(model);
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('Gold').setTransform('translate(120,120)')
                .addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'textscale',
        title: 'Text Scale',
        description: 'Tests scale transforms applied to text element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 90;
            const y = 90;
            const width = 80;
            const height = 80;
            const fontSize = 14;
            const typeface = 'Times New Roman';
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('White')
                .addTo(model);
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('scale(2)')
                .addTo(model);
            elise.text(loremipsum,
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
        id: 'textrotate',
        title: 'Text Rotate',
        description: 'Tests rotate transforms applied to text element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 120;
            const y = 80;
            const width = 120;
            const height = 120;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('White')
                .addTo(model);
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('rotate(45)')
                .addTo(model);
            elise.text(loremipsum,
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
        id: 'textskewx',
        title: 'Text Skew X',
        description: 'Tests horizontal skew transforms applied to text element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 60;
            const y = 60;
            const width = 160;
            const height = 160;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('White')
                .addTo(model);
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('skew(30,0)')
                .addTo(model);
            elise.text(loremipsum,
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
        id: 'textskewy',
        title: 'Text Skew Y',
        description: 'Tests vertical skew transforms applied to text element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 80;
            const y = 60;
            const width = 160;
            const height = 160;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('White')
                .addTo(model);
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('skew(0,30)')
                .addTo(model);
            elise.text(loremipsum,
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
        id: 'textmatrix',
        title: 'Text Matrix',
        description: 'Tests matrix transform applied to text element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 140;
            const y = 80;
            const width = 120;
            const height = 160;
            const fontSize = 20;
            const typeface = 'Times New Roman';
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('White')
                .addTo(model);
            elise.text(loremipsum,
                 x, y, width, height)
                .setTypesize(fontSize)
                .setTypeface(typeface)
                .setFill('0.8;Gold')
                .setTransform('matrix(-1,0,0,1,0,0)')
                .addTo(model);
            elise.text(loremipsum,
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
        id: 'imagetranslate',
        title: 'Image Translate',
        description: 'Tests translate transform applied to image element.',
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
        id: 'imagescale',
        title: 'Image Scale',
        description: 'Tests scale transforms applied to image element.',
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
        id: 'imagerotate',
        title: 'Image Rotate',
        description: 'Tests rotate transforms applied to image element.',
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
        id: 'imageskewx',
        title: 'Image Skew X',
        description: 'Tests horizontal skew transform applied to image element.',
        configure: (viewer) => {
            const model = defaultModel();
            const x = 70;
            const y = 40;
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
        id: 'imageskewy',
        title: 'Image Skew Y',
        description: 'Tests vertical skew transforms applied to image element.',
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
        id: 'imagematrix',
        title: 'Image Matrix',
        description: 'Tests matrix transform applied to image element.',
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
        id: 'spritetranslate',
        title: 'Sprite Translate',
        description: 'Tests translate transform applied to sprite element.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.toString());
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const s2 = elise.sprite(10, 10, spriteWidth, spriteHeight).addTo(model);
            s2.timer = 'tick';
            const s1 = elise.sprite(10, 10, spriteWidth, spriteHeight).setTransform('translate(120,120)') .addTo(model);
            s1.timer = 'tick';
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            model.controllerAttached.add(function(_model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick',
                    function (_controller: ViewController, element, command, trigger, parameters) {
                        TransitionRenderer.spriteTransitionHandler(
                            _controller, element as SpriteElement, command, trigger, parameters);
                    });
            });
            viewer.model = model;
            viewer.timerEnabled = true;
            viewer.displayModel = false;
        }
    },
    {
        id: 'spritescale',
        title: 'Sprite Scale',
        description: 'Tests scale transform applied to sprite element.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.toString());
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const s2 = elise.sprite(80, 80, spriteWidth, spriteHeight).addTo(model);
            s2.timer = 'tick';
            const s1 = elise.sprite(80, 80, spriteWidth, spriteHeight)
                .setTransform('scale(2(' + Math.round(spriteWidth / 2) + ',' + Math.round(spriteHeight / 2) + '))')
                .addTo(model);
            s1.timer = 'tick';
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);
            model.controllerAttached.add(function(_model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick',
                    function (_controller: ViewController, element, command, trigger, parameters) {
                        TransitionRenderer.spriteTransitionHandler(
                            controller, element as SpriteElement, command, trigger, parameters);
                    });
            });
            viewer.model = model;
            viewer.timerEnabled = true;
            viewer.displayModel = false;
        }
    },
    {
        id: 'spriterotate',
        title: 'Sprite Rotate',
        description: 'Tests rotate transform applied to sprite element.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.toString());
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const s2 = elise.sprite(20, 80, spriteWidth, spriteHeight).addTo(model);
            s2.timer = 'tick';
            const s1 = elise.sprite(120, 80, spriteWidth, spriteHeight)
                .setTransform('rotate(45(' + spriteWidth / 2 + ',' + spriteHeight / 2 + '))')
                .addTo(model);
            s1.timer = 'tick';
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);
            model.controllerAttached.add(function(_model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick',
                    function (_controller: ViewController, element, command, trigger, parameters) {
                        TransitionRenderer.spriteTransitionHandler(
                            controller, element as SpriteElement, command, trigger, parameters);
                    });
            });
            viewer.model = model;
            viewer.timerEnabled = true;
            viewer.displayModel = false;
        }
    },
    {
        id: 'spriteskewx',
        title: 'Sprite Skew X',
        description: 'Tests horizontal skew transform applied to sprite element.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.toString());
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const s2 = elise.sprite(20, 80, spriteWidth, spriteHeight).addTo(model);
            s2.timer = 'tick';
            const s1 = elise.sprite(120, 80, spriteWidth, spriteHeight).setTransform('skew(30,0)').addTo(model);
            s1.timer = 'tick';
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);
            model.controllerAttached.add(function(_model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick',
                    function (_controller: ViewController, element, command, trigger, parameters) {
                        TransitionRenderer.spriteTransitionHandler(
                            controller, element as SpriteElement, command, trigger, parameters);
                    });
                controller.startTimer(0);
            });
            viewer.model = model;
            viewer.timerEnabled = true;
            viewer.displayModel = false;
        }
    },
    {
        id: 'spriteskewy',
        title: 'Sprite Skew Y',
        description: 'Tests vertical skew transform applied to sprite element.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.toString());
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const s2 = elise.sprite(20, 80, spriteWidth, spriteHeight).addTo(model);
            s2.timer = 'tick';
            const s1 = elise.sprite(120, 80, spriteWidth, spriteHeight).setTransform('skew(0,30)').addTo(model);
            s1.timer = 'tick';
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);
            model.controllerAttached.add(function(_model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick',
                    function (_controller: ViewController, element, command, trigger, parameters) {
                        TransitionRenderer.spriteTransitionHandler(
                            controller, element as SpriteElement, command, trigger, parameters);
                    });
            });
            viewer.model = model;
            viewer.timerEnabled = true;
            viewer.displayModel = false;
        }
    },
    {
        id: 'spritematrix',
        title: 'Sprite Matrix',
        description: 'Tests matrix transform applied to sprite element.',
        configure: (viewer) => {
            const model = defaultModel();
            model.setFill(Color.DarkGreen.toString());
            model.setBasePath('./assets/test');
            const sx = 4;
            const sy = 4;
            const frameCount = 16;
            const imageWidth = 600;
            const imageHeight = 600;
            const spriteWidth = imageWidth / sx;
            const spriteHeight = imageHeight / sy;
            elise.bitmapResource('santa', '/sprites/santa.png').addTo(model);
            const s2 = elise.sprite(160, 80, spriteWidth, spriteHeight).addTo(model);
            s2.timer = 'tick';
            const s1 = elise.sprite(160, 80, spriteWidth, spriteHeight).setTransform('matrix(-1,0,0,1,0,0)').addTo(model);
            s1.timer = 'tick';
            s2.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0);
            s1.createSheetFrames('santa', imageWidth, imageHeight, spriteWidth, spriteHeight, frameCount, 0.05, null, 0, 0.5);
            model.controllerAttached.add(function(_model, controller: ViewController) {
                const commandHandler = new ElementCommandHandler();
                commandHandler.attachController(controller);
                commandHandler.addHandler('tick',
                    function (_controller: ViewController, element, command, trigger, parameters) {
                        TransitionRenderer.spriteTransitionHandler(
                            controller, element as SpriteElement, command, trigger, parameters);
                    });
            });
            viewer.model = model;
            viewer.timerEnabled = true;
            viewer.displayModel = false;
        }
    },
    {
        id: 'modelscale',
        title: 'Model Scale',
        description: 'Tests scale transform applied to model element.',
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
        id: 'modelrotate',
        title: 'Model Rotate',
        description: 'Tests rotate transform applied to model element.',
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
        id: 'modelskewx',
        title: 'Model Skew X',
        description: 'Tests horizontal skew transform applied to model element.',
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
        id: 'modelskewy',
        title: 'Model Skew Y',
        description: 'Tests vertical skew transform applied to model element.',
        configure: (viewer) => {
            const model = defaultModel();
            const m1 = elise.model(32, 32).setStroke('0.5;Blue,3');
            m1.basePath = model.basePath;
            elise.ellipse(8, 8, 8, 8).setFill('Gold').addTo(m1);
            const br = elise.bitmapResource('bulb', ':./assets/test/images/bulb.png').addTo(m1);
            elise.image(br, 16, 16, 16, 16).addTo(m1);
            elise.modelResource('m1', m1).addTo(model);
            elise.innerModel('m1', 60, 60, 160, 160).addTo(model);
            elise.innerModel('m1', 60, 60, 160, 160).setTransform('skew(0,30))').setOpacity(0.75).addTo(model);
            elise.innerModel('m1', 60, 60, 160, 160).setTransform('skew(0,30(80,80))').setOpacity(0.75).addTo(model);
            viewer.model = model;
        }
    },
    {
        id: 'modelmatrix',
        title: 'Model Matrix',
        description: 'Tests matrix transform applied to model element.',
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
    }
];

@Injectable({
    providedIn: 'root'
})
export class ViewTestService {
    constructor() {}

    configure(viewer: ISampleViewer, modelId: string) {
        const test = tests.find((s) => s.id === modelId);
        viewer.title = test.title;
        viewer.description = test.description;
        test.configure(viewer);
    }

    tests(): Observable<ViewSample[]> {
        return of(tests);
    }

    test(id: string): Observable<ViewSample> {
        return of(tests.find((s) => s.id === id));
    }
}
