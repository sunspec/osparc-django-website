
var osparc_listqueries = function() {

	function init() {
        console.log("in listqueries init");
		getQueries();
	}

    function actions( queryId,queryName ) {

        var td = document.createElement('td');
        var space = document.createTextNode(' ');

        var buttonAttr = document.createAttribute("type");
        buttonAttr.value = "button";
        var onclickAttr = document.createAttribute("onclick");
        onclickAttr.value = "osparc_listqueries.runReport("+queryId+");";
        var valueAttr = document.createAttribute("value");
        valueAttr.value = "Run";
        var inp = document.createElement('input');
        inp.setAttributeNode(buttonAttr);
        inp.setAttributeNode(onclickAttr);
        inp.setAttributeNode(valueAttr);
        td.appendChild(inp);

        td.appendChild(space);

        buttonAttr = document.createAttribute("type");
        buttonAttr.value = "button";
        onclickAttr = document.createAttribute("onclick");
        onclickAttr.value = "osparc_listqueries.deleteQuery("+queryId+",'"+queryName+"');";
        valueAttr = document.createAttribute("value");
        valueAttr.value = "Delete";
        inp = document.createElement('input');
        inp.setAttributeNode(buttonAttr);
        inp.setAttributeNode(onclickAttr);
        inp.setAttributeNode(valueAttr);
        td.appendChild(inp);

        return td;
    }

    function summarizeQuery( query ) {
        tr = document.createElement('tr');

        td = document.createElement('td');
        tn = document.createTextNode(query['name']);
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(query['observationstartdate']);
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(query['observationenddate']);
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(query['plantfilterattribute']+" "+query['plantfilteroperation']+" "+query['plantfiltervalue']);
        td.appendChild(tn);
        tr.appendChild(td);

        tr.appendChild( actions(query['id'],query['name']) );

        return tr;
    }

    function writeQueries(queries) {

        var classNode = document.createAttribute('class');
        classNode.value = "tablesorter";

        var table = document.createElement('table');
        table.setAttributeNode(classNode);

        var headRow = document.createElement('tr');

        var classNode = document.createAttribute('class');
        classNode.value = "o_category_filter_header";

        var th = document.createElement('th');
        th.setAttributeNode(classNode);
        tn = document.createTextNode("Report Name");
        th.appendChild(tn);
        headRow.appendChild(th);

        console.log(headRow);

        var classNode = document.createAttribute('class');
        classNode.value = "o_category_filter_header";
        var th = document.createElement('th');
        th.setAttributeNode(classNode);
        tn = document.createTextNode("Start Date");
        th.appendChild(tn);
        headRow.appendChild(th);

        var classNode = document.createAttribute('class');
        classNode.value = "o_category_filter_header";
        var th = document.createElement('th');
        th.setAttributeNode(classNode);
        tn = document.createTextNode("End Date");
        th.appendChild(tn);
        headRow.appendChild(th);

        var classNode = document.createAttribute('class');
        classNode.value = "o_category_filter_header";
        var th = document.createElement('th');
        th.setAttributeNode(classNode);
        tn = document.createTextNode("Plant Selection Criteria");
        th.appendChild(tn);
        headRow.appendChild(th);

        var classNode = document.createAttribute('class');
        classNode.value = "o_category_filter_header";
        var th = document.createElement('th');
        th.setAttributeNode(classNode);
        tn = document.createTextNode("Actions");
        th.appendChild(tn);
        headRow.appendChild(th);

        table.appendChild(headRow);

        for (var row=0; row < queries.length; row++) {
            
            table.appendChild( summarizeQuery( queries[row] ) );
        }
            
        console.log(table);

        $('#querylist').html(table);
    }

	function getQueries() {
        var path = "api/v1/queries";
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(data) {
            // with pagination, there's a header with count, next, prev
            var queries = data['results'];
            writeQueries(queries);
	    },

        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    function runReport(queryId) {
        var reportRun = {"reportdefinition":queryId};

        console.log("reportRun: "+reportRun);

        var path = "api/v1/reports";
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"POST",
            url:url,
            dataType:"json",
            data:reportRun,

        success:function(data) {
        },

        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    function deleteQuery(id,name) {
        if ( confirm("are you sure you want to delete report definition "+name+" ("+id+")?") == false ) {
            return;
        }   

        var path = "api/v1/queries/"+id;
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"DELETE",
            url:url,
            dataType:"json",

        success:function(data) {
            getQueries();
        },
        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    return {
        init:init,
        deleteQuery:deleteQuery,
        runReport:runReport
    }
}();

$(document).ready(function() {
    osparc_listqueries.init();
});

