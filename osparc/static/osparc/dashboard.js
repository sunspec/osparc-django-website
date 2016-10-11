var osparc_dashboard = function() {
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

        getTotals();
        drawPlantsByStateChart();
        drawPlantsByAgeChart();
        getOsparcReport();

        $(".close_window").on("click",function(){
            var divToClose = $(this).attr("os-data-overlay-id");
            osparc_ui.closePopup(divToClose);
        });
        $(".viewReportLink").on("click",function(){
            osparc_ui.viewReport($(this));
        });
        $("#ss_reportList").tablesorter(options);
    }

    function getTotals() {
        $.ajax({
            method:"GET",
            url:"http://localhost:8001/api/plants/stats",
            dataType:"json",
            success:function(markup){
                document.getElementById('total_plant_count').innerHTML = markup['count'];
                document.getElementById('total_dc_rating').innerHTML = osparc_ui.convertToMW(markup['DCRating'],3);
                document.getElementById('total_storage_capacity').innerHTML = markup['StorageCapacity']+' kWh';
	    },
            error:function(xhr, status, e){
                osparc_ui.showAjaxError(xhr,status,e);
            }
        });
    }

    function drawPlantsByStateChart() {

        var chartData = new google.visualization.DataTable();
    
        chartData.addColumn('string','State');
        chartData.addColumn('number','# of Plants');

        //get states with plant locations
        $.ajax({
            method:"GET",
            url:"http://localhost:8001/api/plants/stats?by=state",
            dataType:"json",
            success:function(data) {

                for (var key in data) {
                    if ( data.hasOwnProperty(key) ) {
                        chartData.addRow([key, data[key]]);
                  }
                }

                var options = {
                  region:  'US',
                  resolution:'provinces',
                  width:450,
                  colorAxis: {minValue: "#5DAF5D", colors: ['#5DAF5D', '#003700']},defaultColor:'#000000',
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
            url:"http://localhost:8001/api/plants/kpis",
            success:function(result){
                document.getElementById('dc_mean').innerHTML = result['DCRating']['mean'];
                document.getElementById('dc_med').innerHTML = result['DCRating']['median'];
                document.getElementById('dc_min').innerHTML = result['DCRating']['min'];
                document.getElementById('dc_max').innerHTML = result['DCRating']['max'];
                document.getElementById('stor_mean').innerHTML = result['StorageCapacity']['mean'];
                document.getElementById('stor_med').innerHTML = result['StorageCapacity']['median'];
                document.getElementById('stor_min').innerHTML = result['StorageCapacity']['min'];
                document.getElementById('stor_max').innerHTML = result['StorageCapacity']['max'];



                // $("#kpi_stats_results").html(markup);
                // $("#kpi_stats_results").find("table").addClass("report_data_table").attr("id","osparc_dash_report");
                //fix html - temp code
		//                $("#osparc_dash_report tr:lt(3)").find($("td:empty")).remove();

                // $("#osparc_dash_report tr:eq(3)").find($("td")).attr("colspan", "6");
		//                $('#osparc_dash_report tr:eq(3)').after('<tr><td colspan="5">&nbsp;</td></tr>');
		//                $("#osparc_dash_report tr:eq(5)").find($("td")).addClass("report_column_heading");
                // $("#osparc_dash_report tr:first").remove(); 
               // getPlantCountByState();
            },
            error:function(xhr, status, e){
                osparc_ui.showAjaxError(xhr,status,e);
            }
        });

    }

    function drawPlantsByAgeChart() {

        var currentYear = today.getFullYear();
        getPlantDataByYearByDCRating(currentYear);
    }

    function getPlantDataByYearByDCRating(presentYear) {

        $.ajax({method:"GET",dataType:"json",url:"http://localhost:8001/api/plants/stats?by=year&by=DCRating",
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
          isStacked:true,
          // reverseCategories:true
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