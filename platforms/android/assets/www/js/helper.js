function post_data(api, request, success, error, silenterror, checkdevice, ajaxoption)
{
    post_data_url(API_URL+api, request, success, error, silenterror, checkdevice, ajaxoption);
}

function post_data_url(api, request, success, errorCallBack, silenterror, checkdevice, ajaxoption)
{
    var TX = "" + Math.random();
    var info = {};
    var settings = $.extend({
        dataType:"json",
        cache:false,
        timeout: TIMEOUT_DEFAULT,
    }, ajaxoption);

    checkdevice = typeof checkdevice !== 'undefined' ? checkdevice : true;
    silenterror = typeof silenterror !== 'undefined' ? silenterror : false;

    if ( checkdevice && DEVICE_READY)
    {
        info.email = window.localStorage.getItem("current_user:email");
        info.uuid = device.uuid;
    }

    var merged = {};
    for ( var i in request) {
        if (request.hasOwnProperty(i))
            merged[i] = request[i];
        }
        //if($.isPlainObject( merged ))
        //    app.log(merged);

        mask_queue.push(api);
        var ajax = $.ajax({
            type: 'POST',
            //headers: {'OPEN-API-Key':'2h47xFs'},
            url: api,
            cache: settings.cache,
            timeout: settings.timeout,
            dataType: settings.dataType,
            //header:{id:1,username:'bill'},
            complete:function(data){
                var index = mask_queue.indexOf(api);
                if (index > -1) {
                    mask_queue.splice(index, 1);
                }

                if($.ui&&mask_queue.length==0)
                    $.ui.hideMask();
                    DISABLE_MASK = false;

                },
                beforeSend:function(data){
                    if($.ui&&!DISABLE_MASK)
                        $.ui.showMask();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        app.log(textStatus + ":"+jqXHR.responseText+" Error thrown:"+errorThrown);
                        if(textStatus == "error")
                        {
                            // //post_data_url(api, request, success, errorCallBack, silenterror, checkdevice, ajaxoption);
                            // if(host==external_host&&silentConnectionError)
                            //     host = internal_host;
                            // else
                            //     host = external_host;
                            // app.log("Changed host to "+host);
                            //retry if possible
                        }

                        $.ui.hideMask();
                        if(typeof errorCallBack !== 'undefined' )
                        {
                            errorCallBack();
                        }
                        else
                        {

                        }
                        if(!silenterror&&!silentConnectionError)
                        {
                            // window.plugins.toast.showShortBottom('Limited or no connectivity');
                            silentConnectionError = true;

                            //silent connection error for 10s
                            setTimeout(function(){
                                silentConnectionError = false;
                                app.log("Enable back silent connection error.");
                            }, 10000);
                            app.log("error toasted");
                        }
                        if (api == 'get_staff_info_by_email')
                        {
                            //pergi ke login page semula jika tiada network connection semasa auto-login..
                            $.ui.loadContent("#login",false,false,"flip");
                        }
                    },
                    data: merged,
                    success: success
                });

                // AJAX_LIST.push(ajax);
            }
function get_data(api, request, success)
{
    // TO be implemented
    var TX = "" + Math.random();

    mask_queue.push(TX);
    $.ajax({
        type: 'GET',
        //headers: {'OPEN-API-Key':'2h47xFs'},
        url: API_URL+api+"&TX="+TX,

        //header:{id:1,username:'bill'},
        dataType: "text",
        complete:function(data){
            var index = mask_queue.indexOf(TX);
            if (index > -1) {
                mask_queue.splice(index, 1);
            }

            if($.ui&&mask_queue.length==0)
                $.ui.hideMask();
            },
            data:request,
            beforeSend:function(data){
                if($.ui)
                    $.ui.showMask();
                },
                cache: false,
                success: success
            });
}

function extractDate(date)
{
    return  date.substr(8,2) +"-"+ date.substr(5,2)+"-"+date.substr(0,4);
}

function goToLocation(dest) {
    //destination_GOOGLEMAP = dest;
    var url = "geo:?q="  + dest +"&z=14";
    app.log(url);
    window.location.href = url;

}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //var login = app.getParameterByName("login");

        DEVICE_READY = true;

        var username = window.localStorage.getItem("imon-username");
        app.log(username);

        if(!username)
        {
            app.log("no session! kicked back to login");
            $.ui.loadContent("#login", false, false,"flip");
            return false;
        }

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        app.log('Received Event: ' + id);
    },
    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    toast: function(msg)
{
    // window.plugins.toast.showShortBottom(msg);
},
log: function(msg)
{
    if(DEBUG_MODE)
        console.log(msg);
    },
    logout: function() {


        //clear the mask
        mask_queue = [];
        $(".latest-interaction").empty();
        firstTimeLoaded = false;
        companyDetailLoaded = false;
        $('.wrap').css({display:'none', opacity:1});

        DISABLE_MASK = true;

        window.localStorage.clear();
        //reset dashboard
        dashboardLoaded = false;

        loadFront = false;
        $("#user-row .user-icon").css("backgroundImage", "url('images/img_placebo.jpeg')").removeAttr("src");
        $.ui.loadContent("#login",false,false,"up");
    },
    resetContent: function()
{
    dashboardLoaded = false;
    //$("#user-row .user-icon").css("backgroundImage", "url('images/img_placebo.jpeg')").removeAttr("src");

},
login: function(){

    //strip data.
    // TODO: password encryption.


    var data = {
        username:$("#username").val(),
        password: $("#password").val(),
        uuid: device.uuid
    };

    //app.log(JSON.stringify(data));

    post_data("LOGIN_USER", data,
    function(info){

        if(info.login == "OK")
        {
            app.log(JSON.stringify(info));
            // Show dashboard

            app.log("Creating session key! "+info.username);

            window.localStorage.setItem("imon-username", info.username);
            window.localStorage.setItem("imon-agency", "");

            //this.resetContent();
            dashboardLoaded = false;
            firstTimeLoaded = false;

            $("#user-row .user-icon").css("backgroundImage", "url('images/img_placebo.jpeg')").removeAttr("src");
            $.ui.loadContent("#frontpanel",false,false,"fade");

        }
        else
        {
            app.log(info.message);
            $('.error-message').hide().text(info.message);
            jQuery('.error-message').css({ opacity: 1 }).show().transition({ opacity: 1 });
        }
    }, function(){          //Error

    }, false, false);
},
htmlEncode : function(s) {
    return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
},
dates: {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp)
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}
};
