var osparc_dashboard = function(){
    var today = new Date();
    var numYearsInChart = 0;
    var maxAttempts = 8;
    var numAttempts = 0;
    var options = {
      headers: {
        0: {
          sorter:false
        },
        2: {
          sorter:false
        }
      },
      widgets: ['zebra'],
      sortList: [[1,1]]
    }
    function init(){

        console.log( "XXX YYY IN osparc_dashboard.init()" );


 //       getOsparcReport();
        drawPlantsChart();

        $(".close_window").on("click",function(){
            var divToClose = $(this).attr("os-data-overlay-id");
            osparc_ui.closePopup(divToClose);
        });
        $(".viewReportLink").on("click",function(){
            osparc_ui.viewReport($(this));
        });
        $("#ss_reportList").tablesorter(options);
    }

    function getPlantCount() {
        $.ajax({
            method:"GET",
            url:"/v1/plant/count/all",
            dataType:"json",
            success:function(markup){
                $("#total_plant_count").html(markup);
	    },
            error:function(xhr, status, e){
                osparc_ui.showAjaxError(xhr,status,e);
            }
        });
    }

    function getPlantCountByState(){

        console.log( "XXX YYY IN osparc_dashboard.getPlantCountByState()" );

        var chartData = new google.visualization.DataTable();
    //get states with plant locations
        $.ajax({
            method:"GET",
            url:"/v1/plant/count/state",
            dataType:"json",
            success:function(data){

                chartData.addColumn('string','State');
                chartData.addColumn('number','# of Plants');

                $.each(data, function(i){
			// the >1000?null:... clause causes any state w/over 1000 to appear black.
			// The reason for doing this is if one state has several 1000 and the next most
			// populous state has 45, the eye is unable to distinguish all other states.
			// The downside is that the tooltip of the big state shows no #.
			//			chartData.addRow([data[i].state, data[i].plantCount>1000?null:data[i].plantCount]);
			chartData.addRow([data[i].state, data[i].plantCount]);
                });

                var options = {
                  region:  'US',
                  resolution:'provinces',
                  width:450,
                  colorAxis: {minValue: "#5DAF5D", colors: ['#5DAF5D', '#003700']},
		  defaultColor:'#000000',
		  //		  legend:'none'
                };

                var chart = new google.visualization.GeoChart(document.getElementById('state_chart'));
                chart.draw(chartData, options);

		// Make the side-by-side containers the same height
                var statesH = $("#o_state_wrapper").height(); // left side
                var ageH = $("#o_newplants_stats").height();  // right side
                var tallerDiv = (ageH > statesH) ? "#o_newplants_stats" : "#o_state_wrapper";
                var shorterDiv = (tallerDiv==="#o_newplants_stats") ?  "#o_state_wrapper" : "#o_newplants_stats";
                $(shorterDiv).css("height",$(tallerDiv).height());
            },
            error:function(xhr, status, e){
                 osparc_ui.showAjaxError(xhr,status,e);
            }
        });
    }

    function getOsparcReport(){

        console.log( "XXX YYY IN osparc_dashboard.getOsparcReport()" );


        $.ajax({
            method:"GET",
            url:"/v1/reportrun/1/kpis/html",
            success:function(markup){
                $("#kpi_stats_results").html(markup);
                $("#kpi_stats_results").find("table").addClass("report_data_table").attr("id","osparc_dash_report");
                //fix html - temp code
		//                $("#osparc_dash_report tr:lt(3)").find($("td:empty")).remove();

                // $("#osparc_dash_report tr:eq(3)").find($("td")).attr("colspan", "6");
		//                $('#osparc_dash_report tr:eq(3)').after('<tr><td colspan="5">&nbsp;</td></tr>');
		//                $("#osparc_dash_report tr:eq(5)").find($("td")).addClass("report_column_heading");
                // $("#osparc_dash_report tr:first").remove(); 
               getPlantCountByState();
            },
            error:function(xhr, status, e){
                osparc_ui.showAjaxError(xhr,status,e);
            }
        });

    }

    function getPlantDataByYearByDCRating(presentYear) {

        $.ajax({method:"GET",dataType:"json",url:"http://localhost:8001/api/plantstats/?count&by=year&by=DCRating",
            success:function(data){

                var plantsChartData = new google.visualization.DataTable(data);
                plantsChartData.addColumn('string','Year');
                plantsChartData.addColumn('number','<10kW');
                plantsChartData.addColumn('number','10-100kW');
                plantsChartData.addColumn('number','100kW-1MW');
                plantsChartData.addColumn('number','1-10MW');
                plantsChartData.addColumn('number','>10MW');

                for (var key in data) {
                  if (data.hasOwnProperty(key) && (key <= presentYear)) {
                    console.log(key + " -> " + data[key]);
                    plantsChartData.addRow([key,
                                            data[key]['<10kW'],
                                            data[key]['10-100kW'],
                                            data[key]['100kW-1MW'],
                                            data[key]['1-10MW'],
                                            data[key]['>10MW']] );
                  }
                }

                renderPlantsChart(plantsChartData);
            },
            error:function(xhr, status, e) {
                    osparc_ui.showAjaxError(xhr,status,e);
            }
        });
    }

    function renderPlantsChart(plantsChartData){
        var options = {
          vAxis: {title:"Number of Plants"},
          seriesType: "bars",
          width:590,
          legend: {position:"top", maxLines:5, textStyle:{fontSize: 11}},
          isStacked:true
        };

        var plantsChart = new google.visualization.ColumnChart(document.getElementById('newplants_chart'));
        plantsChart.draw(plantsChartData, options);

	// Make the side-by-side containers the same height
        var statsH = $("#o_stats_wrapper").height();
        var reportsH = $("#o_myreports_stats").height();
        var tallerDiv = (statsH > reportsH) ? "#o_stats_wrapper" : "#o_myreports_stats";
        var shorterDiv = (tallerDiv==="#o_stats_wrapper") ?  "#o_myreports_stats" : "#o_stats_wrapper";
        $(shorterDiv).css("height",$(tallerDiv).height());
    }
    return {
        init:init
    }
}();

$(document).ready(function(){
    osparc_dashboard.init();
});