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
    <input id="file" type="file" ref="file" accept=".mp3" multiple @change="handleChange" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"; //mapState 是便于书写 状态
import { player } from "../player"; // player 播放器
import { isNullOrUndefined } from "util";

export default {
  mounted() {
    // 给 播放器实例 添加事件监听，togglePlay为播放/暂停  changeCover为切换图片地址
    player.onPlay.listen(() => {
      this.togglePlay(true);
    });
    player.onPause.listen(() => {
      this.togglePlay(false);
    });
    player.onChange.listen(() => {
      this.changeCover();
    });
    player.onReady.listen(() => {
      this.changeCover();
    });
  },
  data() {
    return {
      stopMatrix: ""
    };
  },
  methods: {
    ...mapMutations(["togglePlay", "changeCover"]),
    async handleChange() {
      // this.$refs.file 是 input，type=file，其属性files保存了选的音乐
      const target = this.$refs.file;
      const files = target.files || [];
      // console.log(target.value);
      // console.log(files);

      if (files.length) {
        for (let i = 0; i < files.length; ++i) {
          await player.append(files[i]); //将音乐添加到 播放器中
        }
      }
      target.value = "";
    }
  },
  computed: {
    // 播放 和 图片url都通过 vuex 管理
    ...mapState(["isPlaying", "coverUrl"])
  },
  watch: {
    isPlaying(val) {
      if (!val) {
        this.stopMatrix = getComputedStyle(this.$refs.cover).transform;
      } else {
        const matrix = this.stopMatrix;
        this.stopMatrix = "";

        const match = matrix.match(/^matrix\(([^,]+),([^,]+)/); // 匹配例子： matrix(a,b)
        const [, sin, cos] = match || [0, 0, 0]; // [,sin,cos] 第一个为空，那为什么要有第一个？
        const deg = ((Math.atan2(cos, sin) / 2 / Math.PI) * 360) % 360; // atan2(cos, sin) 返回从 x 轴到点 (sin,cos) 之间的角度

        const styles = [...document.styleSheets]; //document.styleSheets是 StyleSheetList 类型

        styles.forEach(style => {
          try {
            const rules = [...style.cssRules];
            rules.forEach(rule => {
              // KEYFRAMES_RULE 是 type 7
              if (
                rule.type === rule.KEYFRAMES_RULE &&
                rule.name === "rotateAnima"
              ) {
                rule.cssRules[0].style.transform = `rotate3d(0, 0, 1, ${deg}deg)`;
                rule.cssRules[1].style.transform = `rotate3d(0, 0, 1, ${deg +
                  360}deg)`;
              }
              console.log("没出错");
            });
          } catch (error) {
            console.log("出错了");
          }
        });
      }
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
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.3),
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
