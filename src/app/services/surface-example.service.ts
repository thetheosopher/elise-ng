import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SurfaceSample } from '../interfaces/surface-sample';
import { ISurfaceViewer } from '../interfaces/surface-viewer';
import { Surface } from 'elise-graphics/lib/surface/surface';
import { SurfaceTextElement } from 'elise-graphics/lib/surface/surface-text-element';
import { SurfaceImageLayer } from 'elise-graphics/lib/surface/surface-image-layer';
import { SurfaceAnimationLayer } from 'elise-graphics/lib/surface/surface-animation-layer';
import { SurfaceVideoLayer } from 'elise-graphics/lib/surface/surface-video-layer';
import { SurfaceHiddenLayer } from 'elise-graphics/lib/surface/surface-hidden-layer';
import { SurfaceButtonElement } from 'elise-graphics/lib/surface/surface-button-element';
import { SurfaceRadioStrip } from 'elise-graphics/lib/surface/surface-radio-strip';
import { SurfaceRadioStripSelectionArgs } from 'elise-graphics/lib/surface/surface-radio-strip-selection-args';
import { RadioStripOrientation } from 'elise-graphics/lib/surface/surface-radio-strip';
import { SurfacePane } from 'elise-graphics/lib/surface/surface-pane';

// ---------------------------------------------------------------------------
//  Asset paths
// ---------------------------------------------------------------------------

const CARS    = 'assets/examples/surface/cars';
const DEST    = 'assets/examples/surface/destinations';
const VINTAGE = 'assets/examples/surface/vintage';
const NASA    = 'assets/examples/surface/nasa';
const PAGE2   = 'assets/player/page2';
const PAGE3   = 'assets/player/page3';
const PAGE4   = 'assets/player/page4';
const PAGE11  = 'assets/player/page11';
const PAGE12  = 'assets/player/page12';
const VIDEO   = 'assets/player/video';

// ---------------------------------------------------------------------------
//  Shared helpers
// ---------------------------------------------------------------------------

type TextPanel = SurfaceTextElement & { background?: string; border?: string };
const noop = () => undefined;
const noopText = (_t?: SurfaceTextElement) => undefined;
const noopAnim = (_a?: SurfaceAnimationLayer) => undefined;

function addText(
    s: Surface, id: string,
    l: number, t: number, w: number, h: number,
    content: string,
    click: (text?: SurfaceTextElement) => void,
    o?: {
        align?: string; color?: string; face?: string;
        size?: number; style?: string; pad?: number;
        bg?: string; border?: string;
    }
): SurfaceTextElement {
    const el = SurfaceTextElement.create(id, l, t, w, h, content, click).addTo(s);
    el.textAlignment = o?.align  ?? 'Left,Top';
    el.color         = o?.color  ?? 'White';
    el.typeFace      = o?.face   ?? 'Poiret One';
    el.typeSize      = o?.size   ?? 18;
    el.typeStyle     = o?.style  ?? '';
    el.padding       = o?.pad    ?? 0;
    const p = el as TextPanel;
    if (o?.bg)     { p.background = o.bg; }
    if (o?.border) { p.border = o.border; }
    return el;
}

function btn(
    s: Surface, id: string,
    l: number, t: number, w: number, h: number,
    label: string, click: () => void
): SurfaceTextElement {
    return addText(s, id, l, t, w, h, label, () => click(), {
        align: 'Center,Middle', size: 20, pad: 10,
        bg: 'rgba(6,24,38,0.72)', border: 'rgba(255,255,255,0.35)'
    });
}

function btn2(
    s: Surface, id: string,
    l: number, t: number, w: number, h: number,
    label: string, click: () => void
): SurfaceTextElement {
    return addText(s, id, l, t, w, h, label, () => click(), {
        align: 'Center,Middle', size: 16, pad: 8,
        bg: 'rgba(15,23,42,0.58)', border: 'rgba(255,255,255,0.24)'
    });
}

function setBg(s: Surface, path: string): void {
    s.normalImageSource = `:${path}`;
}

// ===================================================================
//  EXAMPLE 1 – World Destinations Kiosk
//  Features: RadioStrip (horizontal), HiddenLayer, AnimationLayer,
//            ImageLayer, Pane + transitions, Text
// ===================================================================

interface Destination {
    id: string; name: string; image: string; blurb: string;
}

const destinations: Destination[] = [
    { id: 'tropical',  name: 'Tropical Paradise', image: `${DEST}/tropical.jpg`,        blurb: 'Crystal waters and white sand stretching to the horizon.' },
    { id: 'coast',     name: 'Rocky Coast',       image: `${DEST}/rocky-coast.jpg`,     blurb: 'Ancient rock formations meet the golden light of dusk.' },
    { id: 'winter',    name: 'Winter Forest',     image: `${DEST}/winter-forest.jpg`,   blurb: 'A frost-covered path through a silent winter wonderland.' },
    { id: 'pier',      name: 'Ocean Pier',        image: `${DEST}/ocean-pier.jpg`,      blurb: 'A weathered boardwalk stretching over calm blue waters.' },
    { id: 'cliffs',    name: 'Sunset Cliffs',     image: `${DEST}/sunset-cliffs.jpg`,   blurb: 'Golden-hour cliffs and open water under a sky on fire.' },
    { id: 'vision',    name: 'Artistic Vision',   image: `${DEST}/artistic-vision.jpg`, blurb: 'A striking close-up study in light and color.' },
    { id: 'cove',      name: 'Hidden Cove',       image: `${DEST}/hidden-cove.jpg`,     blurb: 'A secret inlet framed by dramatic cliff walls.' },
    { id: 'valley',    name: 'Mountain Valley',   image: `${DEST}/mountain-valley.jpg`, blurb: 'Cut by ancient rivers, ringed by snow-capped peaks.' },
    { id: 'dusk',      name: 'Harbour at Dusk',   image: `${DEST}/harbour-dusk.jpg`,    blurb: 'Boats rocking gently as the harbour lights come on.' },
    { id: 'rapids',    name: 'River Rapids',      image: `${DEST}/river-rapids.jpg`,    blurb: 'White-water cascading through a narrow gorge.' },
    { id: 'dawn',      name: 'Coastal Dawn',      image: `${DEST}/coastal-dawn.jpg`,    blurb: 'First light breaking over a quiet seaside shoreline.' },
    { id: 'mesa',      name: 'Desert Mesa',       image: `${DEST}/desert-mesa.jpg`,     blurb: 'A vast sandstone plateau under endless sky.' },
];

