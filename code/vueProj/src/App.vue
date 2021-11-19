<template>
  <div id="main" v-on:mousemove="moveScreen" v-on:wheel="scrollToWin">
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
  },
  methods: {
    scrollToWin : function (event) {

        // Add to scroll count
        if (event.deltaY < 0) Window.ScrollValue--;               // mousewheel up
        else Window.ScrollValue++;                                // mousewheel down
        if (Window.ScrollValue < 0) Window.ScrollValue = 0;       // no negatives
        console.log("Scroll Delta is at:",Window.ScrollValue);

        // Map scroll to array indexes
        let scrollRange = Window.Util.mapRange(Window.ScrollValue,0,200,0,10);
        let scrollIndex = Math.floor(scrollRange);
        console.log("- App --> scrollIndex:", scrollIndex, "by", scrollRange);

        let currentContent = Window.Content[scrollIndex];
    },
  },
}
</script>


<style>

html,body {
    padding: 0;
    margin: 0;
    background-color: rgb(39, 39, 39);
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

/* #nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */

</style>
