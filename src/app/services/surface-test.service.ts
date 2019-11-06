import { Injectable } from '@angular/core';
import { SurfaceSample } from '../interfaces/surface-sample';
import { Observable, of } from 'rxjs';
import { ISurfaceViewer } from '../interfaces/surface-viewer';
import { Surface } from '../elise/surface/surface';
import { SurfaceButton } from '../elise/surface/surface-button';
import { SurfaceViewController } from '../elise/surface/surface-view-controller';
import { Text } from '../elise/surface/text';
import { ImageLayer } from '../elise/surface/image-layer';
import { HTML } from '../elise/surface/html';
import { Video } from '../elise/surface/video';
import { Animation } from '../elise/surface/animation';
import { HiddenLayer } from '../elise/surface/hidden-layer';
import { RadioStrip, RadioStripSelectionArgs, RadioStripOrientation } from '../elise/surface/radio-strip';
import { Pane } from '../elise/surface/pane';
import { loremipsum } from './loremipsum';
import { Button } from 'protractor';

function multiElementSurface1() {
    const surface = new Surface(480, 360);
    const v1 = Video.create('v1', 0, 0, 480, 360, 'assets/player/video/water-480.mp4').addTo(surface);
    v1.autoPlay = true;
    v1.loop = true;
    v1.nativeControls = false;
    ImageLayer.create('img1', 260, 10, 200, 200, 'assets/player/images/test/animated-spiral.gif', null).addTo(surface);
    HTML.create('h2', 0, 0, 480, 360, 'assets/player/html/html2/default.htm').addTo(surface);
    return surface;
}

function simpleSurface1(backgroundColor: string, foregroundColor: string, clickHandler: () => void ) {
    const surface = new Surface(480, 360);
    surface.backgroundColor = backgroundColor;
    const t = Text.create('t1', 0, 0, 480, 360, 'Click Me', function(text: Text) {
        if(clickHandler) {
            clickHandler();
        }
    }).addTo(surface);
    t.textAlignment = 'Center,Middle';
    t.typeSize = 48;
    t.color = foregroundColor;
    return surface;
}

