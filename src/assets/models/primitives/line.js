var model = elise.model(320, 320);
var l = elise.line();
l.p1 = '20,20';
l.p2 = '300,250';
l.stroke = '#60000000,10';
model.add(l);
elise.line(20, 20, 300, 150).setStroke('Green,3').addTo(model);
return model;
