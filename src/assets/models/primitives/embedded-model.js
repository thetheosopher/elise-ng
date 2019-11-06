var outer = elise.model(320, 320);

var red = elise.model(32, 32);
red.add(elise.ellipse(16, 16, 16, 16).setFill('Red'));

elise.modelResource('red_circle', red).addTo(outer);

elise.innerModel('red_circle', 32, 128, 128, 128).addTo(outer);
elise.innerModel('red_circle', 192, 64, 92, 92).setOpacity(0.5).addTo(outer);
elise.innerModel('red_circle', 224, 192, 48, 48).setOpacity(0.25).addTo(outer);

return outer;
