var osparc_viewplant = function() {

	function init() {
		getPlant()
	}

	function getPlant(linkUrl) {
        var id = 2;
        url = "http://localhost:8001/api/plants?id="+id;


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

