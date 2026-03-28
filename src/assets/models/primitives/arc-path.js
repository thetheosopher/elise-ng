var model = elise.model(760, 420);
model.setFill('#f8fafc');

function label(text, x, y) {
    var t = elise.text(text, x, y, 200, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Open Sweep', 54, 24);
var arc1 = elise.arc(46, 66, 184, 184);
arc1.startAngle = 210;
arc1.endAngle = 25;
arc1.setStroke('#2563eb,8').addTo(model);

label('Tall Elliptical Arc', 288, 24);
var arc2 = elise.arc(286, 54, 168, 220);
arc2.startAngle = 130;
arc2.endAngle = 340;
arc2.setStroke('#ea580c,8').addTo(model);

label('Long Sweep', 528, 24);
var arc3 = elise.arc(516, 74, 170, 170);
arc3.startAngle = 40;
arc3.endAngle = 320;
arc3.setStroke('#7c3aed,8').addTo(model);

return model;
