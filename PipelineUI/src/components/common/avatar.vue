<template>
  <bp-image-loader
    :photo-url="photoUrl"
    :custom-class="`rounded-md flex text-xs uppercase font-semibold  text-white !bg-gray-50 text-black flex-row items-center justify-center ${customClass} `"
    :custom-style="`width: ${size}px; height: ${size}px;`"
  >
    <template v-if="photoUrl == ''">
      <slot />
    </template>
  </bp-image-loader>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BpImageLoader from "./imageLoader.vue";

export default defineComponent({
  components: {
    BpImageLoader,
  },
  props: {
    size: {
      type: String,
      default: "50",
    },
    photoUrl: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "",
    },
  },
  name: "BpAvatar",
  setup() {
    const avatarColors = [
      {
        text: "text-[#FFD454]",
        bg: "bg-[#FFD454]",
      },
      {
        text: "text-[#409FFF]",
        bg: "bg-[#409FFF]",
      },
      {
        text: "text-[#FE9F5E]",
        bg: "bg-[#FE9F5E]",
      },
      {
        text: "text-[#3DCC79]",
        bg: "bg-[#3DCC79]",
      },
      {
        text: "text-[#B656EB]",
        bg: "bg-[#B656EB]",
      },
    ];

    const randomIndex = Math.floor(Math.random() * 5);

    return {
      randomIndex,
      avatarColors,
    };
  },
});
</script>
