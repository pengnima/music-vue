<template>
  <div class="progress" :class="{progress__playing:isPlaying}">
    <h2 class="progress_title">{{ name | formatName}}</h2>
    <p class="progress_text">{{position | formatTime}}/ {{duration|formatTime}}</p>
    <div class="progress_line">
      <span :style="{width: progress}" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { player } from "../player";
export default {
  mounted() {
    const draw = () => {
      // requestAnimationFrame 啥意思？？
      requestAnimationFrame(draw);
      const progress = player.position / player.duration;
      this.progress = `${(progress * 100).toFixed(2)}%`;
      this.position = player.position;
      this.duration = player.duration;
      this.name = player.current.file ? player.current.file.name : "";
    };

    draw();
  },
  data() {
    return {
      name: "",
      position: 0,
      duration: 0.001,
      progress: ""
    };
  },
  computed: {
    ...mapState(["isPlaying"])
  },
  filters: {
    formatName(val) {
      return val.replace(/\.mp3$/, "");
    },
    formatTime(val) {
      const min = Math.floor(val / 60);
      const sec = Math.floor(val % 60);
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }
  }
};
</script>

<style>
.progress {
  padding-left: 40%;
  padding-right: 5%;
  width: 100%;
  height: 100%;

  border-radius: 8px 8px 0 0;
  background-color: rgba(210, 210, 210, 0.8);
  transition: all 0.6s ease;
}

.progress__playing {
  transform: translateY(-100%);
}
.progress_title {
  padding-top: 6px;
  font-size: 14px;
  font-weight: bold;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.progress_text {
  padding-top: 2px;
  font-size: 16px;
  font-weight: bold;
  color: #aaa;
  transform: scale(0.8);
  transform-origin: left top;
}

.progress_line {
  height: 3px;
  border-radius: 3px;
  overflow: hidden;
  background-color: #fff;
}
.progress_line span {
  display: block;
  height: 100%;
  /* width: 60%; */
  background-color: #ec51a5;
}
</style>