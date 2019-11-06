var model = elise.model(512, 1152);

function addColor(namedColor, x, y, width, height) {
    model.add(elise.rectangle(x, y, width - 32, height).setFill('White'));
    model.add(elise.rectangle(x, y, width, height).setStroke('Black'));
    model.add(elise.rectangle(x + width - 32, y, 32, height).setFill(namedColor.color.toString()).setStroke('Black'));
    var t = elise.text(namedColor.name, x + 2, y + 2, width - 4, height - 4).setFill('Black');
    t.typesize = 11;
    model.add(t);
}

var x = 0,
    y = 0,
    w = 128,
    h = 32;

    var i;
for (i = 0; i < elise.Color.NamedColors.length; i++) {
    addColor(elise.Color.NamedColors[i], x, y, w, h);
    x += w;
    if (x >= 512) {
        x = 0;
        y += h;
    }
}
return model;
