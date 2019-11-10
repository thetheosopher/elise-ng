﻿var model = elise.model(1024, 576);
model.setFill('White');
var modelUrl = 'https://s3-us-west-2.amazonaws.com/schematrix.elise/Elise/Models/Nature14.mdl';
var sketcher = elise.sketcher(modelUrl).addTo(model);
sketcher.timerDelay = 50;
sketcher.strokeBatchSize = 256;
sketcher.fillBatchSize = 128;
sketcher.sketchColor = true;
sketcher.strokeOpacity = 48;
return model;