<template>
    <div class="commute">
        <div class="sceneInfo">
            <p>This is Scene Number {{id}}</p>
            <p>Name of this Scene is <b>{{name}}</b></p>
            <p>Mappoint is at {{mapPoint[0]}} / {{mapPoint[1]}}</p>
        </div>

            <img v-for="image in images" :key="image"
                class="image3D"
                v-bind:id=image.type
                @load="setImages(image)"
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
    mapPoint: Object,
    type: String,
  },
  methods : {
    tiltMe : function (event) {
        //console.log("event",event);
        /* let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, -20, 20); */
        //event.target.style.transform = `rotate3d(0,1,0, ${30 + mouseXMap}deg)`; // skewX(${mouseXMap}deg)
    },
    setImages : function (comp) {
        //console.log("Image Set");
        let element = event.target;
        //console.log("event", event.target, comp);

        element.style.transform = 
            `translate3d(${comp.positionX}px, ${comp.positionY}px, ${comp.positionZ}px)`;
        element.style.zIndex = comp.zIndex;

        // store image element
        this.imagesEle.push(element);

    },
    moveOut : function () {
        console.log("- Animate from ");
        let index = 0;
        this.imagesEle.forEach(ele => {
            console.log("Test",index);
            let startPos = {x:this.images[index].positionX,y:this.images[index].positionY,z:this.images[index].positionZ}
            ele.animate(
                [
                    { transform: `translate3d(${startPos.x}px, ${startPos.y}px, ${startPos.z}px)` },
                    { transform: `translate3d(${startPos.x}px, ${startPos.y + 800}px, ${startPos.z + 300}px)` }
                ], {
                    fill: 'forwards',
                    easing: 'ease-out',
                    duration: 2000
                });
        });
        
    },
    moveIn : function (comp) {
        console.log("- Animate back ");
        let index = 0;
        this.imagesEle.forEach(ele => {
            let startPos = {x:this.images[index].positionX,y:this.images[index].positionY,z:this.images[index].positionZ}
            ele.animate(
                [
                    { transform: `translate3d(${startPos.x}px, ${startPos.y + 1500}px, ${startPos.z + 800}px)` },
                    { transform: `translate3d(${startPos.x}px, ${startPos.y}px, ${startPos.z}px)` }
                ], {
                    fill: 'forwards',
                    easing: 'ease-in',
                    duration: 5000
                });
        });

    },
  },
  data: function() {
    return {
      imagesEle: [],
    };
  },
};

</script>


<style scoped>

img {
    width: 10vw;
}

#Hintergrund {
    top: 0%;
    left: 0%;
    width: 1920px;
    height: 1080px;
    /*margin-top: -960px; /* Half the height */
    /*margin-left: -54px; /* Half the width */
    
    /* Top, Right, Bottom, Left - Boarder */
    clip: rect(0px,1920px,600px,0px);
}

#Hauptgrund {
    width: 15vw;
}

#Vordergrund {
    width: 10vw;
}

.sceneInfo {
    position: absolute;
    top: 0;
    left: 10px;
    z-index: 15;
    width: 300px;
    color: white;
    background-color: gray;
}

.image3D{
    position: absolute;
    background-color: coral;
    transform-style: preserve-3d;

}

</style>