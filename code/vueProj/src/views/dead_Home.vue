<template>
  <div class="home" v-on:mousemove="moveScreen">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  el: "#home",
  name: "Home",
  components: {
    HelloWorld,
  },
  methods: {
    moveScreen: function (event) {
      console.log("This",this.el, this);
      let mousePosX = event.screenX;
      if (mousePosX > 1920) mousePosX -= 1920;
      let mousePosY = event.screenY;
      let mouseXMap = mapRange(mousePosX, 0, 1920, 20, -20);
      let mouseYMap = mapRange(mousePosY, 0, 1080, 0, 5);
      //this.el.style.transform = `rotate3d(1,0,0, ${45 + mouseYMap}deg) skewX(${mouseXMap}deg)`;
    },
  }
};



// Map n to range of start1, stop1 to start2, stop2
function mapRange(n, start1, stop1, start2, stop2) {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (newval) {
    return newval;
  }
  if (start2 < stop2) {
    return limit(newval, start2, stop2);
  } else {
    return limit(newval, stop2, start2);
  }
}
// Keep n between low and high
function limit(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

</script>

<style>
.home {
  background-color: wheat;

  transform-style: preserve-3d;
  /* transform: rotateX(45deg); */
  /* transform: rotate3d(1, 0, 0, 45deg); */
  /* transform: skewX(0); */
}
</style>