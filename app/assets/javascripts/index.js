//移动到当前坐标的位置
var geolocation = new BMap.Geolocation();
//通过百度地图获取当前位置
var point = new BMap.Point(121.480241,31.236303);

//用来筛选地理位置
var code = "0";
//用来筛选车库的
var garage_uuid = "0";
//获取星期几
var weekVal = "";
//筛选日期的开始和结束日期
var date = new Date();
var start_date = date.getDate()+"/"+(date.getMonth() + 1)+"/"+date.getFullYear();
//30天之前			
var lastMonth = new Date(date.getTime() - (30*24*60*60*1000));
var end_date = lastMonth.getDate()+"/"+(lastMonth.getMonth() + 1)+"/"+lastMonth.getFullYear();


var plot2 = null;

//加载省份信息
function getProvinces(provincesId, cityId){
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/localities.json?level=1",
		success:function(data){
			for (var i = 0; i < data.length; i++){
				provincesId.append(new Option(data[i].name,data[i].code)); 
			}
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
	loadGarageName();
}
//加载城市信息,改变Provinces下拉框的事件
function changeProvinces(cityId,areasId, blocksId, parentId){
	cityId.html ("<option value=\"0\">(All)</option>");
	areasId.html ("<option value=\"0\">(All)</option>");
	blocksId.html ("<option value=\"0\">(All)</option>");
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/localities.json?level=2&parentId="+parentId,
		success:function(data){
			
			for (var i = 0; i < data.length; i++){
				cityId.append(new Option(data[i].name,data[i].code)); 
			}
			cityId.prop("disabled", false);
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
	if (parentId == "0"){
		loadGarageName();
	}else{
		linkageGarageName(parentId);
	}
}
//加载区域信息,改变city下拉框的事件
function changeCity(areasId, blocksId, parentId){
	areasId.html ("<option value=\"0\">(All)</option>");
	blocksId.html ("<option value=\"0\">(All)</option>");
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/localities.json?level=3&parentId="+parentId,
		success:function(data){
			for (var i = 0; i < data.length; i++){
				areasId.append(new Option(data[i].name,data[i].code)); 
			}
			areasId.prop("disabled", false); 
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
	if (parentId == "0"){
		linkageGarageName($("#provinces").find('option:selected').val());
	}else{
		linkageGarageName(parentId);
	}
}
//加载街道信息改变areas下拉框的事件
function changeAreas(blocksId, parentId){
	blocksId.html ("<option value=\"0\">(All)</option>");
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/localities.json?level=4&parentId="+parentId,
		success:function(data){
			for (var i = 0; i < data.length; i++){
				blocksId.append(new Option(data[i].name,data[i].code)); 
			}
			blocksId.prop("disabled", false); 
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
	if (parentId == "0"){
		linkageGarageName($("#citys").find('option:selected').val());
	}else{
		linkageGarageName(parentId);
	}
}
//加载车库名称信息改变blocks下拉框的事件
function changeBlocks(parentId){
	if (parentId == "0"){
		linkageGarageName($("#areas").find('option:selected').val());
	}else{
		linkageGarageName(parentId);
	}
}
//加载省市区街道信息
function loadLocalityContent(provinces, city, areas, blocks){
	provinces.html ("<option value=\"0\">(All)</option>");
	city.html ("<option value=\"0\">(All)</option>");
	areas.html ("<option value=\"0\">(All)</option>");
	blocks.html ("<option value=\"0\">(All)</option>");
	$("#garage_name").html ("<option value=\"0\">(All)</option>");
	$("#garage_name").html ("<option value=\"0\">(All)</option>");
	getProvinces(provinces, city);
	city.prop("disabled", true);
	areas.prop("disabled", true);
	blocks.prop("disabled", true);
}

//加载车库名称信息
function loadGarageName(){
	$("#garage_name").html ("<option value=\"0\">(All)</option>");
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/information.json",
		success:function(data){
			for (var i = 0; i < data.length; i++){
				$("#garage_name").append(new Option(data[i].garage_name,data[i].uuid));
			}
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});

}

//联动地理位置，改变车库名
function linkageGarageName(parentId){
	$("#garage_name").html ("<option value=\"0\">(All)</option>");
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/localities.json?level=5&parentId="+parentId,
		success:function(data){
			for (var i = 0; i < data.length; i++){
				var  garageNum =  data[i].garageNum;
				$.ajax({
					type:"GET",
					dataType:'json',
					url:"/information.json?uuid="+ garageNum,
					success:function(rep){
						for (var j = 0; j < rep.length; j++){
							$("#garage_name").append(new Option(rep[j].garage_name,garageNum)); 
						}
					},
					error: function(){
						alert ("请求发送失败，请稍候再试");
					}
				});
					
			}
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});

}



$(document).ready(function(){
	setVisibleHeight();
	//设置显示当天的时间
	showCurrentTime($("#mapCurrentTime"));
	initMap(point);
	getStatusAjax(code);
	//显示地图主页
	setVisibleHeight();
	//获取位置信息
	loadLocalityContent($("#provinces"), $("#city"), $("#areas"), $("#blocks"));
	//获取车库名称和UUID
	//loadGarageName();
	$("#mapCanvas").focus();
	/*左侧导航栏*/
	$("#home").click(function(e){
		revertBackgroundAndColor();
		setBackgroundAndColor($(this));
		//设置显示当天的时间
		showCurrentTime($("#mapCurrentTime"));
		//显示homeContent
		hiddenContent($("#homeContent"));
		hiddenContent($("#occupancyContent"));
		hiddenContent($("#analyticsContent"));
		showContent($("#homeContent"));
		
		initMap(point);
		$("#mapCanvas").focus();
	});
	//显示停车空闲数据
	$("#occupancy").click(function(e){
		revertBackgroundAndColor();
		setBackgroundAndColor($(this));
		//设置显示当天的时间
		showCurrentTime($("#currentTime"));
		
		//显示occupancyContent
		hiddenContent($("#homeContent"));
		showContent($("#analyticsContent"));
		
		hiddenContent($('#changeTable'));
		showContent($('#changeOccupancy'));
		
		showContent($("#occupancyContent"));
		hiddenContent($('#analyticsData'));
		
		showContent($("#status"));
		hiddenContent($('#garageName'));
		hiddenContent($('#dateRange'));
		hiddenContent($('#weekDay'));
		hiddenContent($('#tabOccupancy'));
		hiddenContent($('#weekStarting'));
		//从数据库加载状态表的信息
		getStatusAjax(code);
		//设置表格背景色 hsl(115, 80%, 60%)   red darkgray
		
	});
	//显示数据分析
	$("#analytics").click(function(e){
		revertBackgroundAndColor();
		setBackgroundAndColor($(this));
		//设置显示当天的时间
		showCurrentTime($("#currentTime"));
		//显示日期区间
		showContent($("#dateRange"));
		showDateRange();
		//显示analyticsContent
		hiddenContent($("#homeContent"));
		showContent($("#analyticsContent"));
		
		hiddenContent($('#changeOccupancy'));
		showContent($('#changeTable'));
		
		showContent($("#analyticsData"));
		hiddenContent($('#occupancyContent'));
		
		
		hiddenContent($('#status'));
		if($("#chart").is(":visible")){
			showContent($("#garageName"));
			showContent($("#weekStarting"));
			hiddenContent($('#tabOccupancy'));
			hiddenContent($('#weekDay'));
			showBarCharts(code, garage_uuid, $("#firstWeek").text(), $("#secondWeek").text(), $("#thirdWeek").text(), $("#fourthWeek").text());
		}else if ($("#analytics-occupancy").is(":visible")){
			showContent($("#tabOccupancy"));
			showContent($("#weekDay"));
			hiddenContent($('#weekStarting'));
			hiddenContent($('#garageName'));
			
			getVelocities(code, start_date, end_date, weekVal);
			/*
			//设置表格背景色 hsl(120, 8%, 100%)
			$("#analyticsTable td").each(function(i, n) {
				if (i % 16 != 0){
					setBackgroundColor($(this),"hsl(120,"+$(this).text()+", 50%)");
				}
			});
			*/
		}
	});
	
	/*查找区域地图*/
	$("#searchBtn").click(function(){
		searchMap();
	});
	
	/*切换选择柱状图或者车库数据分析表格*/
	$("#changeTable").change(function(){
		//显示日期区间
		showDateRange();
		if($(this).val() == "turnover"){
			$("#analyticsData h3").text($(this).find('option:selected').text());
			
			showContent($("#chart"));
			hiddenContent($('#analytics-occupancy'));
			
			showContent($("#garageName"));
			showContent($("#weekStarting"));
			hiddenContent($('#tabOccupancy'));
			hiddenContent($('#weekDay'));
		}else{
			$("#analyticsData h3").text($(this).find('option:selected').text());
			hiddenContent($("#chart"));
			showContent($("#analytics-occupancy"));
			
			showContent($("#tabOccupancy"));
			showContent($("#weekDay"));
			hiddenContent($('#weekStarting'));
			hiddenContent($('#garageName'));
			getVelocities(code, start_date, end_date, weekVal);
			/*
			//设置表格背景色 hsl(120, 8%, 100%)
			$("#analyticsTable td").each(function(i, n) {
				if (i % 16 != 0){
					setBackgroundColor($(this),"hsl(120, "+$(this).text()+", 50%)")
				}
			});
			*/
		}
	});
	
	
	/*切换选择省市区*/
	$("#provinces").change(function(){
		changeProvinces($("#city"), $("#areas"), $("#blocks"), $(this).find('option:selected').val());
	
	});
	$("#city").change(function(){
		changeCity($("#areas"), $("#blocks"), $(this).find('option:selected').val());
	});
	$("#areas").change(function(){
		changeAreas($("#blocks"), $(this).find('option:selected').val());
	});
	$("#blocks").change(function(){
		changeBlocks($(this).find('option:selected').val());
	});
	
	
	//滑动日期区间，更改label的显示值
	$("#rangeSlider").on("valuesChanged", function(e, data){
		var weeKday = data.values.min.getDay();
		var year = data.values.min.getFullYear();
		var month = data.values.min.getMonth()+1;
		var date = data.values.min.getDate();
		var days = getDaysInMonth(year, month);
		if ( weeKday == 0){
			$("#firstWeek").text(date+"/"+month+"/"+year);
			if (date+7 > days){
				$("#secondWeek").text((date+7 - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#secondWeek").text((date+7) + "/"+month+"/"+year);
			}
			if (date+14 > days){
				$("#thirdWeek").text((date+14 - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#thirdWeek").text((date+14) + "/"+month+"/"+year);
			}
			if (date+21 > days){
				$("#fourthWeek").text((date+21 - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#fourthWeek").text((date+21)+ "/"+month +"/"+year);
			}
		}else{
			if(date+7-weeKday > days){
				$("#firstWeek").text((date+7-weeKday - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#firstWeek").text((date+7-weeKday)+ "/"+month +"/"+year);
			}
			if(date+14-weeKday > days){
				$("#secondWeek").text((date+14-weeKday - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#secondWeek").text((date+14-weeKday)+ "/"+month +"/"+year);
			}
			if(date+21-weeKday > days){
				$("#thirdWeek").text((date+21-weeKday - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#thirdWeek").text((date+21-weeKday)+ "/"+month +"/"+year);
			}
			if(date+28-weeKday > days){
				$("#fourthWeek").text((date+28-weeKday - days) + "/"+(month+1)+"/"+year);
			}else{
				$("#fourthWeek").text((date+28-weeKday) + "/"+month+"/"+year);
			}
		}
    });
	
	//刷新按钮点击事件
	//刷新的时候，分对应不同的页面来刷新不同的内容
	$("#refresh").click(function(e){
		//阻止默认的跳转事件
		e.preventDefault();
		
		//获取对应的省市区街道的当前选择的val
		var proVal =  $("#provinces").val(); 
		var cityVal =  $("#city").val(); 
		var areaVal =  $("#areas").val(); 
		var blockVal =  $("#blocks").val(); 
		
		//设置code的值
		if( proVal != "0" && cityVal == "0"){
			code = proVal;
		}else if( cityVal != "0" && areaVal == "0"){
			code = cityVal;
		}else if( areaVal != "0" && blockVal == "0"){
			code = areaVal;
		}else if(blockVal != "0"){
			code = blockVal;
		}
		
		//对应四周的周末
		var firstWeek = $("#firstWeek").text();
		var secondWeek = $("#secondWeek").text();
		var thirdWeek = $("#thirdWeek").text();
		var fourthWeek = $("#fourthWeek").text();
		
		//获取车库的UUID值
		garage_uuid = $("#garage_name").val(); 
		//获取星期几
		weekVal = $("#day").val(); 
		//获取选中筛选月份的最小和最大值
		var minDate = $("#rangeSlider").dateRangeSlider("min");
		var maxDate = $("#rangeSlider").dateRangeSlider("max");
		start_date = minDate.getDate()+"/"+(minDate.getMonth()+1)+"/"+minDate.getFullYear();
		end_date = maxDate.getDate()+"/"+(maxDate.getMonth()+1)+"/"+maxDate.getFullYear();
		
		//状态显示刷新的
		if($("#occupancyContent").css("display") == "block"){
			//没选择省,不做刷新
			if (proVal == "0"){
				return;
			}else{
				//对应状态页面的时候，只根据地理位置刷新状态页面
				getStatusAjax(code);
			}
		}else if ($("#chart").css("display") == "block"){//周转次数显示刷新
			showBarCharts(code, garage_uuid, firstWeek, secondWeek, thirdWeek, fourthWeek);
		}else if ($("#analytics-occupancy").css("display") == "block"){//周转率显示刷新
			getVelocities(code, start_date, end_date, weekVal);
		}
		
	});
	
});

//显示柱状图 纵坐标表示停车场日均总停车数/停车场总泊位数
function showBarCharts(code, garage_uuid, firstWeek, secondWeek, thirdWeek, fourthWeek){
	var s1 = [0, 0, 0, 0, 0, 0, 0];
	var s2 = [0, 0, 0, 0, 0, 0, 0];
	var s3 = [0, 0, 0, 0, 0, 0, 0];
	var s4 = [0, 0, 0, 0, 0, 0, 0];
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/turns/getFullTurns.json?code="+code + "&garage_uuid="+
			garage_uuid+"&first_week="+firstWeek+"&second_week="+secondWeek+
			"&third_week="+thirdWeek+"&four_week="+fourthWeek,
		success:function(data){
			for (var i = 0; i < data.length; i++){
				var totalParking = data[i].totalParking;
				//以下四组值是个数组
				var firstContent = data[i].firstContent;
				for (var j = 0; j < firstContent.length; j++){
					var totalNumber =  firstContent[j].total_parking_number;
					s1[j] = (s1[j] + (totalNumber / totalParking))/ (i + 1);
				}
				var secondContent = data[i].secondContent;
				for (var k = 0; k < secondContent.length; k++){
					var totalNumber =  secondContent[k].total_parking_number;
					s2[k] = (s2[k] + (totalNumber / totalParking))/ (i + 1);
				}
				var thirdContent = data[i].thirdContent;
				for (var l = 0; l < thirdContent.length; l++){
					var totalNumber =  thirdContent[l].total_parking_number;
					s3[l] = (s3[l] + (totalNumber / totalParking))/ (i + 1);
				}
				var fourContent = data[i].fourContent;
				for (var m = 0; m < fourContent.length; m++){
					var totalNumber =  fourContent[m].total_parking_number;
					s4[m] = (s4[m] + (totalNumber / totalParking))/ (i + 1);
				}
			}
			createBarCharts(s1, s2, s3, s4);
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
}

//生成柱状图(先清空防止重叠或者溢出)
function createBarCharts(s1, s2, s3, s4){
	if (plot2){
		plot2.destroy(); 
		$("#chart").empty();
		plot2 = null;
		initBarCharts(s1, s2, s3, s4);
	}else{
		initBarCharts(s1, s2, s3, s4);
	}
}

function initBarCharts(s1, s2, s3, s4){
	$.jqplot.config.enablePlugins = true;
	var ticks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	plot2 = $.jqplot('chart', [s1, s2, s3, s4], {
		axesDefaults: {
			labelRenderer: $.jqplot.CanvasAxisLabelRenderer
		},
		seriesDefaults: {
			renderer:$.jqplot.BarRenderer,
			pointLabels: { show: true }
		},
		axes: {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				ticks: ticks
			},
			yaxis: {
				label: "日均总停车数/总泊位数"
			}
		}
	});
}

//显示时间区间
function showDateRange(){
	var date =  new Date();
	$("#rangeSlider").dateRangeSlider({
		bounds:{
			min: new Date(2014, 7, 22),
			max: new Date()
		},
		defaultValues:{
			min: new Date(2014, date.getMonth()-1, date.getDate()),
			max: new Date()
		},
		range:{
			min: {days: -30},
			max: {days: 30}
		},
		/*
		formatter:function(val){
			var days = val.getDate();
			var month = val.getMonth() + 1;
			var year = val.getFullYear();
			return month + "/" + days + "/" + year;
		},
		*/
		arrows:false
	});
}

function getVelocities(code, start_date, end_date, weekVal){
	//从数据库加载周转率表的信息
	$.ajax({ 
		type:"GET",
		dataType:'json',
		url:"/velocities/getFullVelocities.json?code="+code+"&start_date="+start_date+
			"&end_date="+end_date+"&week_day="+weekVal,
		success:function(data){
			analyticsTableContent(data);
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
}
//添加周转率表格内容
function analyticsTableContent(data){
	//删除所有的表格内容
	$("#analyticsTable tbody").remove();
	for (var i = 0; i < data.length; i++){
		//添加行
		var row = $("<tr></tr>"); 
		//停车总数
		var totalCounts = data[i].totalParking;
		//停车库名称
		var garageName = data[i].garageName;
		//周转率内容
		var velocContent = data[i].velocityContent;
		//总条数
		var counts = velocContent.length;
		//处理对应的每列表格中
		var t_8am = 0;
		var t_9am = 0;
		var t_10am = 0;
		var t_11am = 0;
		var t_12pm = 0;
		var t_1pm = 0;
		var t_2pm = 0;
		var t_3pm = 0;
		var t_4pm = 0;
		var t_5pm = 0;
		var t_6pm = 0;
		var t_7pm = 0;
		var t_8pm = 0;
		var t_9pm = 0;
		var t_10pm_8am = 0;
		for (var j = 0; j < counts; j++){
			var veloc = velocContent[j];
			t_8am += velocContent[j].t_8am / totalCounts;
			t_9am += velocContent[j].t_9am / totalCounts;
			t_10am += velocContent[j].t_10am / totalCounts;
			t_11am += velocContent[j].t_11am / totalCounts;
			t_12pm += velocContent[j].t_12pm / totalCounts;
			t_1pm += velocContent[j].t_1pm / totalCounts;
			t_2pm += velocContent[j].t_2pm / totalCounts;
			t_3pm += velocContent[j].t_3pm / totalCounts;
			t_4pm += velocContent[j].t_4pm / totalCounts;
			t_5pm += velocContent[j].t_5pm / totalCounts;
			t_6pm += velocContent[j].t_6pm / totalCounts;
			t_7pm += velocContent[j].t_7pm / totalCounts;
			t_8pm += velocContent[j].t_8pm / totalCounts;
			t_9pm += velocContent[j].t_9pm / totalCounts;
			t_10pm_8am += velocContent[j].t_10pm_8am / (totalCounts*10);
		}
		t_8am = ((t_8am / counts) * 100).toFixed(0);
		t_9am = ((t_9am / counts) * 100).toFixed(0);
		t_10am = ((t_10am / counts) * 100).toFixed(0);
		t_11am = ((t_11am / counts) * 100).toFixed(0);
		t_12pm = ((t_12pm / counts) * 100).toFixed(0);
		t_1pm = ((t_1pm / counts) * 100).toFixed(0);
		t_2pm = ((t_2pm / counts) * 100).toFixed(0);
		t_3pm = ((t_3pm / counts) * 100).toFixed(0);
		t_4pm = ((t_4pm / counts) * 100).toFixed(0);
		t_5pm = ((t_5pm / counts) * 100).toFixed(0);
		t_6pm = ((t_6pm / counts) * 100).toFixed(0);
		t_7pm = ((t_7pm / counts) * 100).toFixed(0);
		t_8pm = ((t_8pm / counts) * 100).toFixed(0);
		t_9pm = ((t_9pm / counts) * 100).toFixed(0);
		t_10pm_8am = ((t_10pm_8am / counts) * 100).toFixed(0);
		
		//添加车库名称
		row.append($("<td>"+garageName+"</td>"));
		row.append($("<td>"+t_8am+"%</td>"));
		row.append($("<td>"+t_9am+"%</td>"));
		row.append($("<td>"+t_10am+"%</td>"));
		row.append($("<td>"+t_11am+"%</td>"));
		row.append($("<td>"+t_12pm+"%</td>"));
		row.append($("<td>"+t_1pm+"%</td>"));
		row.append($("<td>"+t_2pm+"%</td>"));
		row.append($("<td>"+t_3pm+"%</td>"));
		row.append($("<td>"+t_4pm+"%</td>"));
		row.append($("<td>"+t_5pm+"%</td>"));
		row.append($("<td>"+t_6pm+"%</td>"));
		row.append($("<td>"+t_7pm+"%</td>"));
		row.append($("<td>"+t_8pm+"%</td>"));
		row.append($("<td>"+t_9pm+"%</td>"));
		row.append($("<td>"+t_10pm_8am+"%</td>"));
		$("#analyticsTable").append(row);
	}
	setanalyticsTableBackground();
}

function setanalyticsTableBackground(){
	//设置表格背景色 hsl(120, 8%, 100%)
	$("#analyticsTable td").each(function(i, n) {
		if (i % 16 != 0){
			setBackgroundColor($(this),"hsl(120, "+$(this).text()+", 50%)")
		}
	});

}

//通过ajax加载状态
function getStatusAjax(code){
	//从数据库加载状态表的信息
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"/statuses/getFullStatus.json?code="+code,
		success:function(data){
			occupancyTableContent(data);
			setOccupancyTableBackground();
		},
		error: function(){
			alert ("请求发送失败，请稍候再试");
		}
	});
}

//添加状态表格内容
function occupancyTableContent(data){
	//表格列的总数
	var counts = data.maxTotalSpaces;
	//先删除所有表头列除了第一列
	$("#occupancyTable tr th:not(:nth-child(1))").remove();
	//删除所有的表格内容
	$("#occupancyTable tbody").remove();
	
	//添加表格头
	for (var count = 1; count <= counts; count++){
		$("#occupancyTable thead tr").append($("<th>"+count+"</th>"));
	}
	//所有状态信息数组形式包含一个json数组和一个地址
	var statuses = data.statuses;
	for (var i = 0; i<statuses.length; i++){
		//添加行
		var row = $("<tr></tr>"); 
		//获取状态的json数组
		var status = statuses[i].status
		//获取地址
		var addr = statuses[i].addr;
		//添加地址
		var td = $("<td>"+addr+"</td>"); 
		row.append(td);
		//添加状态内容
		for(var j = 0; j < counts; j++){
			if (counts == status.length){
				var parkerStatus = status[j].status;	//状态0表示空，1表示占
				if (parkerStatus == 0){
					row.append($("<td>空</td>"));
				}else{
					row.append($("<td>占</td>"));
				}
			}else{
				if(j < status.length){
					var parkerStatus = status[j].status;	//状态0表示空，1表示占
					if (parkerStatus == 0){
						row.append($("<td>空</td>"));
					}else{
						row.append($("<td>占</td>"));
					}
				}else{
					row.append($("<td>缺</td>"));
				}
			}
		}
		$("#occupancyTable").append(row);
	}
}
//改变占位状态表的背景色
function setOccupancyTableBackground(){
	$("#occupancyTable td").each(function() {
		var str = $(this).text();
		if( str == "空"){
			setBackgroundColor($(this), "hsl(115, "+"80%"+", 60%)");
		}else if(str == "占"){
			setBackgroundColor($(this), "red");
		}else{
			setBackgroundColor($(this), "darkgray");
		}
	});	
}

//设置导航栏li的背景色与前景色
function setBackgroundAndColor(id){
	id.css({"background-color":"#fefefe", "color":"hsl(115, 80%, 60%)"});
}
//重置导航栏li的背景色与前景色
function revertBackgroundAndColor(){
	$("#home").css({"background-color":"#eeeeee", "color":"black"});
	$("#occupancy").css({"background-color":"#eeeeee", "color":"black"});
	$("#analytics").css({"background-color":"#eeeeee", "color":"black"});
}
//显示右侧内容DIV
function showContent(id){
	id.css("display","block");
}
//隐藏右侧内容DIV
function hiddenContent(id){
	id.css("display","none");
}


//创建和初始化地图函数：
function initMap(point){
	createMap(point);//创建地图
	setMapEvent();//设置地图事件
	addMapControl();//向地图添加控件
	addMarker();//向地图中添加marker
}

//创建地图函数：
function createMap(point){
	var map = new BMap.Map("mapCanvas");//在百度地图容器中创建一个地图
	
	map.centerAndZoom(point,17);//设定地图的中心点和坐标并将地图显示在地图容器中
	window.map = map;//将map变量存储在全局
	addPositionMarker(point);
}

//地图事件设置函数：
function setMapEvent(){
	map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
	map.enableScrollWheelZoom();//启用地图滚轮放大缩小
	map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
	map.enableKeyboard();//启用键盘上下左右键移动地图
	map.enablePinchToZoom();//启用手势缩放
}

//地图控件添加函数：
function addMapControl(){
	//向地图中添加缩放控件
	var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
	map.addControl(ctrl_nav);
	//向地图中添加缩略图控件
	var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
	//map.addControl(ctrl_ove);
	//向地图中添加比例尺控件
	var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
	//map.addControl(ctrl_sca);
	
	// 创建自定义控件
	var myLocationCtrl = new LocationControl();
	// 添加到地图当中
	//map.addControl(myLocationCtrl);
}
//创建marker
function addMarker(){
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"http://yj.wgq.me/information/fullInformations.json",
		success:function(data){
			createMarker(data);
		},
		error: function(){
		
		}
	});
	
}
//更具数组创建marker
function createMarker(arr){
	for(var i=0;i<arr.length;i++){
		//获取information的json
		var information = arr[i].information;
		//剩余车位数
		var remaining_space = arr[i].remaining_space;
		//显示停车状态
		var condition  = remaining_space / information.total_parking_space;
		//alert(typeof(condition) + "-->" + condition);
		//从information获取经纬度
		var point = new BMap.Point(information.longitude,information.latitude);
		//var iconImg = createIcon(json.imgUrl, json.icon);
		var iconImg;
		if (information.position == 1) {
			//TODO 判断状态，这里先写死
			//iconImg = createIcon("/assets/img/green.png");
			
			if(condition >= 0.5 ){
				iconImg = createIcon("/assets/img/green.png");
			}else if (condition < 0.5 && condition >= 0.1) {
				iconImg = createIcon("/assets/img/orange.png");
			}else if (condition < 0.1 && condition > 0) {
				iconImg = createIcon("/assets/img/red.png");
			}else{
				iconImg = createIcon("/assets/img/gray.png");
			}
		}else{
			//TODO 判断状态，这里先写死
			//iconImg = createIcon("/assets/img/green_p.png");
			if(remaining_space != 0){
				iconImg = createIcon("/assets/img/green_p.png");
			}else{
				iconImg = createIcon("/assets/img/gray_p.png");
			}
		}
		var marker = new BMap.Marker(point,{icon:iconImg});
		var iw = createInfoWindow(i, arr);
		if (information.position == 1){
			//剩余车位数，暂时不知道，先写死5
			var label = new BMap.Label(remaining_space, {offset:new BMap.Size(12, 20)});
			label.setStyle({
				color:"yellow",
				border:"0",
				width:"50px",
				textAlign:"center",
				fontSize:"16px",
				cursor:"pointer",
				fontWeight :"bold" ,
				backgroundColor:"0.05"
			});
			marker.setLabel(label);
		}
		
		map.addOverlay(marker);
		(function(){
			var index = i;
			var _iw = createInfoWindow(i, arr);
			var _marker = marker;
			_marker.addEventListener("click",function(){
				this.openInfoWindow(_iw);
			});
			_iw.addEventListener("open",function(){
				//_marker.getLabel().hide();
			})
			_iw.addEventListener("close",function(){
				//_marker.getLabel().show();
			})
			/*
			label.addEventListener("click",function(){
				_marker.openInfoWindow(_iw);
			})
			*/
			//两个感叹号的作用就在于，如果明确设置了变量的值
			//（非null/undifined/0/”“等值),
			//结果就会根据变量的实际值来返回，如果没有设置，结果就会返回false。
			/*
			if(!!json.isOpen){
				//label.hide();
				_marker.openInfoWindow(_iw);
			}
			*/
		})()
	}

}

//创建InfoWindow
function createInfoWindow(i, arr){
	var iw = new BMap.InfoWindow(createHtmlStr(i, arr), {enableMessage:false});
	return iw;
}
//创建一个Icon, json
function createIcon(imgUrl){
	//var icon = new BMap.Icon(imgUrl, new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)});
	var icon = new BMap.Icon(imgUrl, new BMap.Size(72, 72),{      
		// 指定定位位置。     
		// 当标注显示在地图上时，其所指向的地理位置距离图标左上      
		// 角各偏移36像素和75像素。您可以看到在本例中该位置即是     
		// 图标中央下端的尖角位置。      
		anchor: new BMap.Size(36, 75)        
	});
	return icon;
}


//地图搜索
function searchMap() {
    var area = document.getElementById("searchTxt").value; //得到地区
    var ls = new BMap.LocalSearch(map);
    ls.setSearchCompleteCallback(function(rs) {
        if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
            var poi = rs.getPoi(0);
            if (poi) {
                initMap(poi.point);//创建地图(经度poi.point.lng,纬度poi.point.lat)
            }
        }
    });
    ls.search(area);
	
}


// 定义一个控件类,即function
function LocationControl(){
  // 默认停靠位置和偏移量
  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
  this.defaultOffset = new BMap.Size(10, 10);
}

// 通过JavaScript的prototype属性继承于BMap.Control
LocationControl.prototype = new BMap.Control();

// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
LocationControl.prototype.initialize = function(map){
  // 创建一个DOM元素
  var div = document.createElement("div");
  // 添加图片
  var img = document.createElement("img");
  img.src = "/assets/img/location.png";
  div.appendChild(img);
  // 设置样式
  div.style.cursor = "pointer";
  div.style.border = "0";
  div.style.backgroundColor = "0.05";
  // 绑定事件,点击获取当前位置,并标注
  div.onclick = function(e){
	//map.panTo(center:Point, {noAnimation : yes})
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			//清楚所有覆盖物
			map.clearOverlays();
			//重新添加覆盖物
			//addMarker();
			addPositionMarker(r.point);
			map.panTo(r.point, {noAnimation : false});
		}
	});
  }
  // 添加DOM元素到地图中
  map.getContainer().appendChild(div);
  // 将DOM元素返回
  return div;
}

function addPositionMarker(point){
	var circle = new BMap.Circle(point,100,{strokeColor:"green", fillColor:"green", strokeWeight:1, strokeOpacity:0.2, fillOpacity:0.2}); //创建圆
	map.addOverlay(circle);
	var myIcon = new BMap.Icon("/assets/img/position.png",new BMap.Size(30, 30)); 
	var mk = new BMap.Marker(point, {icon: myIcon});
	map.addOverlay(mk);
}


//设置显示当前时间
function showCurrentTime(id){
	var date =  new Date();
	id.text( date.toLocaleString());
}

//动态设置网页的高度
function setVisibleHeight(){
	var height =  $(window).height();
	$("#mapCanvas").height(height-125);
	$("#leftNav").height(height-60);
	$("#analyticsContent").height(height-125);
}

//设置背景色
function setBackgroundColor(id, colorName){
	id.css("background-color", colorName);
}
//获取某年某月的总天数JS里面的new Date("xxxx/xx/xx")这个日期的构造方法有一个妙处，当你传入的是"xxxx/xx/0"（0号）的话，得到的日期是"xx"月的最后一天
function getDaysInMonth(year,month){ 
	var temp = new Date(year,month,0);
	return temp.getDate(); 
} 

//生成点击地图弹出框的html 
//暂时的剩余车位数不清楚
function createHtmlStr(i, arr){
	//获取information的json
	var information = arr[i].information;
	//剩余车位数
	var remaining_space = arr[i].remaining_space;
	//获取tariff的json数组
	var tariffs = arr[i].tariff;
	//获取免费的时间
	var time_range = tariffs[0].time_range;
	//获取每小时多少资费
	var rates = tariffs[1].rates;
	//获取locality的json数组
	var localities = arr[i].locality;
	//获取具体的地址
	var addr = localities[0].name;
	var str = "";
	str = "<b class='iw_poi_title' title='"+information.garage_name+"'>" 
		+information.garage_name+"</b><div class='iw_poi_content'>"
		+'价格：前'+time_range+'小时免费,&nbsp;&nbsp;其他' +rates+'元/小时'+'&nbsp;&nbsp;&nbsp;&nbsp;车位：'
		+remaining_space+'/'+information.total_parking_space+'<br/>'+'地址：'+addr+"</div>";
	return str;
}


