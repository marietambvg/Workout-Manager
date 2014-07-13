var app = app || {};

document.addEventListener("deviceready", function() {
    var vmFunRun;
    var currentFunRunDistance;
    var currentFunRunTime;
    var currentFunRunTimeHours;
    var currentFunRunTimeMinutes;
    var currentFunRunTimeSeconds;
    var currentFunRunSpeed;
    
    function onDistanceStartSuccess(position) {
        startLat = position.coords.latitude;
        startLon = position.coords.longitude;
    }
    
    function onDistanceStartError(error) {
        navigator.notification.alert('code: ' + error.code + '\n' +
                                     'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onDistanceStartSuccess, onDistanceStartError);
    
    (function(a) { 
        a.funRun = {
            init:function(e) {
                currentFunRunDistance = 0;
                currentFunRunSpeed = 0;
                currentFunRunTimeHours = 0;
                currentFunRunTimeMinutes = 0;
                currentFunRunTimeSeconds = 0;
                currentFunRunTime = currentFunRunTimeHours + " h. " + currentFunRunTimeMinutes + " min. " + currentFunRunTimeSeconds + " sec.";
                vmFunRun = kendo.observable({
                                                funStatus:"Your current data:", 
                                                funRunDistance:currentFunRunDistance + " km",
                                                funRunTime:currentFunRunTime,
                                                funRunSpeed:currentFunRunSpeed + " km/hour",
                                                isVisibleFunRunTrackTable:true,
                                                isVisibleFunRunStartButton:true,
                                                isVisibleFunRunPauseButton:false,
                                                isVisibleFunRunContinueButton:false,
                                                isVisibleFunRunStopButton:false
                    
                                            })
                kendo.bind(e.view.element, vmFunRun, kendo.mobile.ui);
                vmFunRun.set("funStatus", "Your current data:");
                vmFunRun.set("funRunDistance", currentFunRunDistance+ " km");
                vmFunRun.set("funRunTime", currentFunRunTime);
                vmFunRun.set("funRunSpeed", currentFunRunSpeed+ " km/hour");
                vmFunRun.set("isVisibleFunRunTrackTable", true);
                vmFunRun.set("isVisibleFunRunStartButton", true);
            },
            
            close: function() {
            },
           
            startRun: function() { 
            },
            
            pauseRun: function() { 
            },
            
            continueRun: function() { 
            },
            resetRun: function() { 
            },
            
            stopRun: function() { 
            },
            
            beep: function() {
            },
            
            save:function() {
            },
            
            share:function() {
            }
            
        };
    }(app));
});