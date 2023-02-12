<template>
  <div class="flex flex-row items-center space-x-2">
    <bp-normal-text> Showing 1-10 of 30 </bp-normal-text>
    <div class="flex flex-row items-center justify-end space-x-2">
      <div
        class="w-[42px] h-[42px] rounded-md bg-gray-200 flex flex-row items-center justify-center"
      >
        <bp-icon name="arrow-left" custom-class="h-[18px]" />
      </div>
      <div
        class="w-[42px] h-[42px] rounded-md bg-gray-600 flex flex-row items-center justify-center"
      >
        <bp-normal-text color="!text-white">1</bp-normal-text>
      </div>
      <div
        class="w-[42px] h-[42px] rounded-md bg-white flex flex-row items-center justify-center"
      >
        <bp-normal-text>2</bp-normal-text>
      </div>
      <div
        class="w-[42px] h-[42px] rounded-md bg-white flex flex-row items-center justify-center"
      >
        <bp-normal-text>3</bp-normal-text>
      </div>
      <div
        class="w-[42px] h-[42px] rounded-md bg-gray-600 bg-opacity-10 flex flex-row items-center justify-center"
      >
        <bp-icon name="arrow-right" custom-class="h-[18px]" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BpIcon from "@/components/common/icon.vue";
import BpNormalText from "@/components/typography/normalText.vue";

export default {
  components: {
    BpIcon,
    BpNormalText,
  },
  props: {
    customClass: {
      type: String,
      required: false,
    },
  },
  name: "BpPaginator",
};
</script>