function destHome(goGallery: () => void, goReel: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, destinations[0].image);
    addText(s, 'dh-kicker', 200, 40, 240, 22, 'Surface Example', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(6,14,28,0.50)' });
    addText(s, 'dh-title', 80, 72, 480, 60, 'World Destinations', noopText,
        { align: 'Center,Middle', size: 42, bg: 'rgba(6,14,28,0.60)' });
    addText(s, 'dh-sub', 100, 148, 440, 60,
        'An interactive travel kiosk with radio-strip navigation, hidden-layer hotspots, and an auto-play animation reel across 12 scenic destinations.',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 14, pad: 10, bg: 'rgba(6,14,28,0.52)' });
    btn(s, 'dh-browse', 160, 260, 150, 40, 'Browse Gallery', goGallery);
    btn(s, 'dh-tour',   330, 260, 150, 40, 'Auto Tour',      goReel);
    addText(s, 'dh-foot', 100, 380, 440, 50,
        'Features: SurfaceRadioStrip · SurfaceHiddenLayer · SurfaceAnimationLayer · SurfaceImageLayer · SurfacePane transitions',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 11, pad: 8, bg: 'rgba(6,14,28,0.44)' });
    return s;
}

function destGallery(
    viewer: ISurfaceViewer, goHome: () => void,
    goDetail: (i: number) => void, goReel: () => void
): Surface {
    const s = new Surface(640, 480);
    setBg(s, destinations[0].image);

    addText(s, 'dg-title', 20, 14, 380, 32, 'Gallery – Select a Destination', noopText,
        { align: 'Left,Middle', size: 22, bg: 'rgba(4,14,28,0.58)' });

    // Hidden layer left/right nav zones
    SurfaceHiddenLayer.create('dg-prev', 0, 56, 60, 360, () => {
        viewer.log('Hidden nav ◀ (left edge hotspot)');
    }).addTo(s);
    SurfaceHiddenLayer.create('dg-next', 580, 56, 60, 360, () => {
        viewer.log('Hidden nav ▶ (right edge hotspot)');
    }).addTo(s);

    // 6 image cards
    const cols = 3; const cw = 186; const ch = 120;
    const sx = 28; const sy = 56; const gx = 14; const gy = 14;
    destinations.slice(0, 6).forEach((d, i) => {
        const col = i % cols; const row = Math.floor(i / cols);
        const x = sx + col * (cw + gx); const y = sy + row * (ch + gy);
        SurfaceImageLayer.create(`dg-img-${i}`, x, y, cw, ch, d.image, () => goDetail(i)).addTo(s);
        addText(s, `dg-lbl-${i}`, x + 4, y + ch - 26, cw - 8, 22, d.name, () => goDetail(i),
            { align: 'Left,Middle', size: 12, face: 'sans-serif', pad: 4, bg: 'rgba(4,10,22,0.64)' });
    });

    const stripSurface = new Surface(500, 34);
    stripSurface.normalImageSource = `:${PAGE11}/normal.png`;
    stripSurface.selectedImageSource = `:${PAGE11}/selected.png`;
    stripSurface.highlightedImageSource = `:${PAGE11}/highlighted.png`;

    // Horizontal radio strip (bottom)
    const rs = SurfaceRadioStrip.create('dg-strip', 0, 0, 500, 34, 0, 0, 110, 34,
        (args: SurfaceRadioStripSelectionArgs | undefined) => {
            if (args?.item) {
                const idx = destinations.findIndex(d => d.id === args.item.id);
                if (idx >= 0) {
                    viewer.log(`Strip: ${destinations[idx].name}`);
                    goDetail(idx);
                }
            }
        }).addTo(stripSurface);
    rs.normalColor = 'Black';
    rs.selectedColor = '#2563eb';
    rs.highlightedColor = '#2563eb';
    rs.typeFace = 'sans-serif';
    rs.typeSize = 14;
    destinations.forEach(d => rs.addItem(d.id, d.name));
    SurfacePane.create('dg-strip-pane', 20, 432, 500, 34, stripSurface).addTo(s);

    btn2(s, 'dg-back', 530, 436, 46, 28, '◀', () => rs.moveBack());
    btn2(s, 'dg-fwd',  582, 436, 46, 28, '▶', () => rs.moveForward());
    btn2(s, 'dg-home', 20, 400, 100, 28, 'Home', goHome);
    btn2(s, 'dg-reel', 540, 400, 80, 28, 'Tour', goReel);
    return s;
}

function destDetail(d: Destination, idx: number, goGallery: () => void, goReel: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, d.image);
    addText(s, 'dd-name', 28, 30, 400, 42, d.name, noopText,
        { align: 'Left,Middle', size: 32, bg: 'rgba(4,14,28,0.60)' });
    addText(s, 'dd-blurb', 28, 80, 500, 50, d.blurb, noopText,
        { align: 'Left,Top', face: 'sans-serif', size: 15, pad: 10, bg: 'rgba(4,14,28,0.52)' });
    addText(s, 'dd-meta', 28, 310, 584, 110,
        `Destination ${idx + 1} of ${destinations.length}. This detail screen demonstrates a full-bleed hero image with overlaid text. ` +
        'The hidden navigation zones on the gallery page (left and right edges) are SurfaceHiddenLayer elements – click them to trigger invisible hotspots.',
        noopText, { align: 'Left,Top', face: 'sans-serif', size: 13, pad: 12, bg: 'rgba(4,10,22,0.66)', border: 'rgba(255,255,255,0.18)' });
    btn2(s, 'dd-gallery', 28, 434, 130, 34, 'Back to Gallery', goGallery);
    btn(s, 'dd-reel', 480, 434, 132, 34, 'Play Reel', goReel);
    return s;
}

