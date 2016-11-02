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
            // alas...this is so sweet...
 			// document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
            // ...but not good enough
            plant = data[0];
            console.log(plant);
            $('#name').text(plant['name']);
            $('#uuid').text(plant['uuid']);
            $('#description').text(plant['description']);
            $('#activationdate').text(plant['activationdate']);
            $('#dcrating').text(plant['dcrating']);
            $('#state').text(plant['state']);
            $('#county').text(plant['county']);
            $('#city').text(plant['city']);
            $('#postalcode').text(plant['postalcode']);
            $('#timezone').text(plant['timezone']);
            $('#latitude').text(plant['latitude']);
            $('#longitude').text(plant['longitude']);
            $('#arraytype').text(plant['arraytype']);
            $('#tilt').text(plant['tilt']);
            $('#azimuth').text(plant['azimuth']);
            $('#weathersource').text(plant['weathersource']);
            $('#storageoriginalcapacity').text(plant['storageoriginalcapacity']);
            $('#monthlyyield').text(plant['plantreport']['monthlyyield']);
            $('#performanceratio').text(plant['plantreport']['performanceratio']);
            $('#storagestateofhealth').text(plant['plantreport']['storagestateofhealth']);
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

