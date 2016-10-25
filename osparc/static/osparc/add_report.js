var osparc_addreport = function() {

    // Add a report definition. 
    //
    // A side-effect on the server is to run the report and create a report run.

    function addReport() {

        var inputArray = $('input').serializeArray();

        var postArray = {};
        inputArray.forEach(function (item) {
              if (postArray[item.name] !== undefined) {
                if (!postArray[item.name].push) {
                    postArray[item.name] = [postArray[item.name]];
                }
                postArray[item.name].push(item.value || '');
            } else {
                postArray[item.name] = item.value || '';
            }
        });

        url = "http://localhost:8001/api/queries";

        $.ajax( {
            method:"POST",
            url:url,
            dataType:"json",
            data:postArray,

        success:function(data) {
              // $( ".result" ).load( "report_added" );
            // document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
        },
            
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });

        return true;
    }

    return {
        addReport:addReport
    }
}();
