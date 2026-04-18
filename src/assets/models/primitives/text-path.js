var model = elise.model(760, 440);
model.setFill('#f8fafc');

// Curved path - text along an arc
var tp1 = elise.textPath('Text Along a Curved Path', 'M 60 280 C 60 80, 360 80, 360 280');
tp1.typeface = 'Coda Caption';
tp1.typesize = 28;
tp1.fill = '#1e40af';
tp1.setShowPath(true);
tp1.setStartOffset(0);
model.add(tp1);

// S-curve path
var tp2 = elise.textPath('Winding Through an S-Curve', 'M 400 320 C 400 160, 560 160, 560 240 C 560 320, 720 320, 720 160');
tp2.typeface = 'Georgia';
tp2.typesize = 20;
tp2.typestyle = 'italic';
tp2.fill = '#9333ea';
tp2.stroke = '#9333ea40';
tp2.setShowPath(true);
model.add(tp2);

// Circular arc
var tp3 = elise.textPath('Elise Text Path Element', 'M 80 400 A 140 140 0 0 1 360 400');
tp3.typeface = 'Coda Caption';
tp3.typesize = 22;
tp3.fill = '#059669';
tp3.setAlignment('center');
tp3.setShowPath(true);
model.add(tp3);

return model;
