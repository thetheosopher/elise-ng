﻿var model = elise.model(320, 320);
model.setBasePath('./assets/models/primitives');
elise.bitmapResource('bulb', '/images/bulb.png').addTo(model);
var ie = elise.image('bulb', 20, 20, 128, 128);
ie.opacity = 0.6;
model.add(ie);
var ie2 = elise.image('bulb', 160, 80, 64, 64);
ie2.opacity = 0.9;
model.add(ie2);
return model;
