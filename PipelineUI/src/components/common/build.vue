<template>
  <router-link
    to="/builds/djfndfd"
    v-if="build"
    :class="`col-span-3 shadow-md rounded-md px-4 py-4 flex flex-col space-y-3 bg-${build.color} !bg-opacity-20`"
  >
    <div class="w-full flex flex-row items-center justify-between">
      <span
        class="h-[39px] w-[39px] rounded-full flex items-center justify-center bg-gray-800 bg-opacity-10"
      >
        <bp-icon name="builds" custom-class="h-[19px]" />
      </span>

      <bp-normal-text custom-class=" !text-xs">
        {{ build.duration }}
      </bp-normal-text>
    </div>

    <bp-normal-text custom-class="font-semibold !line-clamp-1 w-full">
      {{ build.title }}
    </bp-normal-text>

    <div class="w-full flex flex-col space-y-1">
      <div class="w-full flex flex-row items-center justify-between">
        <bp-normal-text custom-class=" !text-xs">
          {{ build.status }}
        </bp-normal-text>
      </div>
      <div class="h-[7px] w-full rounded-2xl bg-white relative">
        <div
          class="absolute top-0 left-0 rounded-2xl h-full bg-black"
          :style="`width: ${build.percentage}%`"
        ></div>
      </div>
      <div class="w-full flex flex-row justify-end">
        <bp-normal-text custom-class=" !text-xs">
          {{ build.percentage }}%
        </bp-normal-text>
      </div>
    </div>

    <div class="flex flex-row">
      <bp-badge custom-class="!text-black bg-gray-800 bg-opacity-10">
        {{ build.branch }}
      </bp-badge>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Build } from "@/modules/types";
import { defineComponent } from "vue";
import BpNormalText from "@/components/typography/normalText.vue";
import BpBadge from "@/components/common/badge.vue";
import BpIcon from "@/components/common/icon.vue";

export default defineComponent({
  components: {
    BpNormalText,
    BpBadge,
    BpIcon,
  },
  props: {
    build: {
      type: Object as () => Build,
    },
  },
  name: "BpBuild",
  setup() {
    const availableColors =
      "border-red border-green border-blue bg-red bg-green bg-blue";
    return { availableColors };
  },
});
</script>
