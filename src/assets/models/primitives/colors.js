﻿var model = elise.model(320, 320);
elise.rectangle(10, 10, 100, 100).setFill('#FF0000').addTo(model);
elise.rectangle(110, 10, 100, 100).setFill('#00FF00').addTo(model);
elise.rectangle(210, 10, 100, 100).setFill('#0000FF').addTo(model);
elise.rectangle(10, 110, 100, 100).setFill('Yellow').addTo(model);
elise.rectangle(110, 110, 100, 100).setFill('LightSkyBlue').addTo(model);
elise.rectangle(210, 110, 100, 100).setFill('BlanchedAlmond').addTo(model);
elise.rectangle(10, 210, 100, 100).setFill('#00000030').addTo(model);
elise.rectangle(110, 210, 100, 100).setFill('#00000080').addTo(model);
elise.rectangle(210, 210, 100, 100).setFill('#000000B0').addTo(model);
return model;
