var osparc_listplants = function() {

	function init() {
		getPlants()
	}

	function getPlants() {
		$.ajax( {
            method:"GET",
            url:"http://localhost:8001/api/plants",
            dataType:"json",

        success:function(data) {

        	var ar = new Array(), j = -1;

        	ar[++j] = '<thead><tr><th class="o_category_filter_header">';
        	ar[++j] = 'Actions';
        	ar[++j] = '</th><th class="o_category_filter_header">Name</th>';
        	ar[++j] = '<th class="o_category_filter_header">State</th>';
        	ar[++j] = '<th class="o_category_filter_header">Postal Code</th>';
        	ar[++j] = '<th class="o_category_filter_header">Activation Date</th>';
        	ar[++j] = '<th class="o_category_filter_header">DC Rating</th>';
        	ar[++j] = '<th class="o_category_filter_header">Last Import Date</th>';
        	ar[++j] = '<th class="o_category_filter_header">Last Import Status</th>';
        	ar[++j] = '</tr></thead>';

			for (var key=0, size=data.length; key<size; key++) {

    			ar[++j] = '<tr><td>';
				ar[++j] = '<a href="list_plants">View</a>&nbsp;';
				ar[++j] = '<a href="list_plants" onclick="return confirm("Are you sure you want to delete this plant?");">Delete</a>';
    			ar[++j] = '</td><td>';
    			ar[++j] = data[key]['name'];
    			ar[++j] = '</td><td>';
    			ar[++j] = data[key]['state'];
     			ar[++j] = '</td><td>';
     			ar[++j] = data[key]['postalCode'];
     			ar[++j] = '</td><td>';
     			ar[++j] = data[key]['activationDate'];
     			ar[++j] = '</td><td>';
     			ar[++j] = data[key]['DCRating'];
     			ar[++j] = '</td></tr>';
 			}
 			
 			document.getElementById('plantlist').innerHTML = ar.join(''); 
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
    osparc_listplants.init();
});

