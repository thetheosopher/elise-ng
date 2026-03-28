var rows = [
    { name: 'easeInBack', accent: '#5c6aa0' },
    { name: 'easeOutBack', accent: '#6d83b4' },
    { name: 'easeInOutBack', accent: '#5b8a7a' },
    { name: 'easeInElastic', accent: '#95674c' },
    { name: 'easeOutElastic', accent: '#b07f60' },
    { name: 'easeInOutElastic', accent: '#8d6079' },
    { name: 'easeInBounce', accent: '#8c7d49' },
    { name: 'easeOutBounce', accent: '#9f9258' },
    { name: 'easeInOutBounce', accent: '#4f8c92' }
];

var width = 1000;
var height = 192 + rows.length * 52;
var trackLeft = 334;
var trackRight = 842;
var trackWidth = trackRight - trackLeft;
var model = elise.model(width, height);
model.setFill('#f1ede8');

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
    var stripeFill = index % 2 === 0 ? '#fbf8f4' : '#f6f1ea';
    var stripe = addElement(elise.rectangle(28, y - 18, width - 56, 40).setFill(stripeFill).setStroke('#d7cfc3'));
    stripe.opacity = 0.84;

    var label = makeText(row.name, 48, y - 14, 228, 24, 15, '#31414e', 'left,top', 'bold', 'Consolas, monospace');
    label.opacity = 0.96;

    var guide = addElement(elise.line(trackLeft, y, trackRight, y).setStroke('#958a7d,2'));
    guide.opacity = 0.9;

    var tickLeft = addElement(elise.line(trackLeft, y - 11, trackLeft, y + 11).setStroke('#6d6257,2'));
    var tickRight = addElement(elise.line(trackRight, y - 11, trackRight, y + 11).setStroke('#6d6257,2'));
    tickLeft.opacity = 0.82;
    tickRight.opacity = 0.82;

    var startDot = addElement(elise.ellipse(trackLeft, y, 4, 4).setFill('#6d6257'));
    var endDot = addElement(elise.ellipse(trackRight, y, 4, 4).setFill('#6d6257'));
    startDot.opacity = 0.88;
    endDot.opacity = 0.88;

    var band = addElement(elise.rectangle(trackLeft, y - 6, trackWidth, 12).setFill('#e5ddd2'));
    band.opacity = 0.26;

    var circle = addElement(elise.ellipse(trackLeft, y, 12, 12).setFill(row.accent).setStroke('#fffdf8,2'));
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

addElement(elise.ellipse(160, 72, 154, 54).setFill('#dfd4c8')).opacity = 0.46;
addElement(elise.ellipse(852, height - 70, 172, 60).setFill('#d7e3e6')).opacity = 0.4;

var title = makeText('Easing Gallery: Overshoot and Bounce', 42, 24, 620, 34, 28, '#213341', 'left,top', 'bold');
var subtitle = makeText('Back, elastic, and bounce easing deliberately move beyond or around the guide span.', 44, 62, 780, 24, 15, '#56696d', 'left,top');
subtitle.opacity = 0.86;

var helper = makeText('The endpoint ticks matter most here: these curves reveal anticipation, overshoot, recoil, and rebound.', 42, 102, 820, 22, 14, '#7b7268', 'left,top');
helper.opacity = 0.8;

var footer = makeText('This gallery isolates the expressive easings where the motion intentionally breaks the straight span.', 42, height - 32, 720, 20, 13, '#7d7469', 'left,top');
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
