var video = document.createElement('video');
const videoWidth = 1600;
video.width = videoWidth;
video.height = videoWidth;


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


// https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia

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
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    return;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});


  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
