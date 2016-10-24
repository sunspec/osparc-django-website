var osparc_viewplant = function() {

	function init() {
		getPlant( getUuid() );
	}

    function getParameterByName(name) {
        var query  = window.location.search.substring(1);

        var value = query.search("=");

        return query.substring(value+1);
    }

    function getUuid() {
        return getParameterByName('uuid');
    }

	function getPlant(uuid) {

        url = "http://localhost:8001/api/plants?uuid="+uuid;

		$.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(data) {

            console.log(data);
 			
 			document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
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
    osparc_viewplant.init();
});

