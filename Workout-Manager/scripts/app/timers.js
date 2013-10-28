var app = app || {};

document.addEventListener("deviceready", function() {
    
    (function(a) { 
        a.timersApi = {
    
            run:function() {
                
            },
            navigateToIntervalTimer:function() {
                app.application.navigate("views/interval-timer-view.html#interval-timer-view");
            },
    
            navigateToCountdownTimer:function() {
                app.application.navigate("views/countdown-timer-view.html#countdown-timer-view");
            },
            navigateToStopwatchTimer:function() {
                app.application.navigate("views/stopwatch-timer-view.html#stopwatch-timer-view");
            },
            
        }}(app));
});