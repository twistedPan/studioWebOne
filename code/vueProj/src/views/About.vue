<template>
  <div class="commute">
    <h1>This is about a page about a commute</h1>
    <li 
    v-for="commute in commutes" :key="commute.person">
      <Commute_CO 
        :person="commute.fields.name" 
        :start="commute.fields.start" 
        :destination="commute.fields.standort" />
    </li>
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

  transform-style: preserve-3d;
  transform: rotateX(45deg);
}
</style>