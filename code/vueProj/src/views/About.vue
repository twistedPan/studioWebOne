<template>
  <div class="commute">
    <h1>This Page is dead</h1>
    <li 
    v-for="commute in commutes" :key="commute.person">
      <Commute_CO 
        :id="commute.fields.id" 
        :name="commute.fields.name" 
        :images="commute.fields.image" 
        :destination="commute.fields.destination" />
    </li>
    <p>This Page is dead</p>
  </div>
</template>

<script>
import Commute_CO from "@/components/Commute_CO.vue";
import { createClient } from "contentful";

export default {
  name: "About",
  components: {
    Commute_CO
  },
  data: function() {
    return {
      commutes: [],
    };
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
}
</script>

<style>
.commute {
  background-color: wheat;
  /* transform-style: preserve-3d;
  transform: rotateX(45deg); */
}
</style>