<template>
  <div class="py-6 grid grid-cols-12 px-8 gap-4">
    <div class="col-span-full justify-between flex flex-row items-center">
      <bp-header-text> Pipelines </bp-header-text>

      <bp-paginator />
    </div>

    <div class="col-span-full flex flex-col space-y-5 pt-3">
      <bp-pipeline v-for="(pipeline, index) in pipelines" :key="index" :pipeline="pipeline"> </bp-pipeline>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useMeta } from 'vue-meta';
import BpHeaderText from '@/components/typography/headerText.vue';
import BpPaginator from '@/components/common/paginator.vue';
import BpPipeline from '@/components/common/pipeline.vue';
import { Logic } from '@/composables';

export default defineComponent({
  name: 'PipelinesPage',
  layout: 'Dashboard',
  components: {
    BpHeaderText,
    BpPaginator,
    BpPipeline,
  },
  middlewares: {
    fetchRules: [
      {
        domain: 'Pipeline',
        property: 'Pipelines',
        method: 'GetPipelines',
        params: [],
        requireAuth: false,
      },
    ],
  },
  setup() {
    useMeta({
      title: 'Pipelines',
    });

    const AllPipelines = ref(Logic.Pipeline.Pipelines);

    const pipelines = ref<any[]>([]);

    const setPipelineData = () => {
      pipelines.value.length = 0;
      AllPipelines.value?.forEach(pipeline => {
        const allBranches = pipeline.settings?.map(branch => branch?.branch);
        const PipelineStatus = Logic.Pipeline.pipelineStatusLabel(pipeline.status || '');
        pipelines.value.push({
          name: pipeline.full_name || '',
          lastActive: Logic.Common.timeFromNow(parseInt(pipeline.updatedAt || '0')),
          lang: pipeline.lang || '',
          branches: allBranches?.join(', ') || '',
          status: PipelineStatus.status,
          color: PipelineStatus.color,
          uuid: pipeline.uuid,
        });
      });
    };

    onMounted(() => {
      Logic.Pipeline.watchProperty('Pipelines', AllPipelines);
      setPipelineData();
    });

    watch(AllPipelines, () => {
      setPipelineData();
    });

    return {
      pipelines,
    };
  },
});
</script>
