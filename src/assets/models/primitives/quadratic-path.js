var model = elise.model(760, 420);
model.setFill('#f4f7fb');

function label(text, x, y) {
    var t = elise.text(text, x, y, 210, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Smooth Quadratic Wave', 44, 26);
var wave = elise.path();
wave.commands = 'm40,176 Q120,38,200,176 T360,176 T520,176 T680,176';
wave.setStroke('#2563eb,8').setLineCap('round').addTo(model);

label('Closed Quadratic Ribbon', 44, 250);
var ribbon = elise.path();
ribbon.commands = 'm84,318 Q176,224,268,318 T452,318 Q360,374,268,350 T84,318 z';
ribbon.setFill('#fb7185').setStroke('#9f1239,3').addTo(model);

label('Quadratic Leaf', 448, 26);
var leaf = elise.path();
leaf.commands = 'm530,96 Q658,40,700,182 Q658,322,530,292 Q564,224,530,96 z';
leaf.setFill('#22c55e').setStroke('#166534,3').addTo(model);

return model;
