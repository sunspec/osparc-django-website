var osparc_viewplant = function() {

	function init() {
		getPlant( getLink() );
	}

    function getLink() {
        return getParameterByName('link');
    }

    function getParameterByName(name) {
        var url = window.location.href;

        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
}

	function getPlant(linkUrl) {

        var id = 2;
        url = "http://localhost:8001"+linkUrl;

        console.log( "url="+url );


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

