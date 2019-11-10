﻿var model = elise.model(1024, 640);
model.setFill('White');
var modelUrl = 'https://s3-us-west-2.amazonaws.com/schematrix.elise/Elise/Models/Mountains2.mdl';
var sketcher = elise.sketcher(modelUrl).addTo(model);
sketcher.timerDelay = 50;
sketcher.strokeBatchSize = 32;
sketcher.fillBatchSize = 16;
sketcher.sketchColor = true;
sketcher.strokeOpacity = 48;
return model;