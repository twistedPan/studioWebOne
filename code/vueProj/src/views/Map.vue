<template>
    <div v-on:wheel="scrolly" v-on:mousemove="moveScreen">
    <!-- <h1>Main Page</h1> -->
    <div ref="container" class="map"></div>
    <div id="mainScene" ref="sceneRef" v-for="scene in commutes" :key="scene">
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
    /* scrolly: function (event) {
        //console.log("Event", event);
        // check if mouse wheel up or down
        if (event.deltaY < 0) Window.ScrollValue--;       // mousewheel up
        else Window.ScrollValue++;                        // mousewheel down
        if (Window.ScrollValue < 0) Window.ScrollValue = 0; // no negatives
        console.log("Scroll Delta is at:",Window.ScrollValue);
    }, */
    /* moveScreen: function (event) {
        //console.log("Move",event);
        let mousePosX = event.screenX;
        if (mousePosX > 1920) mousePosX -= 1920;
        let mousePosY = event.screenY;
        let mouseXMap = Window.Util.mapRange(mousePosX, 0, 1920, 20, -20);
        let mouseYMap = Window.Util.mapRange(mousePosY, 0, 1080, 0, 5);
        //let ele_Scene = document.getElementById("scene");
        //console.log("mousePosX", mousePosX, "MapX", mouseXMap, "\nmousePosY", mousePosY,"MapY", mouseYMap);
        //this.$refs.sceneRef.style.transform = `rotate3d(1,0,0, ${mouseYMap}deg) skewX(${mouseXMap}deg)`;
        //console.log("- --> this.$refs.scene.style", this.$refs.scene.style);
    }, */
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
      style: "mapbox://styles/mapbox/streets-v11", // Map Style
      center: [8.313357, 47.050149], // starting position [lng, lat] 47°03'00.5"N 8°18'48.1"E
      pitch: 80, // Tilting/Neigung in degrees, max = 90°
      bearing: -90, // Rotation um Y
      zoom: 15, // starting zoom
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
                    location : {
                        lon : item.fields.mappoint.fields.location.lon, 
                        lat : item.fields.mappoint.fields.location.lat
                }}
                
                item.fields.image.forEach(imageType => {
                    let imageObj = {
                        src : imageType.fields.image.fields.file.url,
                        position : "0px",
                        placement : "0px",
                        zIndex : 0,
                        name : imageType.fields.titel
                    }

                    switch (imageType.fields.position) {
                        case "Vordergrund":
                            imageObj.position = 600;
                            imageObj.zIndex = 12;
                            break;
                        case "Hauptgrund":
                            imageObj.position = 350;
                            imageObj.zIndex = 8;
                            break;
                        case "Hintergrund":
                            imageObj.position = 250;
                            imageObj.zIndex = 4;
                            break;
                        default:
                            console.log("No Position for:",imageType.fields.titel);
                            break;
                    }

                    switch (imageType.fields.placement) {
                        case "links":
                            imageObj.placement = -800;
                            break;
                        case "mitte":
                            imageObj.placement = -200;
                            break;
                        case "rechts":
                            imageObj.placement = 400;
                            break;
                        default:
                            console.log("Wrong Placement for:",imageType.fields.titel);
                            break;
                    }

                    sceneObj.imageArr.push(imageObj);
                });

                console.log("Scene",sceneObj);  

                Window.Content.push(sceneObj);  // add to content array      
            });

            Window.Content.sort((a, b) => a.id - b.id); // sort content by ID 0->8
            
            this.commutes.push(Window.Content[0]);   // display first content
      });
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
    width: 100%;
    color: white;
}

.commute {
    perspective: 250px;
    perspective-origin: calc(1920px/2) 800px;
}

</style>
