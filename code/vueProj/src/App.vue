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
    return {
      sceneContent: [],
    };
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


<style src='./styles/storytext.css'></style>
<style>

html,body {
    padding: 0;
    margin: 0;
    background-color: rgb(39, 39, 39);
    overflow: hidden;
    /* scroll-behavior: smooth; */
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}


.mapboxgl-ctrl-logo {
  display: none!important;
}
.mapboxgl-ctrl-bottom-right {
  display: none!important;
}

</style>
