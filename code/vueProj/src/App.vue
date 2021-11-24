<template>
  <div id="main" v-on:mousemove="moveScreen">
    <!-- <router-link to="/">Home</router-link> -->
    <!-- <router-link to="/map">Map</router-link> -->
    <router-view/>
  </div>
</template>

<script>

export default {
  //components: {},
  name: "app",
  data: function () {
    return {};
  },
  mounted() {
    console.log("App is now mounted");

    // Reset Globals
    Window.ScrollIndex = 0;
    Window.ScrollValue = 0;
    Window.ClickIndex = 0;
    Window.Content = [];
  },
  methods: {},
}
</script>


<style>

html,body {
    padding: 0;
    margin: 0;
    background-color: rgb(39, 39, 39);
    overflow: hidden;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

</style>
