<template>
  <h3
    :class="` font-extrabold 
	${size == 'lg' ? 'lg:text-lg mdlg:text-lg text-lg' : ''}
	${size == 'xl' ? 'lg:text-xl mdlg:text-xl text-[15px]' : ''}
	${size == 'base' ? 'lg:text-base mdlg:text-[13px] text-sm' : ''}
	${size == 'xs' ? 'mdlg:!text-[12px] text-xs' : ''}
	${customClass}
	${color}`"
  >
    <slot />
  </h3>
</template>
<script lang="ts">
export default {
  props: {
    size: {
      type: String,
      default: "lg",
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
  name: "BpHeaderText",
};
</script>
