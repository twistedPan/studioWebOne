<template>
  <div v-bind:id="id" class="commute" v-bind:style="{ display: display }">
    <div class="sceneInfo">
      <p>This is Scene Number {{ id }}</p>
      <p>
        Name: <b>{{ name }}</b>
      </p>
      <p>Mappoint is at:<br />{{ mapPoint[0] }} / {{ mapPoint[1] }}</p>
    </div>
    <div class="storyContainer">
      <p class="storyText">{{ story }}</p>
    </div>
    <img
      v-for="image in images"
      :key="image"
      class="image3D"
      v-bind:id="image.type"
      @load="setImages(image)"
      v-bind:src="image.src"
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
    story: String,
    display : String
  },
  methods: {
    /* tiltMe: function (event) {
      //console.log("event",event);
        let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, -20, 20);
      //event.target.style.transform = `rotate3d(0,1,0, ${30 + mouseXMap}deg)`; // skewX(${mouseXMap}deg)
    }, */
    setImages: function (comp) {
      //console.log("Image Set");
      let element = event.target;
      //console.log("event", event.target, comp);

      element.style.transform =
        `translate3d(${comp.positionX}vw, ${comp.positionY}vh, ${comp.positionZ}px)`;
      element.style.zIndex = comp.zIndex;
      element.style.width = `${comp.scale}vw`;

      // store image element
      this.imagesEle.push(element);
    },
    moveImage: function (value) {
      let index = 0;
      //console.log("Move Value:", value, this);

      this.imagesEle.forEach((ele) => {
        let type = ele.id;
        let startPos = {
          x: this.images[index].positionX,
          y: this.images[index].positionY,
          z: this.images[index].positionZ,
        };

        switch (type) {
          case "Hintergrund":
            ele.style.transform = `translate3d(${startPos.x}vw, ${startPos.y}vh, ${startPos.z + value}px)`;
            break;
          case "Hintergrund Element":
            ele.style.transform = `translate3d(${startPos.x}vw,${startPos.y}vh,${startPos.z + value * 1.5}px)`;
            break;
          case "Hauptgrund":
            ele.style.transform = `translate3d(${startPos.x}vw,${startPos.y}vh,${startPos.z + value * 2}px)`;
            break;
          case "Vordergrund":
            ele.style.transform = `translate3d(${startPos.x}vw,${startPos.y}vh,${startPos.z + value * 3}px)`;
            break;

          default:
            console.log("No Type:", ele);
            break;
        }

        index++;
      });
    },
    moveIn: function (callback, speed = 2000) {
      //console.log("Ease In");

      this.imagesEle.forEach((ele) => {

        let moveInAnim = ele.animate(
          [
            {opacity: 0},
            {opacity: 1},
          ],
          {fill: "forwards", easing: "ease-in",duration: speed,}
        );
        // callback -> Animation is over
        moveInAnim.onfinish = (_) => callback();

      });
    },
  },
  data: function () {
    return {
      imagesEle: [],
    };
  },
};
</script>


<style src='../styles/storytext.css'></style>
<style scoped>
img {
  width: 10vw;
}

#Hintergrund {
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  opacity: 1;

  /* Top, Right, Bottom, Left - Border */
  /* clip: rect(0px,1920px,600px,0px); */
}

#Hauptgrund {
  /* width: 15vw; */
  opacity: 1;
}

#Vordergrund {
  /* width: 10vw; */
  opacity: 1;
}

.image3D {
  position: absolute;
  /* background-color: coral; */
  transform-style: preserve-3d;
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
</style>
