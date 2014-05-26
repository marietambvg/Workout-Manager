var app = app || {};

document.addEventListener("deviceready", function() {
    var vmFunrun;
    
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
        a.distanceRun = {
            init:function(e) {
                vmFunrun = kendo.observable({
                                                funDistance:"0 km",
                                                isVisibleTrackFunrunTable:false,
                                                funDistanceResult:0,
                                                funSpeed:0,
                                                funCurrentSpeed:0,
                                                funStatus:"Your current data:",
                                                isVisibleFunrunResults:false,
                    isVisibleFunrunStartButton:true,
                    isVisibleFunrunPauseButton:false,
                    isVisibleFunrunContinueButton:false,
                    isVisibleFunrunStopButton:false
                    
                                            })
                kendo.bind(e.view.element, vmFunrun, kendo.mobile.ui);
                vmFunrun.set("funDistance", "run distance");
                vmFunrun.set("isVisibleTrackFunrunTable", false);
                vmFunrun.set("funDistanceResult", "0");
                vmFunrun.set("funSpeed", "0");
                vmFunrun.set("funCurrentSpeed", "0 km/hour");
                vmFunrun.set("funStatus", "Your current data:");
                vmFunrun.set("isInvisible", true);
                vmFunrun.set("isInvisibleWrongDataMessageDistanceRun", true);
            },
            
            close: function() {
                clearInterval(a.funRun.timer);
                clearInterval(a.funRun.timerCounter);
                navigator.geolocation.getCurrentPosition(onDistanceStartSuccess, onDistanceStartError);
            },
           
            run: function() { 
                var startPosition = {"lat":startLat,"lon":startLon};
                distanceData = [];
                distanceData.push(startPosition);
                distancePlanRun = 0;
                distanceTotalRun = 0;
                currentRunTime = 0;
                finalTime = "";
                kmValue = document.getElementById("variable-km-input").value;
                metresValue = document.getElementById("variable-metres-input").value;
                if (kmValue == "") {
                    kmValue = 0;
                }
                if (metresValue == "") {
                    metresValue = 0
                }
                
                kilometres = parseInt(kmValue);
                metres = parseInt(metresValue);
                
                if (isNaN(kilometres) || isNaN(metres) || kilometres < 0 || metres < 0 ||
                    (metres == 0 && kilometres == 0)) {
                    var vm = kendo.observable({
                                                  distance:"0 km",
                                                  isVisibleTrackFunrunTable:false,
                                                  distanceResult:0,
                                                  speed:0,
                                                  status:"Your current data:",
                                                  isInvisible:true,
                                                  userDataVisibility:true,
                                                  isInvisibleWrongDataMessageDistanceRun:false
                   
                    
                                              })
                    kendo.bind($("#distance-run-view"), vm, kendo.mobile.ui);
                    vm.set("distance", "run distance");
                    vm.set("isVisibleTrackFunrunTable", false);
                    vm.set("distanceResult", "0");
                    vm.set("speed", "0");
                    vm.set("status", "Your current data:");
                    vm.set("isInvisible", true);
                    vm.set("isInvisibleWrongDataMessageDistanceRun", false);
                }
                else {
                    distancePlanRun = kilometres + metres / 1000;
                
                    vm = kendo.observable({
                                              distance:"0 km",
                                              isVisibleTrackFunrunTable:false,
                                              distanceResult:0,
                                              speed:0,
                                              currentSpeed:"0 km/hour",
                                              time:"",
                                              status:"Your current data:",
                                              isInvisible:false,
                                              userDataVisibility:false,
                                              currentRunTime:currentRunTime + " sec",
                        
                    
                                              getCurrentPosition:function() {
                                                  navigator.geolocation.getCurrentPosition(vm.onSuccess, vm.onError);
                                              },
                    
                                              onError: function (error) {
                                                  navigator.notification.alert('code: ' + error.code + '\n' +
                                                                               'message: ' + error.message + '\n');
                                              },
                    
                                              calculateCurrentDistance:function(data) {
                                                  var totalDistance = 0;
                                                  if (data.length == 0) {
                                                      return 0;
                                                  }
                                                  else {
                                                      for (i = 0; i < data.length; i++) {
                                                          if (i == (data.length - 1)) {
                                                              break;
                                                          }
                                                          totalDistance += vm.gpsDistance(data[i].lat, data[i].lon, data[i + 1].lat, data[i + 1].lon);
                                                      }
                                                  }
                                                  return totalDistance.toFixed(2);
                                              },
                    
                                              gpsDistance: function(lat1, lon1, lat2, lon2) {
                                                  // http://www.movable-type.co.uk/scripts/latlong.html
                                                  var R = 6371; // km
                                                  var dLat = (lat2 - lat1) * (Math.PI / 180);
                                                  var dLon = (lon2 - lon1) * (Math.PI / 180);
                                                  var lat1 = lat1 * (Math.PI / 180);
                                                  var lat2 = lat2 * (Math.PI / 180);

                                                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                                          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
                                                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
                                                  var d = R * c;
    
                                                  return d;
                                              },     
                    
                                              onSuccess: function(position) {
                                                  var currentLat = position.coords.latitude;
                                                  var currentLon = position.coords.longitude;
                                                  distanceData.push({"lat":currentLat,"lon":currentLon});
                                                  var runDistance = parseFloat(vm.calculateCurrentDistance(distanceData)) || 0;
                                                  distanceTotalRun = runDistance;
                                                  vm.set("distance", runDistance + " km");
                                                  if (distanceTotalRun >= distancePlanRun) {
                                                      a.distanceRun.beep();
                                                  }
                                                  else {
                                                      currentDistanceRunSpeed = (distanceTotalRun / ((currentRunTime / 60) / 60)).toFixed(2);
                                                      vm.set("currentSpeed", currentDistanceRunSpeed + " km/hour");
                                                  }
                                              },
                                          })
                
                    kendo.bind($("#distance-run"), vm, kendo.mobile.ui);
              
                    startTime = Date.now();
                    // distancePlanRun = (parseInt($("#variable-km-input").val()) || 0) + (parseInt($("#variable-metres-input").val()) || 0) / 1000;
                    a.distanceRun.timer = setInterval(
                        vm.getCurrentPosition, 5000);
                    
                    a.distanceRun.timerTimeCounter = setInterval(function() {
                        currentRunTime++;
                        vm.set("currentRunTime", currentRunTime + " sec");
                    }, 1000);
                }
            },
            
            beep: function() {
                navigator.notification.beep(1); 
                clearInterval(a.distanceRun.timer);
                clearInterval(a.distanceRun.timerTimeCounter);
                
                distanceRunTotalDistance = parseFloat(distanceTotalRun);
                //calculate time;
                endTime = Date.now();
                var totalMinutes = ((endTime - startTime) / 1000) / 60;
                if (totalMinutes != 0) {
                    distanceRunAverageSpeed = ((distanceRunTotalDistance * 60) / totalMinutes).toFixed(2) + " km/hour";
                }
                else {
                    distanceRunAverageSpeed = "0 km/hour"
                }
               
                var distanceTimeRunInSeconds = ((endTime - startTime) / 1000).toFixed(0);
                var seconds = distanceTimeRunInSeconds % 60;
                var minutesFull = (distanceTimeRunInSeconds - seconds) / 60;
                var minutes = minutesFull % 60;
                var hours = (minutesFull - minutes) / 60;
                
                if (hours > 0) {
                    finalTime+=hours + " hours";
                    if (minutes > 0) {
                        finalTime+=" " + minutes + " min" ;
                        if (seconds > 0) {
                            finalTime+=", " + seconds + " sec" ;
                        }
                    }
                }
                else if (minutes > 0) {
                    finalTime+=minutes + " min" ;
                    if (seconds > 0) {
                        finalTime+=" " + seconds + " sec" ;
                    }
                }
                else if (seconds > 0) {
                    finalTime+=seconds + " sec";
                }
                
                var viewModel = kendo.observable({
                                                     isVisibleTrackFunrunTable:true,
                                                     distanceResult:0,
                                                     speed:0,
                                                     status:"You run planned distance!",
                                                     isInvisible:true,
                                                     currentRunTime:finalTime,
                                                     isDistanceRunShareButtonVisible:true
                    
                                                 });
                kendo.bind($("#distance-run"), viewModel, kendo.mobile.ui);
                viewModel.set("isInvisible", true);
                viewModel.set("isVisibleTrackFunrunTable", true);
                viewModel.set("speed", distanceRunAverageSpeed);
                viewModel.set("distanceResult", distanceRunTotalDistance + " km");
                viewModel.set("status", "You run planned distance!");
                viewModel.set("currentTimeRun", finalTime);
                distanceRunSpeed = (distanceTotalRun / ((endTime - startTime) / (1000 * 3600))).toFixed(2);
            },
            
            save:function() {
                var formatedMinutes = new Date().getMinutes();
                var formatedMonth = new Date().getMonth() + 1;
                var formatedDate = new Date().getDate();
                var formatedHours = new Date().getHours();
                if (formatedMinutes < 10) {
                    formatedMinutes = "0" + formatedMinutes;
                }
                if (formatedHours < 10) {
                    formatedHours = "0" + formatedHours;
                }
                if (formatedMonth < 10) {
                    formatedMonth = "0" + formatedMonth;
                }
                if (formatedDate < 10) {
                    formatedDate = "0" + formatedDate
                }
                var currentRun = {
                    "runname":new Date().getFullYear() + "-" + formatedMonth + "-" + formatedDate + "/" + formatedHours + ":" + formatedMinutes,
                    "rundistance":distanceTotalRun.toFixed(2),
                    "runtime":finalTime,
                    "runspeed":distanceRunSpeed,
                    "rundata": distanceData
                }
                var localStorageData = new Array();
                localStorageData.push(currentRun);
                if (window.localStorage.getItem("History")) {
                    var history = window.localStorage.getItem("History");
                    var historyArray = JSON.parse(history);
                    historyArray.push(currentRun);
                    window.localStorage.setItem("History", JSON.stringify(historyArray));
                }
                else {
                    window.localStorage.setItem("History", JSON.stringify(localStorageData)); 
                }
                app.application.navigate("views/history-view.html#history-view");
            },
            
            share:function() {
                var vm = kendo.observable({
                                              isVisibleTrackFunrunTable:true,
                                              distanceResult:distanceRunTotalDistance + " km",
                                              speed:distanceRunAverageSpeed,
                                              status:"You run planned distance!",
                                              isInvisible:true,
                                              currentRunTime:finalTime,
                                              isDistanceRunShareButtonVisible:false
                                          })
               
                kendo.bind($("#distance-run-view"), vm, kendo.mobile.ui);
                
                app.facebookApp.login(distanceTotalRun, finalTime, distanceRunSpeed, "Today");
            }
            
        };
    }(app));
});