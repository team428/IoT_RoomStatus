$(function () {

	$(".tab-left").hide();
	$(".tab-left:first").show();

	$("ul.leftbar-content li").click(function (){
		$("ul.leftbar-content li").removeClass("active");
		$(this).addClass("active");
		$(".tab-left").hide()

		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn()
	});
});