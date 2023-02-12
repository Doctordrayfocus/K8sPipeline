<template>
  <button
    :class="`focus:outline-none rounded-[8px] flex flex-row space-x-1 items-center justify-center ${padding} ${bgColor} ${textColor} ${customClass}`"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    bgColor: {
      type: String,
      default: "bg-black",
    },
    textColor: {
      type: String,
      default: "text-white",
    },
    customClass: {
      type: String,
      default: "",
    },
    padding: {
      type: String,
      default: "py-2 px-4 ",
    },
  },
  name: "BpButton",
});
</script>
