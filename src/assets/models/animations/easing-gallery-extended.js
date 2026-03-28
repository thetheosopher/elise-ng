var rows = [
    { name: 'easeInQuart', accent: '#4d6a87' },
    { name: 'easeOutQuart', accent: '#5d80a1' },
    { name: 'easeInOutQuart', accent: '#708d57' },
    { name: 'easeInQuint', accent: '#806145' },
    { name: 'easeOutQuint', accent: '#9d7657' },
    { name: 'easeInOutQuint', accent: '#8b5f7e' },
    { name: 'easeInExpo', accent: '#64589b' },
    { name: 'easeOutExpo', accent: '#8570b8' },
    { name: 'easeInOutExpo', accent: '#4f8f98' },
    { name: 'easeInCirc', accent: '#496f78' },
    { name: 'easeOutCirc', accent: '#5b8790' },
    { name: 'easeInOutCirc', accent: '#8f874f' }
];

var width = 1000;
var height = 192 + rows.length * 52;
var trackLeft = 334;
var trackRight = 842;
var trackWidth = trackRight - trackLeft;
var model = elise.model(width, height);
model.setFill('#eef1f2');

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
    var stripeFill = index % 2 === 0 ? '#f9fbfb' : '#f2f6f6';
    var stripe = addElement(elise.rectangle(28, y - 18, width - 56, 40).setFill(stripeFill).setStroke('#ccd6d7'));
    stripe.opacity = 0.86;

    var label = makeText(row.name, 48, y - 14, 228, 24, 15, '#2f4148', 'left,top', 'bold', 'Consolas, monospace');
    label.opacity = 0.96;

    var guide = addElement(elise.line(trackLeft, y, trackRight, y).setStroke('#8d9ea1,2'));
    guide.opacity = 0.88;

    var tickLeft = addElement(elise.line(trackLeft, y - 11, trackLeft, y + 11).setStroke('#66777a,2'));
    var tickRight = addElement(elise.line(trackRight, y - 11, trackRight, y + 11).setStroke('#66777a,2'));
    tickLeft.opacity = 0.8;
    tickRight.opacity = 0.8;

    var startDot = addElement(elise.ellipse(trackLeft, y, 4, 4).setFill('#66777a'));
    var endDot = addElement(elise.ellipse(trackRight, y, 4, 4).setFill('#66777a'));
    startDot.opacity = 0.86;
    endDot.opacity = 0.86;

    var band = addElement(elise.rectangle(trackLeft, y - 6, trackWidth, 12).setFill('#dfe6e7'));
    band.opacity = 0.28;

    var circle = addElement(elise.ellipse(trackLeft, y, 12, 12).setFill(row.accent).setStroke('#ffffff,2'));
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

addElement(elise.ellipse(172, 72, 168, 52).setFill('#d7e2e4')).opacity = 0.52;
addElement(elise.ellipse(846, height - 74, 174, 62).setFill('#e7ddd0')).opacity = 0.44;

var title = makeText('Easing Gallery: Extended Curves', 42, 24, 520, 34, 28, '#20333e', 'left,top', 'bold');
var subtitle = makeText('Quart, quint, exponential, and circular easing on the same horizontal travel span.', 44, 62, 760, 24, 15, '#4e666d', 'left,top');
subtitle.opacity = 0.86;

var helper = makeText('These curves exaggerate acceleration more aggressively, especially the exponential entries.', 42, 102, 760, 22, 14, '#777f82', 'left,top');
helper.opacity = 0.8;

var footer = makeText('All rows are synchronized so timing differences come from easing alone.', 42, height - 32, 560, 20, 13, '#6d7476', 'left,top');
footer.opacity = 0.72;

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
