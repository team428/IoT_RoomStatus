var svgWidth = 800;
var svgHeight = 400;
var margin = {top: 40, right: 40, bottom: 60, left: 60},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

var scale = height/100;

var parseDate = d3.time.format('%H:%M').parse;
var formatPercent = d3.format(".0%");

var ddata=[];

var average_tick=10;

drawScale();
drawGraph(ddata, "graphline", "cardinal");

function drawGraph(dataSet, cssClassName, type){

	var area = d3.svg.area()
	  .x(function(d, i){
			return margin.left + i * ( width / (dataSet.length-1) );
		})
	  .y0(function(d, i){
			return svgHeight - margin.bottom;
		})
	  .y1(function(d, i){
			return svgHeight - d["value"] * scale  - margin.bottom;
		})
	  .interpolate(type)

	var lineElements = d3.select("#myGraph2")
	  .append("path")
	  .attr("class", "line "+cssClassName)
	  .attr("d", area(dataSet))
		.transition()
		.duration(2000)

	lineElements
		.exit()
		.remove()
}

function drawScale(){
	var average_tick_help=d3.extent ( ddata , function ( d ) { return d['time'] ; } );
	average_tick = (average_tick_help[1]-average_tick_help[0]) / ( 60 * 1000 * 9);

	var vis = d3.select("#myGraph2")
		.append("svg:svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	var yScale = d3.scale.linear()
		.domain([0, 1])
		.range([height,0]);

	var xScale = d3.time.scale()
		.domain( d3.extent ( ddata , function ( d ) { return d['time'] ; } ) )
		.range([0,width]);

	var yAxis = d3.svg.axis()
			.ticks(6)
			.tickFormat(formatPercent)
			.orient("left")
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

	vis.selectAll(".xaxis text")
			.transition()
			.duration(2000)
	 		.attr("transform", "rotate(-45)")
			.attr("dx","-3.3em")
			.attr("dy","0.7em")
			.style("text-anchor","start")

	var grid = d3.select("#myGraph2").append("g")

	var rangeX = d3.range( margin.left , width , 70 );
	var rangeY = d3.range( margin.bottom , height , 70 );

	grid.selectAll("line.y")
	  .data(rangeY)
	  .enter()
	  .append("line")
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

function updateData(){

		 			d3.json("datagraph.json",function(error,data){
			       for(var i=0;i<data.length;i++){
				       ddata.push({"time":parseDate(data[i]["time"]),"value":data[i]["value"]});
			       }return result;
 		       })
}

setInterval(function(){
 	updateData();
	drawScale();
	drawGraph(ddata, "graphline", "cardinal");
}, 2000);
