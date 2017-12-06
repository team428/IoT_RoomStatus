var svgWidth = 800;
var svgHeight = 400;

var dataSet1 = [
		[1, 1], [2, 2], [3, 3], [4, 4], [1, 1],
		[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]
	];
// start format
var circleElements = d3.select("#myGraph")
  .selectAll("circle")
  .data(dataSet1)

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
/*
function updateData1(data){
	var result = data.map(function(d, i){	// count as many as the number of data
		var x = Math.random() * svgWidth;  // random x
		var y = Math.random() * svgHeight;  // radom y
		return [x, y];
	})
	return result;
}
*/

// renewal
function updateGraph1(){
	circleElements
	  .data(dataSet1)
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
/*
	dataSet1 = updateData1(dataSet1);	// new data
*/
	dataSet1 = d3.json("asdf.json", function(data){
		var datas=[];
		for(var i=0;i<datas.length;i++){
			datas.push(data[i][0],data[i][1]);
		}return datas;
	})

	updateGraph1();	// new graph
}, 2000);
