var model = elise.model(1024, 576);
model.setFill('White');
var modelUrl = 'https://s3-us-west-2.amazonaws.com/schematrix.elise/Elise/Models/Abstract01.mdl';
var sketcher = elise.sketcher(modelUrl).addTo(model);
sketcher.timerDelay = 20;
sketcher.strokeBatchSize = 8;
sketcher.fillBatchSize = 32;
sketcher.strokeOpacity = 64;
return model;
