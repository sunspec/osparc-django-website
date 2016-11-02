var osparc_listplants = function() {

	function init() {
		getPlants()
	}

	function getPlants() {
		$.ajax( {
            method:"GET",
            url:"http://localhost:8001/api/plants",
            dataType:"json",

        success:function(plants) {

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
            ar[++j] = '<th style="display:none;"></th>'
        	ar[++j] = '</tr></thead>';

			for (var key=0, size=plants.length; key<size; key++) {

                // plantName assignment is necessary because the name must be escaped in the call to 
                // deletePlant(). Note that it must not be used in the <td> where the plant name is shown 
                // because the escape char '\' should not appear there
                plantName = plants[key]['name'].replace(/'/g, "\\'");

    			ar[++j] = '<tr><td>';
                ar[++j] = '<a href="view_plant?uuid=';
                ar[++j] = plants[key]['uuid'];
                ar[++j] = '">View</a>&nbsp;';
                ar[++j] = '<input type="button" onclick="osparc_listplants.deletePlant(';
                ar[++j] = '\'';
                ar[++j] = plantName;
                ar[++j] = "',";
                ar[++j] = plants[key]['id'];
                ar[++j] = ');" value="Delete"/>';
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
                ar[++j] = '</td>';
                if (plants[key]['uploadactivity'] !== null) {
                    ar[++j] = '<td>';
                    ar[++j] = plants[key]['uploadactivity']['mostrecenttimeseriesuploadtime'];
                    ar[++j] = '</td><td>';
                    ar[++j] = plants[key]['uploadactivity']['status'];
         			ar[++j] = '</td>';
                } else {
                    ar[++j] = '<td></td><td></td>';
                }
                ar[++j] = '</tr>';
 			}

            document.getElementById('plantlist').innerHTML = ar.join(''); 
	    },
            
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
    	});
	}

    function deletePlant(name,id) {

        if ( confirm("are you sure you want to delete plant "+name+" ("+id+")?") == false ) {
            return;
        }   

        url = "http://localhost:8001/api/plants/"+id;

        $.ajax( {
            method:"DELETE",
            url:url,
            dataType:"json",

        success:function(plants) {
            console.log("deletePlant success, plants="+plants);
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
