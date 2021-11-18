<template>
    <div v-on:wheel="scrolly" v-on:mousemove="moveScreen" v-on:click="logClick">
    <!-- <h1>Main Page</h1> -->
    <div ref="container" class="map"></div>
    <div v-for="scene in commutes" :key="scene">
      <Commute_CO
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

export default {
  name: "Map",
  components: {
    Commute_CO
  },
  methods: {
    scrolly: function (event) {
        //console.log("Event", event);
        // check if mouse wheel up or down
        if (event.deltaY < 0) Window.Scrollindex--; // mousewheel up
        else Window.Scrollindex++;                  // mousewheel down
        if (Window.Scrollindex < 0) Window.Scrollindex = 0; // no negatives
        //console.log(Window.Scrollindex);
    },
    /* moveScreen: function (event) {
        //console.log("Move",event);
        //console.log(this.commutes);
        let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, 0, 5);
        //console.log("mousePosX", mousePosX, "MapX", mouseXMap, "\nmousePosY", mousePosY,"MapY", mouseYMap);
        //this.el.style.transform = `rotate3d(1,0,0, ${45 + mouseYMap}deg) skewX(${mouseXMap}deg)`;
    }, */
    logClick : function (event) {
        console.log(event.target)
    }
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
      pitch: 80, // Tilting/Neigung in degrees, max = 90°
      bearing: -90, // Rotation um Y
      zoom: 18, // starting zoom
    });
    // Displaying a GPX track
    await map.once('load');
    // Add fog
    map.setFog({
      'range': [-1, 2],
      'color': 'black',
      'horizon-blend': 0.3
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
                console.log("- --> item", item);

            // all scenes
            // untangle the shit
                let sceneObj = {
                    id : item.fields.id,
                    name : item.fields.name,
                    imageArr : [],
                    location : {
                        lon : item.fields.mappoint.fields.location.lon,
                        lat : item.fields.mappoint.fields.location.lat
                }}

                item.fields.image.forEach(imageType => {
                    let imageObj = {
                        src : imageType.fields.image.fields.file.url,
                        position : "0px",
                        placement : "0px",
                        name : imageType.fields.titel
                    }

                    switch (imageType.fields.position) {
                        case "Vordergrund":
                            imageObj.position = "100px";
                            break;
                        case "Hauptgrund":
                            imageObj.position = "-50px";
                            break;
                        case "Hintergrund":
                            imageObj.position = "-200px";
                            break;
                        default:
                            console.log("Wrong Position for",imageType.fields.titel);
                            break;
                    }

                    switch (imageType.fields.placement) {
                        case "links":
                            imageObj.placement = "-400px";
                            break;
                        case "mitte":
                            imageObj.placement = "0px";
                            break;
                        case "rechts":
                            imageObj.placement = "400px";
                            break;
                        default:
                            console.log("Wrong Position for",imageType.fields.titel);
                            break;
                    }

                    //console.log("- --> imageType.fields", imageType.fields);
                    //console.table(imageObj);
                    sceneObj.imageArr.push(imageObj);
                })
                console.log("Scene",sceneObj);

                Window.Content.push(sceneObj);

                this.commutes.push(sceneObj);
            });
        });
  }
};


</script>



<style src='mapbox-gl/dist/mapbox-gl.css'></style>
<style scoped>

.map {
    /* position: absolute; */
    z-index: 0;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100%;
    background-color: cadetblue;
}

.commute {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    color: white;

    /* 3D */
    /* transform-style: preserve-3d;
    transform: rotate3d(1,0,0, 30deg) skewX(0deg) translateZ(-150px); */
}



</style>
