var osparc_plants = function(){
    var options = {
        headers:{
            0: {
                sorter:false //disable sorting on edit/delete column
            }
        },
        widgets: ['zebra','reattachEventHandlers']
    }
    function initCreatePlant(){
        osparc_reports.initReportRequest();
    }
    function init(){

        $(".close_window").on("click",function(){
            var divToClose = $(this).attr("os-data-overlay-id");
            osparc_ui.closePopup(divToClose);
        });
        $.tablesorter.addWidget({
            id: "reattachEventHandlers",
            format: function(table) {
                $(".viewPlantReportLink").on("click", function(){
                    var msg = "There was an error retrieving your report.";
                    osparc_ui.viewReport($(this), msg);
                });

                $("#pager").css("position","relative");
                $("#pager").css("top","");
            }
        });
        $("#ss_plantList").tablesorter(options).tablesorterPager({container: $("#pager")});

        $(window).load(function(){
            $("#overlay").empty().hide();
        });
        $(".viewPlantReportLink").on("click", function(){
            var msg = "There was an error retrieving your report.";
            osparc_ui.viewReport($(this), msg);
        });

        $(".viewReportLink").on("click", function(){
            var msg = "There was an error retrieving your report.";
            osparc_ui.viewReport($(this), msg);
        });
    }


    return {
        init:init,
        initCreatePlant:initCreatePlant
    }
}();