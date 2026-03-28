var rows = [
    { name: 'easeLinear', accent: '#3c7a89' },
    { name: 'easeInQuad', accent: '#426d9b' },
    { name: 'easeOutQuad', accent: '#4f88b6' },
    { name: 'easeInOutQuad', accent: '#5c8b6f' },
    { name: 'easeInCubic', accent: '#8f6b45' },
    { name: 'easeOutCubic', accent: '#a87655' },
    { name: 'easeInOutCubic', accent: '#8d5568' },
    { name: 'easeInSine', accent: '#7560a8' },
    { name: 'easeOutSine', accent: '#9672b6' },
    { name: 'easeInOutSine', accent: '#5e8298' }
];

var width = 1000;
var height = 192 + rows.length * 52;
var trackLeft = 334;
var trackRight = 842;
var trackWidth = trackRight - trackLeft;
var model = elise.model(width, height);
model.setFill('#f5eee4');

function addElement(element) {
    model.add(element);
    return element;
}

function makeText(text, x, y, textWidth, textHeight, size, fill, alignment, style, typeface) {
    var element = elise.text(text, x, y, textWidth, textHeight);
    element.setTypesize(size || 18);
    element.setFill(fill || '#233341');
    element.setTypeface(typeface || 'Palatino Linotype, Book Antiqua, Georgia, serif');
    if (alignment) {
        element.setAlignment(alignment);
    }
    if (style) {
        element.setTypestyle(style);
    }
    return addElement(element);
}

function makeTrackRow(row, index) {
    var y = 154 + index * 52;
    var stripeFill = index % 2 === 0 ? '#fff8ef' : '#f8f0e4';
    var stripe = addElement(elise.rectangle(28, y - 18, width - 56, 40).setFill(stripeFill).setStroke('#d8cabb'));
    stripe.opacity = 0.82;

    var label = makeText(row.name, 48, y - 14, 228, 24, 15, '#304252', 'left,top', 'bold', 'Consolas, monospace');
    label.opacity = 0.96;

    var guide = addElement(elise.line(trackLeft, y, trackRight, y).setStroke('#9f978a,2'));
    guide.opacity = 0.88;

    var tickLeft = addElement(elise.line(trackLeft, y - 11, trackLeft, y + 11).setStroke('#7a7064,2'));
    var tickRight = addElement(elise.line(trackRight, y - 11, trackRight, y + 11).setStroke('#7a7064,2'));
    tickLeft.opacity = 0.78;
    tickRight.opacity = 0.78;

    var startDot = addElement(elise.ellipse(trackLeft, y, 4, 4).setFill('#7a7064'));
    var endDot = addElement(elise.ellipse(trackRight, y, 4, 4).setFill('#7a7064'));
    startDot.opacity = 0.84;
    endDot.opacity = 0.84;

    var band = addElement(elise.rectangle(trackLeft, y - 6, trackWidth, 12).setFill('#e8ded0'));
    band.opacity = 0.26;

    var circle = addElement(elise.ellipse(trackLeft, y, 12, 12).setFill(row.accent).setStroke('#fffdf7,2'));
    circle.opacity = 0.96;

    return {
        circle: circle,
        easing: row.name
    };
}

function startTween(rowState, movingRight) {
    rowState.circle.animate(
        { centerX: movingRight ? trackRight : trackLeft },
        {
            duration: 2400,
            easing: rowState.easing,
            onComplete: function() {
                startTween(rowState, !movingRight);
            }
        }
    );
}

addElement(elise.ellipse(152, 72, 148, 52).setFill('#eadcc8')).opacity = 0.46;
addElement(elise.ellipse(864, height - 68, 164, 60).setFill('#dce7ec')).opacity = 0.4;

var title = makeText('Easing Gallery: Core Curves', 42, 24, 470, 34, 28, '#1f3141', 'left,top', 'bold');
var subtitle = makeText('Linear, quadratic, cubic, and sine easing with synchronized horizontal travel.', 44, 62, 720, 24, 15, '#556d72', 'left,top');
subtitle.opacity = 0.86;

var helper = makeText('Each guide line shows the intended span. Endpoint markers make overshoot easy to spot.', 42, 102, 760, 22, 14, '#7d7469', 'left,top');
helper.opacity = 0.78;

var footer = makeText('All rows loop continuously using the named easing for both directions.', 42, height - 32, 620, 20, 13, '#817767', 'left,top');
footer.opacity = 0.74;

var rowStates = [];
for (var i = 0; i < rows.length; i++) {
    rowStates.push(makeTrackRow(rows[i], i));
}

model.controllerAttached.add(function() {
    for (var i = 0; i < rowStates.length; i++) {
        startTween(rowStates[i], true);
    }
});

return model;
