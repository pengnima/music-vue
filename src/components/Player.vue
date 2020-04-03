<template>
  <div class="player">
    <div class="player_disk">
      <disk />
    </div>
    <div class="player_control">
      <control />
    </div>
    <div class="player_progress">
      <progress-bar></progress-bar>
    </div>
  </div>
</template>
<script>
import Disk from "./Disk";
import Control from "./Control";
import ProgressBar from "./ProgressBar";
export default {
  components: {
    Disk,
    Control,
    ProgressBar
  }
};
</script>
<style scoped>
.player {
  display: flex;
  position: relative;

  max-width: 300px;
  max-height: 75px;

  width: 60vw;
  height: 15vh;

  background-color: white;
  border-radius: 15px;

  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3), 0 20px 20px rgba(5, 226, 255, 0.3);
}
.player_disk {
  flex: 1.2;
  /* padding: 2.4vw; */
}
.player_control {
  flex: 2;
  padding: 2.4vw 0;
  padding-right: 2.4vw;
}
.player_progress {
  position: absolute;

  left: 1.8vw;
  right: 1.8vw;
  top: 0;
  bottom: 5vw;
}
</style>