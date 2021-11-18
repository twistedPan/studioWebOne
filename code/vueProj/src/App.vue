<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> -->
    <!-- <router-link to="/map">Map</router-link> -->
    <router-view/>
  </div>
</template>

<script>

</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  transform-style: preserve-3d;
  /* transform: rotateX(45deg); */

}

#nav {
  margin: 0;
  padding: 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
