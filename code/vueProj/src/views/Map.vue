<template>
    <div>
    <li 
    v-for="commute in commutes" :key="commute.person">
      <Commute_CO 
        :person="commute.fields.name" 
        :start="commute.fields.start" 
        :destination="commute.fields.standort" />
    </li>
        <h1>Me Map</h1>
        <div class="frame">
            <div ref="container" class="map"></div>
        </div>
  </div>
</template>

<script>
import Commute_CO from "@/components/Commute_CO.vue";
import mapboxgl from "mapbox-gl";
//import getCoordinatesFromGpxFile from "@/modules/gpx-utilities.js";
//import contentful from "@/modules/contentful.js";
import { createClient } from "contentful";

export default {
  name: "Map",
  components: {
    Commute_CO
  },
  data: function () {
    return {
      commutes: [],
    };
  },
  mounted: async function () {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWh1c20iLCJhIjoiY2tnYzVxbHNnMDV5eTJ4bzdnb3R3NGx2bSJ9.FOXkMmSBQgCQSNCQJwxtYg";
    let map = new mapboxgl.Map({
      container: this.$refs.container, // container ID
      style: "mapbox://styles/mhusm/ckgcbplva0qvl19mbxd78ma97", // Map Style
      center: [8.546385, 47.190093], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });
        // Displaying a GPX track
    map.on("load", async function() {
      /* let coordinates = await getCoordinatesFromGpxFile(
        await contentful.getFirstGPXFileUrl()
      ); */
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            //coordinates: coordinates
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
      space: 'iwtb13jor1ni', // MeSeeksGreekGeeks: h901iwmug6ht
      accessToken: 'ILlqA74cGHgrjHnjY2Ab4Vw6hSV-spZuzt83yBROrJU',
    });

    client
      .getEntries()
        .then( entries => {
            console.log("All Entries",entries);
            entries.items.forEach(item => {
              console.log("- --> item", item);
              this.commutes.push(item);
            });
        });
  }
};

</script>



<style src='mapbox-gl/dist/mapbox-gl.css'></style>
<style scoped >

.frame {
    position: relative;
    top: calc(var(--h)/2);
    width: 100%;
    height: 100%;
    background-color: aquamarine;

    perspective: 250px;
    /* x / y => half screen with / sreen height*/
    perspective-origin: calc(var(--w)/2) 100px;
    /* Fluchtpunkt oben in der Mitte der Referenz-Box */
}

.map {
    position: absolute;
    margin-left: 24.6%;
    margin-right: auto;
    height: 50vh;
    width: 50vw;
    background-color: cadetblue;
    z-index: 0;

    transform-style: preserve-3d;
    transform: rotate3d(1,0,0, 90deg) skewX(0deg); /* translateZ(-150px) */


}
</style>