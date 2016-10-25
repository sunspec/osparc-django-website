var osparc_addplant = function() {

    function addPlant() {
        console.log( "in addPlant" );

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

        url = "http://localhost:8001/api/plants";

        $.ajax( {
            method:"POST",
            url:url,
            dataType:"json",
            data:postArray,

        success:function(data) {
            document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
        },
            
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });


        return false;
    }

    return {
        addPlant:addPlant
    }
}();
