var model = elise.model(820, 520);
model.setFill('#f7f7fb');

function label(text, x, y) {
    var t = elise.text(text, x, y, 220, 24);
    t.fill = '#111827';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Line Caps', 44, 24);
var caps = ['butt', 'round', 'square'];
for (var i = 0; i < caps.length; i++) {
    var y = 86 + i * 62;
    elise.line(70, y, 250, y)
        .setStroke('#2563eb,18')
        .setLineCap(caps[i])
        .addTo(model);
    var capLabel = elise.text(caps[i], 272, y - 16, 120, 32);
    capLabel.fill = '#334155';
    capLabel.typesize = 20;
    model.add(capLabel);
}

label('Dash Patterns', 430, 24);
elise.line(430, 88, 760, 88).setStroke('#0f766e,10').setLineCap('round').setStrokeDash([24, 16]).addTo(model);
elise.line(430, 150, 760, 150).setStroke('#b45309,10').setLineCap('square').setStrokeDash([10, 8, 2, 8]).addTo(model);
elise.rectangle(470, 194, 250, 96).setStroke('#7c3aed,8').setStrokeDash([18, 10]).addTo(model);

label('Line Joins', 44, 252);
var joins = ['miter', 'round', 'bevel'];
for (var j = 0; j < joins.length; j++) {
    var x = 60 + j * 240;
    var p = elise.polyline();
    p.addPoint(elise.point(x, 430));
    p.addPoint(elise.point(x + 60, 304));
    p.addPoint(elise.point(x + 120, 430));
    p.setStroke('#dc2626,20').setLineJoin(joins[j]).addTo(model);
    var joinLabel = elise.text(joins[j], x + 16, 456, 120, 26);
    joinLabel.fill = '#334155';
    joinLabel.typesize = 18;
    model.add(joinLabel);
}

return model;
