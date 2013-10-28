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
    
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        
        var savedRuns = window.localStorage.getItem("History");
        if (savedRuns != null) {
            runsData=[];
            runsData=JSON.parse(savedRuns);
            viewModel.set("runs", runsData); 
            viewModel.set("isVisible", false); 
            viewModel.set("isInvisible", false);
            viewModel.set("isVisibleRunInfo", false);
        }
    }
    
    function onRunChanged(e) {
        viewModel.set("isVisibleRunInfo", true);
        var returnedValue;
        returnedValue=(e.sender._selectedValue);
        console.log((returnedValue));
        var currentRundata=[];
        var runNumber=0;
        for (var i = 0; i < runsData.length; i++) {
            if(runsData[i].runname==returnedValue){
                currentRundata=runsData[i].rundata;
                runNumber=i;
                break;
            }
        }
        console.log(currentRundata[0].lat);
        
        viewModel.set("runDate", runsData[runNumber].runname);
        viewModel.set("runDistance", runsData[runNumber].rundistance);
        viewModel.set("runTime", runsData[runNumber].runtime);
        viewModel.set("runSpeed", runsData[runNumber].runspeed);
        trackRoute(currentRundata);
    }
    
    function trackRoute(currentRundata){
        
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
        init:init          
    };
}(app));