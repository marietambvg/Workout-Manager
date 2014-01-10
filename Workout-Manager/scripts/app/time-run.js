var app = app || {};

document.addEventListener("deviceready", function() {
    var totalRun = 0;
    var data = [];
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var runSpeed = 0;
    var runTime = "";
    var timeLeft = 0;
    var runTimeInHours = 0;
    var currentSpeed = 0;
    var averageSpeed;
    var totalDistance;
    var startLat;
    var startLon;
    
    function onStartSuccess(position) {
        startLat = position.coords.latitude;
        startLon = position.coords.longitude;
    }
    
    function onStartError(error) {
        navigator.notification.alert('code: ' + error.code + '\n' +
                                     'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onStartSuccess, onStartError);
    
    (function(a) { 
        a.timeRun = {
            init:function(e) {
                //ar data = [];
                //var startPosition = {"lat":startLat,"lon":startLon};
                //data.push(startPosition);
                runTime = "";
                
                var vm = kendo.observable({
                    distance:"0 km",
                    isVisible:false,
                    distanceResult:0,
                    speed:0,
                    timeStatus:"",
                    isInvisible:true,
                    userDataVisibility:true,
                    isInvisibleWrongDataMessage:true
                })
                kendo.bind(e.view.element, vm, kendo.mobile.ui);
                vm.set("distance", "run distance");
                vm.set("isVisible", false);
                vm.set("distanceResult", "0");
                vm.set("currentSpeed", "0");
                vm.set("speed", "0");
                vm.set("status", "");
                vm.set("isInvisible", true);
                vm.set("isInvisibleWrongDataMessage", true);
            },
            
            close: function() { 
                clearInterval(a.timeRun.timer);
                clearInterval(a.timeRun.timerTimeLeft);
                clearTimeout(a.timeRun.timeout);
                navigator.geolocation.getCurrentPosition(onStartSuccess, onStartError);
            },
            
            run: function(e) {
                
                
                var startPosition = {"lat":startLat,"lon":startLon};
                data=[];
                data.push(startPosition);
                totalRun = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
                runSpeed = 0;
                runTime = "";
                timeLeft = 0;
                runTimeInHours = 0;
                currentSpeed = 0;
                
                secondsValue = document.getElementById("variable-seconds-input").value;
                minutesValue = document.getElementById("variable-minutes-input").value;
                hoursValue = document.getElementById("variable-hours-input").value;
                
                if (secondsValue == "") {
                    secondsValue = 0;
                }
                if (minutesValue == "") {
                    minutesValue = 0;
                }
                if (hoursValue == "") {
                    hoursValue = 0;
                }
                seconds = parseInt(secondsValue);
                minutes = parseInt(minutesValue);
                hours = parseInt(hoursValue);
                if ((isNaN(seconds) || isNaN(minutes) || isNaN(hours) || seconds < 0 || minutes < 0 || hours < 0) ||
                    (secondsValue == "" && minutesValue == "" && hoursValue == "")) {
                    var vm = kendo.observable({
                        distance:"0 km",
                        isVisible:false,
                        distanceResult:0,
                        speed:0,
                        timeStatus:"",
                        isInvisible:true,
                        userDataVisibility:true,
                        isInvisibleWrongDataMessage:false
                    })
                    kendo.bind($("#time-run-view"), vm, kendo.mobile.ui);
                    vm.set("distance", "run distance");
                    vm.set("isVisible", false);
                    vm.set("distanceResult", "0");
                    vm.set("speed", "0");
                    vm.set("status", "");
                    vm.set("isInvisible", true);
                    vm.set("isInvisibleWrongDataMessage", false);
                }
                else {
                    if (secondsValue == "") {
                        secondsValue = 0;
                    }
                    if (minutesValue == "") {
                        minutesValue = 0;
                    }
                    if (hoursValue == "") {
                        hoursValue = 0;
                    }
                    time = ((hours * 60) + minutes) * 60000 + seconds * 1000; //miliseconds
                    runTimeInHours = ((time / 1000) / 60) / 60;
                    timeLeft = time / 1000;
                
                    vm = kendo.observable({
                        distance:"0.00 km",
                        isVisible:false,
                        distanceResult:0,
                        currentSpeed:"0 km/hour",
                        speed:0,
                        timeStatus:"Your current data:",
                        isInvisible:false,
                        userDataVisibility:false,
                        status:"Your current data",
                        timeLeft:timeLeft + " sec",
                    
                        gpsDistance:function(lat1, lon1, lat2, lon2) {
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
                    
                        onSuccess:function(position) {
                            var currentLat = position.coords.latitude;
                            var currentLon = position.coords.longitude;
                            data.push({"lat":currentLat,"lon":currentLon});
                            var runDistance = vm.calculateCurrentDistance(data);
                            totalRun = runDistance;
                            vm.set("distance", runDistance + " km");
                            currentSpeed = (runDistance / (runTimeInHours - (timeLeft / 60) / 60)).toFixed(2);
                            vm.set("currentSpeed", currentSpeed + " km/hour");
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
                
                        onError: function (error) {
                            navigator.notification.alert('code: ' + error.code + '\n' +
                                                         'message: ' + error.message + '\n');
                        },
                
                        getCurrentPosition:function() {
                            navigator.geolocation.getCurrentPosition(vm.onSuccess, vm.onError);
                        }
                    });
                    
                    a.timeRun.timer = setInterval(vm.getCurrentPosition, 5000);
                    a.timeRun.timerTimeLeft = setInterval(
                        function() {
                            timeLeft--;
                            vm.set("timeLeft", timeLeft + " sec");
                        }, 1000);
                
                    kendo.bind($("#time-run-view"), vm, kendo.mobile.ui);
                    
                    a.timeRun.timeout = setTimeout(function () {
                        a.timeRun.beep(hours, minutes, seconds);
                    }, time);
                }
            },
            
            beep: function(hours, minutes, seconds) {
                navigator.notification.beep(1); 
                totalDistance = parseFloat(totalRun);
                //calculate time;
                var totalMinutes = (hours * 60 + minutes + seconds / 60);
                if (totalMinutes != 0) {
                    averageSpeed = ((totalDistance * 60) / totalMinutes).toFixed(2) + " km/hour";
                }
                else {
                    averageSpeed = "0 km/hour"
                }
                if (hours > 0) {
                    runTime+=hours + " hours";
                    if (minutes > 0) {
                        runTime+=" " + minutes + " min" ;
                        if (seconds > 0) {
                            runTime+=", " + seconds + " sec" ;
                        }
                    }
                }
                else if (minutes > 0) {
                    runTime+=minutes + " min" ;
                    if (seconds > 0) {
                        runTime+=" " + seconds + " sec" ;
                    }
                }
                else if (seconds > 0) {
                    runTime+=seconds + " sec";
                }
                var viewModel = kendo.observable({
                    isVisible:true,
                    distanceResult:0,
                    speed:0,
                    timeStatus:"",
                    isInvisible:true,
                    currentRunTime:runTime,
                    isTimeRunShareButtonVisible:true,
                });
                          
                kendo.bind($("#time-run-view"), viewModel, kendo.mobile.ui);
                viewModel.set("isInvisible", true);
                viewModel.set("isVisible", true);
                viewModel.set("isTimeRunShareButtonVisible", true);
                viewModel.set("speed", averageSpeed);
                viewModel.set("distanceResult", totalDistance + " km");
                viewModel.set("timeStatus", "Time is over!");
                viewModel.set("currentRunTime", runTime);
                clearInterval(a.timeRun.timer);
                clearInterval(a.timeRun.timerTimeLeft);
                
                runSpeed = "No data!"
                if (runTime != "") {
                    runSpeed = (totalRun / (hours + minutes / 60 + seconds / 3600)).toFixed(2).toString();
                }
            },
            
            save:function() {
                var currentRun = {
                    "runname":new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate() + "/" + new Date().getHours() + ":" + new Date().getMinutes(),
                    "rundistance":totalRun,
                    "runtime":runTime,
                    "runspeed":runSpeed,
                    "rundata":data
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
                    isVisible:true,
                    isInvisible:true,
                    isTimeRunShareButtonVisible:false,
                    distanceResult:totalDistance + " km",
                    speed:averageSpeed,
                    timeStatus:"Time is over",
                    currentRunTime:runTime,
                })
               
                kendo.bind($("#time-run-view"), vm, kendo.mobile.ui);
                
                app.facebookApp.login(totalRun, runTime, runSpeed);
            },
            
            saveAndShare:function(){
                this.save();
                this.share();
            }
        };
    }(app));
});