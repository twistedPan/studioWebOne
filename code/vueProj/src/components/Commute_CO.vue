<template>
    <div class="commute">
        <p>This is Number {{id}}</p>
        <p>The Name is {{name}}</p>
        <p>{{id}} commutes from {{id}} to {{id}}</p>
    </div>
</template>

 
<script>
export default {
  name: "Commute",
  props: {
    id: String,
    name: String,
    images: [],
    destination: Object
  }
};
</script>

<!--

Image [ 
  {
    name: String,
    src: url,
    position: string,
    placement: string
  },
  ....
]


-->