<template>
  <div
    v-on:wheel="scrolly"
    v-on:mousemove="moveScreen"
    v-on:click="changeScene"
  >
    <div ref="container" class="map"></div>
    <div id="scene" ref="sceneRef">
      <Commute_CO 
        v-for="(scene, i) in sceneContent"
        :ref="'imageRel-'+i"
        :key="scene"
        :id="scene.id"
        :name="scene.name"
        :images="scene.imageArr"
        :mapPoint="scene.location"
        :story="scene.story"
        :display="scene.display"
      />
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
    Commute_CO,
  },
  data: function () {
    return {
      commutes: [],
      sceneContent: [],
      mapBox: null,
      scroll_Z : 0,
      scrollIndex : 0,
      scrollValue : 0,
      clickIndex : 0,
    };
  },
  methods: {
    scrolly: function (event) {
      let that = this;
      //console.log("Event:",event.deltaY);

      let currentContent = this.sceneContent[this.scrollIndex];
      let currentImageRef = "imageRel-"+this.scrollIndex;

      /**
       * Wenn neuer Index erreicht ist 
       * - alles display : "none"           
       * - "fly to" new location
       * - blockiere Scrolling - stelle alles auf stopp
       * - WENN FERTIG mit "fly to"
       * - new contnet: 
       *      - opacitiy : 0
       *      - display : "block"
       *      - ease Opacity in()
       * 
       * Wiederholen
       */
      // Content change if scrollIndex changes value
      if (this.scrollIndex != currentIndex) 
      {
        Array.from(this.$refs.sceneRef.children).forEach(ele => {ele.style.display = "none";});
        this.scroll_Z = 0;
        this.scrollValue = Math.floor(this.scrollValue);
        
        this.mapMove(function() {
          console.log("Map finished Moving, Index",that.scrollIndex);
          that.$refs.sceneRef.children[that.scrollIndex].style.display = "block";
        
          // Ease In -> new Index
          that.$refs[currentImageRef].moveIn(function(){
            // set or refresh current index
            currentIndex = that.scrollIndex;
          })
        });
        
        console.log("New Content:", currentContent.name);
      } else {
        
        console.log("that.scrollIndex",that.scrollIndex);
        this.$refs[currentImageRef].moveImage(this.scroll_Z);
        //console.log("- --> this.$refs", currentImageRef, this.$refs[currentImageRef]);

        // Add to scroll count
        if (event.deltaY < 0) {
          this.scrollValue -= Window.ScrollSpeed;
          this.scroll_Z -= Window.ScrollSpeed;
        }
        else {
          this.scrollValue += Window.ScrollSpeed; // mousewheel down
          this.scroll_Z += Window.ScrollSpeed;
        }

        if (this.scrollValue < 0 || this.scroll_Z < 0) {
          this.scrollValue = 0; // no negatives
          this.scroll_Z = 0;
        }
        //console.log("- --> this.scroll_Z", this.scroll_Z);

      }
      // Map scroll to array indexes
      let scrollRange = Window.Util.mapRange(this.scrollValue,0,Window.ScrollChange,0,9);
      //console.log("- --> scrollRange", scrollRange);
      
      this.scrollIndex = Math.floor(scrollRange);      
      //console.log("Scroll Value is at:",this.scrollValue,"Index:",Window.ScrollInde);


    },
    moveScreen: function () {
      //console.log("Move",event);
      /* let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 5, -5);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, 0, 5); */
      //let ele_Scene = document.getElementById("scene");
      //console.log("mousePosX", mousePosX, "MapX", mouseXMap, "\nmousePosY", mousePosY,"MapY", mouseYMap);
      //this.$refs.sceneRef.style.transform = `rotate3d(1,0,0, ${mouseYMap}deg) skewX(${mouseXMap}deg)`;
      //console.log("- --> this.$refs.scene.style", this.$refs.scene.style);
    },
    changeScene: function () {
      let that = this;
      
      this.clickIndex++;
      // reset click index
      if (this.clickIndex > this.sceneContent.length-1) this.clickIndex = 0;
      this.scrollIndex = this.clickIndex;
      
      Array.from(this.$refs.sceneRef.children).forEach(ele => {ele.style.display = "none";});
      
      this.mapMove(function() {
        console.log("Map finished Moving, clickIndex",that.clickIndex);
        that.$refs.sceneRef.children[that.clickIndex].style.display = "block";
        
        let currentImageRef = "imageRel-"+that.clickIndex;
        // Ease In -> new Index
        that.$refs[currentImageRef].moveIn(function(){
          
          }, 500)
      },500);

    },
    mapMove: function (callback, easeSpeed = 4000) {
      console.log("Map Points:",
        "rotation",this.sceneContent[this.scrollIndex].mapRotation,
        "zoom",this.sceneContent[this.scrollIndex].mapZoom);
      let nextLocation = this.sceneContent[this.scrollIndex].location;
      //console.log("Change Locations",nextLocation[0],nextLocation[1]);
      //this.mapBox.flyTo({center: nextLocation,essential: true,});
      this.mapBox.easeTo({
        center: nextLocation, 
        bearing: 89,
        zoom: 21, 
        duration: easeSpeed});
      
      setTimeout(callback,easeSpeed*1.5);
      
      }
  },
  created: function () {
    let client = createClient({
      space: "h901iwmug6ht",
      accessToken: "Tp72VnrvN7SETkR1RcKpydt8mbvmOWxLrUGv-ofECDM",
    });
    client.getEntries({ content_type: "scene" }).then((entries) => {
      //console.log("All Entries",entries);
      entries.items.forEach((item) => {
        //console.log("Scene NR:",item.fields.id,"-> Data", item);

        // all scenes
        // untangle the shit
        let sceneObj = {
          id: item.fields.id,
          name: item.fields.name,
          imageArr: [],
          location: [
            item.fields.mappoint.fields.location.lon,
            item.fields.mappoint.fields.location.lat,
          ],
          mapRotation: item.fields.mappoint.fields.rotation,
          mapZoom: item.fields.mappoint.fields.zoom,
          story: item.fields.story,
          display: "none",
        };

        item.fields.image.forEach((imageType) => {
          let imageObj = {
            src: imageType.fields.image.fields.file.url,
            positionX: imageType.fields.xAxis,
            positionY: imageType.fields.yAxis,
            positionZ: 0,
            zIndex: 0,
            name: imageType.fields.titel,
            type: imageType.fields.position,
            scale: imageType.fields.scale,
          };

          // set Image Position Z on Y-Axis & Z-Index Property
          switch (imageType.fields.position) {
            case "Vordergrund":
              imageObj.positionZ = 10;
              imageObj.zIndex = 12;
              break;
            case "Hauptgrund":
              imageObj.positionZ = 5;
              imageObj.zIndex = 8;
              break;
            case "Hintergrund Element":
              imageObj.positionZ = 2;
              imageObj.zIndex = 6;
              break;
            case "Hintergrund":
              imageObj.positionZ = 0;
              imageObj.zIndex = 4;
              break;
            default:
              console.log("No Position for:", imageType.fields.titel);
              break;
          }

          sceneObj.imageArr.push(imageObj);
        });

        Window.Content.push(sceneObj); // add to content array
        //console.log("--> SceneObj", sceneObj);
        this.sceneContent.push(sceneObj);
      });

      Window.Content.sort((a, b) => a.id - b.id); // sort content by ID 0->8
      this.sceneContent.sort((a, b) => a.id - b.id); // sort content by ID 0->8
      console.log("Content  loaded");
      console.log("Scene Content:", this.sceneContent, this.sceneContent.length);

    });
  },
  mounted: async function () {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWh1c20iLCJhIjoiY2tnYzVxbHNnMDV5eTJ4bzdnb3R3NGx2bSJ9.FOXkMmSBQgCQSNCQJwxtYg";
    let map = new mapboxgl.Map({
      container: this.$refs.container, // container ID
      style: "mapbox://styles/kaszedal/ckw3ivnhz1ch814p4yufi1f0e", // Map Style
      center: [8.313357, 47.050149], // starting position [lng, lat] 47°03'00.5"N 8°18'48.1"E
      pitch: 89, // Tilting/Neigung in degrees, max = 90°
      bearing: 0, // Rotation um Y
      zoom: 21, // starting zoom
      interactive: false, // no drag no zoom
    });
    // Displaying a GPX track
    await map.once("load");
    // Add fog
    map.setFog({
      range: [-1, 2],
      color: "white",
      "horizon-blend": 0.1,
    });

    map.on("load", async function () {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      });
    });
    
    this.mapBox = map;

    // set first scene  
    this.$refs.sceneRef.children[0].style.display = "block";
  },
};
</script>



<style src='mapbox-gl/dist/mapbox-gl.css'></style>
<style scoped>
.map {
  z-index: 0;
  margin: 0;
  padding: 0;
  height: 100vh; /* 100vh*/
  width: 100vw;
  background-color: cadetblue;
}

#scene {
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;

  /* width: 100%;
    color: white; */
}

.commute {
  position: absolute;
  display: block;
  perspective: 250px;
  perspective-origin: calc(1920px / 2) 800px;
  opacity: 1;
}
</style>
