﻿var model = elise.model(320, 320);
var p = elise.path();
p.commands =
    'm82,76 l82,78 c83,87,86,94,92,100 c98,105,106,108,114,108 ' +
    'c123,108,131,105,137,99 c143,93,147,85,147,76 c147,59,140,44,127,32 ' +
    'c114,19,98,13,80,13 c62,13,47,19,34,31 c22,43,15,57,14,75 ' +
    'c13,65,16,57,22,51 c28,45,36,42,46,42 c56,42,64,45,71,52 ' +
    'c78,58,82,66,82,76 z m126,77 c126,80,125,83,123,85 c120,87,118,88,114,88 ' +
    'c111,88,108,87,106,85 c104,83,103,80,103,77 c103,74,104,71,106,69 ' +
    'c108,67,111,66,114,66 c118,66,120,67,123,69 c125,71,126,74,126,77 z ' +
    'm54,77 c54,75,53,73,52,72 c50,70,48,70,46,70 c44,70,42,70,41,72 ' +
    'c39,73,39,75,39,77 c39,79,39,81,41,82 c42,84,44,85,46,85 c48,85,50,84,52,82 ' +
    'c53,81,54,79,54,77 z m155,77 c155,97,148,114,133,128 c119,143,101,150,80,150 ' +
    'c60,150,42,143,27,129 c13,114,5,97,5,77 c5,57,13,40,27,26 ' +
    'c42,11,60,4,80,4 c101,4,119,11,133,26 c148,40,155,57,155,77 z';
p.setStroke('Black,1').setFill('#66F511E6').scale(2, 2);
model.add(p);
return model;
