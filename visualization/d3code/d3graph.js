var svgWidth = 600;	// SVG 요소의 넓이
var svgHeight = 300;	// SVG 요소의 높이
var offsetX = 30;	// 가로 오프셋
var offsetY = 20;	// 세로 오프셋
var scale = 2.0;	// 2배 크기로 그리기

var dataSet1 = [
	{"time":'10:01',"value":10},
	{"time":'10:02',"value":40},
	{"time":'10:03',"value":50},
	{"time":'10:04',"value":60},
	{"time":'10:05',"value":30},
	{"time":'10:06',"value":40},
];

var parseDate = d3.time.format("%H:%M").parse;
var formatPercent = d3.format(".0%");


var margin = svgWidth /(dataSet1.length - 1);	// 꺾은선 그래프의 간격 계산
drawGraph(dataSet1, "graphline", "basis");	// 곡선으로 표시
drawScale();	// 눈금 표시
// 꺾은선 그래프를 표시하는 함수
function drawGraph(dataSet, cssClassName, type){
	// 영역 안이 좌표값을 계산하는 메서드
	var area = d3.svg.area()	// svg 영역
	  .x(function(d, i){
			return offsetX + i * margin;	// X 좌표는 표시 순서×간격
		})
	  .y0(function(d, i){
			return svgHeight - offsetY;	// 데이터로부터 Y 좌표 빼기
		})
	  .y1(function(d, i){
			return svgHeight - (d["value"] * scale) - offsetY;	// 데이터로부터 Y 좌표 빼기
		})
	  .interpolate(type)	// 꺾은선 그래프의 모양 설정
	// 꺾은선 그래프 그리기
	var lineElements = d3.select("#myGraph2")
	  .append("path")	// 데이터 수만큼 path 요소가 추가됨
	  .attr("class", "line "+cssClassName)	// CSS 클래스 지정
	  .attr("d", area(dataSet))	//연속선 지정
}
// 그래프의 눈금을 표시하는 함수
function drawScale(){
	// 눈금을 표시하기 위한 D3 스케일 설정
	var yScale = d3.scale.linear()  // 스케일 설정
	  .domain([0, 100])   // 원래 크기
	  .range([2.5*100, 0]) // 실제 표시 크기
	// 눈금 표시
	d3.select("#myGraph2")	// SVG 요소를 지정
		  .append("g")	// g 요소 추가. 이것이 눈금을 표시하는 요소가 됨
		  .attr("class", "axis")	// CSS 클래스 지정
		  .attr("transform", "translate("+offsetX+", "+offsetY+")")
		  .call(
				d3.svg.axis()
			  .scale(yScale)  //스케일 적용
			  .orient("left") //눈금 표시 위치를 왼쪽으로 지정
			)

		var xScale = d3.scale.linear()  // 스케일 설정
		  .domain([0, 400])   // 원래 크기
		  .range([0, svgWidth]) // 실제 표시 크기
		// 가로 방향의 선을 표시
		d3.select("#myGraph2")	// SVG 요소를 지정
			  .append("g")	// g 요소 추가. 이것이 눈금을 표시하는 요소가 됨
			  .attr("class", "axis")	// CSS 클래스 지정
			  .attr("transform", "translate("+offsetX+", "+(svgHeight-offsetY)+")")
			  .call(
					d3.svg.axis()
				  .scale(xScale)  //스케일 적용
				  .orient("bottom") //눈금 표시 위치를 왼쪽으로 지정
				)


				// 그리드 표시
		var grid = svg.append("g")
				// 시작 종료 간격
		var rangeX = d3.range(50, 100, 50);
		var rangeY = d3.range(10, 100, 10);
				// 세로 방향 그리드 생성
		grid.selectAll("line.y")	// line요소의 y 클래스를 선택
		  .data(rangeY)	// 세로 방향의 범위를 데이터셋으로 설정
		  .enter()
		  .append("line")	// line 요소 추가
		  .attr("class", "grid")	// CSS 클래스의 grid를 지정
					// (x1,y1)-(x2,y2)의 좌표값을 설정
		  .attr("x1", offsetX)
		  .attr("y1", function(d, i){
				return svgHeight - d - offsetY;
			})
		  .attr("x2", maxX + offsetX)
		  .attr("y2", function(d, i){
				return svgHeight - d - offsetY;
			})
				// 가로 방향의 그리드 생성
		grid.selectAll("line.x")	// line요소의 x 클래스를 선택
		  .data(rangeX)	// 가로 방향의 범위를 데이터셋으로 설정
		  .enter()
		  .append("line")	// line 요소 추가
		  .attr("class", "grid")	// CSS 클래스의 grid를 지정
					// (x1,y1)-(x2,y2)의 좌표값을 설정
		  .attr("x1", function(d, i){
				return d + offsetX;
			})
		  .attr("y1", svgHeight - offsetY)
		  .attr("x2", function(d, i){
				return d + offsetX;
			})
		  .attr("y2", svgHeight -offsetY - maxY)
}




setInterval(function(){
	dataSet = updateData(dataSet);	// 데이터 갱신
	updateGraph();	// 그래프 갱신
}, 2000);
