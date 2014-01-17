// This sample is using jso.js from https://github.com/andreassolberg/jso
var app = app || {};

document.addEventListener("deviceready", function() {
    var debug = true,
    inAppBrowserRef;
    
    
    jso_registerRedirectHandler(function(url) {
        inAppBrowserRef = window.open(url, "_blank");
        inAppBrowserRef.addEventListener('loadstop', function(e) {
            LocationChange(e.url)
        }, false);
    });

    /*
    * Register a handler that detects redirects and
    * lets JSO to detect incomming OAuth responses and deal with the content.
    */
    
    function LocationChange(url) {
        outputlog("in location change");
        url = decodeURIComponent(url);
        outputlog("Checking location: " + url);

        jso_checkfortoken('facebook', url, function() {
            outputlog("Closing InAppBrowser, because a valid response was detected.");
            inAppBrowserRef.close();
        });
    };

    /*
    * Configure the OAuth providers to use.
    */
    jso_configure({
        "facebook": {
            client_id: "218405028336646",
            redirect_uri: "http://www.facebook.com/connect/login_success.html",
            authorization: "https://www.facebook.com/dialog/oauth",
            presenttoken: "qs"
        }
    }, {"debug": debug});
    
    // jso_dump displays a list of cached tokens using outputlog if debugging is enabled.
    jso_dump();
    
    (function(a) { 
        a.facebookApp = {
            
            
            login:function (distance, time, speed, view, day) {
                // For debugging purposes you can wipe existing cached tokens...
                jso_ensureTokens({
                    "facebook": ["read_stream", "publish_stream"]
                });
                initFacebookResults(view);
                a.facebookApp.post(distance, time, speed, day);
            },
            
            clearLog: function () {
                outputclear();
            },
    
            deletePermissions:function() {
                outputlog("delete permissions");
       
                $.oajax({
                    type: "DELETE",
                    url: "https://graph.facebook.com/me/permissions",
                    jso_provider: "facebook",
                    jso_allowia: true,
                    dataType: 'json',
                    success: function(data) {
                        outputlog("Delete response (facebook):");
                        outputlog(data);
                    },
                    error: function(e) {
                        outputlog(e);
                    }
                });

                outputlog("wipe tokens");
                jso_wipe();
            },
    
    
    
            wipe: function() {
                // For debugging purposes you can wipe existing cached tokens...
                outputlog("wipe tokens");
                jso_wipe();
            },
    
            getFeed:function() {
                outputlog("Loading home feed...");
                // Perform the protected OAuth calls.
                $.oajax({
                    url: "https://graph.facebook.com/me/home",
                    jso_provider: "facebook",
                    jso_scopes: ["read_stream", "publish_stream"],
                    jso_allowia: true,
                    dataType: 'json',
                    success: function(data) {
                        var i, l, item;
                        outputlog("Response (facebook):");
                        //outputlog(data.data);
                        try {
                            for (i = 0, l = data.data.length; i < l; i++) {
                                item = data.data[i];
                                outputlog("\n");
                                outputlog(item.story || ([item.from.name,":\n", item.message].join("")));
                            }
                        }
                        catch (e) {
                            outputlog(e);
                        }
                    }
                });
            },

            post:function(distance, time, speed, day) {
                outputlog("Post to wall...");
                
                
                // Perform the protected OAuth calls.
                $.oajax({
                    type: "POST",
                    url: "https://graph.facebook.com/me/feed",
                    jso_provider: "facebook",
                    jso_scopes: ["read_stream", "publish_stream"],
                    jso_allowia: true,
                    dataType: 'json',
                    data: {
                        message: day+" run: Distance - "+distance+" km, Time - "+time+", Average speed - "+speed+" km/hour",
                        link: "http://apps.microsoft.com/windows/bg-bg/app/my-workout-timer/98f7fdf1-29f5-47d2-87a7-71e6eb17ece6#",
                        picture: "http://apps.microsoft.com/windows/bg-bg/app/my-workout-timer/98f7fdf1-29f5-47d2-87a7-71e6eb17ece6#"
                    },
                    success: function(data) {
                        outputlog("Post response (facebook):");
                        //outputlog(data);
                    },
                    error: function(e) {
                        outputlog(e);
                    }
                });
            }
    
        };
        
        
    }(app));
    var resultsField;
    
    function initFacebookResults(view){
        if (view=="distanceRun"){
            resultsField = document.getElementById("distance-run-facebook-result");
        } else if (view=="timeRun"){
            resultsField=document.getElementById("time-run-facebook-result");
        } else if (view=="historyShareRun"){
            resultsField=document.getElementById("history-facebook-result");
        }
        resultsField.innerText="";
    }
    
    function outputlog(m) {
            //var resultsField = document.getElementById("distance-run-facebook-result");
            //if(resultsField==null){
            //    resultsField=document.getElementById("time-run-facebook-result");
            //}
        if(m!="Post response (facebook):"){
            resultsField.innerText += typeof m === 'string' ? m : JSON.stringify(m);
            resultsField.innerText += '\n';
        } else{
            //alert("Your run was sucessfully posted on your Facebook page!");
            resultsField.innerText="Your run was sucessfully posted on your Facebook page!"
            setTimeout(function(){resultsField.innerText = ""},5000)
        }
            
        }

        function outputclear() {
            var resultsField = document.getElementById("distance-run-facebook-result");
            if(resultsField==null){
                resultsField=document.getElementById("time-run-facebook-result");
            }
            resultsField.innerText = "";
        }
    
    
});

//Activate :active state
document.addEventListener("touchstart", function() {
}, false);