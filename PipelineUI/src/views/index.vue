<template>
  <div class="py-6 grid grid-cols-12 px-8 gap-4">
    <div class="col-span-full justify-between flex flex-row items-center">
      <bp-header-text> Pipelines </bp-header-text>

      <bp-paginator />
    </div>

    <div class="col-span-full flex flex-col space-y-5 pt-3">
      <bp-pipeline
        v-for="(pipeline, index) in pipelines"
        :key="index"
        :pipeline="pipeline"
      >
      </bp-pipeline>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from "vue-meta";
import BpHeaderText from "@/components/typography/headerText.vue";
import BpPaginator from "@/components/common/paginator.vue";
import BpPipeline from "@/components/common/pipeline.vue";

export default defineComponent({
  name: "Index",
  layout: "Dashboard",
  components: {
    BpHeaderText,
    BpPaginator,
    BpPipeline,
  },
  setup() {
    useMeta({
      title: "Pipelines",
    });

    const pipelines = [
      {
        name: "Wallet Service",
        lastActive: "Running",
        lang: "NodeJs",
        branches: "dev, prod",
        status: "In Progress",
        color: "blue",
      },
      {
        name: "Notification Service",
        lastActive: "Last active, 3 mins ago",
        lang: "PHP",
        branches: "dev, prod",
        status: "Failed",
        color: "red",
      },
      {
        name: "Auth Service",
        lastActive: "Last active, 3 days ago",
        lang: "PHP",
        branches: "dev, prod",
        status: "Successful",
        color: "green",
      },
    ];

    return {
      pipelines,
    };
  },
});
</script>
