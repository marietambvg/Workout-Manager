var app = app || {};

document.addEventListener("deviceready", function() {
    var isCountdownInputDataValid;
    var countdownHoursInputData;
    var countdownMinutesInputData;
    var countdownSecondsInputData;
    var countdownHours;
    var countdownMinutes;
    var countdownSeconds;
    
    (function(a) { 
        a.countdownApi = {
            init:function(e) {
            },
            
            getCountdownInputData:function() {
                isCountdownInputDataValid = true;
                countdownHoursInputData = $("#variable-countdown-hours-input").val();
                countdownMinutesInputData = $("#variable-countdown-minutes-input").val();
                countdownSecondsInputData = $("#variable-countdown-seconds-input").val();
                if (countdownHoursInputData == "" || countdownHoursInputData < 0 || isNaN(countdownHoursInputData)) {
                    alert("The countdown hours has to be greater than ot equal to 0!");
                    isCountdownInputDataValid = false;
                }
                else if (countdownMinutesInputData == "" || countdownMinutesInputData < 0 || isNaN(countdownMinutesInputData)) {
                    alert("The countdown minutes has to be greater than ot equal to 0!");
                    isCountdownInputDataValid = false;
                }
                else if (countdownSecondsInputData == "" || countdownSecondsInputData < 0 || isNaN(countdownSecondsInputData)) {
                    alert("The countdown seconds has to be greater than ot equal to 0!");
                    isCountdownInputDataValid = false;
                }
                else {
                    countdownHours = countdownHoursInputData;
                    countdownMinutes = countdownMinutesInputData;
                    countdownSeconds = countdownSecondsInputData;
                    a.countdownApi.startCountdown();
                }
            },
            
            startCountdown:function() {
                alert("Everything is correct")
            },
            
            close: function() { 
            },
        };
    }(app));
});