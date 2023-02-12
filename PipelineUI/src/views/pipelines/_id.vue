<template>
  <div class="py-6 grid grid-cols-12 px-8 gap-4">
    <div class="md:col-span-8 col-span-1 flex flex-col space-y-5 items-center">
      <div class="w-full flex flex-row items-center justify-between">
        <div class="flex flex-row items-center space-x-2">
          <span
            @click="Logic.Common.goBack()"
            class="h-[32px] w-[32px] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <bp-icon name="angle-small-left" custom-class="h-[19px]" />
          </span>
          <bp-header-text> {{ PipelineData?.full_name }} </bp-header-text>
        </div>

        <bp-paginator></bp-paginator>
      </div>

      <div class="w-full grid grid-cols-9 gap-5">
        <bp-build v-for="(build, index) in builds" :key="index" :build="build">
        </bp-build>
      </div>
    </div>

    <div class="col-span-4 flex flex-col space-y-3 pb-5 pl-4">
      <div class="w-full h-[42px] flex flex-row items-center">
        <bp-header-text> Microservice Settings </bp-header-text>
      </div>
      <div
        class="w-full flex flex-col bg-gray-100 rounded-md space-y-2"
        v-for="(setting, index) in buildSettings"
        :key="index"
      >
        <div
          @click="
            setting.opened ? (setting.opened = false) : (setting.opened = true)
          "
          class="w-full py-4 px-4 border-b-[1px] border-gray-300 flex flex-row items-center justify-between cursor-pointer"
        >
          <bp-normal-text custom-class="font-semibold w-full">
            {{ setting.name }}
          </bp-normal-text>

          <bp-icon
            :name="setting.opened ? 'angle-small-up' : 'angle-small-down'"
            custom-class="h-[23px]"
          />
        </div>

        <template v-if="setting.opened">
          <div class="w-full flex flex-col space-y-3 px-4 pb-4">
            <div class="w-full flex flex-row pt-2">
              <bp-select
                :options="configOptions"
                :placeholder="'Select..'"
                :hasTitle="true"
                :is-multiple="true"
                @on-option-selected="handleSelectedConfigOptions"
                :default-values="
                  setting.configToUse.length == 0
                    ? defaultConfigToUse
                    : setting.configToUse
                "
                v-model="setting.selectedConfigToUse"
                :extra-data="index"
                :ref="`configSettings${index}`"
              >
                <template v-slot:title> Configs to use </template>
              </bp-select>
            </div>
            <template v-for="(value, key) in setting.serviceConfigs" :key="key">
              <div
                class="w-full flex flex-col"
                v-if="setting.variableToShow.includes(key.toString())"
              >
                <bp-text-field
                  :placeholder="`Enter value`"
                  v-model="setting.serviceConfigs[`${key}`]"
                  :has-title="true"
                >
                  <template v-slot:title>
                    {{ key }}
                  </template>
                </bp-text-field>
              </div>
            </template>
          </div>

          <div class="w-full flex flex-col px-4 pb-6">
            <bp-button
              padding="py-3 px-5"
              @click="updatePipelineSetting(setting)"
            >
              Save
            </bp-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { capitalize, defineComponent, ref } from "vue";
import { useMeta } from "vue-meta";
import BpHeaderText from "@/components/typography/headerText.vue";
import BpNormalText from "@/components/typography/normalText.vue";
import BpIcon from "@/components/common/icon.vue";
import BpPaginator from "@/components/common/paginator.vue";
import BpTextField from "@/components/form/textField.vue";
import BpBuild from "@/components/common/build.vue";
import BpButton from "@/components/common/button.vue";
import BpSelect from "@/components/form/select.vue";
import { Logic } from "@/composables";
import { SelectOption } from "@/modules/types";

export default defineComponent({
  name: "PipelineInfo",
  layout: "Dashboard",
  components: {
    BpHeaderText,
    BpIcon,
    BpPaginator,
    BpNormalText,
    BpTextField,
    BpBuild,
    BpButton,
    BpSelect,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Pipeline",
        property: "EachPipeline",
        method: "GetPipeline",
        params: [],
        requireAuth: false,
        ignoreProperty: true,
        useRouteId: true,
      },
    ],
  },
  setup() {
    useMeta({
      title: "Pipelines Info",
    });

    const PipelineData = Logic.Pipeline.EachPipeline;

    const configTemplateToUse = JSON.parse(
      PipelineData?.lang_config_folders || ""
    );

    const templateVariableToShow = ref<string[]>([]);

    const configOptions = ref<SelectOption[]>([]);

    for (const key in configTemplateToUse) {
      if (Object.prototype.hasOwnProperty.call(configTemplateToUse, key)) {
        configOptions.value.push({
          key,
          value: key.substring(1),
        });
      }
    }

    const buildSettings = ref<any[]>([]);

    const pipelineSettings = PipelineData?.settings;

    const variableToIgnore = ["environment", "serviceName", "imageVersion"];

    const defaultConfigToUse = ref<any>([
      "/namespaces",
      `/${PipelineData?.lang}-default`,
    ]);

    let settingsPosition = 0;
    const handleSelectedConfigOptions = (selectData: {
      selectedItems: string[];
      extraData: any;
    }) => {
      buildSettings.value[selectData.extraData].variableToShow.length = 0;

      buildSettings.value[selectData.extraData].selectedConfigToUse =
        selectData.selectedItems;

      selectData.selectedItems.forEach((configKey) => {
        configTemplateToUse[configKey].forEach((variable: string) => {
          if (
            !buildSettings.value[selectData.extraData].variableToShow.includes(
              variable
            ) &&
            !variableToIgnore.includes(variable)
          ) {
            buildSettings.value[selectData.extraData].variableToShow.push(
              variable
            );
          }
        });

        defaultConfigToUse.value = [
          "/namespaces",
          `/${PipelineData?.lang}-default`,
        ];
      });
    };

    pipelineSettings?.forEach((setting, index) => {
      const settingData = {
        name: capitalize(setting?.branch || ""),
        configToUse: JSON.parse(setting?.config_to_use || ""),
        serviceConfigs: JSON.parse(setting?.service_config || ""),
        settingUuid: setting?.uuid,
        opened: settingsPosition == 0,
        selectedConfigToUse: [],
        variableToShow: [],
        uuid: setting?.uuid,
      };

      if (settingData.configToUse.length == 0) {
        settingData.selectedConfigToUse = defaultConfigToUse.value;
      } else {
        settingData.selectedConfigToUse = settingData.configToUse;
      }

      settingData.serviceConfigs["environment"] = setting?.branch;
      settingData.serviceConfigs["serviceName"] = PipelineData?.repo_id;
      buildSettings.value.push(settingData);

      handleSelectedConfigOptions({
        selectedItems: settingData.selectedConfigToUse,
        extraData: index,
      });

      settingsPosition++;
    });

    const updatePipelineSetting = (buildSetting: any) => {
      const pipelineSettingsForm = Logic.Pipeline.UpdatePipelineSettingForm;

      pipelineSettingsForm.configToUse = JSON.stringify(
        buildSetting.selectedConfigToUse
      );
      pipelineSettingsForm.serviceConfig = JSON.stringify(
        buildSetting.serviceConfigs
      );
      pipelineSettingsForm.settingUuid = buildSetting.uuid;

      Logic.Pipeline.UpdatePipelineSetting(PipelineData?.uuid || "");
    };

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
      Logic,
      PipelineData,
      buildSettings,
      configOptions,
      templateVariableToShow,
      handleSelectedConfigOptions,
      defaultConfigToUse,
      updatePipelineSetting,
    };
  },
});
</script>
