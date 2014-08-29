var width = 600,
    height = 300;

//scaled x and y vertices of graph to equal 0 - 1 for both axes
var scaler = function(rangeArray, domainArray){
 domainArray = domainArray || [0, 1];
 return d3.scale.linear().domain(domainArray).range(rangeArray);
};
var xScale = scaler([0, width]);
var yScale = scaler([height, 0]);


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
var points = pointNumber(2);

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

//the first focused or previously selected point on the line
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



// function updateAnim() {
//   document.getElementById('ball').style.webkitAnimationName = "none";
// }

