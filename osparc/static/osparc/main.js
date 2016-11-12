var osparc_ui = function(){
    //google.maps.visualRefresh = true;
    function init(){
       // var ts = date_utils.getTimestamp(new Date(),false);
       //  var tz_offset = (ts.timezone_offset)/60;
       //  $.ajax({
       //      method:"GET",
       //      url:"/setUserTimezone/" + parseInt(tz_offset),
       //      success:function(){
       //          console.log('time zone set');
       //      },
       //      error:function(){
       //          //console.log('booboo');
       //      }
       //  });

        window.apiHost = "http://localhost:8001";

        console.log( "XXX YYY IN main.init(). apiHost="+apiHost );

<!-- kinda looks like this does nothing...
        $("ul.dropdown li").hover(function(){
            $(this).addClass("hover");


            $('ul:first',this).css('visibility', 'visible');
            if( $(this).has("ul").length === 0) {
                $(this).addClass("main_hover");
                $(this).removeClass("hover");
            }
            if( $(this).has("ul").length === 0 && $(this).hasClass("active")){
                $(this).removeClass("hover");
            }

        }, function(){
            $(this).removeClass("hover");
            $('ul:first',this).css('visibility', 'hidden');
        });
        $(".o_cancel").on("click",function(){
            var cbUrl = $(this).attr("o-data-url");
            window.location = "/" + cbUrl;
        });
-->
    }

    function initCitySearch(){
        var lat,lon;
        var options = {
            types: ['(cities)'],
            componentRestrictions:{country:"us"}
        }
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById("companyCityState"),options);
    }
    function doLogin(){
        var data = $("#login_form").serialize();
        //console.log("data:" + JSON.stringify(data));

    }
    function viewReport(el,msg){

        console.log( "XXX YYY IN main.viewReport()" );


        var id = el.attr("os-data-reportrun-id");
        var reportName = el.attr("os-data-reportname");
        console.log("reportName:" + reportName);
        $("#overlay").css("display","block");
        var isPlantReport = (el.hasClass("viewPlantReportLink")) ? true : false;
        var getReportUrl = (isPlantReport) ? "/v1/plant/" + id + "/report/html" : "/v1/reportrun/" + id + "/html";
        $.ajax({
            method: "GET",
            url: getReportUrl,
            success:function(content){
                $("#report_title").html((reportName!=='') ? reportName : (isPlantReport) ? "Plant Report" : "Report");
                $("#report_text").html(content);
                $("#report_text").prepend("<div id='report_logo'><img src='/resources/images/logo_sm.jpg'/></div>");

                $("#reportOverlay").css("display","block");
                osparc_ui.centerDiv("#reportOverlay");
                $("#reportOverlay").css("top","20px");
                var dataTables = $("#report_text").find("table").addClass("report_data_table");
                if(!isPlantReport){
                    $( "#Inverter" ).wrap( "<div id='report_equipment'></div>" );
                    $("#report_equipment").append($("#Module"));

                    $( "#info" ).wrap( "<div id='report_plantInfo'></div>" );
                    $( "#report_plantInfo" ).append( $("#report_equipment") );


                    $("#stakeholders").wrap("<div id='report_stakeholders'></div>");
                    //fix html - temp code
                    $("#report_equipment").find($( "td:empty" )).remove();
                    $("#pool tr:lt(3)").find($( "td:empty" )).remove();
                    $('#pool tr:eq(3)').after('<tr><td colspan="5">&nbsp;</td></tr>');
                    $("#pool tr:eq(3)").find($( "td" )).addClass("report_column_heading");
                    $('#osparc tr:eq(3)').after('<tr><td colspan="5">&nbsp;</td></tr>');
                    $("#osparc tr:eq(3)").find($( "td" )).addClass("report_column_heading");
                    $("#osparc tr:lt(3)").find($( "td:empty" )).remove();
                }
                window.scrollTo(0,0);
            },
            error:function(xhr, status, e){
                var msg = "There was a problem retrieving your report.";
                osparc_ui.showAjaxError(xhr,status,e, msg);
            }
        });
    }

    function showHideDiv(divId, isOpen){
        showHideFilter(divId, isOpen);
    }
    function showHideFilter(divId, isOpen){
        if(isOpen){
            $(divId).hide("blind","slow");
        }
        else {
            $(divId).show("blind","slow");
        }
    }

    /** Return current dimension of visible browser window
    */
    function getWinDims(){
        var winDims = {
            "w" : $(window).width(),
            "h" : $(window).height()
        }
        return winDims;
    }

    function centerDiv(divId){
        var winSize = getWinDims();
        $(divId).css("left",(winSize.w - $(divId).outerWidth())/2);
        $(divId).css("top",((winSize.h - $(divId).outerHeight())/2) + $(window).scrollTop());
    }

    function closePopup(divToClose,cb){
        $("#overlay").css("display","none");
        $("#" + divToClose).hide("fade","slow");
        if(cb){
            cb();
        }
    }
    /** Round a number to n decimal places
    * @param {int} x = number to round
    * @param {int} n = decimal places
    * e.g.: rnd(3.141592653589793,6) will return 3.141592
    */
    function rnd(x,n) {
        var dec = [1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000,10000000000];
        return Math.round(x*dec[n])/dec[n];
    }

    function convertByMega(x,y) {
        return rnd((x/1000000),y);
    }

    function convertToMW(x, y){
        return rnd((x/1000000),y);
    }

    function convertByKilo(x,y) {
        return rnd((x/1000),y);
    }
    function convertToKW(x,y) {
        return rnd((x/1000),y);
    }

    function showAjaxError(xhr,status,e,msg){
        console.log("xhr:" + xhr);
        console.log("status:" + status);
        console.log("e:" + e);
        console.log("msg:" + msg);
        if(msg){
            $("#report_title").html("Error");
            $("#report_text").html(msg);
            $("#reportOverlay").css("display","block");
            osparc_ui.centerDiv("#reportOverlay");
        }
        else {
            if($("#overlay").is(":visible")){
                $("#overlay").css("display","none");
            }
        }

    }

    return {
        init:init,
        doLogin:doLogin,
        viewReport:viewReport,
        initCitySearch:initCitySearch,
        showHideFilter:showHideFilter,
        showHideDiv:showHideDiv,
        centerDiv:centerDiv,
        closePopup:closePopup,
        rnd:rnd,
        convertToMW:convertToMW,
        convertByKilo:convertByKilo,
        showAjaxError:showAjaxError
    }
}();

$(document).ready(function(){
    osparc_ui.init();
});