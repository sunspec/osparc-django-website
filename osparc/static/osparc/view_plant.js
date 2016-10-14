var osparc_viewplant = function() {

	function init() {
		getPlant()
	}

	function getPlant() {
		$.ajax( {
            method:"GET",
            url:"http://localhost:8001/api/plants/2",
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

