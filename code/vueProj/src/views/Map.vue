<template>
  <div v-on:wheel="scrolly">
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
        :subtext="scene.subtext"
        :display="scene.display"
      />
    </div>
    <!-- <audio src="" hidden /> -->
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
      sceneContent: [],
      mapBox: null,
      scroll_Z : 0,
      scrollIndex : 0,
      scrollValue : 0,
      clickIndex : 0,
      scrollIsBlocked : true,
    };
  },
  methods: {
    scrolly: function (event) {
      let that = this;
      if (this.scrollIsBlocked) return;
      //console.log("Event:",event.deltaY);

      //let currentContent = this.sceneContent[this.scrollIndex]; //! Audio is not enabled
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
        if (this.scrollIndex < currentIndex) {this.scrollIndex = currentIndex; return;}
        Array.from(this.$refs.sceneRef.children).forEach(ele => {ele.style.display = "none";});
        this.scroll_Z = 0; // for translating through Z-Axis
        this.scrollValue = Math.floor(this.scrollValue);

        this.scrollIsBlocked = true;
         console.log("scroll blocked")

        this.mapMove(function() {
          //console.log("Map finished Moving, Index",that.scrollIndex);
          that.$refs.sceneRef.children[that.scrollIndex].style.display = "block";

          //console.log("New Content:", currentContent.name);

          // currentContent.sound // sound file is here
          /* let aduioEle = document.getElementsByTagName("audio");
          console.log("currentContent.sound",currentContent.sound);
          aduioEle.src = currentContent.sound;
          aduioEle.play(); */

          // Ease In -> new Index
          that.$refs[currentImageRef].moveIn(function(){
            // set or refresh current index
            currentIndex = that.scrollIndex;
            if (currentIndex >= that.sceneContent.length) currentIndex = 0;

            setTimeout(_=>{that.scrollIsBlocked = false; console.log("scroll unblocked");},8000);
            
          }, 1200)
        }, 2000);

      } else {

          if (this.scrollIsBlocked == false) {
          //console.log("that.scrollIndex",that.scrollIndex);
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
      }
      // Map scroll to array indexes
      let scrollRange = Window.Util.mapRange(this.scrollValue, 0,Window.ScrollChange, 0,this.sceneContent.length-1);
      //console.log("- --> scrollRange", scrollRange);

      this.scrollIndex = Math.floor(scrollRange);
      if (this.scrollIndex >= this.sceneContent.length) {
        location.reload();
      }
      //console.log("Scroll Value is at:",this.scrollValue,"Index:",Window.ScrollInde);


    },
    mapMove: function (callback, easeSpeed = 4000) {
      let nextScene = this.sceneContent[this.scrollIndex];
      //console.log("Change Locations",nextLocation[0],nextLocation[1]);
      //this.mapBox.flyTo({center: nextLocation,essential: true,});
      this.mapBox.easeTo({
        center: nextScene.location,
        bearing: nextScene.mapRotation,
        zoom: nextScene.mapZoom,
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
          subtext: "",
          display: "none",
          sound: null
        };

        /* if (typeof item.fields.sound != "undefined"){
          sceneObj.sound = item.fields.sound[0].fields.file.url;
        } */

        if (sceneObj.story.split('//').length > 1) {
          let splitStory = sceneObj.story.split('//');
          sceneObj.story = splitStory[0];
          sceneObj.subtext = splitStory[1];
        }

        let index = 0;
        item.fields.image.forEach((imageType) => {
          let imageObj = {
            id: index++,
            src: imageType.fields.image.fields.file.url,
            positionX: imageType.fields.xAxis,
            positionY: imageType.fields.yAxis,
            positionZ: 0,
            zIndex: 0,
            name: imageType.fields.titel,
            type: imageType.fields.position,
            scale: imageType.fields.scale,
            transition: null
          };

          if (typeof imageType.fields.forAnimation != "undefined")
            imageObj.transition = imageType.fields.forAnimation;

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

          //console.log("Image Object:",sceneObj.id,imageObj);
          sceneObj.imageArr.push(imageObj);
        });

        Window.Content.push(sceneObj); // add to content array
        //console.log("--> SceneObj", sceneObj);
        this.sceneContent.push(sceneObj);
      });

      Window.Content.sort((a, b) => a.id - b.id); // sort content by ID 0->8
      this.sceneContent.sort((a, b) => a.id - b.id); // sort content by ID 0->8
      //console.log("Content  loaded");
      //console.log("Scene Content:", this.sceneContent, this.sceneContent.length);

      // currentContent.sound // sound file is here
        /* let aduioEle = document.getElementsByTagName("audio")[0];
        console.log("- --> client.getEntries --> aduioEle", aduioEle);
        console.log("currentContent.sound",this.sceneContent[0].sound);
        aduioEle.src = this.sceneContent[0].sound;
        aduioEle.play(); */

        setTimeout(_=>{this.scrollIsBlocked = false; console.log("scroll unblocked");},9000)
    });
  },
  mounted: async function () {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWh1c20iLCJhIjoiY2tnYzVxbHNnMDV5eTJ4bzdnb3R3NGx2bSJ9.FOXkMmSBQgCQSNCQJwxtYg";
    let map = new mapboxgl.Map({
      container: this.$refs.container, // container ID
      style: "mapbox://styles/kaszedal/ckw3ivnhz1ch814p4yufi1f0e", // Map Style
      center: [8.313357, 47.050149], // starting position [lng, lat] 47°03'00.5"N 8°18'48.1"E
      pitch: 70, // Tilting/Neigung in degrees, max = 90°
      bearing: 0, // Rotation um Y
      zoom: 20, // starting zoom
      interactive: false, // no drag no zoom
    });
    // Displaying a GPX track
    await map.once("load");
    // Add fog
    map.setFog({
      range: [1, 2],
      color: "#f6f4e4",
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
  perspective-origin: 860px 200px;
  opacity: 1;
}


</style>
