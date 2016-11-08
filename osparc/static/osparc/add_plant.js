var osparc_addplant = function() {

    function postToServer(postArray) {
        var path = "api/v1/plants";
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"POST",
            url:url,
            dataType:"json",
            data:postArray,

        success:function(data) {
            $( ".result" ).load( "plant_added" );
            // document.getElementById('plantdetails').innerHTML = "<pre><code>"+JSON.stringify(data,null,4)+"</code></pre>"; 
        },
            
        error:function(xhr, status, e) {
            console.log("error: xhr="+xhr+" status="+status+" e="+e);
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });

        return true;
    }

    function addPlant() {

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

        return postToServer(postArray);
    }

    function uploadPlant() {
        var str = $('textarea')[0].value;

        var jsonArray = JSON.parse(str);

        return postToServer(jsonArray);
    }

    return {
        addPlant:addPlant,
        uploadPlant:uploadPlant
    }
}();
