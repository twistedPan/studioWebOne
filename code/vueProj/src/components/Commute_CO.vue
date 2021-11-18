<template>
    <div class="commute">
        <div class="sceneInfo">
            <p>This is Scene Number {{id}}</p>
            <p>Name of this Scene is <b>{{name}}</b></p>
            <p>Mappoint is at {{mapPoint.lon}} / {{mapPoint.lat}}</p>
        </div>
        
        <p>Images: </p>
            <li v-for="image in images" :key="image">
                <p>{{image.name}}</p>
                <p>{{image.position}} und {{image.placement}}</p>
                <img class="image3D" v-bind:src=image.src />
            </li>
    </div>
</template>

 
<script>
export default {
  name: "Commute",
  props: {
    id: Number,
    name: String,
    images: [],
    mapPoint: Object
  }
};
</script>


<style scoped>

img {
    width: 40vh;
}

.sceneInfo {
    position: absolute;
    top: 0;
    left: 10;
}

.image3D{
    background-color: coral;
    transform-style: preserve-3d;
    transform: rotate3d(1,0,0, 30deg) skewX(0deg) translateZ(-150px);
}

</style>