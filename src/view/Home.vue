<template>
  <div class="home">
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
</style>