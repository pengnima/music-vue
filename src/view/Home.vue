<template>
  <div class="home">
    <div class="mytips">
      <img
        class="project_img"
        src="https://gitee.com/pengnima1/blogimage/raw/master/md/music_project.jpg"
        alt="演示图"
      />
      右侧为演示图，操作方式：点击下方的黑色磁盘，选择 mp3 格式的乐曲，读取完毕后点击 播放按钮
    </div>

    <player />
  </div>
</template>

<script>
import Player from "../components/Player";
export default {
  components: {
    Player
  }
};
</script>

<style scoped>
.home {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #ffedff;

  z-index: 0;

  position: relative;
  justify-content: center;
  align-items: center;
}
.mytips {
  position: absolute;
  top: 0;
  left: 0;
}
.project_img {
  vertical-align: middle;
}
</style>