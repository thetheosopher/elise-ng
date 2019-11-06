var model = elise.model(320, 320);
elise.rectangle(20, 20, 100, 100).setStroke('Black').setFill('Green').addTo(model);
var r1 = elise.rectangle();
r1.location = '20,150';
r1.size = '200x100';
r1.stroke = 'Brown,6';
r1.fill = '#60FFFF00';
model.add(r1);
return model;
