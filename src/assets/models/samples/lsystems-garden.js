var width = 1120;
var height = 760;
var model = elise.model(width, height);
model.setFill('#0b1510');

var bg = elise.rectangle(0, 0, width, height);
var g = elise.linearGradientFill('0,0', '0,' + height);
g.stops.push(elise.gradientFillStop('#13251a', 0));
g.stops.push(elise.gradientFillStop('#0f1b14', 0.6));
g.stops.push(elise.gradientFillStop('#0a140e', 1));
bg.setFill(g);
model.add(bg);

function lsystem(axiom, rules, depth) {
    var s = axiom;
    for (var i = 0; i < depth; i++) {
        var n = '';
        for (var j = 0; j < s.length; j++) {
            var ch = s.charAt(j);
            n += rules[ch] ? rules[ch] : ch;
        }
        s = n;
    }
    return s;
}

function turtleSegments(seq, startX, startY, len, angDeg) {
    var angle = -Math.PI / 2;
    var stack = [];
    var x = startX;
    var y = startY;
    var segs = [];
    var step = len;
    var turn = angDeg * Math.PI / 180;

    for (var i = 0; i < seq.length; i++) {
        var ch = seq.charAt(i);
        if (ch === 'F') {
            var nx = x + Math.cos(angle) * step;
            var ny = y + Math.sin(angle) * step;
            segs.push({ x1: x, y1: y, x2: nx, y2: ny });
            x = nx; y = ny;
        } else if (ch === '+') {
            angle += turn;
        } else if (ch === '-') {
            angle -= turn;
        } else if (ch === '[') {
            stack.push({ x: x, y: y, a: angle, s: step * 0.97 });
        } else if (ch === ']') {
            var st = stack.pop();
            if (st) {
                x = st.x; y = st.y; angle = st.a; step = st.s;
            }
        }
    }
    return segs;
}

var segs = [];
var plantSpecs = [
    { axiom: 'F', rules: { 'F': 'FF-[-F+F+F]+[+F-F-F]' }, depth: 4, x: 80, len: 7.8, turn: 20 },
    { axiom: 'F', rules: { 'F': 'F[+F]F[-F]F' }, depth: 5, x: 190, len: 7.2, turn: 21 },
    { axiom: 'X', rules: { 'X': 'F-[[X]+X]+F[+FX]-X', 'F': 'FF' }, depth: 5, x: 300, len: 7.4, turn: 23 },
    { axiom: 'F', rules: { 'F': 'FF+[+F-F-F]-[-F+F+F]' }, depth: 4, x: 410, len: 7.0, turn: 22 },
    { axiom: 'X', rules: { 'X': 'F[+X]F[-X]+X', 'F': 'FF' }, depth: 5, x: 520, len: 6.9, turn: 25 },
    { axiom: 'F', rules: { 'F': 'F[+F]F[-F][F]' }, depth: 5, x: 630, len: 6.7, turn: 19 },
    { axiom: 'X', rules: { 'X': 'F[-X][X]F[-X]+FX', 'F': 'FF' }, depth: 5, x: 740, len: 7.1, turn: 22 },
    { axiom: 'F', rules: { 'F': 'FF-[-F+F]+[+F-F]' }, depth: 5, x: 850, len: 6.8, turn: 24 },
    { axiom: 'X', rules: { 'X': 'F[+X][-X]FX', 'F': 'FF' }, depth: 5, x: 960, len: 6.9, turn: 26 },
    { axiom: 'F', rules: { 'F': 'F[+F]F[-F]F' }, depth: 5, x: 1040, len: 7.3, turn: 20 }
];

for (var p = 0; p < plantSpecs.length; p++) {
    var spec = plantSpecs[p];
    var seq = lsystem(spec.axiom, spec.rules, spec.depth);
    segs = segs.concat(turtleSegments(seq, spec.x, height - 18, spec.len, spec.turn));
}

var lines = [];
for (var i = 0; i < segs.length; i++) {
    var s = segs[i];
    var ln = elise.line(s.x1, s.y1, s.x1, s.y1);
    ln.setStroke('#6dbf76,1');
    model.add(ln);
    lines.push(ln);
}

var title = elise.text('L-System Garden', 16, 16, 360, 30);
title.setTypeface('Consolas, monospace');
title.setTypesize(24);
title.setFill('#cdeec9');
model.add(title);

var driver = elise.ellipse(-10, -10, 2, 2);
driver.setFill('#00000000');
driver.timer = 'tick';
model.add(driver);

model.controllerAttached.add(function (model, controller) {
    var h = new elise.ElementCommandHandler();
    h.attachController(controller);
    h.addHandler('tick', function (controller, el, command, trigger, parameters) {
        var t = parameters.elapsedTime;
        var reveal = Math.min(lines.length, Math.floor(t * 340));

        for (var i = 0; i < lines.length; i++) {
            var seg = segs[i];
            if (i < reveal) {
                lines[i].setP1(elise.point(seg.x1, seg.y1));
                lines[i].setP2(elise.point(seg.x2, seg.y2));
                var growth = Math.max(0, Math.min(1, (reveal - i) / 140));
                var a = Math.floor(90 + growth * 160);
                var gcol = Math.floor(150 + growth * 90);
                lines[i].setStroke(elise.color(a, 90, gcol, 110).toHexString() + ',1');
            } else {
                lines[i].setP1(elise.point(seg.x1, seg.y1));
                lines[i].setP2(elise.point(seg.x1, seg.y1));
            }
        }

        controller.invalidate();
    });
    controller.startTimer();
});

return model;
