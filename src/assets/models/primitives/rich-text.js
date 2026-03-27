var model = elise.model(760, 440);
model.setFill('#f7f2e8');

var heading = elise.text(' ', 40, 32, 680, 92);
heading.fill = '#2d241c';
heading.alignment = 'center,middle';
heading.setRichText([
    { text: 'Elise ', typeface: 'Coda Caption', typesize: 34 },
    { text: 'Rich', typeface: 'Coda Caption', typesize: 42, typestyle: 'bold', decoration: 'underline' },
    { text: ' Text', typeface: 'Coda Caption', typesize: 42, typestyle: 'italic', letterSpacing: 1.5 }
]);
model.add(heading);

elise.rectangle(40, 138, 680, 244)
    .setCornerRadius(28)
    .setFill('#fffdf9')
    .setStroke('#b7a793,2')
    .addTo(model);

var body = elise.text(' ', 72, 168, 616, 184);
body.fill = '#43352b';
body.typesize = 26;
body.typeface = 'Georgia';
body.alignment = 'left,top';
body.setRichText([
    { text: 'Rich text runs let one Elise text element mix ', typesize: 26 },
    { text: 'typefaces', typeface: 'Coda Caption', typesize: 24, typestyle: 'bold' },
    { text: ', ', typesize: 26 },
    { text: 'sizes', typesize: 34, typestyle: 'bold' },
    { text: ', ', typesize: 26 },
    { text: 'styles', typesize: 26, typestyle: 'italic' },
    { text: ', ', typesize: 26 },
    { text: 'spacing', typesize: 24, letterSpacing: 2.2 },
    { text: ', and ', typesize: 26 },
    { text: 'decoration', typesize: 26, decoration: 'underline line-through' },
    { text: ' without splitting the layout box into separate text elements.', typesize: 26 }
]);
model.add(body);

var footer = elise.text(' ', 56, 330, 648, 36);
footer.fill = '#7a5a3a';
footer.alignment = 'center,middle';
footer.setRichText([
    { text: 'Each run contributes to one flow layout with shared wrapping and alignment.', typesize: 16, letterSpacing: 0.4 }
]);
model.add(footer);

return model;
