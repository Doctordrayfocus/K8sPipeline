<template>
  <router-link
    :to="`/pipelines/${pipeline.uuid}`"
    v-if="pipeline"
    :class="`w-full flex flex-row items-center justify-between shadow-md  bg-opacity-10 border-l-[4px] border-${pipeline.color} py-4 px-3`"
  >
    <div class="flex flex-col space-y-1 justify-start w-[25%]">
      <bp-normal-text custom-class="font-semibold">
        {{ pipeline.name }}
      </bp-normal-text>
      <bp-normal-text color="!text-gray-500" custom-class="text-xs">
        {{ pipeline.lastActive }}
      </bp-normal-text>
    </div>

    <div class="flex flex-col space-y-1 justify-start w-[25%] items-start">
      <div>
        <bp-normal-text custom-class="font-semibold"> Lang </bp-normal-text>
        <bp-normal-text color="!text-gray-500" custom-class="text-xs">
          {{ pipeline.lang }}
        </bp-normal-text>
      </div>
    </div>

    <div class="flex flex-col space-y-1 justify-start w-[25%] items-start">
      <div>
        <bp-normal-text custom-class="font-semibold"> Branches </bp-normal-text>
        <bp-normal-text color="!text-gray-500" custom-class="text-xs">
          {{ pipeline.branches }}
        </bp-normal-text>
      </div>
    </div>

    <div class="flex flex-col space-y-1 justify-start w-[25%]">
      <div class="w-full flex flex-row items-center justify-center">
        <bp-badge :color="pipeline.color"> {{ pipeline.status }} </bp-badge>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Pipeline } from "@/modules/types";
import { defineComponent } from "vue";
import BpNormalText from "@/components/typography/normalText.vue";
import BpBadge from "@/components/common/badge.vue";

export default defineComponent({
  components: {
    BpNormalText,
    BpBadge,
  },
  props: {
    pipeline: {
      type: Object as () => Pipeline,
    },
  },
  name: "BpPipeline",
  setup() {
    const availableColors =
      "border-red border-green border-blue bg-red bg-green bg-blue";
    return { availableColors };
  },
});
</script>
