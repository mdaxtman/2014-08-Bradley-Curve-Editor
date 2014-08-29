//create an svg element
var bounceAxis = scaler([25, 275], [0,300]);
var timeScale = scaler([0,2000],[0,600]);
var svgElem = d3.select("#ballWrapper")
                .append("svg")
                .attr("height", "300px")
                .attr("width", "140px")
                .attr("class", "balls");
  
//create an object to bounce in svg with fixed cx position
var objectCreator = function(objectType){
  var yPoints = [];
  for(var i = 0; i < points.length; i++){
    yPoints.push(points[i][1]);
  }
  // yPoints = [yPoints];
  return svgElem.selectAll(objectType)
                .data(yPoints)
                .enter()
                .append(objectType)
                .attr("cx", 25)
                .attr("cy", function(d){
                  return bounceAxis( d );  
                })
                .attr("r", 20)
                .attr("id", "object");
};
//create ball object to animate
var nodes = d3.select("g").selectAll("circle").attr("class", "nodes");
var time = [];

var drag = d3.behavior.drag()
  .on("drag", function(d, i){
    console.log("should be smaller", d[0]);
    console.log("should be bigger", time[i+1]);
    if(d[0] > time[i + 1]){
      d[0] = time[i + 1];
    }
    if(d[0] < time[i - 1]){
      d[0] = time[i - 1];
    }  
    d3.selectAll(".nodes")
      .attr("cx", function(d){
        return d[0];
      });
  });
d3.selectAll(".nodes").call(drag);

setInterval(function(){
  time = [];
  points.forEach(function(val){
    time.push(val[0]);
  });
  ballObject = objectCreator("circle");
  ballObject.style("visibility", function(d,i){
    if(i === 0){
      return "visible";
    }else{
      return "hidden";
    } 
  });
var animationLapse = (timeScale( time[1] ) - timeScale( time[0]) );
  var t0 = ballObject.transition()
    .duration(animationLapse)
    .ease("linear")
    //.delay(function(d, i){ return i * 50;})
    .attr("cy", function(d, i){
      if(points[i+1] !== undefined){
        var val = points[i + 1][1]; 
        return bounceAxis(val);
      }else{
        return bounceAxis(points[i][1]);
      }
      //|| points[i][1];
    })
    .each("end", function(d, i){
      animationLapse = timeScale(time[i+1]) - timeScale(time[i]);
  console.log(animationLapse);
      d3.select(this).remove();
    })
    .delay(function(d, i){ 
      return i * animationLapse;
    })
    .style("visibility", "visible");
},2000);





