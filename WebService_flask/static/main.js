


function get_map_data(){
	var target_variable;
	$.ajax({
		type:"POST",
		url:"/get_map_data",
		success:function(response){
			target_variable = response;
		}
	});
	return target_variable;
}


function get_graph_data(){
	var target_variable;
	$.ajax({
		type:"POST",
		url:"/get_graph_data",
		success:function(response){
			target_variable = response;
		}
	});
	return target_variable;
}
