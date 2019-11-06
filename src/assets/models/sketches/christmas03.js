﻿var model = elise.model(1024, 768);
model.setFill('White');
var modelUrl = 'https://s3-us-west-2.amazonaws.com/schematrix.elise/Elise/Models/Christmas03.mdl';
var sketcher = elise.sketcher(modelUrl).addTo(model);
sketcher.timerDelay = 200;
sketcher.strokeBatchSize = 16;
sketcher.fillBatchSize = 8;
sketcher.sketchColor = true;
sketcher.strokeOpacity = 48;
return model;