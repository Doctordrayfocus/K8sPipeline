<template>
  <div
    class="h-auto w-full flex flex-row bg-[#0f111e] min-h-screen lg:text-sm mdlg:text-[12px] text-xs"
  >
    <div class="w-[17%] h-screen flex flex-col pt-5 px-6 fixed top-0 left-0">
      <div class="flex flex-col space-y-6 items-center justify-center">
        <bp-header-text color="text-white" size="xl">
          K8sPipeline
        </bp-header-text>

        <bp-side-bar :tabIsActive="tabIsActive" :tabs="tabs" />
      </div>
    </div>
    <div class="w-[83%] ml-[17%] flex flex-col h-full min-h-screen pr-5">
      <div
        class="w-full py-4 sticky top-0 flex flex-row items-center justify-between bg-[#0f111e] z-[9000]"
      >
        <div
          class="w-[30%] rounded-md bg-white flex flex-row space-x-3 items-center px-3 py-3"
        >
          <bp-icon name="search" custom-class="h-[18px]" />
          <input
            type="text"
            class="focus:outline-none bg-transparent placeholder:text-slate-800 px-3 border-l-[1px] border-gray-500 flex-grow"
            placeholder="Find builds or pipelines ..."
          />
        </div>

        <div class="flex flex-row items-center space-x-8">
          <bp-button
            bg-color="bg-white"
            text-color="text-black"
            custom-class="font-semibold"
            padding="py-3 px-5"
            @click="Logic.Common.GoToRoute('/pipelines/create')"
          >
            Add new pipeline
          </bp-button>
          <span
            class="px-4 py-3 rounded-md bg-white flex items-center justify-center"
          >
            <bp-icon name="bell" custom-class="h-[20px]" />
          </span>
          <bp-avatar :photo-url="''" :size="'46'">A</bp-avatar>
        </div>
      </div>
      <div
        class="col-span-12 bg-white rounded-tl-2xl h-full flex-grow flex flex-col justify-between"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BpHeaderText from "@/components/typography/headerText.vue";
import BpIcon from "@/components/common/icon.vue";
import BpButton from "@/components/common/button.vue";
import BpAvatar from "@/components/common/avatar.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import BpSideBar from "@/components/navigation/sidebar.vue";
import { Logic } from "@/composables";

export default {
  name: "DashboardLayout",
  components: {
    BpHeaderText,
    BpIcon,
    BpButton,
    BpAvatar,
    BpSideBar,
  },
  setup() {
    const router = useRouter();

    const selectedTab = ref("");

    const goBack = () => {
      window.history.length > 1 ? router.go(-1) : router.push("/");
    };

    const tabIsActive = (tabName: string) => {
      const mainName = tabName;

      if (mainName == "base" && router.currentRoute.value.path == "/") {
        return true;
      } else if (
        mainName != "base" &&
        router.currentRoute.value.path.includes(mainName)
      ) {
        selectedTab.value = mainName;
        return true;
      }

      return false;
    };

    const tabs = ref<any[]>([
      {
        name: "Pipelines",
        path: "/pipelines",
        icon: "pipelines",
        routeTag: "pipelines",
        icon_size: "lg:h-[20px] mdlg:h-[29px]",
      },
      {
        name: "Builds",
        path: "/builds",
        icon: "builds",
        routeTag: "builds",
        icon_size: "lg:h-[20px] mdlg:h-[29px]",
      },
    ]);

    return {
      tabIsActive,
      tabs,
      goBack,
      Logic,
    };
  },
};
</script>
