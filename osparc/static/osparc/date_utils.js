var date_utils = function(){
    var today = new Date();//Wed Sep 25 2013 10:51:19 GMT-0700 (PDT)
    var today_epoch = new Date(today * 1000);

    /** return local timestamp for manipulation in UI
    * @param {Date Object} d - Javascript Date Object
    * @param {boolean}  isUTC - epoch date flag
    */
    function getTimestamp(d,isUTC){
        if(isUTC){
            d = convertFromUTC(d);
        }
        var timestamp = {};
        var h = d.getHours();
        var raw_h = h;//24-hour clock
        var am_pm = (h >= 12) ? "pm" : "am";
        h = (h < 12) ? h : h - 12;
        if(h == 0){
            h = 12;
        }
        var m = d.getMinutes();
        var raw_m = m;
        if(m < 10) {
            m = "0" + m;
        }
        if(m===0){
            m = "00";
        }
        var timestr = d.toTimeString();//14:39:11 GMT-0700 (Pacific Standard Time)
        var timezone = getTimezone(timestr);
        timestamp.datestr = d.toDateString();//Wed Sep 25 2013
        timestamp.timestr = timestr;
        timestamp.utc = d.getTime();//or Date.parse(d)?
        timestamp.hours = h;
        timestamp.raw_h = raw_h;
        timestamp.mins = m;
        timestamp.raw_mins = raw_m;
        timestamp.am_pm = am_pm;
        timestamp.timezone = timezone;
        timestamp.month = d.getMonth();//0-11
        timestamp.timezone_offset = d.getTimezoneOffset();//timezone difference between UTC and Local Time

        var month = getMonth(timestamp.month);
        timestamp.shortMonthName = month.short;//Jan, etc.
        timestamp.fullMonthName = month.long;//January, etc.

        timestamp.day = d.getDate();//0-31

        var weekday = getWeekday(d.getDay());//0-6
        timestamp.fullWeekday = weekday.long;//Sunday, Monday, etc.
        timestamp.shortWeekday = weekday.short;//Sun, Mon, etc.

        timestamp.year = d.getFullYear();
        timestamp.shortYear = ((timestamp.year).toString()).substring(2);
        return timestamp;
    }

    function getCurrentTimestamp(){
        getTimestamp(today);
    }

    function getWeekday(d){
        var days = [
            { "short" : "Sun", "long" : "Sunday"},
            { "short" : "Mon", "long" : "Monday"},
            { "short" : "Tue", "long" : "Tuesday"},
            { "short" : "Wed", "long" : "Wednesday"},
            { "short" : "Thur", "long" : "Thursday"},
            { "short" : "Fri", "long" : "Friday"},
            { "short" : "Sat", "long" : "Saturday"}
        ];
        return days[d];
    }

    function getMonth(d){
        var months = [
            { "short" : "Jan", "long": "January"},
            { "short" : "Feb", "long": "February"},
            { "short" : "Mar", "long": "March"},
            { "short" : "Apr", "long": "April"},
            { "short" : "May", "long": "May"},
            { "short" : "Jun", "long": "June"},
            { "short" : "Jul", "long": "July"},
            { "short" : "Aug", "long": "August"},
            { "short" : "Sep", "long": "September"},
            { "short" : "Oct", "long": "October"},
            { "short" : "Nov", "long": "November"},
            { "short" : "Dec", "long": "December"}
        ]
        return months[d];
    }
    /** parse time zone from date string
    * @param {string} d - [Javascript Date Object].toTimeString()
    */
    function getTimezone(d){
        return d.substring(  d.indexOf('(') + 1, d.length -1);
    }
    /** convert epoch to javascript date object
     * @param {int} d - date in epoch time
     */
    function convertFromUTC(d){
        return newDateObj = new Date(d);
    }
    function getFormattedTimestamp(d,isUTC){
        var ts = getTimestamp(d,isUTC);
        return ts.datestr + ", " + ts.hours + ":" + ts.mins + ts.am_pm;
    }

    return {
        getTimestamp:getTimestamp,
        getFormattedTimestamp:getFormattedTimestamp,
        getCurrentTimestamp:getCurrentTimestamp
    }
}();