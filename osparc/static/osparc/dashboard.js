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
        var path = "api/v1/aggregates";
        var url = window.apiHost+"/"+path;

        $.ajax({
            method:"GET",
            url:url,
            dataType:"json",
            success:function(markup){
                document.getElementById('total_plant_count').innerHTML = markup['count'];
                document.getElementById('total_dc_rating').innerHTML = osparc_ui.convertToMW(markup['DCRating'],3)+" MW";
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
        var path = "api/v1/aggregates?by=state";
        var url = window.apiHost+"/"+path;
        $.ajax({
            method:"GET",
            url:url,
            dataType:"json",
            success:function(data) {

                var states = data['bystate'];
                if (typeof states != "undefined") {

                    for (var key in states) {
                        if ( states.hasOwnProperty(key) ) {
                            chartData.addRow([key, states[key]]);
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
                } else {
                    console.log("!!!!!!!!!! no bystate")
                }
            },
            error:function(xhr, status, e){
                 osparc_ui.showAjaxError(xhr,status,e);
            }

        });
    }

    function getOsparcReport(){

        var path = "api/v1/aggregates";
        var url = window.apiHost+"/"+path;

        $.ajax({
            method:"GET",
            url:url,
            success:function(data){

            var result = data['kpis'];
            if (typeof result != "undefined") {
                for (var key in result) {
                    switch (result[key]['name']) {
                    case 'MonthlyInsolation':
                        document.getElementById('ghi_mean').innerHTML = result[key]['mean'];
                        document.getElementById('ghi_med').innerHTML = result[key]['median'];
                        document.getElementById('ghi_min').innerHTML = result[key]['minimum'];
                        document.getElementById('ghi_max').innerHTML = result[key]['maximum'];
                        break;
                    case'DCRating':
                        document.getElementById('dc_mean').innerHTML = osparc_ui.convertByKilo(result[key]['mean'],3);
                        document.getElementById('dc_med').innerHTML = osparc_ui.convertByKilo(result[key]['median'],3);
                        document.getElementById('dc_min').innerHTML = osparc_ui.convertByKilo(result[key]['minimum'],3);
                        document.getElementById('dc_max').innerHTML = osparc_ui.convertByKilo(result[key]['maximum'],3);
                        break;
                    case 'MonthlyGeneratedEnergy':
                        document.getElementById('wh_mean').innerHTML = osparc_ui.convertByKilo(result[key]['mean'],3);
                        document.getElementById('wh_med').innerHTML = osparc_ui.convertByKilo(result[key]['median'],3);
                        document.getElementById('wh_min').innerHTML = osparc_ui.convertByKilo(result[key]['minimum'],3);
                        document.getElementById('wh_max').innerHTML = osparc_ui.convertByKilo(result[key]['maximum'],3);
                        break;
                    case 'MonthlyYield':
                        document.getElementById('yield_mean').innerHTML = result[key]['mean'];
                        document.getElementById('yield_med').innerHTML = result[key]['median'];
                        document.getElementById('yield_min').innerHTML = result[key]['minimum'];
                        document.getElementById('yield_max').innerHTML = result[key]['maximum'];
                         break;
                    case 'PerformanceRatio':
                        document.getElementById('pr_mean').innerHTML = result[key]['mean'];
                        document.getElementById('pr_med').innerHTML = result[key]['median'];
                        document.getElementById('pr_min').innerHTML = result[key]['minimum'];
                        document.getElementById('pr_max').innerHTML = result[key]['maximum'];
                        break;
                    case 'StorageCapacity':
                        document.getElementById('stor_mean').innerHTML = osparc_ui.convertByKilo(result[key]['mean'],3);
                        document.getElementById('stor_med').innerHTML = osparc_ui.convertByKilo(result[key]['median'],3);
                        document.getElementById('stor_min').innerHTML = osparc_ui.convertByKilo(result[key]['minimum'],3);
                        document.getElementById('stor_max').innerHTML = osparc_ui.convertByKilo(result[key]['maximum'],3);
                        break;
                    case 'StorageStateOfHealth':
                        document.getElementById('soh_mean').innerHTML = result[key]['mean'];
                        document.getElementById('soh_med').innerHTML = result[key]['median'];
                        document.getElementById('soh_min').innerHTML = result[key]['minimum'];
                        document.getElementById('soh_max').innerHTML = result[key]['maximum'];
                        break;
                    }
                }
            }

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

        var path = "api/v1/aggregates?by=year&by=dcrating";
        var url = window.apiHost+"/"+path;
        $.ajax({
            method:"GET",
            dataType:"json",
            url:url,
            success:function(response){

                var data = response['byyearanddcrating'];
                if (typeof data != "undefined") {


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
            }
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

$(document).ready(function() {
    osparc_dashboard.init();
});