<template>
  <div id="my_canvas">
    <canvas class="canvas"></canvas>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { player } from "../player";
export default {
  mounted() {
    let canvas = document.querySelector(".canvas");
    let ctx = canvas.getContext("2d");

    // 画布宽
    let cWidth = canvas.width;
    // 画布高
    let cHeight = canvas.height;
    // 画布颜色渐变
    let grd = ctx.createLinearGradient(0, 0, 0, cHeight);
    grd.addColorStop(1, "green");
    grd.addColorStop(0.5, "yellow");
    grd.addColorStop(0, "red");
    ctx.fillStyle = grd;

    //由于 画布会变化，所以 player里的方条属性等也要跟着变化
    player.amendData(cWidth, cHeight);
    const draw = () => {
      ctx.clearRect(0, 0, cWidth, cHeight);

      player.drawCanvas(cHeight, ctx, this.isPlaying);
      window.requestAnimationFrame(draw);
    };
    draw();
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["isPlaying"])
  }
};
</script>

<style>
.canvas {
  max-width: 300px;
  min-height: 130px;
  max-height: 260px;
  width: 60vw;
  border-radius: 15px;
  background-color: #aaa;
  color: rgb(255, 51, 0);
}
</style>