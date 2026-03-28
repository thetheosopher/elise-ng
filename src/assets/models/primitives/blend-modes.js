var model = elise.model(780, 460);
model.setFill('#f1f5f9');

function addBlendGroup(title, mode, x, y) {
    var cardX = x;
    var cardY = y + 36;
    var cardSize = 150;
    var centerX = cardX + cardSize / 2;
    var centerY = cardY + cardSize / 2;
    var radius = 44;

    var label = elise.text(title, x, y, 150, 24);
    label.fill = '#0f172a';
    label.typesize = 18;
    label.typeface = 'Coda Caption';
    model.add(label);

    elise.rectangle(cardX, cardY, cardSize, cardSize).setFill('#d7e0ea').setStroke('#b8c8d8,2').addTo(model);
    elise.ellipse(centerX - 22, centerY + 10, radius, radius).setFill('#ef4444d8').setBlendMode(mode).addTo(model);
    elise.ellipse(centerX + 22, centerY + 10, radius, radius).setFill('#22c55ed8').setBlendMode(mode).addTo(model);
    elise.ellipse(centerX, centerY - 22, radius, radius).setFill('#3b82f6d8').setBlendMode(mode).addTo(model);
}

addBlendGroup('Source Over', 'source-over', 42, 24);
addBlendGroup('Multiply', 'multiply', 230, 24);
addBlendGroup('Screen', 'screen', 418, 24);
addBlendGroup('Overlay', 'overlay', 606, 24);
addBlendGroup('Darken', 'darken', 136, 236);
addBlendGroup('Lighten', 'lighten', 418, 236);

return model;
