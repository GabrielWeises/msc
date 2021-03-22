/*
design by Voicu Apostol.
design: https://dribbble.com/shots/3533847-Mini-Music-Player
I can't find any open music api or mp3 api so i have to download all musics as mp3 file.
You can fork on github: https://github.com/muhammederdem/mini-player
*/

new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Breezeblocks",
          artist: "Alt-J",
          cover: "https://i1.sndcdn.com/artworks-000061431228-gs6qjv-t500x500.jpg",
          source: "https://download1649.mediafire.com/fp6jmwbk81qg/0ll9gqsy33a9akj/BRZ.mp3",
          url: "https://www.youtube.com/watch?v=rVeMiVU77wo&ab_channel=alt-J",
          favorited: false
        },
        {
          name: "Toxic",
          artist: "Ashnikko",
          cover: "https://studiosol-a.akamaihd.net/uploadfile/letras/albuns/1/1/d/1/995771610708306.jpg",
          source: "https://download1081.mediafire.com/b0vsjmdz4ejg/ceq5quxhd14k67o/TOXIC.mp3",
          url: "https://www.youtube.com/watch?v=VpAUThB0fJE",
          favorited: false
        },
        {
          name: "Love Language",
          artist: "Croocked Colours",
          cover: "https://m.media-amazon.com/images/I/81JPlHJn4vL._SS500_.jpg",
          source: "https://download937.mediafire.com/qt7j90xwbecg/fniih4m25i3u8pu/LOVE.mp3",
          url: "https://www.youtube.com/watch?v=W92z8e1GdKI",
          favorited: false
        },
        {
          name: "RIP To My Youth",
          artist: "The Neighbourhood",
          cover: "https://i1.sndcdn.com/artworks-000478296165-kc0s0z-t500x500.jpg",
          source: "https://download1647.mediafire.com/ne3jcbv48tzg/l91pf4x37xn2mg9/RIP.mp3",
          url: "https://www.youtube.com/watch?v=vKH-rcO6PA8",
          favorited: false
        },
        {
          name: "Thelema",
          artist: "Øfdream",
          cover: "https://i1.sndcdn.com/artworks-000246628837-f80sl3-t500x500.jpg",
          source: "https://download1474.mediafire.com/b3lgqvgzhw1g/sg7j8ch8u4rca65/THELEMA.mp3",
          url: "https://youtu.be/XCgjvjuE1fY",
          favorited: true
        },
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});