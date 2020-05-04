<template>
  <div id="app">
    <home />
  </div>
</template>

<script>
import Home from "./view/Home";
export default {
  name: "App",
  components: {
    Home
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
