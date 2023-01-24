var video = document.createElement('video');
const videoWidth = 1600;
video.width = videoWidth;
video.height = videoWidth;
let count = 0;

const constraints = {
  audio: false, video: {
    facingMode: 'environment',
    width: videoWidth,
    height: videoWidth,

  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream) {
    const video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.





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
      // 画面幅の取得
      self.width = window.innerWidth;
      self.height = window.innerHeight;
      self.timerCallback();
    }, false);
  },

  computeFrame: function() {
    //videoで取得した映像の描画（フレームごとに)[
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    //canvas→DataURL
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


    count++;
    if (count % 20 == 0) {
      //getFaceInfo(file);
    }
    return;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});


// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas

  


//画像の分析    
function getFaceInfo(file) {
  let json;
  const c2 = document.getElementById("c2")
  const ctx2 = c2.getContext("2d");

  const img = new Image();
  const FruitPath = ["./fruit_ringo.png", "./fruit_banana.png", "./fruit_grape.png","./fruit_melon.png","./fruit_pineapple.png","./fruit_strawberry.png"];
  
  img.src = "./fruit_ringo.png";

  let dx =150;
  let dy = 150;
  let dw = 70;
  let dh = 70;

  // Custom Vision の Subscription Key と URL をセット
  // サブスクリプション画面に表示される URL および Key をコピーしてください
  const predictionKey = "adaeaed1463a4b0e9fb6577d9df6ca6d";
  const endpoint = "https://japaneast.api.cognitive.microsoft.com/customvision/v3.0/Prediction/d22922d2-3762-4197-8064-cff3e62ff61f/classify/iterations/Fruits_1/image";
  // Custom Vision 呼び出し URL をセット
  let webSvcUrl = endpoint;
  // Face API を呼び出すためのパラメーターをセットして呼び出し
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", webSvcUrl, true);
  xmlHttp.setRequestHeader("Prediction-Key", predictionKey);
  xmlHttp.setRequestHeader("Content-Type", "application/octet-stream");
  xmlHttp.send(file);
  xmlHttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      json = JSON.parse(this.responseText);
      ctx2.clearRect(0, 0, c2.width, c2.height);
      //ctx2.fillText(json.predictions[0].tagName,  c2.width/2, c2.height/2 
    console.log(json.predictions);
      if(json.predictions[0].probability>=0.6){
        switch(json.predictions[0].tagName){
          case 'Apple':
            img.src=FruitPath[3];
            break;
          case 'Banana':
            img.src=FruitPath[2];
            break;
          case 'Grape':
            img.src=FruitPath[0];
            break;
          case 'Melon':
            img.src=FruitPath[1];
            break;
          case 'Pineapple':
            img.src=FruitPath[5];
            break;
          case 'Strawberry':
            img.src=FruitPath[4];
            break;
        }
          ctx2.drawImage(img, dx, dy, dw, dh);
      }
    } else
    // データが取得できなかった場合
    {
    }
  };
  return json;
};

