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

    function viewAction( runId ) {
        var att = document.createAttribute("href");
        att.value = "view_report?id="+runId;
        var a = document.createElement('a');
        a.setAttributeNode(att);
        var an = document.createTextNode('View');
        a.appendChild(an);
        return a;
    }

    function deleteAction( name,runId ) {
        var inp = document.createElement('input');

        var att = document.createAttribute('type');
        att.value = "button";
        inp.setAttributeNode(att);

        att = document.createAttribute('onclick');
        att.value = "osparc_listreports.deleteReport(\""+name+"\","+runId+");";
        inp.setAttributeNode(att);

        att = document.createAttribute('value');
        att.value = "Delete";
        inp.setAttributeNode(att);

        return inp;
    }

    function summarizeReport( report ) {

        tr = document.createElement('tr');

        td = document.createElement('td');
        tn = document.createTextNode(report[1]);
        // tn = document.createTextNode(report['reportdefinition']['name']);
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(statusText(report[2]));
        // tn = document.createTextNode(statusText(report['status']));
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        tn = document.createTextNode(report[3]);
        // tn = document.createTextNode(report['runsubmittime']);
        td.appendChild(tn);
        tr.appendChild(td);

        td = document.createElement('td');
        if (report[2] == 1) {    // ready
            td.appendChild(viewAction(report[0]));
        }
        td.appendChild(deleteAction(report[3],report[0]));
        tr.appendChild(td);

        console.log(tr);

        return tr;
    }

    function writeReports(reports) {

        var body = $('#reportlist');

        body.html("");

        for (row=0; row < reports.length; row++) {
            
            body.append( summarizeReport(reports[row]) );

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
                    result = new Array(runs[i].id,queries[j].name,runs[i].status,runs[i].runsubmittime);
                    results.push(result);
                    break;
                }
            }
        }
        return results;
    }

	function getReports() {
        var path = "api/v1/reports";
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"GET",
            url:url,
            dataType:"json",

        success:function(runs) {

            $.ajax( {
                method:"GET",
                url:"http://osparc.sunspec.org:8001/api/v1/queries",
                dataType:"json",

            success:function(queries) {

                writeReports(combine(runs,queries));
            },

            error:function(xhr, status, e) {
                osparc_ui.showAjaxError(xhr,status,e);
            }
            });
	    },

        error:function(xhr, status, e) {
            osparc_ui.showAjaxError(xhr,status,e);
        }
        });
    }

    function deleteReport(name,id) {

        console.log("in deleteReport");

        if ( confirm("are you sure you want to delete plant "+name+"("+id+")?") == false ) {
            return;
        }   

        var path = "api/v1/reports/"+id;
        var url = window.apiHost+"/"+path;

        $.ajax( {
            method:"DELETE",
            url:url,
            dataType:"json",

        success:function(plants) {
            getReports();
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

