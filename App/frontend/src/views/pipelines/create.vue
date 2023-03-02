<template>
  <div class="py-6 grid grid-cols-12 px-8 gap-4">
    <div class="md:col-span-12 lg:col-span-8 flex flex-col space-y-5 items-center">
      <div class="w-full flex flex-row items-center justify-between">
        <div class="flex flex-row items-center space-x-2">
          <span @click="Logic.Common.goBack()" class="h-[32px] w-[32px] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
            <bp-icon name="angle-small-left" custom-class="h-[19px]" />
          </span>
          <bp-header-text> Add new pipeline </bp-header-text>
        </div>
      </div>

      <div class="w-full flex flex-col space-y-6">
        <div class="w-full flex flex-col space-y-3">
          <bp-normal-text> Choose Git Platform </bp-normal-text>
          <div class="w-full flex flex-row whitespace-nowrap space-x-5 items-center">
            <div
              @click="Logic.Pipeline.GetWorkspaces()"
              class="w-[110px] h-[110px] cursor-pointer bg-[whitesmoke] shadow-md rounded-md py-4 px-4 flex flex-col space-y-3 items-center justify-center"
            >
              <bp-icon :name="'bitbucket'" custom-class="h-[50px]" />
              <bp-normal-text :customClass="'font-semibold'"> Bitbucket </bp-normal-text>
            </div>

            <div class="w-[110px] h-[110px] bg-[whitesmoke] shadow-md rounded-md py-4 px-4 flex flex-col space-y-3 items-center justify-center">
              <bp-icon :name="'github'" custom-class="h-[50px]" />
              <bp-normal-text :customClass="'font-semibold'"> Github </bp-normal-text>
            </div>

            <div class="w-[110px] h-[110px] bg-[whitesmoke] shadow-md rounded-md py-4 px-4 flex flex-col space-y-3 items-center justify-center">
              <bp-icon :name="'gitlab'" custom-class="h-[50px]" />
              <bp-normal-text :customClass="'font-semibold'"> Gitlab </bp-normal-text>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col space-y-3">
          <bp-normal-text> Select Workspace </bp-normal-text>
          <div class="w-full flex flex-row whitespace-nowrap space-x-5 items-center">
            <bp-select :options="workspaceOptions" :placeholder="'Select..'" v-model="workspaceId"> </bp-select>
          </div>
        </div>

        <div class="w-full flex flex-col space-y-3">
          <bp-normal-text> Select Service Repository </bp-normal-text>
          <div class="w-full flex flex-row whitespace-nowrap space-x-5 items-center">
            <bp-select :options="repositoriesOptions" :placeholder="'Select..'" :auto-complete="true" v-model="repoId"> </bp-select>
          </div>
        </div>

        <div class="w-full flex flex-col space-y-3">
          <bp-normal-text> Select Service Language/Framework </bp-normal-text>
          <div class="w-full flex flex-row whitespace-nowrap space-x-5 items-center">
            <bp-select :options="languages" :placeholder="'Select..'" v-model="selectedLang"> </bp-select>
          </div>
        </div>

        <div class="w-full flex flex-row items-center justify-start">
          <bp-button padding="py-3 px-5" @click="createServicePipeline()"> Add pipeline </bp-button>
        </div>

        <div class="w-full flex flex-col space-y-3">
          <bp-normal-text> Setting up Pipeline </bp-normal-text>
          <div class="w-full h-[500px]">
            <bp-terminal :content="pipelineContent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useMeta } from 'vue-meta';
import BpHeaderText from '@/components/typography/headerText.vue';
import BpNormalText from '@/components/typography/normalText.vue';
import BpIcon from '@/components/common/icon.vue';
import BpSelect from '@/components/form/select.vue';
import { Logic } from '@/composables';
import BpButton from '@/components/common/button.vue';
import { SelectOption } from '@/modules/types';
import BpTerminal from '@/components/common/terminal.vue';

export default defineComponent({
  name: 'CreatePipeline',
  layout: 'Dashboard',
  components: {
    BpHeaderText,
    BpIcon,
    BpNormalText,
    BpSelect,
    BpButton,
    BpTerminal,
  },
  setup() {
    useMeta({
      title: 'Add new pipeline',
    });

    const repositoriesOptions = ref<SelectOption[]>([]);
    const workspaceOptions = ref<SelectOption[]>([]);
    const workspaceId = ref('');
    const repoId = ref('');
    const selectedLang = ref('');
    const languages = [
      {
        key: 'php',
        value: 'PHP',
      },
      {
        key: 'nodejs',
        value: 'NodeJs',
      },
    ];

    const Workspaces = ref(Logic.Pipeline.Workspaces);
    const Repositories = ref(Logic.Pipeline.Repositories);

    const pipelineContent = ref('');

    onMounted(() => {
      Logic.Pipeline.watchProperty('Workspaces', Workspaces);
      Logic.Pipeline.watchProperty('Repositories', Repositories);
    });

    const setWorkspaceOptions = () => {
      workspaceOptions.value.length = 0;
      Workspaces.value?.forEach(workspace => {
        workspaceOptions.value.push({
          key: workspace.slug,
          value: workspace.name,
        });
      });
    };

    const setRepositoryOptions = () => {
      repositoriesOptions.value.length = 0;
      Repositories.value?.forEach(repository => {
        repositoriesOptions.value.push({
          key: repository.slug,
          value: repository.name,
        });
      });
    };

    watch(Workspaces, () => {
      setWorkspaceOptions();
    });

    watch(Repositories, () => {
      setRepositoryOptions();
    });

    watch(workspaceId, () => [Logic.Pipeline.GetRepositories(workspaceId.value)]);

    const createServicePipeline = () => {
      const selectedRepository = Repositories.value?.filter(repo => repo.slug == repoId.value);
      if (selectedRepository?.length) {
        const createPipelineForm = Logic.Pipeline.CreatePipelineForm;
        createPipelineForm.lang = selectedLang.value;
        createPipelineForm.repoDescription = selectedRepository[0].description
          ? selectedRepository[0].description
          : `${selectedRepository[0].name} repository`;
        createPipelineForm.repo_name = selectedRepository[0].name;
        createPipelineForm.workspaceId = workspaceId.value;
        createPipelineForm.repoId = repoId.value;

        Logic.Pipeline.CreateServicePipeline(true)?.then(() => {
          Logic.Common.socketIo.on(`${repoId.value}`, data => {
            pipelineContent.value = data;
          });
        });
      }
    };

    return {
      Logic,
      repositoriesOptions,
      workspaceOptions,
      languages,
      workspaceId,
      repoId,
      selectedLang,
      createServicePipeline,
      pipelineContent,
    };
  },
});
</script>
