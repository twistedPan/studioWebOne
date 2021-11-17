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
        <div ref="container" class="map"></div>
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
      style: "mapbox://styles/mhusm/ckgcbplva0qvl19mbxd78ma97", // My custom style
      center: [8.546385, 47.190093], // starting position [lng, lat]
      zoom: 9, // starting zoom
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
      space: 'iwtb13jor1ni',
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
.map {
  height: 100vh;
  width: 100vw;
}
</style>