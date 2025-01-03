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
const playbackSpeed = document.getElementById("playback-speed");
const speedOptions = document.getElementById("speed-options");
const speed = document.getElementById("speed");
const settings = document.getElementById("settings-icon");
const settingMenu = document.getElementById("settings-menu");
const settingsControl = document.getElementById("settings-control");
const add10s = document.getElementById("add10s");
const subtract10s = document.getElementById("subtract10s");
let controlsTimeout;
let isMouseOverControls = false;

// Capture a thumbnail from the video
function captureThumbnail() {
  const ctx = canvas.getContext("2d");
  video.currentTime = 2;
  video.addEventListener("loadeddata", () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
}
captureThumbnail();

// Play video on overlay click
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

// Toggle play/pause on button click
document.querySelector(".play-pause").addEventListener("click", () => {
  togglePlayPause();
});

// Update seek bar and time display
video.addEventListener("timeupdate", () => {
  const value = (100 / video.duration) * video.currentTime;
  seekBar.value = value;
  document.getElementById("current-time").textContent = formatTime(
    video.currentTime
  );
  document.getElementById("duration").textContent = formatTime(video.duration);
});

// Seek video on seek bar input
seekBar.addEventListener("input", () => {
  const time = video.duration * (seekBar.value / 100);
  video.currentTime = time;
});

// Format time in minutes and seconds
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Toggle play/pause state
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

// Handle keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (playPauseOverlayParent.style.cssText === "display: none;") {
    if (event.key === " " || event.key.toLowerCase() === "k") {
      togglePlayPause();
    }

    if (event.key.toLowerCase() === "f") {
      toggleFullScreen();
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "l") {
      video.currentTime += 5;
    }

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "j") {
      video.currentTime -= 5;
    }

    if (event.key === "ArrowUp") {
      video.volume = Math.min(video.volume + 0.1, 1);
      updateVolumeDisplay();
      updateVolumeBar();
    }

    if (event.key === "ArrowDown") {
      video.volume = Math.max(video.volume - 0.1, 0);
      updateVolumeDisplay();
      updateVolumeBar();
    }

    if (event.key.toLowerCase() === "m") {
      video.muted = !video.muted;
      updateVolumeDisplay();
      updateVolumeBar();
    }
  }
});

// Hide controls after a delay
function hideControlsAfterDelay() {
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    if (!isMouseOverControls && settingMenu.classList.contains("hidden")) {
      controls.classList.add("hidden");
    }
  }, 2000);
}

// Show controls on mouse move
video.addEventListener("mousemove", () => {
  controls.classList.remove("hidden");
  hideControlsAfterDelay();
});

// Keep controls visible on mouse enter
controls.addEventListener("mouseenter", () => {
  isMouseOverControls = true;
  clearTimeout(controlsTimeout);
});

// Hide controls on mouse leave
controls.addEventListener("mouseleave", () => {
  isMouseOverControls = false;
  hideControlsAfterDelay();
});

// Toggle full screen mode
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

// Mute/unmute video on volume icon click
volumeIcon.addEventListener("click", () => {
  video.muted = !video.muted;
  video.muted ? (volumeBar.value = 0) : (volumeBar.value = video.volume);
  updateVolumeDisplay();
  updateVolumeBar();
});

// Show volume bar on mouse enter
volumeIcon.addEventListener("mouseenter", () => {
  volumeBar.classList.remove("hidden");
});

volumeBar.addEventListener("mouseenter", () => {
  volumeBar.classList.remove("hidden");
});

volumeBar.addEventListener("mouseleave", () => {
  volumeBar.classList.add("hidden");
});

// Update video volume on volume bar input
volumeBar.addEventListener("input", () => {
  video.volume = volumeBar.value;
  updateVolumeDisplay();
  updateVolumeBar();
});

// Update volume icon and tooltip
function updateVolumeDisplay() {
  volumeIcon.title = `Volume: ${Math.round(
    (!video.muted ? video.volume : 0) * 100
  )}%`;
  if (video.muted || video.volume === 0) {
    volumeIcon.src = "./assets/img/icon/sound-off.svg";
  } else if (video.volume < 0.5) {
    volumeIcon.src = "./assets/img/icon/sound-volume-1.svg";
  } else {
    volumeIcon.src = "./assets/img/icon/sound-volume-2.svg";
  }
}

// Update volume bar value
function updateVolumeBar() {
  volumeBar.value = video.muted ? 0 : video.volume;
}

// Toggle speed options visibility
playbackSpeed.addEventListener("click", () => {
  speedOptions.classList.toggle("hidden");
});

// Toggle settings menu visibility
settingsControl.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the click from propagating to the document
  settingMenu.classList.toggle("hidden");
  if (!settingMenu.classList.contains("hidden")) {
    controls.classList.remove("hidden");
  }
});

// Hide settings menu on document click
document.addEventListener("click", (event) => {
  if (
    !settingMenu.contains(event.target) &&
    !settingsControl.contains(event.target)
  ) {
    settingMenu.classList.add("hidden");
  }
});

// Add 10 seconds to video current time
add10s.addEventListener("click", () => {
  video.currentTime += 10;
});

// Subtract 10 seconds from video current time
subtract10s.addEventListener("click", () => {
  video.currentTime -= 10;
});

// Toggle speed options visibility
playbackSpeed.addEventListener("click", () => {
  speed.classList.toggle("hidden");
  speed.classList.toggle("show");
});

// Set video playback speed
speed.addEventListener("click", (event) => {
  const speedValue = event.target.getAttribute("data-speed");
  if (speedValue) {
    video.playbackRate = parseFloat(speedValue);
    document.querySelector(".menu-item-content").textContent = `${
      speedValue != 1 ? `${speedValue}x` : "Normal"
    }`;
    console.log(speed);
  }
});

// Initial update of volume display and bar
updateVolumeDisplay();
updateVolumeBar();
