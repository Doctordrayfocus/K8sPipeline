<template>
  <span
    :class="`px-3 py-1 !text-xs ${customClass} font-semibold rounded-md !bg-opacity-10 flex flex-row items-center justify-between
      ${color == 'purple' ? '  bg-purple text-purple ' : ''}
      ${color == 'green' ? '  bg-darkGreen text-darkGreen' : ''}
      ${color == 'blue' ? '  bg-darkBlue text-darkBlue' : ''}
      ${color == 'yellow' ? '  bg-darkYellow text-darkYellow' : ''}
      ${color == 'red' ? '  bg-darkRed text-darkRed' : ''}
      ${color == 'orange' ? '  bg-darkOrange text-darkOrange' : ''}
      ${color == 'newgray' ? '  bg-newgray text-black' : ''}
      `"
  >
    <slot />
    <slot name="extras" />
  </span>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    color: {
      type: String,
      default: "purple",
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  name: "BpBadge",
});
</script>
