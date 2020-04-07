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
    <input id="file" type="file" ref="file" accept="music/mp3" multiple @change="handleChange" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"; //mapState 是便于书写 状态
import { player } from "../player"; // player 播放器
import { isNullOrUndefined } from "util";

export default {
  mounted() {
    // 给 播放器实例 添加事件监听，togglePlay为播放/暂停  changeCover为切换图片地址
    player.onPlay.push(() => {
      this.togglePlay(true);
    });
    player.onPause.push(() => {
      this.togglePlay(false);
    });
    player.onChange.push(() => {
      this.changeCover();
    });
    player.onReady.push(() => {
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
        // 为 false 时，触发下面
        this.stopMatrix = getComputedStyle(this.$refs.cover).transform;
      } else {
        //为 true 时
        if (this.stopMatrix != "") {
          const matrix = this.stopMatrix;
          this.stopMatrix = "";
          const match = matrix.match(/^matrix\(([^,]+),([^,]+)/);
          let deg = ((Math.atan2(match[2], match[1]) / Math.PI) * 180) % 360;

          const styles = [...document.styleSheets]; //document.styleSheets是 StyleSheetList 类型
          // 因为要改的是 keyframs里的样式，所以从全部的样式中去寻找
          styles.forEach(style => {
            try {
              const rules = [...style.cssRules];
              rules.forEach(rule => {
                // KEYFRAMES_RULE 是 type 7
                if (
                  rule.type === rule.KEYFRAMES_RULE &&
                  rule.name.indexOf("rotateAnima") != -1
                ) {
                  rule.cssRules[0].style.transform = `rotate(${deg}deg)`;
                  rule.cssRules[1].style.transform = `rotate(${deg + 360}deg)`;
                }
              });
            } catch (error) {
              // styles[0]没有cssRules，所以会报错， DOMException: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules
            }
          });
        }
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
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
