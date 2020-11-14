const { doc } = require("prettier");

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const extendBtn = document.getElementById("jsExpandBtn");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime")
const volumeRange = document.getElementById("jsVolume");
const timeRange = document.getElementById("jsVideoTime");


function handlePlayClick(){
    if(videoPlayer.paused){
        videoPlayer.play();
        playBtn.innerHTML ='<i class="fas fa-pause"></i>'
    }else{
        videoPlayer.pause();
        playBtn.innerHTML ='<i class="fas fa-play"></i>'
    }
}
function handleVolumeClick(){
    if(videoPlayer.muted){
        videoPlayer.muted = false;
        volumeBtn.innerHTML ='<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume;
    }else{
        volumeRange.value = 0;
        videoPlayer.muted = true;
        volumeBtn.innerHTML ='<i class="fas fa-volume-mute"></i>'
    }
}
function exitFullScreen(){
    extendBtn.innerHTML = '<i class="fas fa-expand"></i>';
    extendBtn.addEventListener("click",goFullScreen);
    if(document.exitFullscreen){
        document.exitFullscreen();
    }else if(document.mozCancelFullScreen){
        document.mozCancelFullScreen();
    }else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen();
    }else if(document.msExitFullscreen){
        document.msExitFullscreen();
    }
}
function goFullScreen(){
    if(videoContainer.requestFullscreen){
        videoContainer.requestFullscreen();
    }else if(videoContainer.mozRequestFullScreen){
        videoContainer.mozRequestFullScreen();
    }else if(videoContainer.webkitRequestFullscreen){
        videoContainer.webkitRequestFullscreen();
    }else if(videoContainer.msRequsetFullscreen){
        videoContainer.msRequsetFullscreen();
    }
    extendBtn.innerHTML = '<i class="fas fa-compress"></i>'
    extendBtn.removeEventListener("click",goFullScreen);
    extendBtn.addEventListener("click",exitFullScreen)
}

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
  
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
  };
  
function setTotalTime(){
    const totalTimeString = formatDate(videoPlayer.duration);
    totalTime.innerHTML = totalTimeString; 
}

function getCurrentTime(){
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function handleEnded(){
    videoPlayer.currentTime = 0;
    playBtn.innerHTML ='<i class="fas fa-play"></i>';
}
function handleDrag(event){
    const {
        target : { value }
    } = event
    videoPlayer.volume = value;
    if(value >= 0.7){
        volumeBtn.innerHTML ='<i class="fas fa-volume-up"></i>';
    }else if( value >= 0.4){
        volumeBtn.innerHTML ='<i class="fas fa-volume-down"></i>';
    }else if(value > 0.1){
        volumeBtn.innerHTML ='<i class="fas fa-volume-off"></i>';
    }else {
        volumeBtn.innerHTML ='<i class="fas fa-volume-mute"></i>';
    }
}

function handleTimeDrag(event){
    const {
        target : { value }
    } = event;
    const videoTime = Math.floor(videoPlayer.duration);
    timeRange.max = videoTime; 
    videoPlayer.currentTime = value; 
    
}
function setVideoProgress(){
    const percent = 
        ((timeRange.value - timeRange.min) / (timeRange.max - timeRange.min))*100;
    timeRange.style.setProperty("--progressPersent",`${percent}%`);
}

function init(){
    videoPlayer.volume = 0.5;
    playBtn.addEventListener("click",handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    extendBtn.addEventListener("click",goFullScreen);
    videoPlayer.addEventListener("loadedmetadata",setTotalTime);
    videoPlayer.addEventListener("timeupdate",()=>{
        setInterval(getCurrentTime, 1000);
        timeRange.value = videoPlayer.currentTime;
    })
    videoPlayer.addEventListener("ended",handleEnded);
    volumeRange.addEventListener("input",handleDrag);
    timeRange.addEventListener("input",handleTimeDrag);
    videoPlayer.addEventListener("timeupdate",setVideoProgress);
}

if(videoContainer){
    init();
}

