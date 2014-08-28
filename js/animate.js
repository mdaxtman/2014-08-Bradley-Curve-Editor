//create an svg element
var svgElem = d3.select("#ballWrapper")
                .append("svg")
                .attr("height", "300px")
                .attr("width", "140px")
                .attr("id", "ball");
  
//create an object to bounce in svg with fixed cx position
var objectCreator = function(objectType){
  return svgElem.append(objectType)
                .attr("cx", 25)
                .attr("r", 20);
};
//create ball object to animate
var ballObject = objectCreator("circle");

//animation function
var animateObject = function(list){
  ballObject.attr("cy", bounceAxis(list[0][1] ) );
  var clone = list.slice();
  var recurse = function(list, delay){
    //var delay = function(d, i){ return i * 1000}
    var first = list.shift();
    var t0 = ballObject.transition()
      .duration(1000)
      .attr("cy", bounceAxis(first[1]) );
    if(list.length > 0){
        recurse(list);
    }
  };    
  recurse(clone);
};

setInterval(function(){
  animateObject(points);
}, 1000);