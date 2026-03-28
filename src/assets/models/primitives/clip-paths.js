var model = elise.model(780, 460);
model.setFill('#eef3f7');

function label(text, x, y) {
    var t = elise.text(text, x, y, 200, 28);
    t.fill = '#1f2937';
    t.typesize = 18;
    t.typeface = 'Coda Caption';
    model.add(t);
}

label('Object Bounding Box Clip', 48, 24);
var skyFill = elise.linearGradientFill('48,60', '268,280');
skyFill.addFillStop('#60a5fa', 0);
skyFill.addFillStop('#1d4ed8', 1);
elise.rectangle(48, 60, 220, 220)
    .setFill(skyFill)
    .setStroke('#1e3a8a,2')
    .setClipPath({
        units: 'objectBoundingBox',
        commands: [
            'm0.14,0.1',
            'l0.86,0.1',
            'l0.96,0.5',
            'l0.86,0.9',
            'l0.14,0.9',
            'l0.04,0.5',
            'z'
        ]
    })
    .addTo(model);

label('User Space Clip', 304, 24);
elise.ellipse(414, 170, 110, 110)
    .setFill('#fb7185')
    .setStroke('#9f1239,3')
    .setClipPath({
        commands: [
            'm348,94',
            'l492,94',
            'l556,170',
            'l492,246',
            'l348,246',
            'l284,170',
            'z'
        ]
    })
    .addTo(model);

label('Clipped Text Block', 534, 24);
elise.rectangle(528, 60, 210, 220).setFill('#ffffff').setStroke('#cbd5e1,2').addTo(model);
var clippedText = elise.text('Clip paths can trim any renderable element, including text.', 544, 86, 178, 168);
clippedText.fill = '#0f172a';
clippedText.typeface = 'Georgia';
clippedText.typesize = 24;
clippedText.alignment = 'center,middle';
clippedText.setClipPath({
    units: 'objectBoundingBox',
    commands: ['m0.12,0', 'l1,0', 'l0.88,1', 'l0,1', 'z']
});
model.add(clippedText);

return model;
