const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
const PLAYER_KEY = "Flower";
const audio = $("#audio");
const player = $(".player");
const btnPlay = $(".btn-toggle-play");
const progress = $("#progress");
const btnRepeat = $(".btn-repeat");
const cdThumb = $(".cd-thumb");

const app = {
  isRepeat: false,
  isPlaying: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Bông hoa chẳng thuộc về ta",
      singer: "Việt x Deus",
      path: "bonghoachangthuocveta.mp3",
      image: "bonghoachangthuocveta.jpg",
    },
  ],

  handleEvents: function () {
    const _this = this;

    //xử lý khi play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //xử lý khi repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      btnRepeat.classList.toggle("active", _this.isRepeat);
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
  },

  loadConfig: function () {
    this.isRepeat = this.config.isRepeat;
  },
  defineProperty: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    audio.src = this.currentSong.path;
  },
  start: function () {
    this.loadConfig();
    btnRepeat.classList.toggle("active", this.isRepeat);
    this.defineProperty();
    this.handleEvents();
    this.loadCurrentSong();
  },
};
app.start();
