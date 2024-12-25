const video = document.getElementById("video");
const canvas = document.getElementById("video-thumbnail");
const playPauseOverlay = document.getElementById("play-pause-overlay");
const playPauseOverlayParent = document.getElementById(
  "play-pause-overlay-parent"
);
const playButtonControl = document.getElementById("play-icon");
const pauseButtonControl = document.getElementById("pause-icon");
const seekBar = document.getElementById("seek-bar");
const controls = document.getElementById("video-controls");
const fullScreenButton = document.getElementById("full-screen");
const volumeIcon = document.getElementById("volume-icon");
const volumeBar = document.getElementById("volume-bar");
let controlsTimeout;
let isMouseOverControls = false;

function captureThumbnail() {
  const ctx = canvas.getContext("2d");
  video.currentTime = 2;
  video.addEventListener("loadeddata", () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
}
captureThumbnail();

playPauseOverlay.addEventListener("click", () => {
  video.classList.remove("hidden");
  video.play();
  playPauseOverlayParent.style.display = "none";
  canvas.style.display = "none";
  controls.classList.remove("hidden");
  playButtonControl.classList.add("hidden");
  pauseButtonControl.classList.remove("hidden");
  hideControlsAfterDelay();
});

document.querySelector(".play-pause").addEventListener("click", () => {
  togglePlayPause();
});

video.addEventListener("timeupdate", () => {
  const value = (100 / video.duration) * video.currentTime;
  seekBar.value = value;
  document.getElementById("current-time").textContent = formatTime(
    video.currentTime
  );
  document.getElementById("duration").textContent = formatTime(video.duration);
});

seekBar.addEventListener("input", () => {
  const time = video.duration * (seekBar.value / 100);
  video.currentTime = time;
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function togglePlayPause() {
  if (video.paused) {
    video.play();
    playButtonControl.classList.add("hidden");
    pauseButtonControl.classList.remove("hidden");
    hideControlsAfterDelay();
  } else {
    video.pause();
    playButtonControl.classList.remove("hidden");
    pauseButtonControl.classList.add("hidden");
    controls.classList.remove("hidden");
  }
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    togglePlayPause();
  }

  if (event.code === "KeyF") {
    toggleFullScreen();
  }

  if (event.code === "ArrowRight") {
    video.currentTime += 5;
  }

  if (event.code === "ArrowLeft") {
    video.currentTime -= 5;
  }

  if (event.code === "ArrowUp") {
    video.volume = Math.min(video.volume + 0.1, 1);
    updateVolumeDisplay();
    updateVolumeBar();
  }

  if (event.code === "ArrowDown") {
    video.volume = Math.max(video.volume - 0.1, 0);
    updateVolumeDisplay();
    updateVolumeBar();
  }
});

function hideControlsAfterDelay() {
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    if (!isMouseOverControls) {
      controls.classList.add("hidden");
    }
  }, 2000);
}

video.addEventListener("mousemove", () => {
  controls.classList.remove("hidden");
  hideControlsAfterDelay();
});

controls.addEventListener("mouseenter", () => {
  isMouseOverControls = true;
  clearTimeout(controlsTimeout);
});

controls.addEventListener("mouseleave", () => {
  isMouseOverControls = false;
  hideControlsAfterDelay();
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document
      .querySelector(".video-container")
      .requestFullscreen()
      .catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
  } else {
    document.exitFullscreen();
  }
}

fullScreenButton.addEventListener("click", toggleFullScreen);

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    controls.classList.remove("hidden");
    hideControlsAfterDelay();
  } else {
    controls.classList.remove("hidden");
  }
});

video.addEventListener("dblclick", toggleFullScreen);
video.addEventListener("click", togglePlayPause);

volumeIcon.addEventListener("click", () => {
  video.muted = !video.muted;
  video.muted ? (volumeBar.value = 0) : (volumeBar.value = video.volume);
  updateVolumeDisplay();
  updateVolumeBar();
});

volumeIcon.addEventListener("mouseenter", () => {
  volumeBar.classList.remove("hidden");
});

volumeBar.addEventListener("mouseenter", () => {
  volumeBar.classList.remove("hidden");
});

volumeBar.addEventListener("mouseleave", () => {
  volumeBar.classList.add("hidden");
});

volumeIcon.addEventListener("mouseleave", () => {
  volumeBar.classList.add("hidden");
});

volumeBar.addEventListener("input", () => {
  video.volume = volumeBar.value;
  updateVolumeDisplay();
  updateVolumeBar();
});

function updateVolumeDisplay() {
  volumeIcon.title = `Volume: ${Math.round(
    (!video.muted ? video.volume : 0) * 100
  )}%`;
  if (video.muted || video.volume === 0) {
    volumeIcon.src = './assets/img/icon/sound-off.svg';
  } else if (video.volume < 0.5) {
    volumeIcon.src = './assets/img/icon/sound-volume-1.svg';
  } else {
    volumeIcon.src = './assets/img/icon/sound-volume-2.svg';
  }
}

function updateVolumeBar() {
  volumeBar.value = video.volume;
}

updateVolumeDisplay();
updateVolumeBar();
