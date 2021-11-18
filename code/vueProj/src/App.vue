<template>
  <div id="main" v-on:mousemove="moveScreen">
    <!-- <router-link to="/">Home</router-link> -->
    <!-- <router-link to="/map">Map</router-link> -->
    <router-view/>
  </div>
</template>

<script>

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
