﻿var model = elise.model(1024, 768);
model.setFill('White');
var modelUrl = 'https://s3-us-west-2.amazonaws.com/schematrix.elise/Elise/Models/Nature41.mdl';
var sketcher = elise.sketcher(modelUrl).addTo(model);
sketcher.timerDelay = 100;
sketcher.strokeBatchSize = 32;
sketcher.fillBatchSize = 64;
sketcher.sketchColor = false;
sketcher.strokeOpacity = 64;
return model;