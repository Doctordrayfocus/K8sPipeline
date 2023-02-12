<template>
  <span>
    <img :src="`/images/icons/${name}.svg`" :class="`${customClass}`"
  /></span>
</template>
<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      required: true,
    },
  },
  name: "BpIcon",
};
</script>
