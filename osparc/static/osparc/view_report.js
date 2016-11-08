var osparc_viewreport = function() {

	function init() {
		getReport( getId() );
	}

    function getParameterByName(name) {
        var query  = window.location.search.substring(1);
        var value = query.search("=");
        return query.substring(value+1);
    }

    function getId() {
        return getParameterByName('id');
    }

	function getReport(id) {

        var path = "api/v1/reports/"+id;
        var url = window.apiHost+"/"+path;

		$.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(data) {
 			// document.getElementById('reportdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
            document.getElementById('report_name').innerHTML = data['id'];
            document.getElementById('firstmeasurementdate').innerHTML = data['firstmeasurementdate'];
            document.getElementById('lastmeasurementdate').innerHTML = data['lastmeasurementdate'];
            document.getElementById('numberofplants').innerHTML = data['numberofplants'];
            document.getElementById('totaldccapacity').innerHTML = data['totaldccapacity']/1000;


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
	    },
            
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
    	});
	}

    return {
        init:init
    }
}();

$(document).ready(function() {
    osparc_viewreport.init();
});

