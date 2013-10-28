var app = app || {};

document.addEventListener("deviceready", function() {
    var distancePlanRun = 0;
    var distanceTotalRun = 0;
    var distanceData = [];
    var startTime;
    var currentRunTime=0;
    var endTime;
    var distanceRunTime;
    var distanceRunSpeed;
    
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
                //ar data = [];
                var startPosition = {"lat":startLat,"lon":startLon};
                distanceData.push(startPosition);
                
                var vm = kendo.observable({
                    distance:"0 km.",
                    isVisible:false,
                    distanceResult:0,
                    speed:0,
                    status:"",
                    isInvisible:true,
                    userDataVisibility:true,
                   
                    
                })
                kendo.bind(e.view.element, vm, kendo.mobile.ui);
                vm.set("distance", "run distance");
                vm.set("isVisible", false);
                vm.set("distanceResult", "0");
                vm.set("speed", "0");
                vm.set("status", "");
                vm.set("isInvisible", true);
               
            },
            
            close: function() { 
            },
           
            run: function() { 
                var vm = kendo.observable({
                    distance:"0 km",
                    isVisible:false,
                    distanceResult:0,
                    speed:0,
                    time:"",
                    isInvisible:false,
                    userDataVisibility:false,
                    currentRunTime:currentRunTime+" sec.",
                    
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
                        vm.set("distance", runDistance + " km.");
                        if (distanceTotalRun >= distancePlanRun) {
                            a.distanceRun.beep();
                        }
                    },
                })
                
                kendo.bind($("#distance-run"), vm, kendo.mobile.ui);
              
                startTime = Date.now();
                distancePlanRun = (parseInt($("#variable-km-input").val()) || 0) + (parseInt($("#variable-metres-input").val()) || 0) / 1000;
                a.distanceRun.timer = setInterval(vm.getCurrentPosition, 5000);
                a.distanceRun.timerTimeCounter = setInterval(function(){
                    currentRunTime++;
                    vm.set("currentRunTime",currentRunTime+" sec.")
                }, 1000);
                
               
            },
            
            beep: function() {
                navigator.notification.beep(1); 
                clearInterval(a.distanceRun.timer);
                clearInterval(a.distanceRun.timerTimeCounter);
                
                var totalDistance = parseFloat(distanceTotalRun);
                //calculate time;
                endTime = Date.now();
                var totalMinutes = ((endTime - startTime) / 1000) / 60;
                if (totalMinutes != 0) {
                    var averageSpeed = ((totalDistance * 60) / totalMinutes).toFixed(2) + " km/hour";
                }
                else {
                    averageSpeed = "0 km/hour"
                }
                
                var viewModel = kendo.observable({
                    isVisible:true,
                    distanceResult:0,
                    speed:0,
                    status:"",
                    isInvisible:true,
                    currentRunTime:currentRunTime+" sec.",
                    
                });
                          
                kendo.bind($("#distance-results"), viewModel, kendo.mobile.ui); 
                kendo.bind($("#distance-current-distance"), viewModel, kendo.mobile.ui);
                viewModel.set("isInvisible", true);
                viewModel.set("isVisible", true);
                viewModel.set("speed", averageSpeed);
                viewModel.set("distanceResult", totalDistance + " km.");
                viewModel.set("status", "You run planned distance!");
                viewModel.set("currentTimeRun", currentRunTime+" sec.");
                
            },
            
            save:function() {
                distanceRunTime=((endTime-startTime)/(1000*60)).toFixed(2);
                distanceRunSpeed=(distanceTotalRun/((endTime-startTime)/(1000*3600))).toFixed(2);
                var currentRun = {
                    
                    "runname":new Date().getFullYear() + "-"+new Date().getMonth()+ "-" +new Date().getDate() +"/" +new Date().getHours()+ ":" + new Date().getMinutes(),
                    "rundistance":distanceTotalRun.toFixed(2),
                    "runtime":distanceRunTime,
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
            }
        };
    }(app));
});