function destReel(goHome: () => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#040a14';
    addText(s, 'dr-title', 24, 14, 592, 32, 'Auto Tour – World Destinations', noopText,
        { align: 'Center,Middle', size: 24, bg: 'rgba(4,14,28,0.54)' });
    addText(s, 'dr-sub', 100, 48, 440, 22, 'Self-running animation reel using SurfaceAnimationLayer', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(4,14,28,0.44)' });
    const trans = ['fade', 'zoomIn', 'slideLeft', 'ellipticalIn', 'wipeLeft',
                   'pushUp', 'rectangularIn', 'slideRight', 'revealDown', 'expandVertical', 'grid', 'radar'];
    const anim = SurfaceAnimationLayer.create('dr-anim', 32, 78, 576, 350, true, noopAnim, 0, noopAnim).addTo(s);
    destinations.forEach((d, i) => {
        anim.addFrame(`f-${d.id}`, `:${d.image}`, 0, 0, 576, 350, 3.0, trans[i % trans.length], 0.9, false);
    });
    btn2(s, 'dr-home', 24, 440, 120, 30, 'Back Home', goHome);
    return s;
}

function configureDestinations(viewer: ISurfaceViewer): void {
    const shell = new Surface(640, 480);
    shell.backgroundColor = '#030712';
    let pane!: SurfacePane;
    const goHome    = () => pane.replaceSurface(destHome(goGallery, goReel),         () => viewer.log('Home'),    'fade', 0.6);
    const goGallery = () => pane.replaceSurface(destGallery(viewer, goHome, goDetail, goReel), () => viewer.log('Gallery'), 'slideLeft', 0.6);
    const goDetail  = (i: number) => pane.replaceSurface(destDetail(destinations[i], i, goGallery, goReel), () => viewer.log(destinations[i].name), 'wipeLeft', 0.7);
    const goReel    = () => pane.replaceSurface(destReel(goHome), () => viewer.log('Auto tour'), 'zoomIn', 0.8);
    pane = SurfacePane.create('dest-pane', 0, 0, 640, 480, destHome(goGallery, goReel)).addTo(shell);
    viewer.surface = shell;
}

// ===================================================================
//  EXAMPLE 2 – Space Science Console
//  Features: RadioButtons (page3), Checkboxes (page4),
//            RadioStrip (vertical), Pane, Text, ImageLayer
// ===================================================================

interface SciTopic { id: string; name: string; image: string; body: string; frames: string[]; }

const sciTopics: SciTopic[] = [
    { id: 'earth', name: 'Earth Observation', image: `${NASA}/earth-view.jpg`,
      body: 'Monitoring our planet from orbit reveals patterns invisible from the ground – ocean currents, vegetation cycles, and atmospheric dynamics captured by a fleet of Earth-observing satellites.',
      frames: [`${NASA}/earth-view.jpg`, `${NASA}/galaxy-wide.jpg`, `${NASA}/nebula.jpg`] },
    { id: 'mars', name: 'Mars Exploration', image: `${NASA}/perseverance-selfie.jpg`,
      body: 'After a seven-month cruise, Perseverance touched down in Jezero Crater to search for signs of ancient microbial life and collect rock samples for future return to Earth.',
      frames: [`${NASA}/perseverance-selfie.jpg`, `${NASA}/moon-surface.jpg`, `${NASA}/star-field.jpg`] },
    { id: 'aurora', name: 'Aurora Science', image: `${NASA}/aurora.jpg`,
      body: 'Aurorae form when charged solar-wind particles funnel along magnetic field lines and excite atmospheric gases. Jupiter, Saturn, and even Ganymede host their own spectacular light shows.',
      frames: [`${NASA}/aurora.jpg`, `${NASA}/jupiter-aurora.jpg`, `${NASA}/rocket-launch.jpg`] },
    { id: 'deep', name: 'Deep Space', image: `${NASA}/galaxy-wide.jpg`,
      body: 'Beyond the asteroid belt lie the gas and ice giants. Juno orbits Jupiter capturing unprecedented views of its polar aurorae, while New Horizons revealed Pluto\'s complex geology.',
      frames: [`${NASA}/galaxy-wide.jpg`, `${NASA}/nebula.jpg`, `${NASA}/star-field.jpg`] },
];

function sciHome(goTopics: () => void, goBrowse: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, `${NASA}/galaxy-wide.jpg`);
    addText(s, 'sh-kicker', 200, 36, 240, 22, 'Surface Example', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(5,12,20,0.52)' });
    addText(s, 'sh-title', 70, 68, 500, 64, 'Space Science Console', noopText,
        { align: 'Center,Middle', size: 40, bg: 'rgba(5,12,20,0.62)' });
    addText(s, 'sh-sub', 90, 148, 460, 64,
        'Radio buttons for topic selection, checkboxes for data-layer toggles, a vertical radio strip for browsing, and NASA / space imagery throughout.',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 14, pad: 10, bg: 'rgba(5,12,20,0.56)' });
    btn(s, 'sh-topics', 140, 264, 170, 40, 'Select Topic', goTopics);
    btn(s, 'sh-browse', 330, 264, 170, 40, 'Browse Topics', goBrowse);
    addText(s, 'sh-foot', 80, 380, 480, 48,
        'Features: SurfaceButtonElement.createRadioButton · createCheckbox · SurfaceRadioStrip (vertical) · SurfacePane · SurfaceImageLayer',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 11, pad: 8, bg: 'rgba(5,12,20,0.44)' });
    return s;
}

function sciTopicSelect(viewer: ISurfaceViewer, goHome: () => void, goDetail: (i: number) => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#0a1628';
    addText(s, 'st-hdr', 80, 16, 480, 36, 'Select a Research Topic', noopText,
        { align: 'Center,Middle', size: 28, bg: 'rgba(6,14,28,0.54)' });
    addText(s, 'st-hint', 80, 56, 480, 22,
        'Choose one topic using the radio buttons below. Each option fires a radio-group callback.',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(6,14,28,0.44)' });

    const rbSurface = new Surface(480, 320);
    rbSurface.normalImageSource      = `:${PAGE3}/normal.png`;
    rbSurface.selectedImageSource    = `:${PAGE3}/selected.png`;
    rbSurface.highlightedImageSource = `:${PAGE3}/highlighted.png`;
    rbSurface.disabledImageSource    = `:${PAGE3}/disabled.png`;

    const handler = (button?: SurfaceButtonElement) => {
        if (!button) { return; }
        const idx = parseInt(button.id.replace('rb', '')) - 1;
        viewer.log(`Radio: ${sciTopics[idx].name}`);
        goDetail(idx);
    };
    SurfaceButtonElement.createRadioButton('topics', 'rb1', 22, 22,  220, 56, handler).addTo(rbSurface);
    SurfaceButtonElement.createRadioButton('topics', 'rb2', 22, 93,  220, 56, handler).addTo(rbSurface);
    SurfaceButtonElement.createRadioButton('topics', 'rb3', 22, 165, 220, 56, handler).addTo(rbSurface);
    SurfaceButtonElement.createRadioButton('topics', 'rb4', 17, 238, 220, 56, handler).addTo(rbSurface);

    sciTopics.forEach((t, i) => {
        addText(rbSurface, `rbl-${i}`, 250, 30 + i * 71, 220, 48,
            t.name + '\n' + t.body.substring(0, 60) + '…', noopText,
            { align: 'Left,Top', face: 'sans-serif', size: 11, color: '#444', pad: 4 });
    });
    SurfacePane.create('rb-pane', 80, 86, 480, 320, rbSurface).addTo(s);
    btn2(s, 'st-back', 80, 430, 120, 32, 'Back Home', goHome);
    return s;
}

function sciDetail(topic: SciTopic, goTopics: () => void, goCb: () => void, goReel: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, topic.image);
    addText(s, 'sd-title', 28, 28, 360, 44, topic.name, noopText,
        { align: 'Left,Middle', size: 30, bg: 'rgba(5,12,20,0.62)' });
    addText(s, 'sd-body', 28, 290, 584, 120, topic.body, noopText,
        { align: 'Left,Top', face: 'sans-serif', size: 14, pad: 12, bg: 'rgba(4,10,22,0.70)', border: 'rgba(255,255,255,0.18)' });
    btn(s, 'sd-reel', 380, 34, 130, 38, 'Play Reel', goReel);
    btn2(s, 'sd-data', 524, 34, 90, 38, 'Layers', goCb);
    btn2(s, 'sd-back', 28, 434, 120, 34, 'Topics', goTopics);
    return s;
}

