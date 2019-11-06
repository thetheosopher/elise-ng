var model = elise.model(320, 320);
var t1 = elise.text(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in condimentum justo.',
    16,
    16,
    320 - 32,
    320 - 32
);
t1.stroke = 'Blue';
t1.fill = '#A0C390D4';
t1.typesize = 30;
t1.typeface = 'Coda Caption';
t1.alignment = 'center,middle';
model.add(t1);
return model;
