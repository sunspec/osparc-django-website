
var osparc_listqueries = function() {

	function init() {
        console.log("in listqueries init");
		getQueries();
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

    function actions( queryId ) {

        var td = document.createElement('td');
        var space = document.createTextNode(' ');

        // var att = document.createAttribute("href");
        // att.value = "view_query?id="+queryId;
        // var a = document.createElement('a');
        // a.setAttributeNode(att);
        // var an = document.createTextNode('View');
        // a.appendChild(an);
        // td.appendChild(a);

        // td.appendChild(space);

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

        // var a = document.createElement('a');
        // a.setAttributeNode(att);
        // var an = document.createTextNode('Run');
        // a.appendChild(an);
        // td.appendChild(a);


        // <input type="button" onclick="osparc_listplants.deletePlant(';
        //         ar[++j] = '\'';
        //         ar[++j] = plantName;
        //         ar[++j] = "',";
        //         ar[++j] = plants[key]['id'];
        //         ar[++j] = ');" value="Delete"/>


        td.appendChild(space);

        var att = document.createAttribute("href");
        att.value = "delete_query?id="+queryId;
        var a = document.createElement('a');
        a.setAttributeNode(att);
        var an = document.createTextNode('Delete');
        a.appendChild(an);
        td.appendChild(a);

        console.log(td);

        return td;
    }

    function summarizeQuery( query ) {
        // Note that col 0 contains the run's id. We don't currently use it..
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

        tr.appendChild( actions(query['id']) );

        return tr;
    }

    function writeQueries(queries) {

        var body, tr, td, tn, row, col;
        body = document.getElementsByTagName('tbody')[0];

        for (row=0; row < queries.length; row++) {
            
            body.appendChild( summarizeQuery(queries[row]) );

        }
    }

	function getQueries() {
        $.ajax( {
            method:"GET",
            url:"http://localhost:8001/api/queries",
            dataType:"json",

        success:function(queries) {
            writeQueries(queries);
	    },

        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    function runReport(queryId) {
        // var reportRun = { 
        //         "status": null,
        //         "reportdefinition": queryId,
        //         "runsubmittime": null,
        //         "runstarttime": null,
        //         "runcompletetime": null,
        //         "firstmeasurementdate": null,
        //         "lastmeasurementdate": null,
        //         "numberofmeasurements": null,
        //         "numberofplants": null,
        //         "totaldccapacity": null,
        //         "totalstoragecapacity": null
        // };
        var reportRun = {"reportdefinition":queryId};

        console.log("reportRun: "+reportRun);

        $.ajax( {
            method:"POST",
            url:"http://localhost:8001/api/reports",
            dataType:"json",
            data:reportRun,

        success:function(result) {
            console.log("result: "+result);
        },

        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    function deleteQuery() {

        console.log("in deleteQuery");

        if ( confirm("are you sure you want to delete report definition "+getName()+"?") == false ) {
            return;
        }   

        url = "http://localhost:8001/api/queries?uuid="+getUuid();

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
        deleteQuery:deleteQuery,
        runReport:runReport
    }
}();

$(document).ready(function() {
    osparc_listqueries.init();
});

