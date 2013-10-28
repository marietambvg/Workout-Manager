var app = app || {};

(function(a) {
    var states = null;
    var currentState="";
    var previousState="";
    
    function initStates() {
        states = {};
        states[Connection.UNKNOWN] = 'Unknown';
        states[Connection.ETHERNET] = 'Ethernet';
        states[Connection.WIFI] = 'WiFi';
        states[Connection.CELL_2G] = 'Cell 2G';
        states[Connection.CELL_3G] = 'Cell 3G';
        states[Connection.CELL_4G] = 'Cell 4G';
        states[Connection.CELL] = 'Cell generic';
        states[Connection.NONE] = 'No network';
    }
    var connectionAPI = {
        init: function(e) {
            if (!states) {
                initStates();
            }
            var vm = kendo.observable({
                state:"Internet Access Enabled",
                
                update:function() {
                    var networkState = navigator.connection.type;
                    previousState=currentState;
                    currentState = states[networkState];
                    
                    if (currentState != "No network") {
                        vm.set("state", states[networkState] + " Connection Enabled");
                    }
                    else if(currentState!=previousState){
                        vm.set("state", "No Internet Access");
                        navigator.notification.beep(3);
                        navigator.notification.vibrate(2000);
                    }
                    else {
                        vm.set("state", "No Internet Access");
                    }
                }
            });
            connectionAPI.timer = setInterval(vm.update, 5000);            
            kendo.bind($("#settings-view"), vm, kendo.mobile.ui);       
        },
        close: function() {
            clearInterval(connectionAPI.timer);
        }
    }
    
    a.connectionApi = connectionAPI;
}(app));