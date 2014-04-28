var app = app || {};

document.addEventListener("deviceready", function() {
    var stopwatchHoursCurrentStatus;
    var stopwatchMinutesCurrentStatus;
    var stopwatchSecondsCurrentStatus;
    var vmStopwatch;
    (function(a) { 
        a.stopwatchApi = {
            init:function(e) {
                stopwatchHoursCurrentStatus = 0;
                stopwatchMinutesCurrentStatus = 0;
                stopwatchSecondsCurrentStatus = 0;
                vmStopwatch = kendo.observable({
                                                   isVisibleStopwatchStartButton:true,
                                                   isVisibleStopwatchPauseButton:false,
                                                   isVisibleStopwatchStopButton:false,
                                                   isVisibleStopwatchContinueButton:false,
                                                   isVisibleStopwatchResetButton:false,
                                                   isVisibleStopwatchStatus:true,
                                                   stopwatchHours:stopwatchHoursCurrentStatus,
                                                   stopwatchMinutes:stopwatchMinutesCurrentStatus,
                                                   stopwatchSeconds:stopwatchSecondsCurrentStatus,
                                               });
                vmStopwatch.set("isVisibleStopwatchStartButton", true);
                kendo.bind(e.view.element, vmStopwatch, kendo.mobile.ui);
                a.stopwatchApi.viewStopwatch();
            },
            
            viewStopwatch:function() {
                vmStopwatch.set("stopwatchHours", stopwatchHoursCurrentStatus);
                vmStopwatch.set("stopwatchMinutes", stopwatchMinutesCurrentStatus);
                vmStopwatch.set("stopwatchSeconds", stopwatchSecondsCurrentStatus);
                vmStopwatch.set("isVisibleStopwatchStartButton", true);
                vmStopwatch.set("isVisibleStopwatchPauseButton", false); 
                vmStopwatch.set("isVisibleStopwatchStopButton", false); 
                vmStopwatch.set("isVisibleStopwatchStatus", true);
                vmStopwatch.set("isVisibleStopwatchContinueButton", false);
                vmStopwatch.set("isVisibleStopwatchResetButton", false);
            },
            
            
            startStopwatch:function() {
                vmStopwatch.set("isVisibleStopwatchStartButton", false);
                vmStopwatch.set("isVisibleStopwatchPauseButton", true); 
                vmStopwatch.set("isVisibleStopwatchStopButton", true); 
                vmStopwatch.set("isVisibleStopwatchStatus", true);
                vmStopwatch.set("isVisibleStopwatchContinueButton", false);
                a.stopwatchApi.stopwatchTimer = setInterval(a.stopwatchApi.countTimeStopwatch, 1000);
            },
            
            countTimeStopwatch:function() {
                stopwatchSecondsCurrentStatus++;
                if(stopwatchSecondsCurrentStatus===60){
                    stopwatchSecondsCurrentStatus=0;
                    stopwatchMinutesCurrentStatus++;
                    if(stopwatchMinutesCurrentStatus===60){
                        stopwatchMinutesCurrentStatus=0;
                        stopwatchHoursCurrentStatus++;
                    }
                }
                vmStopwatch.set("stopwatchHours", stopwatchHoursCurrentStatus);
                vmStopwatch.set("stopwatchMinutes", stopwatchMinutesCurrentStatus);
                vmStopwatch.set("stopwatchSeconds", stopwatchSecondsCurrentStatus);
            },
            
            pauseStopwatch:function() {
                vmStopwatch.set("isVisibleStopwatchStartButton", false);
                vmStopwatch.set("isVisibleStopwatchPauseButton", false); 
                vmStopwatch.set("isVisibleStopwatchStopButton", true); 
                vmStopwatch.set("isVisibleStopwatchStatus", true);
                vmStopwatch.set("isVisibleStopwatchContinueButton", true);
                clearInterval(a.stopwatchApi.stopwatchTimer);
            },
            
            stopStopwatch:function() {
                clearInterval(a.stopwatchApi.stopwatchTimer);
                vmStopwatch.set("isVisibleStopwatchStartButton", false);
                vmStopwatch.set("isVisibleStopwatchPauseButton", false); 
                vmStopwatch.set("isVisibleStopwatchStopButton", false); 
                vmStopwatch.set("isVisibleStopwatchStatus", true);
                vmStopwatch.set("isVisibleStopwatchContinueButton", false);
                vmStopwatch.set("isVisibleStopwatchResetButton", true);
            },
            
            resetStopwatch:function() {
                stopwatchHoursCurrentStatus = 0;
                stopwatchMinutesCurrentStatus = 0;
                stopwatchSecondsCurrentStatus = 0;
                a.stopwatchApi.viewStopwatch();
            },
            
            continueStopwatch:function() {
                vmStopwatch.set("isVisibleStopwatchStartButton", false);
                vmStopwatch.set("isVisibleStopwatchPauseButton", true); 
                vmStopwatch.set("isVisibleStopwatchStopButton", true); 
                vmStopwatch.set("isVisibleStopwatchStatus", true);
                vmStopwatch.set("isVisibleStopwatchContinueButton", false);
                a.stopwatchApi.stopwatchTimer = setInterval(a.stopwatchApi.countTimeStopwatch, 1000);
            },
            
            close: function() { 
                clearInterval(a.stopwatchApi.stopwatchTimer);
            },
        };
    }(app));
});