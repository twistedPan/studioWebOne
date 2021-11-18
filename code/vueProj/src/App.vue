<template>
  <div id="main" v-on:mousemove="moveScreen">
    <!-- <router-link to="/">Home</router-link> -->
    <!-- <router-link to="/map">Map</router-link> -->
    <router-view/>
  </div>
</template>

<script>

export default {
    name: "App",
    methods: {
        moveScreen: function(event) {
            let navEle = document.getElementById("main");
            console.log("Move",navEle,event);
            //console.log(this.commutes);
            
            let mousePosX = event.screenX;
            if (mousePosX > 1920) mousePosX -= 1920;
            let mousePosY = event.screenY;
            let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
            let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, 0, 5);
            //console.log("mousePosX", mousePosX, "MapX", mouseXMap, "\nmousePosY", mousePosY,"MapY", mouseYMap);
            navEle.style.transform = `rotate3d(1,0,0, ${30 + mouseYMap}deg) skewX(${mouseXMap}deg)`;
        }
    }
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

    perspective: 250px;
    perspective-origin: calc(var(--w)/2) 100px;
    /* x / y => half screen with / sreen height*/

}

/* #nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */

</style>
