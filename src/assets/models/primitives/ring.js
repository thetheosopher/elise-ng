var model = elise.model(760, 420);
model.setFill('#f8fafc');

function label(text, x, y) {
    var t = elise.text(text, x, y, 210, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Standard Annulus', 50, 24);
var ring1 = elise.ring(42, 70, 176, 176);
ring1.innerRadiusScale = 0.56;
ring1.setFill('#60a5fa').setStroke('#1d4ed8,3').addTo(model);

label('Wide Elliptical Ring', 270, 24);
var ring2 = elise.ring(258, 92, 220, 132);
ring2.innerRadiusScale = 0.42;
ring2.setFill('#fb7185').setStroke('#9f1239,3').addTo(model);

label('Thin Ring', 548, 24);
var ring3 = elise.ring(548, 78, 150, 150);
ring3.innerRadiusScale = 0.78;
ring3.setFill('#22c55e').setStroke('#166534,3').addTo(model);

return model;
