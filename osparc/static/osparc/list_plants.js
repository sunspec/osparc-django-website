var osparc_listplants = function() {

    var limit;

	function init() {
        limit = 100;
        if (sessionStorage.getItem("firstUrl") == null) {
            sessionStorage.setItem("firstUrl",window.apiHost+"/api/v1/plants?limit="+limit+"&offset=0");
        }
		getFirst();
	}

    function getFirst() {
        getPlants(sessionStorage.getItem("firstUrl"));
    }

    function getPrev() {
        getPlants(sessionStorage.getItem("prevUrl"));
    }

    function getNext() {
        getPlants(sessionStorage.getItem("nextUrl"));
    }

    function getLast() {
        getPlants(sessionStorage.getItem("lastUrl"));
    }

	function getPlants(url) {
		$.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(data) {

            var plants = data['results'];
            if ( data['next'] != null ) {
                sessionStorage.setItem("nextUrl",data['next']);
            } else {
                sessionStorage.setItem("nextUrl",sessionStorage.getItem("lastUrl"));
            }
            if ( data['previous'] != null ) {
                sessionStorage.setItem("prevUrl",data['previous']);
            } else {
                sessionStorage.setItem("prevUrl",sessionStorage.getItem("firstUrl"));
            }
            var total = data['count'];
            sessionStorage.setItem("lastUrl",window.apiHost+"/api/v1/plants?limit="+limit+"&offset="+(total-limit));

            $('#firstIndex').html(plants[0]['id']);
            $('#lastIndex').html(plants[plants.length-1]['id']);
            $('#totalIndex').html(total);

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
                ar[++j] = '<a href="view_plant?id=';
                ar[++j] = plants[key]['id'];
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

            doc = ar.join('');
            $('#plantlist').html(ar.join(''));
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

        var path = "api/v1/plants/"+id
        var url = window.apiHost+"/"+path;

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
        getFirst:getFirst,
        getNext:getNext,
        getPrev:getPrev,
        getLast:getLast,
        deletePlant:deletePlant
    }
}();

$(document).ready(function() {
    osparc_listplants.init();
});
