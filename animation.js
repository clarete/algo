function $(id) {
  return document.getElementById(id);
}

function animate(opts) {
  var start = new Date;

  function frame() {
    var timePassed = new Date - start;
    var progress = Math.min(timePassed / opts.duration, 1);
    opts.step(opts.delta(progress));
    if (progress == 1) clearInterval(id);
  }
  var id = setInterval(frame, opts.delay || 10);
}

function deltaLinear(p) {
  return p;
}

function deltaQuad(p) {
  return Math.pow(p, 2);
}

function deltaBow(p, x) {
  x = x | 1.5;
  return Math.pow(p, 2) * ((x + 1) * p - x);
}

function move(elementId, deltaFunc) {
  var to = 850;

  animate({
    delay: 10,
    duration: 1000,
    delta: deltaFunc,
    step: function (delta) {
      $(elementId).style.left = to * delta + 'px'
    }
  });
}

function plotGraphBackground(canvas, context) {
  var step = 10;
  var ctx = context;

  for (var i = 1; i <= 29; i++) {
    ctx.setLineDash([1, step]);
    ctx.beginPath();
    ctx.moveTo(step * i, step);
    ctx.lineTo(step * i, canvas.offsetHeight);
    ctx.stroke();
    console.log(i);
  }
}

function drawPlan(elementId) {
  var canvas = $(elementId);
  var context = canvas.getContext('2d');
  plotGraphBackground(canvas, context);
}
