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
    var background = "#FFB6C1";
    var isInputDataValid;
    
    (function(a) {
        a.intervalsApi = {
            init:function(e) {
                 currentPhase = "PREPARE";
                 isNewInterval = true;
            },
            
            getCurrentValues:function() {
                isInputDataValid=true;
                intervals = $("#variable-intervals-number").val();
                if (intervals == "" || intervals <= 0 || isNaN(intervals)) {
                    alert("The intervals' number has to be greater than 0!");
                    isInputDataValid=false;
                }
                else {
                    work = $("#variable-work-time-input").val();
                    if (work == "" || work <= 0 || work % 1 > 0) {
                        isInputDataValid=false;
                        alert("The workout time has to be greater than 0!");
                    }
                    else {
                        rest = $("#variable-rest-time-input").val();
                        if (rest == "" || rest < 0 || rest % 1 > 0) {
                            isInputDataValid=false;
                            alert("The rest time has to be greater than or equal to 0!");
                        }
                        else {
                            prepare = $("#variable-prepare-time-input").val();
                            if (prepare == "" || prepare < 0 || prepare % 1 > 0) {
                                isInputDataValid=false;
                                alert("The prepare time has to be greater than or equal to 0!");
                            }
                            else {
                                currentInterval = intervals;
                                currentTimeLeft = prepare; 
                            }
                        }
                    }
                }
            },
            
            initIntervals:function(e) {
                var vm = kendo.observable({
                                              IsVisibleCurrentWorkoutDetails:true,
                                              isVisible:false,
                                              isInvisible:true,
                                              totalIntervals:intervals,
                                              workTime:work,
                                              restTime:rest,
                                              prepareTime:prepare,
                                              backgroundcolor:background,
                                          });
                kendo.bind(e.view.element, vm, kendo.mobile.ui);
            },
            
            close: function() { 
                clearInterval(a.intervalsApi.prepareTimer);
                clearInterval(a.intervalsApi.timer);
            },
            
            pauseWorkout:function(){
                alert("The workout is paused. Press O.K. when you are ready to continue.")
            },
            
            navigateToPlayIntervalsView: function() {
                a.intervalsApi.getCurrentValues();
                if(isInputDataValid==true){
                    app.application.navigate("views/play-intervals-view.html#play-intervals-view");
                }
                else a.intervalsApi.navigateToPlayIntervalsView;
                
            },
            
            startWorkout: function() {
                var vm = kendo.observable({
                                              IsVisibleCurrentWorkoutDetails:false,
                                              isVisible:true,
                                              isInvisible:true,
                                              interval:currentInterval,
                                              timeLeft:currentTimeLeft,
                                              phase:currentPhase,
                                              backgroundcolor:background,
                    
                                              countdownPrepare:function() {
                                                  if (currentPhase == "PREPARE") {
                                                      if (currentTimeLeft > 0) {
                                                          currentTimeLeft--;
                                                          vm.set("timeLeft", currentTimeLeft);
                                                          vm.set("backgroundcolor", "#FFB6C1");
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
                                                      vm.set("backgroundcolor", "#9ACD32");
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
                                                          vm.set("backgroundcolor", "#DC143C");
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