var svgWidth = 800;
var svgHeight = 400;

drawmap("#student-restaurant-map");
drawmap("#ujeongdang-map");

function drawmap(targetID){
	var dataSet1 = [
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
			[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
		];

	// start format
	var circleElements = d3.select(targetID)
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

		var dataSet2 = [];

		circleElements
		  .data(dataSet1)
		  .transition()	// animation
	    .duration(1500)  // ani 2 second
	    .attr("cx", function(d, i){
				return d[0];
			})
		  .attr("cy", function(d, i){
				return svgHeight-d[1];
			})
			// delete dataSet
		
			circleElements
				.data(dataSet1)
				.transition()
				.delay(1900)
				.remove()
	}





	// timer two second interval
	setInterval(function(){
		var tmp;
		dataSet1 = [];
	/*
		dataSet1 = updateData1(dataSet1);	// new data
	*/
	/*
		for(var i=0;i<dataSet.length;i++){
			ddata.push({"time" : parseDate(dataSet[i]["time"]) ,"value" : dataSet[i]["value"]});
		}*/
		
		$.ajax({
			type:"POST",
			url:"/get_map_data",
			success:function(response){
			
			//var tmp = Object.keys(response).length;
			//var arr = $.map(obj, function(el) { return el });
			/*
			for(var i=0;i<Object.keys(response).length;i++){
				dataSet1.push(response[i]);
			}
			*/
			//document.write(response[1], "\n");
			for(var x in response){
				dataSet1.push(response[x]);
				updateGraph1();
			}
			//document.write(dataSet1);
		}
	});
		//console.log(dataSet1);
		//console.log(dataSet1);
		
		//updateGraph1();	// new graph

	}, 1500);
}