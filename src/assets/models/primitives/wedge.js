var model = elise.model(760, 420);
model.setFill('#f9fafb');

function label(text, x, y) {
    var t = elise.text(text, x, y, 200, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Quarter Sector', 44, 24);
var wedge1 = elise.wedge(38, 66, 184, 184);
wedge1.startAngle = 270;
wedge1.endAngle = 25;
wedge1.setFill('#38bdf8').setStroke('#0c4a6e,3').addTo(model);

label('Large Sweep', 286, 24);
var wedge2 = elise.wedge(280, 66, 184, 184);
wedge2.startAngle = 210;
wedge2.endAngle = 60;
wedge2.setFill('#f97316').setStroke('#9a3412,3').addTo(model);

label('Elliptical Sector', 528, 24);
var wedge3 = elise.wedge(512, 82, 192, 150);
wedge3.startAngle = 320;
wedge3.endAngle = 145;
wedge3.setFill('#a855f7').setStroke('#6b21a8,3').addTo(model);

return model;
