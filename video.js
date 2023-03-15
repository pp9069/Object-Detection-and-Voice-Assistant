document.getElementById("ai").addEventListener("change", toggleAi)
document.getElementById("fps").addEventListener("input", changeFps)

const video = document.getElementById("video");
const c1 = document.getElementById('c1');
const ctx1 = c1.getContext('2d');
var cameraAvailable = false;
var aiEnabled = false;
var fps = 16;

var facingMode = "environment"; 
var constraints = {
    audio: false,
    video: {
        facingMode: 'enviroment'
    }
};


function toggleCard(){
    let card = document.querySelector(".card-panel");
    card.classList.toggle('hide');
}




/* Stream it to video element */
camera();
function camera() {
    if (!cameraAvailable) {
        console.log("camera")
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            cameraAvailable = true;
            video.srcObject = stream;
        }).catch(function (err) {
            cameraAvailable = false;
            if (modelIsLoaded) {
                if (err.name === "NotAllowedError") {
                    document.getElementById("loadingText").innerText = "Waiting for camera permission";
                }
            }
            setTimeout(camera, 1000);
        });
    }
}

window.onload = function () {
    timerCallback();
}

function timerCallback() {
    if (isReady()) {
        setResolution();
        ctx1.drawImage(video, 0, 0, c1.width, c1.height);
        if (aiEnabled) {
            ai();
        }
    }
    setTimeout(timerCallback, fps);
}

function isReady() {
    if (modelIsLoaded && cameraAvailable) {
        document.getElementById("loadingText").style.display = "none";
        document.getElementById("ai").disabled = false;
        return true;
    } else {
        return false;
    }
}

function setResolution() {
    if (window.screen.width < video.videoWidth) {
        c1.width = window.screen.width * 0.9;
        let factor = c1.width / video.videoWidth;
        c1.height = video.videoHeight * factor;
    } else if (window.screen.height < video.videoHeight) {
        c1.height = window.screen.height * 0.50;
        let factor = c1.height / video.videoHeight;
        c1.width = video.videoWidth * factor;
    }
    else {
        c1.width = video.videoWidth;
        c1.height = video.videoHeight;
    }
};

function toggleAi() {
    aiEnabled = document.getElementById("ai").checked;
}

function changeFps() {
    fps = 1000 / document.getElementById("fps").value;
}
let xaxis = document.getElementById("xaxis");
let yaxis = document.getElementById("yaxis");
let width = document.getElementById("width");
let height = document.getElementById("height");
let obj = document.getElementById("obj");
let speech = new SpeechSynthesisUtterance();
function ai() {
    // Detect objects in the image element
    objectDetector.detect(c1, (err, results) => {
        console.log(results); // Will output bounding boxes of detected objects
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            ctx1.font = "15px Arial";
            ctx1.fillStyle = "red";
            ctx1.fillText(element.label + " - " + (element.confidence * 100).toFixed(2) + "%", element.x + 10, element.y + 15);
            ctx1.beginPath();
            ctx1.strokeStyle = "red";
            ctx1.rect(element.x, element.y, element.width, element.height);
            ctx1.stroke();
            console.log(element.label);
            xaxis.textContent = element.x;
            yaxis.textContent = element.y;
            width.textContent = element.width;
            height.textContent = element.height;
            obj.textContent=element.label;
        /*
            var direction="";
           if(element.x>44.74935531616211)
            {
                direction="left";
            }
            else
            {
                direction="right";
            }
        */
            /* --------------- Speech ------------ */
            speech.text = element.label;
            speech.pitch = 1;
            speech.volume = 1;
            speech.lang = "en-US";
            speech.rate = 1;
            speechSynthesis.speak(speech);
            /* --------------- Speech ------------ */
            
        }
    });
}

