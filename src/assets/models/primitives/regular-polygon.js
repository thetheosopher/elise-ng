var model = elise.model(760, 420);
model.setFill('#f6f7fb');

function label(text, x, y) {
    var t = elise.text(text, x, y, 220, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Hexagon', 66, 24);
var hexagon = elise.regularPolygon(52, 64, 170, 170);
hexagon.sides = 6;
hexagon.rotation = -90;
hexagon.setFill('#60a5fa').setStroke('#1d4ed8,3').addTo(model);

label('Five Point Star', 286, 24);
var star = elise.regularPolygon(276, 58, 184, 184);
star.sides = 5;
star.innerRadiusScale = 0.48;
star.rotation = -90;
star.setFill('#fb7185').setStroke('#9f1239,3').addTo(model);

label('Eight Point Starburst', 526, 24);
var burst = elise.regularPolygon(520, 60, 178, 178);
burst.sides = 8;
burst.innerRadiusScale = 0.68;
burst.rotation = -90;
burst.setFill('#fbbf24').setStroke('#b45309,3').addTo(model);

return model;
