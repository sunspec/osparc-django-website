var osparc_addquery = function() {

    // Add a report definition. 
    //
    // A side-effect on the server is to run the report and create a report run.

    function init() {
        $(".js-example-basic-single").select2();
    }

    function addQuery() {

        var inputArray = $('input,select').serializeArray();

        var postArray = {};
        var sawLike = false;
        inputArray.forEach(function (item) {
            if (item.value == 'like') {
                sawLike = true;
            }
            if (postArray[item.name] !== undefined) {
                if (!postArray[item.name].push) {
                    postArray[item.name] = [postArray[item.name]];
                }
                postArray[item.name].push(item.value || '');
            } else {
                postArray[item.name] = item.value || '';
            }
        }
        );
        if (sawLike == true) {
            postArray['plantfiltervalue'] = '%'+postArray['plantfiltervalue']+'%'
        }

        var path = "api/v1/queries";
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"POST",
            url:url,
            dataType:"json",
            data:postArray,

        success:function(data) {
            $( ".result" ).load( "query_added" );
            // document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
        },
            
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });

        return true;
    }

    function addRow() {
        // Find a <table> element with id="myTable":
        var table = document.getElementById("plant_attributes_table");

        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(0);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        // Add some text to the new cells:
        cell1.innerHTML = "NEW CELL1";
        cell2.innerHTML = "NEW CELL2";
        cell3.innerHTML = "NEW CELL3";
    }

    return {
        init:init,
        addQuery:addQuery,
        addRow:addRow
    }
}();

$(document).ready(function() {
    osparc_addquery.init();
});


