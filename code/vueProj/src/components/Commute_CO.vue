<template>
    <div class="commute">
        <div class="sceneInfo">
            <p>This is Scene Number {{id}}</p>
            <p>Name of this Scene is <b>{{name}}</b></p>
            <p>Mappoint is at {{mapPoint.lon}} / {{mapPoint.lat}}</p>
        </div>

            <img v-for="image in images" :key="image"
                class="image3D"
                @load="getImages(image)"
                v-bind:src=image.src
            />
    </div>
</template>


<script>
export default {
  name: "Commute",
  el: "commutes",
  props: {
    id: Number,
    name: String,
    images: Array,
    mapPoint: Object
  },
  methods : {
    tiltMe : function (event) {
        //console.log("event",event);
        let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, -20, 20);
        mouseXMap = mouseYMap;
        mouseYMap = mouseXMap;
        //event.target.style.transform = `rotate3d(0,1,0, ${30 + mouseXMap}deg)`; /* skewX(${mouseXMap}deg) */
    },
    getImages : function (ele) {
        //console.log("- --> event", event.target);
        event.target.style.transform = 
            `translate3d(${ele.placement}px, ${ele.position}px, 0px)`;
        event.target.style.zIndex = ele.zIndex;
    }
  }
};

</script>


<style scoped>

img {
    width: 10vw;
}

.sceneInfo {
    position: absolute;
    top: 0;
    left: 10px;
}

.image3D{
    position: absolute;
    background-color: coral;
    transform-style: preserve-3d;

}

</style>