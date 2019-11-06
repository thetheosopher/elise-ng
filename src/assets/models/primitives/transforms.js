var model = elise.model(320, 320);
var left = 120,
    top = 120,
    width = 80,
    height = 80;

function makeRect(stroke) {
    return elise.rectangle(left, top, width, height).setStroke(stroke).addTo(model);
}

var r1 = makeRect('Red,5');
var r2 = makeRect('Green,5');
var r3 = makeRect('Blue,5');
var r4 = makeRect('Yellow,5');
var baseRect = makeRect('Black,5');

// Scale a factor of 2 centered around local offset of 40,40
r1.transform = 'scale(2(40,40))';

// Rotate by 45 degrees centered around local offset of 40,40
r2.transform = 'rotate(45(40,40))';

// Translate in x direction by 25 and in y direction by -25
r3.transform = 'translate(25, -25)';

// Skew in x direction by 45 degrees
r4.transform = 'skew(45,0)';

return model;