function sciCheckboxes(viewer: ISurfaceViewer, topic: SciTopic, goBack: () => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#0a1628';
    addText(s, 'dl-hdr', 80, 16, 480, 36, 'Toggle Data Layers', noopText,
        { align: 'Center,Middle', size: 28, bg: 'rgba(6,14,28,0.54)' });
    addText(s, 'dl-hint', 80, 56, 480, 22,
        `Layer controls for ${topic.name}. Check/uncheck to toggle overlays.`,
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(6,14,28,0.44)' });

    const cbSurface = new Surface(480, 320);
    cbSurface.normalImageSource      = `:${PAGE4}/normal.png`;
    cbSurface.selectedImageSource    = `:${PAGE4}/selected.png`;
    cbSurface.highlightedImageSource = `:${PAGE4}/highlighted.png`;
    cbSurface.disabledImageSource    = `:${PAGE4}/disabled.png`;

    const layers = ['Temperature', 'Atmosphere', 'Terrain', 'Water'];
    const cbHandler = (button?: SurfaceButtonElement) => {
        if (!button) { return; }
        const idx = parseInt(button.id.replace('cb', '')) - 1;
        viewer.log(`Checkbox ${layers[idx]}: ${button.isSelected ? 'ON' : 'OFF'}`);
    };
    SurfaceButtonElement.createCheckbox('cb1', 22, 22,  220, 56, cbHandler).addTo(cbSurface);
    SurfaceButtonElement.createCheckbox('cb2', 22, 93,  220, 56, cbHandler).addTo(cbSurface);
    SurfaceButtonElement.createCheckbox('cb3', 22, 165, 220, 56, cbHandler).addTo(cbSurface);
    SurfaceButtonElement.createCheckbox('cb4', 17, 238, 220, 56, cbHandler).addTo(cbSurface);

    layers.forEach((layer, i) => {
        addText(cbSurface, `cbl-${i}`, 250, 36 + i * 71, 210, 32, layer, noopText,
            { align: 'Left,Middle', face: 'sans-serif', size: 14, color: '#444' });
    });
    SurfacePane.create('cb-pane', 80, 86, 480, 320, cbSurface).addTo(s);
    btn2(s, 'dl-back', 80, 430, 160, 32, 'Back to Detail', goBack);
    return s;
}

function sciBrowse(viewer: ISurfaceViewer, goHome: () => void, goDetail: (i: number) => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#0a1628';
    setBg(s, `${NASA}/nebula.jpg`);

    addText(s, 'sc-hdr', 180, 14, 440, 34, 'Browse All Topics', noopText,
        { align: 'Left,Middle', size: 26, bg: 'rgba(6,14,28,0.58)' });

    // Vertical radio strip on the left
    const rs = SurfaceRadioStrip.create('sc-strip', 20, 60, 148, 360, 20, 60, 148, 44,
        (args: SurfaceRadioStripSelectionArgs | undefined) => {
            if (args?.item) {
                const idx = sciTopics.findIndex(t => t.id === args.item.id);
                if (idx >= 0) { viewer.log(`V-Strip: ${sciTopics[idx].name}`); }
            }
        }).addTo(s);
    rs.orientation = RadioStripOrientation.Vertical;
    rs.normalColor = 'rgba(255,255,255,0.85)';
    rs.selectedColor = 'Yellow';
    rs.highlightedColor = 'Cyan';
    rs.typeFace = 'Poiret One';
    rs.typeSize = 14;
    sciTopics.forEach(t => rs.addItem(t.id, t.name));

    sciTopics.forEach((topic, i) => {
        const y = 60 + i * 96;
        SurfaceImageLayer.create(`sc-img-${i}`, 180, y, 120, 80, topic.image, () => goDetail(i)).addTo(s);
        addText(s, `sc-n-${i}`, 310, y, 300, 22, topic.name, () => goDetail(i),
            { align: 'Left,Middle', size: 16, bg: 'rgba(4,10,22,0.56)' });
        addText(s, `sc-d-${i}`, 310, y + 24, 300, 54, topic.body.substring(0, 100) + '…', noopText,
            { align: 'Left,Top', face: 'sans-serif', size: 11, pad: 4, bg: 'rgba(4,10,22,0.44)' });
    });
    btn2(s, 'sc-home', 20, 440, 100, 28, 'Home', goHome);
    return s;
}

function sciReel(frames: string[], goBack: () => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#040a14';
    addText(s, 'sr-title', 24, 14, 592, 32, 'Science Image Reel', noopText,
        { align: 'Center,Middle', size: 24, bg: 'rgba(4,14,28,0.54)' });
    const tr = ['fade', 'zoomIn', 'slideLeft', 'ellipticalIn', 'wipeLeft'];
    const anim = SurfaceAnimationLayer.create('sr-anim', 32, 58, 576, 370, true, noopAnim, 0, noopAnim).addTo(s);
    frames.forEach((f, i) => anim.addFrame(`sf-${i}`, `:${f}`, 0, 0, 576, 370, 2.8, tr[i % tr.length], 0.9, false));
    btn2(s, 'sr-back', 24, 440, 120, 30, 'Back', goBack);
    return s;
}

function configureSpaceScience(viewer: ISurfaceViewer): void {
    const shell = new Surface(640, 480);
    shell.backgroundColor = '#030712';
    let pane!: SurfacePane;
    let curTopic = 0;
    const goHome    = () => pane.replaceSurface(sciHome(goTopics, goBrowse), () => viewer.log('Home'), 'fade', 0.6);
    const goTopics  = () => pane.replaceSurface(sciTopicSelect(viewer, goHome, goDetail), () => viewer.log('Topic select'), 'slideLeft', 0.6);
    const goBrowse  = () => pane.replaceSurface(sciBrowse(viewer, goHome, goDetail), () => viewer.log('Browse'), 'pushLeft', 0.6);
    const goDetail  = (i: number) => { curTopic = i; pane.replaceSurface(sciDetail(sciTopics[i], goTopics, goCb, () => goReel(i)), () => viewer.log(sciTopics[i].name), 'wipeLeft', 0.7); };
    const goCb      = () => pane.replaceSurface(sciCheckboxes(viewer, sciTopics[curTopic], () => goDetail(curTopic)), () => viewer.log('Data layers'), 'slideRight', 0.6);
    const goReel    = (i: number) => pane.replaceSurface(sciReel(sciTopics[i].frames, () => goDetail(i)), () => viewer.log('Reel'), 'zoomIn', 0.8);
    pane = SurfacePane.create('sci-pane', 0, 0, 640, 480, sciHome(goTopics, goBrowse)).addTo(shell);
    viewer.surface = shell;
}

// ===================================================================
//  EXAMPLE 3 – Auto Showcase
//  Features: Buttons (page2), RadioStrip (horizontal), AnimationLayer,
//            ImageLayer, Pane, Text
// ===================================================================

interface Car { id: string; name: string; year: string; image: string; tagline: string; spec: string; }

const cars: Car[] = [
    { id: 'classic-red',    name: 'Audi R8 V10',           year: '2020', image: `${CARS}/classic-red.jpg`,          tagline: 'Crimson supercar on a European boulevard.',    spec: 'V10 · 562 hp · 7-speed dual-clutch · quattro AWD' },
    { id: 'classic-blue',   name: 'Lamborghini Huracán',   year: '2022', image: `${CARS}/classic-blue.jpg`,         tagline: 'Stanced supercar in studio profile.',          spec: 'V10 · 631 hp · 7-speed DCT · custom forged wheels' },
    { id: 'muscle',         name: 'Jeep Grand Cherokee',   year: '2021', image: `${CARS}/muscle-car.jpg`,           tagline: 'Rugged luxury meets trail capability.',        spec: 'V8 5.7L · 360 hp · 8-speed auto · Quadra-Trac II 4WD' },
    { id: 'convertible',    name: 'Mercedes-Benz Lineup',  year: '2019', image: `${CARS}/vintage-convertible.jpg`,  tagline: 'Premium fleet on the dealer lot.',             spec: 'AMG styling · LED optics · multi-link suspension · MBUX' },
    { id: 'white',          name: 'Renault Koleos',        year: '2020', image: `${CARS}/vintage-white.jpg`,        tagline: 'Euro crossover on an urban bridge.',           spec: 'Inline-4 turbo · 175 hp · CVT · front-wheel drive' },
    { id: 'showroom',       name: 'Toyota GR Supra',       year: '2023', image: `${CARS}/showroom.jpg`,             tagline: 'Track-ready in the showroom spotlight.',       spec: 'Inline-6 turbo · 382 hp · 8-speed auto · rear-wheel drive' },
    { id: 'dashboard',      name: 'Audi RS6 Avant',        year: '2021', image: `${CARS}/classic-dashboard.jpg`,    tagline: 'Performance wagon by the lake.',               spec: 'V8 twin-turbo · 591 hp · 8-speed tiptronic · quattro AWD' },
    { id: 'garage',         name: 'BMW E30 3 Series',      year: '1988', image: `${CARS}/vintage-garage.jpg`,       tagline: 'Timeless lines from Bavaria\'s golden era.',   spec: 'Inline-6 · 168 hp · 5-speed manual · limited-slip diff' },
];

function carHome(goCatalog: () => void, goReel: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, cars[0].image);
    addText(s, 'ch-kicker', 190, 36, 260, 22, 'Surface Example', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(6,14,28,0.50)' });
    addText(s, 'ch-title', 60, 68, 520, 60, 'Auto Showcase', noopText,
        { align: 'Center,Middle', size: 42, bg: 'rgba(6,14,28,0.62)' });
    addText(s, 'ch-sub', 80, 148, 480, 64,
        'Browse a curated catalog of performance automobiles. 8 models with radio-strip navigation, action buttons, and an automated highlight reel.',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 14, pad: 10, bg: 'rgba(6,14,28,0.54)' });
    btn(s, 'ch-cat', 155, 264, 156, 40, 'Browse Catalog', goCatalog);
    btn(s, 'ch-reel', 330, 264, 156, 40, 'Highlight Reel', goReel);
    addText(s, 'ch-foot', 80, 380, 480, 48,
        'Features: SurfaceButtonElement · SurfaceRadioStrip (horizontal) · SurfaceAnimationLayer · SurfaceImageLayer · SurfacePane',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 11, pad: 8, bg: 'rgba(6,14,28,0.44)' });
    return s;
}

