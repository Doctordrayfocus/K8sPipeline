<template>
  <div class="py-6 grid grid-cols-12 px-8 gap-4">
    <div class="col-span-full justify-between flex flex-row items-center">
      <bp-header-text> Builds </bp-header-text>

      <bp-paginator />
    </div>

    <div class="col-span-full grid grid-cols-12 gap-5 pt-3">
      <bp-build v-for="(build, index) in builds" :key="index" :build="build">
      </bp-build>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from "vue-meta";
import BpHeaderText from "@/components/typography/headerText.vue";
import BpPaginator from "@/components/common/paginator.vue";
import BpBuild from "@/components/common/build.vue";

export default defineComponent({
  name: "BuildsPages",
  layout: "Dashboard",
  components: {
    BpHeaderText,
    BpPaginator,
    BpBuild,
  },
  setup() {
    useMeta({
      title: "Builds",
    });

    const builds = [
      {
        title: "Feat: Added paystack modules",
        duration: "4 minutes ago",
        status: "Progress",
        percentage: "60",
        branch: "dev",
        color: "blue",
      },
      {
        title: "Fix: Flutterwave modules",
        duration: "10 minutes ago",
        status: "Successful",
        percentage: "100",
        branch: "prod",
        color: "green",
      },
      {
        title: "Feat: Transaction details",
        duration: "40 minutes ago",
        status: "Failed",
        percentage: "40",
        branch: "prod",
        color: "red",
      },
    ];

    return {
      builds,
    };
  },
});
</script>
