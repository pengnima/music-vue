<template>
  <div class="disk" :class="{ disk__playing: isPlaying }">
    <label
      for="file"
      class="disk_cover"
      ref="cover"
      :style="{
        transform: stopMatrix,
        backgroundImage: coverUrl ? `url(${coverUrl})` : ''
      }"
    ></label>
    <input
      id="file"
      type="file"
      ref="file"
      accept=".mp3"
      multiple
      @change="handleChange"
    />
  </div>
</template>

<script>
// import { mapState } from "";
export default {
  data() {
    return {
      isPlaying: false,
      coverUrl: "",
      stopMatrix: ""
    };
  },
  methods: {
    handleChange() {
      console.log("change？？");
    }
  }
};
</script>

<style scoped>
.disk {
  overflow: hidden;
  position: relative;

  /**
  * padding 可以 被子元素当成宽高
  * 且背景也是可以在 padding中显示的
   */
  padding-top: 100%;
  border-radius: 50%;
  left: 8px;

  transform: translateY(-50%) scale(0.8);
  transform-origin: center bottom;
  transition: all 0.6s;
}
.disk input {
  display: none;
}
.disk_cover {
  position: absolute;

  /**
  * 4个0 拉伸
   */
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;

  background-image: radial-gradient(circle, #444, #333);
  background-position: center;
  background-size: cover;
}
.disk_cover::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-image: linear-gradient(45deg, white, #daada1);
}
.disk__playing {
  transform: translateY(-60%);
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.4),
    0 10px 25px rgba(11, 207, 241, 0.8);
}
.disk__playing .disk_cover {
  animation: rotateAnima 6s infinite linear;
}
@keyframes rotateAnima {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}
</style>
