<template>
  <div class="py-6 grid grid-cols-12 px-8 gap-4 !h-full flex-grow">
    <div class="col-span-full flex flex-col space-y-3 h-full justify-between">
      <div class="w-full flex flex-row items-center justify-between">
        <div class="flex flex-row items-center space-x-2">
          <span @click="Logic.Common.goBack()" class="h-[32px] w-[32px] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
            <bp-icon name="angle-small-left" custom-class="h-[19px]" />
          </span>
          <bp-header-text> Build details </bp-header-text>
        </div>
      </div>
      <div class="w-full grid grid-cols-12 gap-5 pt-3 flex-grow">
        <div class="col-span-3 flex flex-col">
          <div class="w-full grid grid-cols-3">
            <bp-build :build="builds[0]"> </bp-build>
          </div>
        </div>

        <div class="col-span-9 w-full flex flex-col h-full bg-gray-300 rounded-md px-3 py-3">
          <bp-terminal :content="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMeta } from 'vue-meta';
import BpHeaderText from '@/components/typography/headerText.vue';
import BpBuild from '@/components/common/build.vue';
import BpTerminal from '@/components/common/terminal.vue';
import BpIcon from '@/components/common/icon.vue';
import { Logic } from '@/composables';

export default defineComponent({
  name: 'BuildInfo',
  layout: 'Dashboard',
  components: {
    BpHeaderText,
    BpBuild,
    BpTerminal,
    BpIcon,
  },
  middlewares: {
    fetchRules: [
      {
        domain: 'Pipeline',
        property: 'PipelineBuildData',
        method: 'GetPipelineBuild',
        params: [],
        requireAuth: false,
        ignoreProperty: true,
        useRouteId: true,
      },
    ],
  },
  setup() {
    useMeta({
      title: 'Build Info',
    });

    const buildData = Logic.Pipeline.PipelineBuildData;

    const content = ref('');

    content.value = buildData?.content || '';

    const builds = [
      {
        title: buildData?.title || '',
        branch: buildData?.branch || '',
        color: Logic.Pipeline.pipelineStatusLabel(buildData?.status || '').color,
        duration: Logic.Common.timeFromNow(parseInt(buildData?.started_at || '0')),
        percentage: '40',
        status: buildData?.status || '',
      },
    ];

    Logic.Common.socketIo.on(`${buildData?.uuid}`, data => {
      content.value = data;
    });

    return {
      builds,
      Logic,
      content,
    };
  },
});
</script>