function carCatalog(
    viewer: ISurfaceViewer, goHome: () => void,
    goDetail: (i: number) => void, goReel: () => void
): Surface {
    const s = new Surface(640, 480);
    setBg(s, cars[5].image);

    addText(s, 'cc-hdr', 20, 14, 600, 32, 'Auto Catalog', noopText,
        { align: 'Center,Middle', size: 26, bg: 'rgba(4,14,28,0.58)' });

    // Horizontal radio strip
    const rs = SurfaceRadioStrip.create('cc-strip', 20, 430, 510, 34, 20, 430, 120, 34,
        (args: SurfaceRadioStripSelectionArgs | undefined) => {
            if (args?.item) {
                const idx = cars.findIndex(c => c.id === args.item.id);
                if (idx >= 0) {
                    viewer.log(`Strip: ${cars[idx].year} ${cars[idx].name}`);
                    goDetail(idx);
                }
            }
        }).addTo(s);
    rs.normalColor = 'Black';
    rs.selectedColor = 'Yellow';
    rs.highlightedColor = 'Cyan';
    rs.typeFace = 'Poiret One';
    rs.typeSize = 13;
    cars.forEach(c => rs.addItem(c.id, `${c.year} ${c.name}`));

    btn2(s, 'cc-prev', 540, 434, 44, 28, '◀', () => rs.moveBack());
    btn2(s, 'cc-next', 590, 434, 44, 28, '▶', () => rs.moveForward());

    // Image cards
    const cols = 4; const cw = 142; const ch = 95;
    const sx = 20; const sy = 56; const gx = 10; const gy = 10;
    cars.forEach((car, i) => {
        const col = i % cols; const row = Math.floor(i / cols);
        const x = sx + col * (cw + gx); const y = sy + row * (ch + gy);
        SurfaceImageLayer.create(`cc-img-${i}`, x, y, cw, ch, car.image, () => goDetail(i)).addTo(s);
        addText(s, `cc-lbl-${i}`, x + 2, y + ch - 22, cw - 4, 20,
            `${car.year} ${car.name}`, () => goDetail(i),
            { align: 'Left,Middle', size: 10, face: 'sans-serif', pad: 3, bg: 'rgba(4,10,22,0.64)' });
    });

    btn2(s, 'cc-home', 20, 398, 100, 26, 'Home', goHome);
    btn2(s, 'cc-reel', 540, 398, 80, 26, 'Reel', goReel);
    return s;
}

