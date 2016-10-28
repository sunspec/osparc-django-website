//
// Reports, as viewed by the webapp/UI, are mildly funkadelic: they are a combination
// of the oSPARC web services "queries" and "reports" objects.
// The web services query object describes the query, as defined by the user.
// The web services report object describes the results of a run of that query.
// When this web-app displays a "report", it displays the combination of the two web services objects.

var osparc_listreports = function() {

	function init() {
		getReports();
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

    function actions( run ) {
        var att = document.createAttribute("href");
        att.value = "view_report?id="+run[0];   // 0th col is id
        var a = document.createElement('a');
        a.setAttributeNode(att);
        var an = document.createTextNode('View');
        a.appendChild(an);
        var td = document.createElement('td');
        td.appendChild(a);

        console.log(td);

        return td;
    }

    function summarizeReport( report ) {
        // Note that col 0 contains the run's id. We don't currently use it..
        tr = document.createElement('tr');

        td = document.createElement('td');
        tn = document.createTextNode(report['reportdefinition']['name']);
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(statusText(report['status']));
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(report['runsubmittime']);
        td.appendChild(tn);
        tr.appendChild(td);

        tr.appendChild( actions(report) );

        return tr;
    }

    function writeReports(reports) {

        var body, tr, td, tn, row, col;
        body = document.getElementsByTagName('tbody')[0];

        for (row=0; row < reports.length; row++) {
            
            body.appendChild( summarizeReport(reports[row]) );

        }
    }

    function statusText(statusInt) {
        switch (statusInt) {
        case 1:return "ready"; break;
        case 2:return "pending"; break;
        case 5:return "processing"; break;
        case 6:return "failed"; break;
        case 9:return "empty"; break;
        default: return "unknown"; break;
        }
    }

    function combine(runs,queries) {
        var results = new Array();

        for (var i = runs.length - 1; i >= 0; i--) {

            for (var j = queries.length - 1; j >= 0; j--) {

                if (queries[j].id == runs[i].reportdefinition) {
                    result = new Array(runs[i].id,queries[j].name,statusText(runs[i].status),runs[i].runsubmittime);
                    results.push(result);
                    break;
                }
            }
        }
        return results;
    }

	function getReports() {
        $.ajax( {
            method:"GET",
            url:"http://localhost:8001/api/reports",
            dataType:"json",

        success:function(runs) {

            // We have the queries and results (runs); combine to form the 'results'
            writeReports(runs);
	    },

        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    function deleteReport() {

        console.log("in deleteReport");

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
        deleteReport:deleteReport
    }
}();

$(document).ready(function() {
    osparc_listreports.init();
});

