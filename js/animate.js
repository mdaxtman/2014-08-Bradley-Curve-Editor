//create an svg element
var bounceAxis = scaler([25, 275], [0,300]);
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

d3.select("g").selectAll("circle").attr("class", "nodes");

setInterval(function(){
  ballObject = objectCreator("circle");
  ballObject.style("visibility", function(d,i){
    if(i === 0){
      return "visible";
    }else{
      return "hidden";
    } 
  });
  ballObject.transition()
    .duration(400)
    .ease("linear")
    .delay(function(d, i){ return i * 50;})
    .attr("cy", function(d, i){
      console.log(points);
      if(points[i+1] !== undefined){
        var val = points[i + 1][1]; 
        return bounceAxis(val);
      }else{
        return bounceAxis(points[i][1]);
      }
      //|| points[i][1];
    })
    .each("end", function(d, i){
      d3.select(this).remove();
    })
    .delay(function(d, i){ 
      return i * 400;
    })
    .style("visibility", "visible");
},2000);