function carDetail(car: Car, goCatalog: () => void, goActions: () => void, goReel: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, car.image);
    addText(s, 'cd-name', 28, 28, 450, 44, `${car.year} ${car.name}`, noopText,
        { align: 'Left,Middle', size: 30, bg: 'rgba(4,14,28,0.62)' });
    addText(s, 'cd-tag', 28, 78, 400, 26, car.tagline, noopText,
        { align: 'Left,Middle', face: 'sans-serif', size: 15, bg: 'rgba(4,14,28,0.50)' });
    addText(s, 'cd-spec', 28, 310, 584, 50, car.spec, noopText,
        { align: 'Left,Middle', face: 'sans-serif', size: 14, pad: 12, bg: 'rgba(4,10,22,0.68)', border: 'rgba(255,255,255,0.18)' });
    addText(s, 'cd-body', 28, 368, 584, 56,
        `The ${car.year} ${car.name} – presented here as an interactive kiosk with hero imagery, key specs, and dealer action buttons.`,
        noopText, { align: 'Left,Top', face: 'sans-serif', size: 12, pad: 10, bg: 'rgba(4,10,22,0.62)' });
    btn(s, 'cd-actions', 488, 28, 126, 38, 'Actions', goActions);
    btn2(s, 'cd-reel', 488, 74, 126, 34, 'Reel', goReel);
    btn2(s, 'cd-back', 28, 436, 130, 30, 'Back to Catalog', goCatalog);
    return s;
}

function carActions(viewer: ISurfaceViewer, goBack: () => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#0a1628';
    addText(s, 'ca-hdr', 80, 16, 480, 36, 'Dealer Actions', noopText,
        { align: 'Center,Middle', size: 28, bg: 'rgba(6,14,28,0.54)' });
    addText(s, 'ca-hint', 80, 56, 480, 22, 'Press a button to trigger a dealer workflow.', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(6,14,28,0.44)' });

    const bSurface = new Surface(480, 320);
    bSurface.normalImageSource      = `:${PAGE2}/normal.png`;
    bSurface.selectedImageSource    = `:${PAGE2}/selected.png`;
    bSurface.highlightedImageSource = `:${PAGE2}/highlighted.png`;
    bSurface.disabledImageSource    = `:${PAGE2}/disabled.png`;

    const labels = ['Schedule Viewing', 'Download Brochure', 'Compare Models', 'Contact Dealer'];
    const bHandler = (button?: SurfaceButtonElement) => {
        if (!button) { return; }
        const idx = parseInt(button.id.replace('ab', '')) - 1;
        viewer.log(`Action: ${labels[idx]}`);
    };
    SurfaceButtonElement.create('ab1', 27, 20,  168, 62, bHandler).addTo(bSurface);
    SurfaceButtonElement.create('ab2', 27, 93,  168, 62, bHandler).addTo(bSurface);
    SurfaceButtonElement.create('ab3', 27, 164, 168, 62, bHandler).addTo(bSurface);
    SurfaceButtonElement.create('ab4', 27, 235, 168, 62, bHandler).addTo(bSurface);

    labels.forEach((label, i) => {
        addText(bSurface, `abl-${i}`, 210, 34 + i * 71, 250, 36, label, noopText,
            { align: 'Left,Middle', face: 'sans-serif', size: 14, color: '#444' });
    });
    SurfacePane.create('ab-pane', 80, 86, 480, 320, bSurface).addTo(s);
    btn2(s, 'ca-back', 80, 430, 160, 32, 'Back to Detail', goBack);
    return s;
}

function carReel(goHome: () => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#040a14';
    addText(s, 'cr-title', 24, 14, 592, 32, 'Auto Highlight Reel', noopText,
        { align: 'Center,Middle', size: 24, bg: 'rgba(4,14,28,0.54)' });
    const tr = ['fade', 'slideLeft', 'zoomIn', 'pushRight', 'wipeLeft', 'ellipticalIn', 'revealRight', 'grid'];
    const anim = SurfaceAnimationLayer.create('cr-anim', 32, 58, 576, 370, true, noopAnim, 0, noopAnim).addTo(s);
    cars.forEach((c, i) => anim.addFrame(`cf-${c.id}`, `:${c.image}`, 0, 0, 576, 370, 2.5, tr[i % tr.length], 0.8, false));
    btn2(s, 'cr-home', 24, 440, 120, 30, 'Back Home', goHome);
    return s;
}

function configureClassicAuto(viewer: ISurfaceViewer): void {
    const shell = new Surface(640, 480);
    shell.backgroundColor = '#030712';
    let pane!: SurfacePane;
    let curCar = 0;
    const goHome    = () => pane.replaceSurface(carHome(goCatalog, goReel), () => viewer.log('Home'), 'fade', 0.6);
    const goCatalog = () => pane.replaceSurface(carCatalog(viewer, goHome, goDetail, goReel), () => viewer.log('Catalog'), 'slideLeft', 0.6);
    const goDetail  = (i: number) => { curCar = i; pane.replaceSurface(carDetail(cars[i], goCatalog, goActions, goReel), () => viewer.log(`${cars[i].year} ${cars[i].name}`), 'wipeLeft', 0.7); };
    const goActions = () => pane.replaceSurface(carActions(viewer, () => goDetail(curCar)), () => viewer.log('Actions'), 'slideRight', 0.6);
    const goReel    = () => pane.replaceSurface(carReel(goHome), () => viewer.log('Highlight reel'), 'zoomIn', 0.8);
    pane = SurfacePane.create('car-pane', 0, 0, 640, 480, carHome(goCatalog, goReel)).addTo(shell);
    viewer.surface = shell;
}

// ===================================================================
//  EXAMPLE 4 – Vintage Science Lab
//  Features: VideoLayer, RadioStrip (horizontal + vertical),
//            HiddenLayer, ImageLayer, Pane, Text
// ===================================================================

interface Instrument { id: string; name: string; category: string; image: string; era: string; desc: string; }

const labCategories = ['All', 'Optics', 'Electronics', 'Measurement', 'Mechanics'];

const instruments: Instrument[] = [
    { id: 'telescope',    name: 'Brass Telescope',      category: 'Optics',      image: `${VINTAGE}/telescope.jpg`,      era: '1780s', desc: 'A hand-drawn brass refractor used by navigators and amateur astronomers. Demonstrates how optics technology scaled from military to civilian use.' },
    { id: 'microscope',   name: 'Compound Microscope',  category: 'Optics',      image: `${VINTAGE}/microscope.jpg`,     era: '1850s', desc: 'An achromatic-objective microscope that opened the microbial world to Victorian science.' },
    { id: 'radio',        name: 'Vacuum-Tube Radio',    category: 'Electronics', image: `${VINTAGE}/radio.jpg`,          era: '1930s', desc: 'An Art Deco cathedral radio that brought live broadcasts into every living room.' },
    { id: 'typewriter',   name: 'Mechanical Typewriter', category: 'Electronics', image: `${VINTAGE}/typewriter.jpg`,    era: '1920s', desc: 'A precision writing machine that transformed correspondence and commerce for a century.' },
    { id: 'chemistry',    name: 'Chemistry Apparatus',  category: 'Measurement', image: `${VINTAGE}/chemistry.jpg`,     era: '1860s', desc: 'Glassware flasks, condensers, and burettes used for gravimetric and volumetric analysis.' },
    { id: 'compass',      name: 'Navigator\'s Compass', category: 'Measurement', image: `${VINTAGE}/compass.jpg`,       era: '1800s', desc: 'A brass bearing compass that guided ships across oceans before GPS.' },
    { id: 'lab-equip',    name: 'Laboratory Setup',     category: 'Mechanics',   image: `${VINTAGE}/lab-equipment.jpg`,  era: '1950s', desc: 'A mid-century bench layout with beakers, clamps, and Bunsen burners for general experiment work.' },
    { id: 'clock-gears',  name: 'Antique Timepieces',   category: 'Mechanics',   image: `${VINTAGE}/clock-gears.jpg`,   era: '1800s', desc: 'An hourglass flanked by ornate brass clocks – timekeeping instruments that shaped navigation, science, and daily life for centuries.' },
];

function labHome(goBrowser: () => void, goVideo: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, instruments[7].image);
    addText(s, 'lh-kicker', 200, 36, 240, 22, 'Surface Example', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 12, bg: 'rgba(6,14,28,0.50)' });
    addText(s, 'lh-title', 60, 68, 520, 60, 'Vintage Science Lab', noopText,
        { align: 'Center,Middle', size: 42, bg: 'rgba(6,14,28,0.62)' });
    addText(s, 'lh-sub', 70, 148, 500, 64,
        'Explore classic scientific instruments across optics, electronics, measurement, and mechanics. Dual radio strips, video playback, and interactive discovery zones.',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 14, pad: 10, bg: 'rgba(6,14,28,0.54)' });
    btn(s, 'lh-browse', 145, 264, 170, 40, 'Explore Lab', goBrowser);
    btn(s, 'lh-video',  335, 264, 170, 40, 'Watch Demo', goVideo);
    addText(s, 'lh-foot', 60, 380, 520, 48,
        'Features: SurfaceVideoLayer · SurfaceRadioStrip (horizontal + vertical) · SurfaceHiddenLayer · SurfaceImageLayer · SurfacePane',
        noopText, { align: 'Center,Middle', face: 'sans-serif', size: 11, pad: 8, bg: 'rgba(6,14,28,0.44)' });
    return s;
}

