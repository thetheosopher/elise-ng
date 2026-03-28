var model = elise.model(760, 420);
model.setFill('#fcfaf5');

function addRow(label, y, decoration, spacing, style) {
    var name = elise.text(label, 54, y, 180, 36);
    name.fill = '#7c5e3a';
    name.typesize = 18;
    name.typeface = 'Coda Caption';
    model.add(name);

    var sample = elise.text('Decorated Elise Text', 240, y - 4, 470, 42);
    sample.fill = '#241c15';
    sample.typeface = 'Georgia';
    sample.typesize = 28;
    sample.alignment = 'left,middle';
    if (style) {
        sample.typestyle = style;
    }
    sample.setTextDecoration(decoration);
    sample.setLetterSpacing(spacing);
    model.add(sample);
}

addRow('Underline', 60, 'underline', 0, '');
addRow('Overline', 118, 'overline', 0, '');
addRow('Line Through', 176, 'line-through', 0, '');
addRow('Combined', 234, 'underline overline', 0, 'italic');
addRow('Wide Spacing', 292, undefined, 2.5, '');
addRow('Decorated + Spaced', 350, 'underline', 1.6, 'bold');

return model;
