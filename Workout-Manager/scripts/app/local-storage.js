var app = app || {};

document.addEventListener("deviceready", function() {
    
    
    (function(a) { 
        a.localStorage = {
            init:function(e) {
                var checkLocalStorage = function() {
                    var currentLocalStorage = window.localStorage.getItem("History");
                    if (currentLocalStorage) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                
                var vm = kendo.observable({
                    isVisible:checkLocalStorage(),
                    isInvisible:checkLocalStorage()
                })
                kendo.bind(e.view.element, vm, kendo.mobile.ui);
            },
            
            close: function() { 
            },
            
            clear:function(){
                window.localStorage.clear();
                app.application.navigate("views/history-view.html#history-view");
            }
        };
    }(app));
});