var svgWidth = 800;
var svgHeight = 400;

var dataSet = [
		[1, 1], [2, 2], [3, 3], [4, 4], [1, 1],
		[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]
	];
// start format
var circleElements = d3.select("#myGraph")
  .selectAll("circle")
  .data(dataSet)

circleElements
  .enter()
  .append("circle")	// count, read data
  .attr("class", "mark")
  .attr("cx", function(d, i){
		return d[0];	// x axis
	})
  .attr("cy", function(d, i){
		return svgHeight-d[1];	// y axis
	})
  .attr("r", 5)	// circle size

function updateData(data){
	var result = data.map(function(d, i){	// count as many as the number of data
		var x = Math.random() * svgWidth;  // random x
		var y = Math.random() * svgHeight;  // radom y
		return [x, y];
	})
	return result;
}
// renewal
function updateGraph(){
	circleElements
	  .data(dataSet)
	  .transition()	// animation
    .duration(2000)  // ani 2 second
    .attr("cx", function(d, i){
			return d[0];
		})
	  .attr("cy", function(d, i){
			return svgHeight-d[1];
		})
		// delete dataSet
	circleElements
		.exit()
		.remove()
}
// timer two second interval
setInterval(function(){
	dataSet = updateData(dataSet);	// new data
	updateGraph();	// new graph
}, 2000);
