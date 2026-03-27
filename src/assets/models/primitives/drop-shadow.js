var model = elise.model(860, 560);
model.setFill('#f7f4ee');

function addLabel(content, x, y) {
    var label = elise.text(content, x, y, 160, 28);
    label.fill = '#5a4b3f';
    label.typesize = 16;
    label.typeface = 'Coda Caption';
    model.add(label);
}

addLabel('Rectangle', 52, 24);
elise.rectangle(48, 56, 220, 128)
    .setCornerRadius(24)
    .setFill('#ee8f6e')
    .setStroke('#74341f,4')
    .setShadow({ color: '#4a231680', blur: 18, offsetX: 12, offsetY: 10 })
    .addTo(model);

addLabel('Ellipse', 326, 24);
elise.ellipse(442, 120, 102, 66)
    .setFill('#5bb8aa')
    .setStroke('#1d5e60,4')
    .setShadow({ color: '#163b4066', blur: 20, offsetX: 10, offsetY: 14 })
    .addTo(model);

addLabel('Line', 626, 24);
var line = elise.line(610, 64, 794, 176);
line.setStroke('#355cdd,16');
line.lineCap = 'round';
line.setShadow({ color: '#1f2c5a7a', blur: 12, offsetX: 8, offsetY: 8 });
model.add(line);

addLabel('Text', 52, 230);
var title = elise.text('Elise\nShadow API', 48, 264, 280, 142);
title.fill = '#fff9f0';
title.stroke = '#8d2f2b,1';
title.typesize = 34;
title.typeface = 'Coda Caption';
title.alignment = 'center,middle';
title.setShadow({ color: '#541b1b8c', blur: 14, offsetX: 7, offsetY: 9 });
model.add(title);

addLabel('Polygon', 420, 230);
var polygon = elise.polygon();
var numpoints = 5;
var angle = Math.PI * 4 / numpoints;
var radius = 92;
var xc = 622;
var yc = 370;
for (var i = 0; i < numpoints + 1; i++) {
    var x = xc + radius * Math.cos(i * angle - Math.PI / 2);
    var y = yc + radius * Math.sin(i * angle - Math.PI / 2);
    polygon.addPoint(elise.point(x, y));
}
polygon.setFill('#f1c84a').setStroke('#7a5a00,5');
polygon.setWinding(elise.WindingMode.EvenOdd);
polygon.setShadow({ color: '#6d4f0080', blur: 22, offsetX: 14, offsetY: 14 });
model.add(polygon);

return model;
