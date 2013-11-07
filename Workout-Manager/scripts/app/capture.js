
var app = app || {};

document.addEventListener("deviceready", function() {
    function id(element) {
        return document.getElementById(element);
    }
    
    (function(a) { 
        a.captureApi = {
    
            accessFileSystem:function() {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, a.captureApi.onFileSystemSuccess, a.captureApi.fail);
            },
            onFileSystemSuccess:function (fileSystem) {
                $("#result-message").html("Name: "+fileSystem.name+" Path: "+fileSystem.root.name);
                console.log(fileSystem.name);
                console.log(fileSystem.root.name);
            },

            fail:function(evt) {
                console.log(evt.target.error.code);
            },

            navigate:function() {
                app.application.navigate("views/capture-view.html#capture-view");
            },
    
            _captureVideo:function() {
                var that = this;
                navigator.device.capture.captureVideo(function() {
                    that._captureSuccess.apply(that, arguments);
                }, function() { 
                    captureApp._captureError.apply(that, arguments);
                }, {limit:1});
            },
    
            _capureAudio:function() {
                var that = this;
                navigator.device.capture.captureAudio(function() {
                    that._captureSuccess.apply(that, arguments);
                }, function() { 
                    captureApp._captureError.apply(that, arguments);
                }, {limit:1});
            },
    
            _captureImage:function() {
                var that = this;
                navigator.device.capture.captureImage(function() {
                    that._captureSuccess.apply(that, arguments);
                }, function() { 
                    captureApp._captureError.apply(that, arguments);
                }, {limit:1});
            },
    
            _captureSuccess:function(capturedFiles) {
                var i,
                media = document.getElementById("media");
                media.innerHTML = "";
                for (i=0;i < capturedFiles.length;i+=1) {
                    media.innerHTML+='<p>Capture taken! Its path is: ' + capturedFiles[i].fullPath + '</p>'
                }
            },
    
            _captureError:function(error) {
                if (device.uuid == "e0101010d38bde8e6740011221af335301010333" || device.uuid == "e0908060g38bde8e6740011221af335301010333") {
                    alert(error);
                }
                else {
                    var media = document.getElementById("media");
                    media.innerHTML = "An error occured! Code:" + error.code;
                }
            },
            
        }
    }(app));
});