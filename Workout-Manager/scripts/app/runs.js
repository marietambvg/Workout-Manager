var app = app || {};

document.addEventListener("deviceready", function() {
    
    (function(a) { 
        a.runsApi = {
    
            run:function() {
                
            },
            navigateToRunForTime:function() {
                app.application.navigate("views/time-run-view.html#time-run-view");
            },
    
            navigateToRunForDistance:function() {
                app.application.navigate("views/distance-run-view.html#distance-run-view");
            },
            
             navigateToRunForFun:function() {
                app.application.navigate("views/fun-run-view.html#fun-run-view");
            },
            
        }}(app));
});