function labBrowser(
    viewer: ISurfaceViewer, goHome: () => void,
    goDetail: (i: number) => void, goVideo: () => void,
    activeCategory: string, goCategory: (category: string) => void
): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#0c1420';
    const visibleInstruments = activeCategory === 'All'
        ? instruments
        : instruments.filter(inst => inst.category === activeCategory);
    const categoryItemWidth = 92;
    const itemStripHeight = Math.max(40, Math.min(320, visibleInstruments.length * 40));

    addText(s, 'lb-hdr', 170, 10, 460, 30, 'Instrument Collection', noopText,
        { align: 'Left,Middle', size: 22, bg: 'rgba(6,14,28,0.54)' });

    const catStripSurface = new Surface(460, 30);
    catStripSurface.normalImageSource = `:${PAGE11}/normal.png`;
    catStripSurface.selectedImageSource = `:${PAGE11}/selected.png`;
    catStripSurface.highlightedImageSource = `:${PAGE11}/highlighted.png`;

    // Horizontal category strip (top)
    const catStrip = SurfaceRadioStrip.create('lb-cats', 0, 0, 460, 30, 0, 0, categoryItemWidth, 30,
        (args: SurfaceRadioStripSelectionArgs | undefined) => {
            if (args?.item) {
                viewer.log(`Category: ${args.item.id}`);
                goCategory(args.item.id);
            }
        }).addTo(catStripSurface);
    catStrip.normalColor = 'rgba(255,255,255,0.80)';
    catStrip.selectedColor = 'Yellow';
    catStrip.highlightedColor = 'Cyan';
    catStrip.typeFace = 'Poiret One';
    catStrip.typeSize = 12;
    labCategories.forEach(cat => catStrip.addItem(cat, cat));
    SurfacePane.create('lb-cats-pane', 170, 44, 460, 30, catStripSurface).addTo(s);

    const itemStripSurface = new Surface(150, itemStripHeight);
    itemStripSurface.normalImageSource = `:${PAGE12}/normal.png`;
    itemStripSurface.selectedImageSource = `:${PAGE12}/selected.png`;
    itemStripSurface.highlightedImageSource = `:${PAGE12}/highlighted.png`;

    // Vertical instrument strip (left)
    const itemStrip = SurfaceRadioStrip.create('lb-items', 0, 0, 150, itemStripHeight, 0, 0, 150, 40,
        (args: SurfaceRadioStripSelectionArgs | undefined) => {
            if (args?.item) {
                const idx = instruments.findIndex(i => i.id === args.item.id);
                if (idx >= 0) {
                    viewer.log(`Instrument: ${instruments[idx].name}`);
                    goDetail(idx);
                }
            }
        }).addTo(itemStripSurface);
    itemStrip.orientation = RadioStripOrientation.Vertical;
    itemStrip.normalColor = 'rgba(255,255,255,0.80)';
    itemStrip.selectedColor = 'Yellow';
    itemStrip.highlightedColor = 'Cyan';
    itemStrip.typeFace = 'Poiret One';
    itemStrip.typeSize = 12;
    visibleInstruments.forEach(inst => itemStrip.addItem(inst.id, inst.name));
    SurfacePane.create('lb-items-pane', 10, 84, 150, itemStripHeight, itemStripSurface).addTo(s);

    // 4 instrument cards
    visibleInstruments.slice(0, 4).forEach((inst) => {
        const instIdx = instruments.findIndex(i => i.id === inst.id);
        if (instIdx < 0) { return; }
        const i = visibleInstruments.findIndex(v => v.id === inst.id);
        const col = i % 2; const row = Math.floor(i / 2);
        const x = 170 + col * 232; const y = 84 + row * 164;
        SurfaceImageLayer.create(`lb-img-${instIdx}`, x, y, 224, 130, inst.image, () => goDetail(instIdx)).addTo(s);
        addText(s, `lb-lbl-${instIdx}`, x + 4, y + 130, 216, 24, `${inst.era} · ${inst.name}`, () => goDetail(instIdx),
            { align: 'Left,Middle', size: 12, face: 'sans-serif', pad: 4, bg: 'rgba(4,10,22,0.64)' });
    });

    // Hidden layer discovery zone
    SurfaceHiddenLayer.create('lb-discover', 280, 180, 100, 60, () => {
        viewer.log('Discovery zone activated! (SurfaceHiddenLayer)');
    }).addTo(s);

    // Strip nav
    addText(s, 'lb-start', 10, 404, 70, 24, 'Start', () => itemStrip.moveStart(),
        { align: 'Center,Middle', face: 'sans-serif', size: 11, bg: 'rgba(6,14,28,0.48)' });
    addText(s, 'lb-end', 86, 404, 70, 24, 'End', () => itemStrip.moveEnd(),
        { align: 'Center,Middle', face: 'sans-serif', size: 11, bg: 'rgba(6,14,28,0.48)' });

    btn2(s, 'lb-home', 10, 440, 80, 28, 'Home', goHome);
    btn2(s, 'lb-video', 550, 440, 80, 28, 'Demo', goVideo);
    return s;
}

