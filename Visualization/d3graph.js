var svgWidth = 800;
var svgHeight = 400;

var margin = {top: 40, right: 40, bottom: 60, left: 60},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

var scale = height/100;

var average_tick=10;
// something data
var dataSet = [
	{"time":'10:00',"value":0},
	{"time":'10:01',"value":20},
	{"time":'10:02',"value":10},
	{"time":'10:03',"value":30},
	{"time":'10:04',"value":50},
	{"time":'10:05',"value":90},
	{"time":'10:06',"value":40},
	{"time":'10:10',"value":20},
	{"time":'10:11',"value":40},
	{"time":'11:12',"value":90},
	{"time":'12:13',"value":30},
	{"time":'13:14',"value":60}
];

var parseDate = d3.time.format('%H:%M').parse;
var formatPercent = d3.format(".0%");

var ddata=[];
for(var i=0;i<dataSet.length;i++){
	ddata.push({"time" : parseDate(dataSet[i]["time"]) ,"value" : dataSet[i]["value"]});
}

drawScale();
drawGraph(dataSet, "graphline", "cardinal");	// as curve line

function drawGraph(dataSet, cssClassName, type){
	// fill color
	var area = d3.svg.area()	// svg area
		.x(function(d, i){
			return margin.left + i * ( width / (dataSet.length-1) );
		})
	  .y0(function(d, i){
			return svgHeight - margin.bottom;
		})
	  .y1(function(d, i){
			return svgHeight - d["value"] * scale  - margin.bottom;	// data - y axis
		})
	  .interpolate(type)	//  type of shape graph line

	// draw graph
	var lineElements = d3.select("#myGraph2")
	  .append("path")	// add the number of data as path
	  .attr("class", "line "+cssClassName)	// CSS class
		.transition()
		.duration(3000)
		 .style("fill","#154360")
	  .attr("d", area(dataSet))

		// delete data
		lineElements
			.remove()
}

function drawScale(){
	// standard tick
	var average_tick_help=d3.extent ( ddata , function ( d ) { return d['time'] ; } );
	average_tick = (average_tick_help[1]-average_tick_help[0]) / ( 60 * 1000 * 9);
	// create an svg container
	var vis = d3.select("#myGraph2")
		.append("svg:svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// delete x text
	vis.selectAll(".xaxis text")
	.remove()

	var yScale = d3.scale.linear()
		.domain([0, 1])
		.range([height,0]);

	var xScale = d3.time.scale()
		.domain( d3.extent ( ddata , function ( d ) { return d['time'] ; } ) )  // [minimum,maximum]
		.range([0,width]);

	var yAxis = d3.svg.axis()
			.ticks(6) // the number of x value
			.tickFormat(formatPercent) // mark %
			.orient("left") //location y axis
			.scale(yScale);

	var xAxis = d3.svg.axis()
			.ticks(d3.time.minutes, average_tick)
			.orient("bottom")
			.scale(xScale)

	vis.append("g")
			.attr("transform", "translate("+margin.left+","+margin.top+")")
			.call(yAxis);

	vis.append("g")
			.attr("class", "xaxis")
			.attr("transform", "translate("+margin.left+"," + (height+margin.top)  + ")")
			.call(xAxis);

			// x axis text
	vis.selectAll(".xaxis text")  // select all the text elements for the xaxis
			.transition()
			.duration(2000)
	 		.attr("transform", "rotate(-45)")
			.attr("dx","-3.3em")
			.attr("dy","0.7em")
			.style("text-anchor","start")

			// for grid
	var grid = d3.select("#myGraph2").append("g")
	var rangeX = d3.range( margin.left , width , 70 ); // grid interval
	var rangeY = d3.range( margin.bottom , height , 70 );

	grid.selectAll("line.y")	// y class of line
	  .data(rangeY)	// y axis range
	  .enter()
	  .append("line")	// add css line class
		.attr("class", "grid")
	  .attr("x1", margin.left)
	  .attr("y1", function(d, i){
			return svgHeight - d - margin.bottom;
		})
	  .attr("x2", width + margin.left)
	  .attr("y2", function(d, i){
			return svgHeight - d - margin.bottom;
		})

	grid.selectAll("line.x")
	  .data(rangeX)
	  .enter()
	  .append("line")
	  .attr("class", "grid")
	  .attr("x1", function(d, i){
			return d + margin.left;
		})
	  .attr("y1", svgHeight - margin.bottom)
	  .attr("x2", function(d, i){
			return d + margin.left;
		})
	  .attr("y2", svgHeight -margin.bottom - height)
}
/*
function updateData(data){
	var reserve = [];
	var result = [];
	var time ;
	var value ;

	for(var i=0 ; i < dataSet.length ; i++){
		reverse=[];
		time = Math.random() * 60;
		value = Math.random() * 100;
		reserve={"time" : "10:"+time+"" ,"value" : value};
		result.push({"time" : parseDate(reserve["time"]) ,"value" : reserve["value"]});
	}
	return result
}
*/

setInterval(function(){
/*
	ddata = updateData(dataSet);
*/
	ddata = 	dataSet1 = d3.json("asdf.json", function(data){
			var datas=[];
			for(var i=0;i<datas.length;i++){
				datas.push(data[i]["time"],data[i]["value"]);
			}return datas;
		})
	drawScale();
	drawGraph(ddata, "graphline", "cardinal");
}, 3000);
