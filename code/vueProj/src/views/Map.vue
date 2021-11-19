<template>
    <div v-on:wheel="scrolly" v-on:mousemove="moveScreen">
    <!-- <h1>Main Page</h1> -->
    <div ref="container" class="map"></div>
    <div id="mainScene" ref="sceneRef" v-for="scene in commutes" :key="scene">
      <Commute_CO ref="imagesRef"
        :id="scene.id"
        :name="scene.name" 
        :images="scene.imageArr"
        :mapPoint="scene.location" />
    </div>
</div>
</template>

<script>
import Commute_CO from "@/components/Commute_CO.vue";
import mapboxgl from "mapbox-gl";
import { createClient } from "contentful";

let currentIndex = 0;

export default {
  name: "Map",
  components: {
    Commute_CO
  },
  methods: {
    scrolly: function (event) {
        
        // Add to scroll count
        if (event.deltaY < 0) Window.ScrollValue--;               // mousewheel up
        else Window.ScrollValue++;                                // mousewheel down
        if (Window.ScrollValue < 0) Window.ScrollValue = 0;       // no negatives
        //console.log("Scroll Delta is at:",Window.ScrollValue);

        // Map scroll to array indexes
        let scrollRange = Window.Util.mapRange(Window.ScrollValue,0,Window.ScrollSpeed,0,9);
        Window.ScrollIndex = Math.floor(scrollRange);
        //console.log("- App --> scrollIndex:", Window.ScrollIndex, "by", scrollRange);

        let currentContent = Window.Content[Window.ScrollIndex];
        
        // Content change if scrollIndex changes value
        if (Window.ScrollIndex != currentIndex) {
          
          // start animations
          let that = this;
          console.log("Animation: Move-Out start");
          this.$refs.imagesRef.moveOut(function(){
            that.commutes = [currentContent];
          });


          // change content
          //this.$nextTick(function () {
          //
            //this.commutes = [currentContent];
            /* console.log("New Content:",currentContent.name);
            console.log("Animation: Move-In start");
            this.$refs.imagesRef.moveIn(); */
          //});
        }
        else { // ??? none
          }

      

        // set or refresh current index
        currentIndex = Window.ScrollIndex;

    },
    moveScreen: function (event) {
        //console.log("Move",event);
        let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 5, -5);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, 0, 5);
        //let ele_Scene = document.getElementById("scene");
        //console.log("mousePosX", mousePosX, "MapX", mouseXMap, "\nmousePosY", mousePosY,"MapY", mouseYMap);
        //this.$refs.sceneRef.style.transform = `rotate3d(1,0,0, ${mouseYMap}deg) skewX(${mouseXMap}deg)`;
        //console.log("- --> this.$refs.scene.style", this.$refs.scene.style);
    },
  },
  data: function() {
    return {
      commutes: [],
    };
  },
  mounted: async function() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWh1c20iLCJhIjoiY2tnYzVxbHNnMDV5eTJ4bzdnb3R3NGx2bSJ9.FOXkMmSBQgCQSNCQJwxtYg";
    let map = new mapboxgl.Map({
      container: this.$refs.container, // container ID
      style: "mapbox://styles/kaszedal/ckw3ivnhz1ch814p4yufi1f0e", // Map Style
      center: [8.313357, 47.050149], // starting position [lng, lat] 47°03'00.5"N 8°18'48.1"E
      //center: Window.Content[Window.ScrollIndex].location, // starting position [lng, lat] 47°03'00.5"N 8°18'48.1"E
      pitch: 89, // Tilting/Neigung in degrees, max = 90°
      bearing: 0, // Rotation um Y
      zoom: 21, // starting zoom
      interactive: false, // no drag no zoom
    });
    // Displaying a GPX track
    await map.once('load');
    // Add fog
    map.setFog({
      'range': [-1, 2],
      'color': 'black',
      'horizon-blend': 0.1
    });

    map.on("load", async function() {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
          }
        }
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#888",
          "line-width": 8
        }
      });
    });
    
    console.log("Mounted Map");
  },
  created: function() {
    let client = createClient({
      space: 'h901iwmug6ht',
      accessToken: 'Tp72VnrvN7SETkR1RcKpydt8mbvmOWxLrUGv-ofECDM',
    });
    client
      .getEntries({content_type: 'scene'})
        .then( entries => {
            //console.log("All Entries",entries);
            entries.items.forEach(item => {
              //console.log("- --> item", item,"\nThis is scene nr:",item.fields.id);

            // all scenes
            // untangle the shit
                let sceneObj = {
                    id : item.fields.id,
                    name : item.fields.name,
                    imageArr : [],
                    location : [
                        item.fields.mappoint.fields.location.lon, 
                        item.fields.mappoint.fields.location.lat
                    ],
                }
                
                item.fields.image.forEach(imageType => {
                    let imageObj = {
                        src : imageType.fields.image.fields.file.url,
                        positionX : 0,
                        positionY : 0,
                        positionZ : 0,
                        zIndex : 0,
                        name : imageType.fields.titel,
                        type : imageType.fields.position
                    }

                    // set Image Position on Y-Axis & Z-Index Property
                    switch (imageType.fields.position) {
                        case "Vordergrund":
                            imageObj.positionY = 600;
                            imageObj.zIndex = 12;
                            break;
                        case "Hauptgrund":
                            imageObj.positionY = 350;
                            imageObj.zIndex = 8;
                            break;
                        case "Hintergrund":
                            imageObj.positionY = 0;
                            imageObj.zIndex = 4;
                            break;
                        default:
                            console.log("No Position for:",imageType.fields.titel);
                            break;
                    }

                    // set Image Position on X-Axis
                    switch (imageType.fields.placement) {
                        case "links":
                            imageObj.positionX = Window.Placement.Links;
                            break;
                        case "mitte":
                          imageObj.positionX = Window.Placement.Mitte;
                            break;
                        case "rechts":
                            imageObj.positionX = Window.Placement.Rechts;
                            break;
                        case "ohne":
                            imageObj.positionX = 0;
                            break;
                        default:
                            console.log("Wrong Placement for:",imageType.fields.titel);
                            break;
                    }

                    sceneObj.imageArr.push(imageObj);
                });

                //console.log("Scene",sceneObj);  

                Window.Content.push(sceneObj);  // add to content array      
            });

            Window.Content.sort((a, b) => a.id - b.id); // sort content by ID 0->8
            console.log("Content  loaded");
            this.commutes.push(Window.Content[0]);   // display first content
      });
  },
  updated : function() {
    //let mapPoint = Window.Content[Window.ScrollIndex].location;

    
    console.log("Update Map");
    

  }
};


</script>



<style src='mapbox-gl/dist/mapbox-gl.css'></style>
<style scoped>

.map {
    z-index: 0;
    margin: 0;
    padding: 0;
    height: 918px; /* 100vh*/
    width: 100%;
    background-color: cadetblue;
}

#mainScene {
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 0px;
    /* 
    width: 100%;
    color: white; */
}

.commute {
    perspective: 250px;
    perspective-origin: calc(1920px/2) 800px;
}


.moveOut {
  animation: moveOut 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes moveOut {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}


</style>
