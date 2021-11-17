<template>
    <div class="commute">
        <!-- <h2>{{person}}'s commute</h2>
        <p>This is <span class="person">{{person}}</span></p>
        <p>{{person}} commutes from {{start}} to {{destination}}</p> -->
    </div>
</template>

 
<script>
export default {
  name: "Commute",
  props: {
    person: String,
    start: String,
    destination: Object
  }
};
</script>