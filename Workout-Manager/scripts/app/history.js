var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        runs:[],
        selectedRun:null,
        change:onRunChanged,
        isInvisible:true,
        isVisible:true,
        isVisibleRunInfo:false
    });
    
    var runsData;
    var runNumber = 0;
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        
        var savedRuns = window.localStorage.getItem("History");
        if (savedRuns != null) {
            runsData = [];
            runsData = JSON.parse(savedRuns);
            console.log("runsData" + runsData);
            if (runsData.length > 0) {
                viewModel.set("runs", runsData); 
                viewModel.set("isVisible", false); 
                viewModel.set("isInvisible", false);
                viewModel.set("isVisibleRunInfo", false);
                viewModel.set("isVisibleShareButton", true);
            }
            else {
                viewModel.set("isVisible", true);
            }
        }
    }
    
    function deleteCurrentRun() {
        runsData.splice(runNumber, 1);
        console.log("runsData" + runsData);
        window.localStorage.setItem("History", JSON.stringify(runsData));
        viewModel.set("runs", runsData); 
        if (runsData.length > 0) {
            viewModel.set("isVisible", false); 
            viewModel.set("isInvisible", false);
            viewModel.set("isVisibleRunInfo", false);
        }
        else {
            viewModel.set("isVisible", true);
            viewModel.set("isInvisible", true);
            viewModel.set("isVisibleRunInfo", false);
        }
    }
    function shareCurrentRun(){
        var totalRun=runsData[runNumber].rundistance;
        var runTime=runsData[runNumber].runtime;
        var runSpeed=runsData[runNumber].runspeed;
        var day=runsData[runNumber].runname;
        app.facebookApp.login(totalRun, runTime, runSpeed,"historyShareRun",day);
    }
    function onRunChanged(e) {
        viewModel.set("isVisibleRunInfo", true);
        var returnedValue;
        returnedValue = (e.sender._selectedValue);
        console.log("sender selected value" + (returnedValue));
        var currentRundata = [];
        
        for (var i = 0; i < runsData.length; i++) {
            if (runsData[i].runname == returnedValue) {
                currentRundata = runsData[i].rundata;
                runNumber = i;
                break;
            }
        }
        console.log("currenrRunData[0].lat" + currentRundata[0].lat);
        
        viewModel.set("runDate", runsData[runNumber].runname);
        viewModel.set("runDistance", runsData[runNumber].rundistance + " km");
        viewModel.set("runTime", runsData[runNumber].runtime);
        viewModel.set("runSpeed", runsData[runNumber].runspeed + " km/hour");
        trackRoute(currentRundata);
    }
    
    function trackRoute(currentRundata) {
        var data = currentRundata;
        var myLatLng = new google.maps.LatLng(data[0].lat, data[0].lon);

        // Google Map options
        var myOptions = {
            zoom: 15,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Create the Google Map, set options
        var map = new google.maps.Map(document.getElementById("route-holder"), myOptions);

        var trackCoords = [];
    
        // Add each GPS entry to an array
        for (i=0; i < data.length; i++) {
            trackCoords.push(new google.maps.LatLng(data[i].lat, data[i].lon));
        }
    
        // Plot the GPS entries as a line on the Google Map
        var trackPath = new google.maps.Polyline({
            path: trackCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        // Apply the line to the map
        trackPath.setMap(map);
    }
    a.runs = {
        init:init,
        deleteCurrentRun:deleteCurrentRun,
        shareCurrentRun:shareCurrentRun
    };
}(app));