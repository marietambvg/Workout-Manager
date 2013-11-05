var app = app || {};

document.addEventListener("deviceready", function() {
    var intervals = 4;
    var rest = 2;
    var work = 5;
    var currentInterval = 4;
    var currentTimeLeft = rest;
    var currentPhase = "REST";
    var isNewInterval = true;
    
    (function(a) { 
        a.intervalsApi = {
            init:function(e) {
                var vm = kendo.observable({
                    IsVisibleCurrentWorkoutDetails:true,
                    isVisible:false,
                    isInvisible:true,
                    totalIntervals:intervals,
                    workTime:work,
                    restTime:rest
                });
                kendo.bind(e.view.element, vm, kendo.mobile.ui);
            },
            
            close: function() { 
            },
            
            navigateToPlayIntervalsView: function() { 
                app.application.navigate("views/play-intervals-view.html#play-intervals-view");
            },
            
            startWorkout: function() {
                var vm = kendo.observable({
                    IsVisibleCurrentWorkoutDetails:false,
                    isVisible:true,
                    isInvisible:true,
                    interval:currentInterval,
                    timeLeft:currentTimeLeft,
                    phase:currentPhase,
                    
                    countdownIntervals:function() {
                        if (isNewInterval) {
                            isNewInterval = false;
                            currentPhase = "REST";
                            currentTimeLeft = rest;
                            currentInterval--;
                            vm.set("phase", currentPhase);
                            vm.set("interval", currentInterval); 
                            vm.set("timeLeft", currentTimeLeft);
                        } 
                        
                        if (currentTimeLeft - 1 > 0) {
                            currentTimeLeft--;
                            vm.set("timeLeft", currentTimeLeft);
                        }
                        else if (currentTimeLeft - 1 == 0) {
                            currentTimeLeft--;
                            vm.set("timeLeft", currentTimeLeft);
                            if (currentPhase == "REST") {
                                currentPhase = "WORK";
                                vm.set("phase", "WORK");
                                currentTimeLeft = work;
                                vm.set("timeLeft", currentTimeLeft);
                            }
                            else {
                                if (currentInterval == 0) {
                                    
                                    vm.set("setIsVisibleCurrentWorkoutDetails", false);
                                    vm.set("isVisible", false);
                                    vm.set("isInvisible", false);
                                    clearInterval(a.intervalsApi.timer);
                                }
                                else {
                                    isNewInterval = true;
                                }
                            }
                        }
                    }                    
                    
                })
                kendo.bind($("#play-intervals-view"), vm, kendo.mobile.ui);
                a.intervalsApi.timer = setInterval(vm.countdownIntervals, 1000);
            }
        };
    }(app));
});