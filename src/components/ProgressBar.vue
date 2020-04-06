<template>
  <div class="progress" :class="{progress__playing:isPlaying}">
    <h2 class="progress_title">{{ name | formatName}}</h2>
    <p class="progress_text">{{position | formatTime}}/ {{duration|formatTime}}</p>
    <div class="progress_line" @click="setPos" ref="line">
      <span :style="{width: progress}" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { player } from "../player";
export default {
  methods: {
    setPos(ev) {
      // ev.offsetX 值为Number，是这条progress_line的 某一处位置
      // 获取 整条line的宽度，再相除，把得到的 百分比，给player.position，让其根据该比率，*自己的曲目长度
      let lineHeight = parseFloat(getComputedStyle(this.$refs.line).width);
      let rate = ev.offsetX / lineHeight;
      player.position = rate;
    }
  },
  mounted() {
    const draw = () => {
      // requestAnimationFrame 类似 setInterval，用来做循环正合适，因为此方法会跟随屏幕刷新率执行
      window.requestAnimationFrame(draw);
      const progress = player.position / player.duration;
      this.progress = `${(progress * 100).toFixed(2)}%`;
      this.position = player.position;
      this.duration = player.duration;
      this.name = player.current.file ? player.current.file.name : "";
      // console.log(this.position);
    };

    draw();
  },
  data() {
    return {
      name: "",
      position: 0, //当前所处位置
      duration: 0.001, //时长
      progress: "" //控制进度条长度的，利用 样式 width: %
    };
  },
  computed: {
    ...mapState(["isPlaying"])
  },
  filters: {
    // 格式化名字
    formatName(val) {
      return val.replace(/\.mp3$/, "");
    },
    //格式化时间
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
  transform: translateY(-90%);
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
  height: 6px;
  border-radius: 6px;
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