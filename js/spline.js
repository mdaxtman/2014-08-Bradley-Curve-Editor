var width = 600,
    height = 300;

//scaled x and y vertices of graph to equal 0 - 1 for both axes
var scaler = function(rangeArray, domainArray){
 domainArray = domainArray || [0, 1];
 return d3.scale.linear().domain(domainArray).range(rangeArray);
};
var xScale = scaler([0, width]);
var yScale = scaler([height, 0]);
var bounceAxis = scaler([25, 275], [0,300]);

//graph points hashing distance and time
var axisCreator = function(inputScale, orientation){
 return d3.svg.axis()
          .scale(inputScale)
          .orient(orientation);
};
var xAxis = axisCreator(xScale, "bottom");
var yAxis = axisCreator(yScale, "left");
yAxis = yAxis.ticks(10, "%");


//creation of default nodes upon page load and assignment of position on the graph
var pointNumber = function(num){
 return d3.range(0, num).map(function(i) {
   return [(i * width / 5), (height-(i*50)) ];
  });
};
var points = pointNumber(6);

//create an svg element
var svgElem = d3.select("#ballWrapper")
                .append("svg")
                .attr("height", "300px")
                .attr("width", "140px");
  
//create an object to bounce in svg with fixed cx position
var objectCreator = function(objectType){
  return svgElem.append(objectType)
                .attr("cx", 25)
                .attr("r", 20);
};
var ballObject = objectCreator("circle");

////will be erased for test purposes only
setInterval(function(){
  ballObject.attr("cy", function(){
    var height = bounceAxis( points[0][1]);
    return height;
  }); 
},1000);

///////////////////////

var line = d3.svg.line();

var graph = d3.select("#curveEditor").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    ;

graph.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown);

var curve = graph.append("path")
    .datum(points)
    .attr("class", "line")
    .attr("id", "animCurve")
    .call(redraw);

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup)
    .on("keydown", keydown);

d3.select("#interpolate")
    .on("change", change)
  .selectAll("option")
    .data([
      "linear",
      "step-before",
      "step-after",
      "basis",
      "cardinal",
      "monotone"
    ])
  .enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });

graph.node().focus();

var dragged = null;
//the selected or previously selected point on the line
var selected = points[0];


function redraw() {
  graph.select("path").attr("d", line);

  var circle = graph.selectAll("circle")
      .data(points, function(d) { return d; });

  circle.enter().append("circle")
      .attr("r", 1e-6)
      .on("mousedown", function(d) { selected = dragged = d; redraw(); })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 6.5);

  circle
      .classed("selected", function(d) { return d === selected; })
      .attr("cx", function(d) { return d[0]; })
      .attr("cy", function(d) { return d[1]; });

  circle.exit().remove();

  if (d3.event) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}

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

// function updateAnim() {
//   document.getElementById('ball').style.webkitAnimationName = "none";
// }

