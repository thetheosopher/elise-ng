var model = elise.model(760, 420);
model.setFill('#f7fafc');

function label(text, x, y) {
    var t = elise.text(text, x, y, 210, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Balanced Arrow', 54, 38);
var arrow1 = elise.arrow(44, 110, 200, 82);
arrow1.setFill('#60a5fa').setStroke('#1d4ed8,3');
model.add(arrow1);

label('Long Head Arrow', 286, 38);
var arrow2 = elise.arrow(274, 102, 210, 94);
arrow2.headLengthScale = 0.48;
arrow2.headWidthScale = 0.9;
arrow2.shaftWidthScale = 0.22;
arrow2.setFill('#f97316').setStroke('#c2410c,3');
model.add(arrow2);

label('Wide Shaft Arrow', 534, 38);
var arrow3 = elise.arrow(522, 108, 180, 86);
arrow3.headLengthScale = 0.34;
arrow3.headWidthScale = 0.72;
arrow3.shaftWidthScale = 0.5;
arrow3.setFill('#22c55e').setStroke('#166534,3');
model.add(arrow3);

return model;
