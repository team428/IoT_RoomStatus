var svgWidth = 800;	// SVG 요소의 넓이
var svgHeight = 400;	// SVG 요소의 높이


var margin = {top: 40, right: 40, bottom: 60, left: 60},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

var scale = height/100;

//일단 아무값이나
var average_tick=10;

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
	{"time":'10:12',"value":90}

];

var parseDate = d3.time.format('%H:%M').parse;
var formatPercent = d3.format(".0%");

var ddata=[];
for(var i=0;i<dataSet.length;i++){
	ddata.push({"time" : parseDate(dataSet[i]["time"]) ,"value" : dataSet[i]["value"]});
}

drawScale();
drawGraph(dataSet, "graphline", "cardinal");	// 곡선으로 표시

// 그래프를 표시하는 함수
function drawGraph(dataSet, cssClassName, type){
	// 색칠 공부
	var area = d3.svg.area()	// svg 영역
	  .x(function(d, i){
			return margin.left + i * ( width / (dataSet.length-1) );	// X 좌표는 표시 순서×간격
		})
	  .y0(function(d, i){
			return svgHeight - margin.bottom;	// 데이터로부터 Y 좌표 빼기
		})
	  .y1(function(d, i){
			return svgHeight - d["value"] * scale  - margin.bottom;	// 데이터로부터 Y 좌표 빼기
		})
	  .interpolate(type)	//  그래프의 모양 설정

	// 그래프 그리기
	var lineElements = d3.select("#myGraph2")
	  .append("path")	// 데이터 수만큼 path 요소가 추가됨
	  .attr("class", "line "+cssClassName)	// CSS 클래스 지정
		.transition()
		.duration(2000)
	  .attr("d", area(dataSet))	//연속선 지정

		lineElements
			.remove()
}

function drawScale(){

//tick 기준 정할때 사용
	var average_tick_help=d3.extent ( ddata , function ( d ) { return d['time'] ; } );
	average_tick = (average_tick_help[1]-average_tick_help[0]) / ( 60 * 1000 * 9);

	// create an svg container
	var vis = d3.select("#myGraph2")
		.append("svg:svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	var yScale = d3.scale.linear()
		.domain([0, 1])
		.range([height,0]);

	var xScale = d3.time.scale()
		.domain( d3.extent ( ddata , function ( d ) { return d['time'] ; } ) )  // [최소,최대]
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


///x축 텍스트 적기

	vis.selectAll(".xaxis text")  // select all the text elements for the xaxis
			.transition()
			.duration(2000)
	 		.attr("transform", "rotate(-45)")
			.attr("dx","-3.3em")
			.attr("dy","0.7em")
			.style("text-anchor","start")



	//그리드

	var grid = d3.select("#myGraph2").append("g")

	var rangeX = d3.range( margin.left , width , 70 );
	var rangeY = d3.range( margin.bottom , height , 70 );


	grid.selectAll("line.y")	// line요소의 y 클래스를 선택
	  .data(rangeY)	// 세로 방향의 범위를 데이터셋으로 설정
	  .enter()
	  .append("line")	// line 요소 추가
	  .attr("class", "grid")	// CSS 클래스의 grid를 지정
		// (x1,y1)-(x2,y2)의 좌표값을 설정
	  .attr("x1", margin.left)              //x양 끝 틀
	  .attr("y1", function(d, i){
			return svgHeight - d - margin.bottom;
		})
	  .attr("x2", width + margin.left)
	  .attr("y2", function(d, i){
			return svgHeight - d - margin.bottom;
		})
	// 가로 방향의 그리드 생성
	grid.selectAll("line.x")	// line요소의 x 클래스를 선택
	  .data(rangeX)	// 가로 방향의 범위를 데이터셋으로 설정
	  .enter()
	  .append("line")	// line 요소 추가
	  .attr("class", "grid")	// CSS 클래스의 grid를 지정
		// (x1,y1)-(x2,y2)의 좌표값을 설정
	  .attr("x1", function(d, i){
			return d + margin.left;
		})
	  .attr("y1", svgHeight - margin.bottom)   //y 양끝
	  .attr("x2", function(d, i){
			return d + margin.left;
		})
	  .attr("y2", svgHeight -margin.bottom - height)

}

function updateData(data){
	var result = [];
	var last_result = [];
	var time=0,value=0;

	for(var i=0;i<data.length;i++){
		time = Math.random() * 60;
		value = Math.random() * 100;
		result={"time" : "10:"+time+"" ,"value" : value};
		last_result.push({"time" : parseDate(result["time"]) ,"value" : result["value"]});
	}
	return last_result;
}


setInterval(function(){
 	ddata = updateData(dataSet);
	drawScale();
	drawGraph(ddata, "graphline", "cardinal");
}, 2000);
