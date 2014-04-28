var app = app || {};

document.addEventListener("deviceready", function() {
    var countdownHoursInputData;
    var countdownMinutesInputData;
    var countdownSecondsInputData;
    var countdownHoursCurrentValue;
    var countdownMinutesCurrentValue;
    var countdownSecondsCurrentValue;
    var vmCountdown;
    
    (function(a) { 
        a.countdownApi = {
            init:function(e) {
                vmCountdown = kendo.observable({
                                                   isVisibleCountdownInputs:true,
                                                   isVisibleCountdownStatus:false,
                                                   isVisibleCountdownStartButton:true,
                                                   isVisibleCountdownPauseButton:false,
                                                   isVisibleCountdownContinueButton:false,
                                                   isVisibleCountdownResetButton:false,
                                                   isVisibleFinishCountdownStatus:false,
                                                   countdownSeconds:countdownSecondsCurrentValue,
                                                   countdownMinutes:countdownMinutesCurrentValue,
                                                   countdownHours:countdownHoursCurrentValue,
                                               });
                kendo.bind("#countdown-timer-view", vmCountdown, kendo.mobile.ui);
            },
            
            getCountdownInputData:function() {
                isCountdownInputDataValid = true;
                countdownHoursInputData = $("#variable-countdown-hours-input").val();
                countdownMinutesInputData = $("#variable-countdown-minutes-input").val();
                countdownSecondsInputData = $("#variable-countdown-seconds-input").val();
                if (countdownHoursInputData === "") {
                    countdownHoursInputData = 0;
                }
                if (countdownMinutesInputData === "") {
                    countdownMinutesInputData = 0;
                }
                if (countdownSecondsInputData === "") {
                    countdownSecondsInputData = 0;
                }
                
                if (countdownHoursInputData < 0 || isNaN(countdownHoursInputData)) {
                    alert("The countdown hours has to be greater than or equal to 0!");
                    isCountdownInputDataValid = false;
                }
                else if (countdownMinutesInputData < 0 || isNaN(countdownMinutesInputData)) {
                    alert("The countdown minutes has to be greater than or equal to 0!");
                    isCountdownInputDataValid = false;
                }
                else if (countdownSecondsInputData < 0 || isNaN(countdownSecondsInputData)) {
                    alert("The countdown seconds has to be greater than or equal to 0!");
                    isCountdownInputDataValid = false;
                }
                else {
                    if (countdownSecondsInputData === 0 && countdownMinutesInputData === 0 && countdownHoursInputData === 0) {
                        alert("You did not enter any data!");
                    }
                    else {
                        countdownHoursCurrentValue = countdownHoursInputData;
                        countdownMinutesCurrentValue = countdownMinutesInputData;
                        countdownSecondsCurrentValue = countdownSecondsInputData;
                        vmCountdown.set("countdownSeconds", countdownSecondsCurrentValue);
                        vmCountdown.set("countdownMinutes", countdownMinutesCurrentValue);
                        vmCountdown.set("countdownHours", countdownHoursCurrentValue);
                        
                        a.countdownApi.countdownTimer = setInterval(a.countdownApi.startCountdown, 1000);
                    }
                }
            },
                                  
            startCountdown:function() {
                //alert("Everything is correct");
                vmCountdown.set("isVisibleCountdownInputs", false);
                vmCountdown.set("isVisibleFinishCountdownStatus", false);
                vmCountdown.set("isVisibleCountdownStatus", true);
                vmCountdown.set("isVisibleCountdownStartButton", false);
                vmCountdown.set("isVisibleCountdownContinueButton", false);
                vmCountdown.set("isVisibleCountdownPauseButton", true);
                vmCountdown.set("isVisibleCountdownResetButton", true);
            
                if (countdownSecondsCurrentValue > 0) {
                    countdownSecondsCurrentValue--;
                    vmCountdown.set("countdownSeconds", countdownSecondsCurrentValue);
                }
                else if (countdownMinutesCurrentValue > 0) {
                    countdownSecondsCurrentValue = 59;
                    countdownMinutesCurrentValue--;
                    vmCountdown.set("countdownSeconds", countdownSecondsCurrentValue);
                    vmCountdown.set("countdownMinutes", countdownMinutesCurrentValue);
                }
                else if (countdownHoursCurrentValue > 0) {
                    countdownSecondsCurrentValue = 59;
                    countdownMinutesCurrentValue = 59;
                    countdownHoursCurrentValue--;
                    vmCountdown.set("countdownSeconds", countdownSecondsCurrentValue);
                    vmCountdown.set("countdownMinutes", countdownMinutesCurrentValue);
                    vmCountdown.set("countdownHours", countdownHoursCurrentValue);
                }
                else {
                    a.countdownApi.beep();
                }
            },
            
            pauseCountdown:function() {
                //alert("Countdown timer is paused! Press O.K. when you are ready to continue.");
                clearInterval(a.countdownApi.countdownTimer);
                vmCountdown.set("isVisibleCountdownContinueButton", true);
                vmCountdown.set("isVisibleCountdownPauseButton", false);
                vmCountdown.set("isVisibleCountdownResetButton", true);
            },
            
            continueCountdown:function() {
                vmCountdown.set("isVisibleCountdownContinueButton", false);
                vmCountdown.set("isVisibleCountdownPauseButton", true);
                vmCountdown.set("isVisibleCountdownResetButton", true);
                a.countdownApi.countdownTimer = setInterval(a.countdownApi.startCountdown, 1000);
            },
            
            resetCountdown:function() {
                //alert("You are going to reset countdown timer!");
                a.countdownApi.init();
            },
            
            beep: function() {
                clearInterval(a.countdownApi.countdownTimer);
                navigator.notification.beep(3);
                vmCountdown.set("isVisibleCountdownResetButton",true);
                vmCountdown.set("isVisibleCountdownPauseButton",false);
                vmCountdown.set("isVisibleFinishCountdownStatus", true);
            },
            close:function() {
                clearInterval(a.countdownApi.countdownTimer);
            },
        };
    }(app));
});