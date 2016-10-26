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

        url = "http://localhost:8001/api/reports/"+id;

		$.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(data) {
 			document.getElementById('reportdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
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