function labDetail(inst: Instrument, goBrowser: () => void, goVideo: () => void): Surface {
    const s = new Surface(640, 480);
    setBg(s, inst.image);
    addText(s, 'ld-era', 28, 26, 100, 24, inst.era, noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 13, bg: 'rgba(4,14,28,0.52)' });
    addText(s, 'ld-cat', 136, 26, 120, 24, inst.category, noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 13, bg: 'rgba(4,14,28,0.52)' });
    addText(s, 'ld-name', 28, 56, 450, 44, inst.name, noopText,
        { align: 'Left,Middle', size: 30, bg: 'rgba(4,14,28,0.60)' });
    addText(s, 'ld-desc', 28, 304, 584, 110, inst.desc, noopText,
        { align: 'Left,Top', face: 'sans-serif', size: 14, pad: 12, bg: 'rgba(4,10,22,0.70)', border: 'rgba(255,255,255,0.18)' });
    btn(s, 'ld-video', 452, 28, 162, 38, 'Watch Demo', goVideo);
    btn2(s, 'ld-back', 28, 434, 130, 30, 'Back to Lab', goBrowser);
    return s;
}

function labVideo(viewer: ISurfaceViewer, goHome: () => void): Surface {
    const s = new Surface(640, 480);
    s.backgroundColor = '#040a14';
    addText(s, 'lv-title', 24, 12, 592, 28, 'Instrument Demonstration', noopText,
        { align: 'Center,Middle', size: 22, bg: 'rgba(4,14,28,0.54)' });
    addText(s, 'lv-note', 100, 42, 440, 20,
        'SurfaceVideoLayer – looping engineering demo reel (industrial gears)', noopText,
        { align: 'Center,Middle', face: 'sans-serif', size: 11, bg: 'rgba(4,14,28,0.44)' });
    const video = SurfaceVideoLayer.create('lv-video', 40, 70, 560, 360, `${VIDEO}/industrial-gears-1080.mp4`).addTo(s);
    video.autoPlay = true;
    video.loop = true;
    video.nativeControls = false;
    btn2(s, 'lv-home', 24, 444, 120, 28, 'Back Home', goHome);
    return s;
}

function configureVintageLab(viewer: ISurfaceViewer): void {
    const shell = new Surface(640, 480);
    shell.backgroundColor = '#030712';
    let pane!: SurfacePane;
    let curCategory = 'All';
    const goHome    = () => pane.replaceSurface(labHome(goBrowser, goVideo), () => viewer.log('Home'), 'fade', 0.6);
    const goBrowser = (category: string = curCategory) => {
        curCategory = category;
        pane.replaceSurface(labBrowser(viewer, goHome, goDetail, goVideo, curCategory, goBrowser), () => viewer.log(`Lab browser: ${curCategory}`), 'slideLeft', 0.6);
    };
    const goDetail  = (i: number) => pane.replaceSurface(labDetail(instruments[i], () => goBrowser(curCategory), goVideo), () => viewer.log(instruments[i].name), 'wipeLeft', 0.7);
    const goVideo   = () => pane.replaceSurface(labVideo(viewer, goHome), () => viewer.log('Video demo'), 'zoomIn', 0.8);
    pane = SurfacePane.create('lab-pane', 0, 0, 640, 480, labHome(() => goBrowser(curCategory), goVideo)).addTo(shell);
    viewer.surface = shell;
}

// ===================================================================
//  Example registry
// ===================================================================

const examples: SurfaceSample[] = [
    {
        id: 'world-destinations',
        title: 'World Destinations Kiosk',
        description: 'Travel gallery with horizontal radio strip, hidden-layer hotspots, animation reel, and 12 scenic destinations at perfect 640×480 aspect ratio.',
        configure: configureDestinations
    },
    {
        id: 'space-science-console',
        title: 'Space Science Console',
        description: 'Space-science kiosk with radio buttons, checkboxes, vertical radio strip, and NASA / space imagery — all 640×480.',
        configure: configureSpaceScience
    },
    {
        id: 'auto-showcase',
        title: 'Auto Showcase',
        description: 'Performance automobile gallery with 8 vehicles, horizontal radio strip, multi-state action buttons, and an animated highlight reel.',
        configure: configureClassicAuto
    },
    {
        id: 'vintage-science-lab',
        title: 'Vintage Science Lab',
        description: 'Science-instrument museum with video playback, dual radio strips (horizontal + vertical), hidden discovery zones, and 8 instrument detail screens.',
        configure: configureVintageLab
    }
];

// ===================================================================
//  Angular service
// ===================================================================

@Injectable({ providedIn: 'root' })
export class SurfaceExampleService {
    examples(): Observable<SurfaceSample[]> {
        return of(examples);
    }

    example(id: string): Observable<SurfaceSample | undefined> {
        return of(examples.find(e => e.id === id));
    }

    configure(viewer: ISurfaceViewer, id: string): void {
        const ex = examples.find(e => e.id === id);
        if (!ex) { return; }
        viewer.title = ex.title;
        viewer.description = ex.description;
        ex.configure(viewer);
    }
}
