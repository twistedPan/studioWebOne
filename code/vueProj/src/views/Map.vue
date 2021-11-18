<template>
    <div>
    <li v-for="scene in commutes" :key="scene">
      <Commute_CO 
        :id="scene.id"
        :name="scene.name" 
        :images="scene.imageArr"
        :mapPoint="scene.location" />
    </li>
    <h1>Main Page</h1>
    <div ref="container" class="map"></div>
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
      style: "mapbox://styles/kaszedal/ckvting2h21wl14nc8b9z6oku", // Map Style
      center: [8.313357, 47.050149], // starting position [lng, lat] 47°03'00.5"N 8°18'48.1"E
      pitch: 120, // Tilting/Neigung in degrees
      bearing: 0, // Rotation um Y
      zoom: 15, // starting zoom
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
                console.log("- --> item", item);

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
                        position : imageType.fields.position,
                        placement : imageType.fields.placement,
                        name : imageType.fields.titel
                    }
                    //console.log("- --> imageType.fields", imageType.fields);
                    //console.table(imageObj);
                    sceneObj.imageArr.push(imageObj);
                })
                console.log(sceneObj);
                this.commutes.push(sceneObj);
            });
        });
  }
};
</script>



<style src='mapbox-gl/dist/mapbox-gl.css'>
</style><style scoped>

.map {
  /* position: absolute; */
  margin: 0;
  padding: 0;
  /* margin-left: -480px; */
  /* margin-right: auto; */
  height: 80vh;
  width: 100%;
  background-color: cadetblue;
  z-index: 0;

  /* transform-style: preserve-3d;
    transform: rotate3d(1,0,0, 90deg) skewX(0deg); */
  /* translateZ(-150px) */


}
</style>
