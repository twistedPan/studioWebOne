<template>
  <div class="commute">
    <div class="sceneInfo">
      <p>This is Scene Number {{ id }}</p>
      <p>
        Name: <b>{{ name }}</b>
      </p>
      <p>Mappoint is at:<br />{{ mapPoint[0] }} / {{ mapPoint[1] }}</p>
    </div>
    <p class="storyText">StoryText: {{ story }}</p>
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
  },
  methods: {
    tiltMe: function (event) {
      //console.log("event",event);
      /* let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, -20, 20); */
      //event.target.style.transform = `rotate3d(0,1,0, ${30 + mouseXMap}deg)`; // skewX(${mouseXMap}deg)
    },
    setImages: function (comp) {
      //console.log("Image Set");
      let element = event.target;
      //console.log("event", event.target, comp);

      element.style.transform = `translate3d(${comp.positionX}vw, ${comp.positionY}vh, ${comp.positionZ}px)`;
      element.style.zIndex = comp.zIndex;

      // store image element
      this.imagesEle.push(element);
    },
    moveImage: function (value) {
      let index = 0;
      console.log("Value:", value);

      this.imagesEle.forEach((ele) => {
        //console.log("Type:", ele.id);
        let type = ele.id;
        let startPos = {
          x: this.images[index].positionX,
          y: this.images[index].positionY,
          z: this.images[index].positionZ,
        };

        switch (type) {
          case "Hintergrund":
            ele.style.transform = `translate3d(
              ${startPos.x}vw, 
              ${startPos.y}vh, 
              ${startPos.z + value}px)`;
            break;
          case "Hintergrund Element":
            ele.style.transform = `translate3d(
              ${startPos.x}vw, 
              ${startPos.y}vh, 
              ${startPos.z + value}px)`;
            break;
          case "Hauptgrund":
            ele.style.transform = `translate3d(
              ${startPos.x}vw, 
              ${startPos.y}vh, 
              ${startPos.z + value*2}px)`;
            break;
          case "Vordergrund":
            ele.style.transform = `translate3d(
              ${startPos.x}vw, 
              ${startPos.y}vh, 
              ${startPos.z + value*3}px)`;
            break;

          default:
            console.log("No Type:", ele);
            break;
        }

        index++;
      });
    },
    moveOut: function (callback) {
      let index = 0;

      this.imagesEle.forEach((ele) => {
        let moveOutAnim = null;
        let startPos = {
          x: this.images[index].positionX,
          y: this.images[index].positionY,
          z: this.images[index].positionZ,
        };
        //console.log("--> StartPos of",this.images[index].name, startPos, this.images[index].type);

        if (this.images[index].type != "Hintergrund") {
          moveOutAnim = ele.animate(
            [
              {
                transform: `translate3d(${startPos.x}vw, ${startPos.y}vh, ${startPos.z}px)`,
                opacity: 1,
              },
              {
                transform: `translate3d(${startPos.x}vw, ${
                  startPos.y + 800
                }vh, ${startPos.z + 280}px)`,
                opacity: 0,
              },
            ],
            {
              fill: "forwards",
              easing: "ease-out",
              duration: 1500,
            }
          );
          moveOutAnim.onfinish = (_) => callback();
        } else if (this.images[index].type === "Hintergrund") {
          moveOutAnim = ele.animate([{ opacity: 1 }, { opacity: 0 }], {
            fill: "forwards",
            easing: "ease-out",
            duration: 1500,
          });
          moveOutAnim.onfinish = (_) => callback();
        }

        index++;
      });
    },
    moveIn: function (callback) {
      //console.log("- Animate back ");
      let index = 0;

      this.imagesEle.forEach((ele) => {
        let moveInAnim = null;
        let startPos = {
          x: this.images[index].positionX,
          y: this.images[index].positionY,
          z: this.images[index].positionZ,
        };
        //console.log("--> StartPos of",this.name, startPos, " - goal",);

        if (this.images[index].type != "Hintergrund") {
          moveInAnim = ele.animate(
            [
              {
                transform: `translate3d(${startPos.x}vw, ${
                  startPos.y + -1000
                }vh, ${startPos.z + 400}px)`,
                opacity: 0,
              },
              {
                transform: `translate3d(${startPos.x}vw, ${startPos.y}vh, ${startPos.z}px)`,
                opacity: 1,
              },
            ],
            {
              fill: "forwards",
              easing: "ease-in",
              duration: 3000,
            }
          );
          moveInAnim.onfinish = (_) => callback();
        } else if (this.images[index].type === "Hintergrund") {
          moveInAnim = ele.animate([{ opacity: 0 }, { opacity: 1 }], {
            fill: "forwards",
            easing: "ease-in",
            duration: 3000,
          });
          moveInAnim.onfinish = (_) => callback();
        }

        index++;
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


<style scoped>
img {
  width: 10vw;
}

#Hintergrund {
  top: 0%;
  left: 0%;
  width: 1920px;
  height: 1080px;
  opacity: 1;

  /* Top, Right, Bottom, Left - Border */
  /* clip: rect(0px,1920px,600px,0px); */
}

#Hauptgrund {
  width: 15vw;
  opacity: 1;
}

#Vordergrund {
  width: 10vw;
  opacity: 1;
}

.image3D {
  position: absolute;
  /* background-color: coral; */
  transform-style: preserve-3d;
}

.storyText {
  position: absolute;
  z-index: 10;
  color: red;
  width: 50vw;
  font-size: 40px;

  /* Temporär*/
  top: 80vh;
  left: 20vw;
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