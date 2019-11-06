var model = elise.model(320, 320);
model.setBasePath('./assets/models/primitives');
elise.modelResource('yinyang', '/models/yin-yang/').addTo(model);
model.add(elise.innerModel('yinyang', 20, 20, 256, 256));
return model;
