<template>
  <span
    :class="` flex flex-row items-center
  ${customClass} ${color}
  ${size == 'base' ? 'lg:text-sm mdlg:text-[12px] text-xs' : ''}
  ${size == 'small' ? ' text-xs' : ''}`"
  >
    <slot />
  </span>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    size: {
      type: String,
      default: "base",
    },
    color: {
      type: String,
      default: "text-black",
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  name: "BpNormalText",
});
</script>
