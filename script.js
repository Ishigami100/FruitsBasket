//video width&height
var video = document.createElement('video');
const videoWidth = 1600;
video.width = videoWidth;
video.height = videoWidth;

let count = 0;

//video config 
const constraints = {
  audio: false, video: {
    facingMode: 'environment',
    width: videoWidth,
    height: videoWidth,

  }
};

// https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia
//camera launch

navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream) {
    const video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); }); 
  // always check for errors at the end.


let processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    var video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    setTimeout(function() {
      self.timerCallback();
    }, 0);
  },
  
  doLoad: function() {
    this.video = document.querySelector("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");

    let self = this;
    this.video.addEventListener("play", function() {
      self.width = window.innerWidth;
      self.height = window.innerHeight;
      self.timerCallback();
    }, false);
  },
  
  //processing per frame
  computeFrame: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);

    let dataURI = this.c1.toDataURL();
    var byteString = atob(dataURI.split(",")[1]);
    var mimeType = dataURI.match(/(:)([a-z\/]+)(;)/)[2];

    for (var i = 0, l = byteString.length, content = new Uint8Array(l); l > i; i++) {
      content[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([content], {
      type: "application/octet-stream",
    });

    const file = new File([blob], "file1.png", { type: "application/octet-stream" });
    //処理の低速化
    count++;
    if (count % 10 == 0) getFaceInfo(file);

    return;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});


//画像の分析    
function getFaceInfo(file) {

  // Custom Vision の Subscription Key と URL をセット
  // サブスクリプション画面に表示される URL および Key をコピーしてください
  const predictionKey = "<Custom Vision の Prediction Key を入力>";
  const endpoint = "EndPointのURLを入れる";

  // Custom Vision 呼び出し URL をセット
  const webSvcUrl = endpoint;

  // Face API を呼び出すためのパラメーターをセットして呼び出し
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", webSvcUrl, true);
  xmlHttp.setRequestHeader("Prediction-Key", predictionKey);
  xmlHttp.setRequestHeader("Content-Type", "application/octet-stream");
  xmlHttp.send(file);
  xmlHttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      json = JSON.parse(this.responseText);
      console.log(json.predictions);
    } 
  };
}

