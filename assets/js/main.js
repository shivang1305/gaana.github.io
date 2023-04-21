/**
 * Tasks:
 * Generate all sections using data & JS
 * Add event listeners to play audio
 * Audio navbar
 * Scroll state
 * Songs Queue
 */

// constants
const musicLibContainer = document.getElementById("music-libs");
const audioPlayer = document.getElementById("audio-player");
const playingBtn = document.getElementById("playing");
const pausedBtn = document.getElementById("paused");

var currentSongObj = [];
var defaultImage = "/assets/images/defaultImage.gif";

// Core App logic
window.addEventListener("load", bootUpApp);

function bootUpApp() {
  fetchAndRenderAllSections();
}

function fetchAndRenderAllSections() {
  //fetch the data of all sections
  fetch("/assets/js/gaana.json")
    .then((response) => response.json())
    .then((response) => {
      console.log("Response: ", response);

      // destructing the json response
      const { cardbox } = response;

      if (Array.isArray(cardbox) && cardbox.length) {
        cardbox.forEach((section) => {
          const { songsbox, songscards } = section;
          renderSection(songsbox, songscards);
        });
      }
    })
    .catch((err) => {
      console.error(err);
      alert("error failing data");
    });
}

function renderSection(title, songsList) {
  const songSection = makeSectionDom(title, songsList);
  musicLibContainer.appendChild(songSection);
}

function makeSectionDom(title, songsList) {
  const sectionDiv = document.createElement("div");
  sectionDiv.className = "songs-sections";

  // add sings html
  sectionDiv.innerHTML = `
    <h2 class="section-heading">${title}</h2>
    <div class="songs-cont">
      ${songsList.map((songObj) => buildSongCardDom(songObj)).join("")}
    </div>
  `;

  console.log(sectionDiv);
  return sectionDiv;
}

function buildSongCardDom(songObj) {
  return `
    <div class="song-card" onclick="playSong(this)" data-songobj='${JSON.stringify(
      songObj
    )}'>
      <div class="img-cont">
          <img src="/${songObj.image_source}" alt="${songObj.song_name}" />
          <div class="overlay"></div>
      </div>
      <p class="song-name">${songObj.song_name}</p>
    </div>
  `;
}

// Music Player functions
function playSong(songCardEle) {
  const songObj = JSON.parse(songCardEle.dataset.songobj);
  console.log(songObj);
  setAndPlayCurrentSong(songObj);

  // show the audio player when the user plays some particular song
  document.getElementById("music-player").classList.remove("hidden");
}

function setAndPlayCurrentSong(songObj) {
  currentSongObj = songObj;
  audioPlayer.pause();
  audioPlayer.src = songObj.quality.low;
  audioPlayer.currentTime = 0;
  audioPlayer.play();

  updatePlayerUI(songObj);
}

function updatePlayerUI(songObj) {
  const songImg = document.getElementById("song-img");
  const songName = document.getElementById("song-name");
  const songCurrentTime = document.getElementById("song-time-start");
  const songTotalTime = document.getElementById("song-total-time");

  songImg.src = songObj.image_source;
  songName.innerHTML = songObj.song_name;

  songCurrentTime.innerHTML = audioPlayer.currentTime;
  songTotalTime.innerHTML = audioPlayer.duration;

  // audioPlayer.addEventListener("timeupdate", updatePlayerTime);

  var intervalId = window.setInterval(function () {
    updatePlayerTime();
  }, 900);

  pausedBtn.style.display = "none";
  playingBtn.style.display = "display";
}

function togglePlayer() {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();

  pausedBtn.style.display = audioPlayer.paused ? "block" : "none";
  playingBtn.style.display = audioPlayer.paused ? "none" : "block";
}

function updatePlayerTime() {
  if (!audioPlayer || audioPlayer.paused) return;

  const songCurrentTime = document.getElementById("song-time-start");
  const songTotalTime = document.getElementById("song-total-time");

  songCurrentTime.innerHTML = getTimeString(audioPlayer.currentTime);
  songTotalTime.innerHTML = getTimeString(audioPlayer.duration);
}

function getTimeString(time) {
  return isNaN(audioPlayer.duration)
    ? "0:00"
    : Math.floor(time / 60) +
        ":" +
        parseInt((((time / 60) % 1) * 100).toPrecision(2));
}

/** Next Steps:
 * Add Slider
 * Create song hover track
 * Create song playlist
 * Shuffle playlist
 * Delete from queue
 * Responsive
 * Search bar
 * */