const tests: SurfaceSample[] = [
    {
        id: 'simplesurface',
        title: 'Simple Surface',
        description: 'Tests simple surface with a normal background image',
        configure: (surfaceViewer) => {
            const surface = new Surface(640, 480);
            surface.normalImageSource = ':assets/player/page1/normal.jpg';
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'surfacebuttons',
        title: 'Surface Buttons',
        description: 'Tests multistate surface buttons. Third button toggles enabled state of fourth button.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.normalImageSource = ':assets/player/page2/normal.png';
            surface.selectedImageSource = ':assets/player/page2/selected.png';
            surface.highlightedImageSource = ':assets/player/page2/highlighted.png';
            surface.disabledImageSource = ':assets/player/page2/disabled.png';
            const buttonClicked = function(button: SurfaceButton) {
                surfaceViewer.log(`Button ${button.id} pressed`);
                if(button.id === 'b3') {
                    const b = button.surface.elementWithId('b4') as SurfaceButton;
                    b.setEnabled(!b.isEnabled);
                }
            };
            SurfaceButton.create('b1', 27, 20, 168, 62, buttonClicked).addTo(surface);
            SurfaceButton.create('b2', 27, 93, 168, 62, buttonClicked).addTo(surface);
            SurfaceButton.create('b3', 27, 164, 168, 62, buttonClicked).addTo(surface);
            SurfaceButton.create('b4', 27, 235, 168, 62, buttonClicked).addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'radiobuttons',
        title: 'Surface Radio Buttons',
        description: 'Tests multistate surface radio buttons.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.normalImageSource = ':assets/player/page3/normal.png';
            surface.selectedImageSource = ':assets/player/page3/selected.png';
            surface.highlightedImageSource = ':assets/player/page3/highlighted.png';
            surface.disabledImageSource = ':assets/player/page3/disabled.png';
            const buttonClicked = function(button: SurfaceButton) {
                surfaceViewer.log(`Button ${button.id} pressed`);
            };
            SurfaceButton.createRadioButton('g1', 'b1', 22, 22, 220, 56, buttonClicked).addTo(surface);
            SurfaceButton.createRadioButton('g1', 'b2', 22, 93, 220, 56, buttonClicked).addTo(surface);
            SurfaceButton.createRadioButton('g1', 'b3', 22, 165, 220, 56, buttonClicked).addTo(surface);
            SurfaceButton.createRadioButton('g1', 'b4', 17, 238, 220, 56, buttonClicked).addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'checkboxes',
        title: 'Check Boxes',
        description: 'Tests multistate surface check boxes.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.normalImageSource = ':assets/player/page4/normal.png';
            surface.selectedImageSource = ':assets/player/page4/selected.png';
            surface.highlightedImageSource = ':assets/player/page4/highlighted.png';
            surface.disabledImageSource = ':assets/player/page4/disabled.png';
            const buttonClicked = function(button: SurfaceButton) {
                surfaceViewer.log(`Checkbox ${button.id} clicked. Now ${button.isSelected ? 'checked' : 'unchecked' }`);
            };
            SurfaceButton.createCheckbox('b1', 22, 22, 220, 56, buttonClicked).addTo(surface);
            SurfaceButton.createCheckbox('b2', 22, 93, 220, 56, buttonClicked).addTo(surface);
            SurfaceButton.createCheckbox('b3', 22, 165, 220, 56, buttonClicked).addTo(surface);
            SurfaceButton.createCheckbox('b4', 17, 238, 220, 56, buttonClicked).addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'textelement',
        title: 'Text Element',
        description: 'Tests surface text element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.backgroundColor = '#f2f2f2';
            const textClicked = function(text: Text) {
                surfaceViewer.log('Text element clicked');
            };
            const t1 = Text.create('t1', 20, 20, 440, 280, loremipsum, textClicked).addTo(surface);
            t1.typeFace = 'Poiret One';
            t1.typeSize = 24;
            t1.color = 'Black';
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'imagelayer',
        title: 'Image Layer',
        description: 'Tests layered image element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.backgroundColor = '#f2f2f2';
            const imageClicked = function(image: ImageLayer) {
                surfaceViewer.log(`Image ${image.id} clicked`);
            };
            ImageLayer.create('img1', 20, 60, 200, 200, 'assets/player/images/test/animated-spiral.gif', imageClicked).addTo(surface);
            ImageLayer.create('img2', 260, 60, 200, 200, 'assets/player/images/test/snowflake.gif', imageClicked).addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'htmllayer',
        title: 'HTML Layer',
        description: 'Tests layered HTML element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 360);
            surface.backgroundColor = '#f2f2f2';
            HTML.create('h1', 0, 0, 480, 360, 'assets/player/html/html2/default.htm').addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'videolayer',
        title: 'Video Layer',
        description: 'Tests layered video element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.backgroundColor = '#f2f2f2';
            const v1 = Video.create('v1', 0, 0, 480, 320, 'assets/player/video/water.mp4').addTo(surface);
            v1.autoPlay = true;
            v1.loop = true;
            v1.nativeControls = false;
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'animation',
        title: 'Animation',
        description: 'Tests layered animation element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(400, 300);
            const transitions = [
                'none', 'fade',
                'pushLeft', 'pushRight', 'pushUp', 'pushDown',
                'wipeLeft', 'wipeRight', 'wipeUp', 'wipeDown',
                'slideLeft', 'slideRight', 'slideUp', 'slideDown',
                'slideLeftDown', 'slideRightDown', 'slideLeftUp', 'slideRightUp',
                'revealLeft', 'revealRight', 'revealUp', 'revealDown',
                'revealLeftDown', 'revealRightDown', 'revealLeftUp', 'revealRightUp',
                'ellipticalIn', 'ellipticalOut', 'rectangularIn', 'rectangularOut',
                'grid', 'expandHorizontal', 'expandVertical',
                'zoomIn', 'zoomOut', 'zoomRotateIn', 'zoomRotateOut',
                'radar'
            ];

            const animationClicked = function(anim: Animation) {
                surfaceViewer.log(`Animation ${anim.id} pressed.`);
                anim.pause();
            };

            const animationFrameAdvance = function(anim: Animation) {
                surfaceViewer.log(`Animation ${anim.id} advanced to frame ${anim.frameIndex}.`);
            };

            const animation = Animation.create('ani1', 0, 0, 400, 300, true,
                animationClicked, 0, animationFrameAdvance).addTo(surface);
            for (let i = 0; i < transitions.length; i++) {
                animation.addFrame(null, ':/assets/test/transitions/400x300/' + transitions[i] + '.jpg',
                    0, 0, 400, 300, 0.5, transitions[i], 1.0, false);
            }

            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'hidden',
        title: 'Hidden Layer',
        description: 'Tests hidden layer element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(400, 300);
            surface.backgroundColor = '#f2f2f2';
            const hiddenClicked = function(hidden: HiddenLayer) {
                surfaceViewer.log(`Hidden layer ${hidden.id} clicked.`);
            };
            HiddenLayer.create('hidden1', 0, 0, 200, 300, hiddenClicked).addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'horizontalradio',
        title: 'Radio Strip (Horizontal)',
        description: 'Tests layered horizontal radio strip.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);

            surface.normalImageSource = ':assets/player/page11/normal.png';
            surface.selectedImageSource = ':assets/player/page11/selected.png';
            surface.highlightedImageSource = ':assets/player/page11/highlighted.png';

            const radioStripSelected = function(args: RadioStripSelectionArgs) {
                surfaceViewer.log(`Item selected: ${args.item.id}`);
            };

            const rs = RadioStrip.create('rs1', 34, 249, 411, 34, 34, 249, 101, 34, radioStripSelected).addTo(surface);
            rs.normalColor = 'White';
            rs.selectedColor = 'Yellow';
            rs.highlightedColor = 'Black';
            rs.typeFace = 'Poiret One';
            rs.typeSize = 16;
            for(let i = 1; i <= 25; i++) {
                rs.addItem('' + i, 'Item ' + i);
            }
            const t1 = Text.create('t1', 189, 40, 193, 33, 'Start', function(text: Text) {
                rs.moveStart();
            }).addTo(surface);
            t1.color = 'White';
            t1.typeSize = 16;
            const t2 = Text.create('t2', 189, 80, 193, 33, 'End', function(text: Text) {
                rs.moveEnd();
            }).addTo(surface);
            const t3 = Text.create('t3', 189, 120, 193, 33, 'Back', function(text: Text) {
                rs.moveBack();
            }).addTo(surface);
            const t4 = Text.create('t4', 189, 160, 193, 33, 'Forward', function(text: Text) {
                rs.moveForward();
            }).addTo(surface);
            t4.color = t3.color = t2.color = t1.color;
            t4.typeSize = t3.typeSize = t2.typeSize = t1.typeSize;

            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'verticalradio',
        title: 'Radio Strip (Vertical)',
        description: 'Tests layered vertical radio strip.',
        configure: (surfaceViewer) => {
            const surface = new Surface(480, 320);
            surface.normalImageSource = ':assets/player/page12/normal.png';
            surface.selectedImageSource = ':assets/player/page12/selected.png';
            surface.highlightedImageSource = ':assets/player/page12/highlighted.png';
            const radioStripSelected = function(args: RadioStripSelectionArgs) {
                surfaceViewer.log(`Item selected: ${args.item.id}`);
            };

            const rs = RadioStrip.create('rs1', 33, 40, 132, 244, 33, 40, 132, 33, radioStripSelected).addTo(surface);
            rs.orientation = RadioStripOrientation.Vertical;
            rs.normalColor = 'White';
            rs.selectedColor = 'Yellow';
            rs.highlightedColor = 'Black';
            rs.typeFace = 'Poiret One';
            rs.typeSize = 16;
            for(let i = 1; i <= 25; i++) {
                rs.addItem('' + i, 'Item ' + i);
            }
            const t1 = Text.create('t1', 189, 40, 193, 33, 'Start', function(text: Text) {
                rs.moveStart();
            }).addTo(surface);
            t1.color = 'White';
            t1.typeSize = 16;
            const t2 = Text.create('t2', 189, 80, 193, 33, 'End', function(text: Text) {
                rs.moveEnd();
            }).addTo(surface);
            const t3 = Text.create('t3', 189, 120, 193, 33, 'Back', function(text: Text) {
                rs.moveBack();
            }).addTo(surface);
            const t4 = Text.create('t4', 189, 160, 193, 33, 'Forward', function(text: Text) {
                rs.moveForward();
            }).addTo(surface);
            t4.color = t3.color = t2.color = t1.color;
            t4.typeSize = t3.typeSize = t2.typeSize = t1.typeSize;

            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'pane',
        title: 'Pane',
        description: 'Tests layered surface pane element.',
        configure: (surfaceViewer) => {
            const surface = new Surface(640, 480);
            surface.backgroundColor = 'White';
            surface.normalImageSource = ':assets/player/images/frame1.png';
            const s2 = new Surface(640, 480);
            s2.normalImageSource = ':assets/player/page1/normal.jpg';
            const p1 = Pane.create('p1', 80, 62, 480, 360, s2).addTo(surface);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'opacity',
        title: 'Surface Opacity',
        description: 'Tests surface opacity.',
        configure: (surfaceViewer) => {

            let timerHandle: NodeJS.Timer;
            let surfaceOpacity = 1;
            let opacityIncrement = 0.02;

            function timerHandler() {
                surfaceOpacity += opacityIncrement;
                if(surfaceOpacity > 1) {
                    surfaceOpacity = 1;
                    opacityIncrement *= -1;
                }
                else if(surfaceOpacity < 0) {
                    surfaceOpacity = 0;
                    opacityIncrement *= -1;
                }
                surface.setOpacity(surfaceOpacity);
            }

            function surfaceInitialized(controller: SurfaceViewController) {
                if(timerHandle) {
                    clearInterval(timerHandle);
                }
                timerHandle = setInterval(timerHandler, 50);
            }

            const surface = multiElementSurface1();
            surface.initialized.add(surfaceInitialized);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'translatex',
        title: 'Translate X',
        description: 'Tests surface x translation.',
        configure: (surfaceViewer) => {

            let timerHandle: NodeJS.Timer;
            let surfaceX = 0;
            let xIncrement = 2;

            function timerHandler() {
                surfaceX += xIncrement;
                if(surfaceX > 480) {
                    surfaceX = 480;
                    xIncrement *= -1;
                }
                else if(surfaceX < -480) {
                    surfaceX = -480;
                    xIncrement *= -1;
                }
                surface.setTranslateX(surfaceX);
            }

            function surfaceInitialized(controller: SurfaceViewController) {
                if(timerHandle) {
                    clearInterval(timerHandle);
                }
                timerHandle = setInterval(timerHandler, 15);
            }

            const surface = multiElementSurface1();
            surface.initialized.add(surfaceInitialized);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'translatey',
        title: 'Translate Y',
        description: 'Tests surface y translation.',
        configure: (surfaceViewer) => {

            let timerHandle: NodeJS.Timer;
            let surfaceY = 0;
            let yIncrement = 2;

            function timerHandler() {
                surfaceY += yIncrement;
                if(surfaceY > 360) {
                    surfaceY = 360;
                    yIncrement *= -1;
                }
                else if(surfaceY < -360) {
                    surfaceY = -360;
                    yIncrement *= -1;
                }
                surface.setTranslateY(surfaceY);
            }

            function surfaceInitialized(controller: SurfaceViewController) {
                if(timerHandle) {
                    clearInterval(timerHandle);
                }
                timerHandle = setInterval(timerHandler, 15);
            }

            const surface = multiElementSurface1();
            surface.initialized.add(surfaceInitialized);
            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'swap',
        title: 'Swap Surfaces',
        description: 'Tests pane surface replacement.',
        configure: (surfaceViewer) => {

            let lastColor = 'Red';
            let pane: Pane;

            const surface = new Surface(640, 480);
            surface.normalImageSource = ':assets/player/images/frame1.png';

            function swapSurface() {
                const paneSurface2 = new Surface(480, 360);
                if(lastColor === 'Red') {
                    lastColor = 'Green';
                }
                else {
                    lastColor = 'Red';
                }
                paneSurface2.backgroundColor = lastColor;
                const t2 = Text.create('t1', 0, 0, 480, 360, 'Click Me', function(text: Text) {
                    swapSurface();
                }).addTo(paneSurface2);
                t2.textAlignment = 'Center,Middle';
                t2.typeSize = 48;
                pane.replaceSurface(paneSurface2, function() {
                    surfaceViewer.log(`Surface replaced. Color: ${lastColor} `);
                });
            }

            const paneSurface = new Surface(480, 360);
            paneSurface.backgroundColor = lastColor;
            const t = Text.create('t1', 0, 0, 480, 360, 'Click Me', function(text: Text) {
                swapSurface();
            }).addTo(paneSurface);
            t.textAlignment = 'Center,Middle';
            t.typeSize = 48;
            pane = Pane.create('p1', 80, 62, 480, 360, paneSurface).addTo(surface);

            surfaceViewer.surface = surface;
        }
    },
    {
        id: 'transition',
        title: 'Surface Transition',
        description: 'Tests surface transitions.',
        configure: (surfaceViewer: ISurfaceViewer) => {
            const surface = new Surface(640, 480);
            let pane: Pane;
            let tick = false;

            function swapSurface() {
                const color = 'Green';
                let paneSurface2: Surface = null;
                if(tick) {
                    tick = false;
                    paneSurface2 = simpleSurface1(color, 'Black', function() {
                        swapSurface();
                    });
                }
                else {
                    paneSurface2 = multiElementSurface1();
                    tick = true;
                }
                pane.replaceSurface(paneSurface2, function() {
                    surfaceViewer.log(`Transition ${surfaceViewer.transition} complete.`);
                }, surfaceViewer.transition, 1.5);
            }

            function buttonClicked() {
                swapSurface();
            }

            surface.backgroundColor = 'White';
            surface.normalImageSource = ':assets/player/images/frame2-normal.png';
            surface.selectedImageSource = ':assets/player/images/frame2-down.png';
            SurfaceButton.create('b1', 250, 423, 158, 46, buttonClicked).addTo(surface);
            const paneSurface = simpleSurface1('Green', 'Black', function() {
                swapSurface();
            });
            pane = Pane.create('p1', 81, 41, 480, 360, paneSurface).addTo(surface);

            surfaceViewer.surface = surface;
            surfaceViewer.transitionDisplay = true;
        }
    }
];

@Injectable({
  providedIn: 'root'
})
export class SurfaceTestService {

  constructor() { }

  configure(viewer: ISurfaceViewer, modelId: string) {
    const test = tests.find((s) => s.id === modelId);
    viewer.title = test.title;
    viewer.description = test.description;
    test.configure(viewer);
    }

    tests(): Observable<SurfaceSample[]> {
        return of(tests);
    }

    test(id: string): Observable<SurfaceSample> {
        return of(tests.find((s) => s.id === id));
    }
}
