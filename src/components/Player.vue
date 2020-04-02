<template>
  <div class="player">
    <div class="player_disk">
      <disk />
    </div>
    <div class="player_control"></div>
    <div class="player_progress"></div>
  </div>
</template>
<script>
import Disk from "./Disk";
export default {
  components: {
    Disk
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
}
.player_progress {
  position: absolute;
}
</style>