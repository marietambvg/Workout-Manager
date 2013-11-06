var app = app || {};

document.addEventListener("deviceready", function() {
    var intervals;
    var rest;
    var work;
    var prepare;
    var currentPhase = "PREPARE";
    var currentInterval;
    var currentTimeLeft; 
    var isNewInterval = true;
    
    (function(a) {
        a.intervalsApi = {
            init:function(e) {
            },
            
            getCurrentValues:function() {
                intervals = $("#variable-intervals-number").val();
                work = $("#variable-work-time-input").val();
                rest = $("#variable-rest-time-input").val();
                prepare = $("#variable-prepare-time-input").val();
                currentInterval=intervals;
                currentTimeLeft=prepare; 
            },
            
            initIntervals:function(e) {
                var vm = kendo.observable({
                    IsVisibleCurrentWorkoutDetails:true,
                    isVisible:false,
                    isInvisible:true,
                    totalIntervals:intervals,
                    workTime:work,
                    restTime:rest,
                    prepareTime:prepare
                });
                kendo.bind(e.view.element, vm, kendo.mobile.ui);
            },
            
            close: function() { 
            },
            
            navigateToPlayIntervalsView: function() {
                a.intervalsApi.getCurrentValues();
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
                    
                    countdownPrepare:function() {
                        if (currentPhase == "PREPARE") {
                            if (currentTimeLeft > 0) {
                                currentTimeLeft--;
                                vm.set("timeLeft", currentTimeLeft);
                            }
                            else {
                                clearInterval(a.intervalsApi.prepareTimer);
                                navigator.notification.beep(1);
                                a.intervalsApi.timer = setInterval(vm.countdownIntervals, 1000);
                            }
                        }
                    },
                    
                    countdownIntervals:function() {
                        if (isNewInterval) {
                            isNewInterval = false;
                            currentPhase = "REST";
                            currentTimeLeft = rest;
                            vm.set("timeLeft", currentTimeLeft);
                            currentInterval--;
                            vm.set("interval", currentInterval);
                            vm.set("phase", currentPhase);
                        } 
                        
                        if (currentTimeLeft > 0) {
                            vm.set("timeLeft", currentTimeLeft);
                            currentTimeLeft--;
                        }
                        else if (currentTimeLeft == 0) {
                            navigator.notification.beep(2);
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
                                    navigator.notification.beep(3);
                                }
                                else {
                                    isNewInterval = true;
                                }
                            }
                        }
                    }                    
                    
                })
                kendo.bind($("#play-intervals-view"), vm, kendo.mobile.ui);
                a.intervalsApi.prepareTimer = setInterval(vm.countdownPrepare, 1000);
            }
        };
    }(app));
});