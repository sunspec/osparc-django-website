var osparc_listplants = function() {

	function init() {
		getPlants()
	}

    function getParameterByName(name) {
        var query  = window.location.search.substring(1);
        var value = query.search("=");
        return query.substring(value+1);
    }

    function getUuid() {
        return getParameterByName('uuid');
    }

    function getName() {
        return getParameterByName('name');
    }

	function getPlants() {
		$.ajax( {
            method:"GET",
            url:"http://localhost:8001/api/plants",
            dataType:"json",

        success:function(plants) {

            // var plants = data['plants']

        	var ar = new Array(), j = -1;

        	ar[++j] = '<thead><tr><th class="o_category_filter_header">';
        	ar[++j] = 'Actions';
        	ar[++j] = '</th><th class="o_category_filter_header">Name</th>';
        	ar[++j] = '<th class="o_category_filter_header">State</th>';
        	ar[++j] = '<th class="o_category_filter_header">Postal Code</th>';
        	ar[++j] = '<th class="o_category_filter_header">Activation Date</th>';
        	ar[++j] = '<th class="o_category_filter_header">DC Rating</th>';
        	// ar[++j] = '<th class="o_category_filter_header">Last Import Date</th>';
        	// ar[++j] = '<th class="o_category_filter_header">Last Import Status</th>';
            ar[++j] = '<th style="display:none;"></th>'
        	ar[++j] = '</tr></thead>';

			for (var key=0, size=plants.length; key<size; key++) {

    			ar[++j] = '<tr><td>';
                ar[++j] = '<a href="view_plant?uuid=';
                ar[++j] = plants[key]['uuid'];
                ar[++j] = '">View</a>&nbsp;';

				// ar[++j] = '<a href="delete_plant?uuid=';
    //             ar[++j] = plants[key]['uuid'];
    //             ar[++j] = '"';
    //             ar[++j] = ' onclick="return confirm();">Delete</a>';
                
    			ar[++j] = '</td><td>';
    			ar[++j] = plants[key]['name'];
    			ar[++j] = '</td><td>';
    			ar[++j] = plants[key]['state'];
     			ar[++j] = '</td><td>';
     			ar[++j] = plants[key]['postalcode'];
     			ar[++j] = '</td><td>';
     			ar[++j] = plants[key]['activationdate'];
     			ar[++j] = '</td><td>';
     			ar[++j] = plants[key]['dcrating'];
     			ar[++j] = '</td></tr>';
 			}
 			
 			document.getElementById('plantlist').innerHTML = ar.join(''); 
	    },
            
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
    	});
	}

    function deletePlant() {

        console.log("in deletePlant");

        if ( confirm("are you sure you want to delete plant "+getName()+"?") == false ) {
            return;
        }   

        url = "http://localhost:8001/api/plants?uuid="+getUuid();

        $.ajax( {
            method:"DELETE",
            url:url,
            dataType:"json",

        success:function(plants) {
            getPlants();
        },
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    return {
        init:init,
        deletePlant:deletePlant
    }
}();

$(document).ready(function() {
    osparc_listplants.init();
});

