<template>
    <div class="commute">
        <p>This is Scene Number {{id}}</p>
        
        <p>Name of this Scene is <b>{{name}}</b></p>
        
        <p>Mappoint is at {{mapPoint.lon}} / {{mapPoint.lat}}</p>
        
        <p>Images: </p>
        
        <li v-for="image in images" :key="image">
            <p>{{image.name}}</p>
            <p>{{image.position}} und {{image.placement}}</p>
            <img v-bind:src=image.src />
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

</style>