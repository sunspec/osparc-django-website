var osparc_viewplant = function() {

	function init() {
		getPlant( getId() );
	}

    function getParameterByName(name) {
        var query  = window.location.search.substring(1);
        var value = query.search("=");
        return query.substring(value+1);
    }

    function getId() {
        return getParameterByName('id');
    }

	function getPlant(id) {

        var path = "api/v1/plants/"+id;
        var url = window.apiHost+"/"+path;

		$.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(plant) {
            // alas...this is so sweet...
 			// document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
            // ...but not good enough
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
            $('#firstmeasurementdate').text(plant['plantreport']['firstmeasurementdate']);
            $('#lastmeasurementdate').text(plant['plantreport']['lastmeasurementdate']);
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

