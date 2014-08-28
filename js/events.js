function change() {
  line.interpolate(this.value);
  redraw();
}

function mousedown() {
  points.push(selected = dragged = d3.mouse(graph.node()));
  redraw();
}

function mousemove() {
  if (!dragged) return;
  var m = d3.mouse(graph.node());
  dragged[0] = Math.max(0, Math.min(width, m[0]));
  dragged[1] = Math.max(0, Math.min(height, m[1]));
  redraw();
}

var regEx = /[A-Z]/gi;

var roundIt = function(number) {
  number = number * 100;
  number = Math.round(number);
  return number / 100 ;
};

function mouseup() {
  if (!dragged) return;
  mousemove();
  dragged = null;

  var curveData = document.getElementById('animCurve');
  var curvePoints = curveData.getAttribute("d");
  // console.log(curvePoints);
  curvePoints = curvePoints.replace(regEx, ',');
  // console.log(curvePoints);
  curvePoints = curvePoints.split(',');
  // console.log(curvePoints);
  if (Array.isArray(curvePoints)) {
    for (var i = 0; i < curvePoints.length; i++ ) {
      curvePoints[i] = parseInt(curvePoints[i]);
    }
    console.log(curvePoints);

    var xDistance  = curvePoints[curvePoints.length-2] - curvePoints[1];
    console.log("curve X distance: " + xDistance);

    var curveLength = curve.node().getTotalLength();
    console.log("curveLength is: " + curveLength);

    d3.select('#cssData').selectAll("p").remove();

    for (var sIndex = 0; sIndex < 9; sIndex++ ) {
      var initX = curvePoints[1]+((xDistance/8)*sIndex);
      var start = initX;
      var end = curveLength;
      var target;
      while (true) {
          // console.log("begin: "+start);
          // console.log("end: "+end);
          // console.log("target: "+target);
          target = Math.floor((start + end) / 2);
          pos = curve.node().getPointAtLength(target);
          if ((target === end || target === start) && pos.x !== initX) {
              break;
          }
          if (pos.x > initX) end = target;
          else if (pos.x < initX) start = target;
          else break; //position found
      }

      var roundX = roundIt(xScale.invert(pos.x));
      var roundY = roundIt(yScale.invert(pos.y));
      // console.log("x / y intersect graph: " + [pos.x, pos.y]);
      // console.log("data intersect graph: " + [xScale.invert(pos.x), yScale.invert(pos.y)]);
      d3.select('#cssData').append("p").text(roundX+", "+ roundY);
    }
   
  }
}

function keydown() {
  if (!selected) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      var i = points.indexOf(selected);
      points.splice(i, 1);
      selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
      redraw();
      break;
    }
  }
}