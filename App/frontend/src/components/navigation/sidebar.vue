<template>
  <div class="flex flex-col space-y-3 pt-8 w-full">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      @mouseover="hoverTab = tab.icon"
      @mouseleave="hoverTab = ''"
      :class="`flex flex-col`"
    >
      <router-link
        :to="tab.path"
        :class="`flex flex-row py-3 items-center px-4 space-x-3 rounded w-full ${
          tabIsActive(tab.routeTag) ? 'bg-white rounded-md' : ''
        } `"
        @click="tab.showSub ? (tab.showSub = false) : (tab.showSub = true)"
      >
        <span>
          <bp-icon
            :name="tabIsActive(tab.routeTag) ? tab.icon : `${tab.icon}_white`"
            :custom-class="` ${
              tab.icon_size ? tab.icon_size : 'lg:h-[19px] mdlg:h-[19px]'
            } `"
          />
        </span>
        <bp-normal-text
          custom-class="pt-[2px] "
          :color="`${
            tabIsActive(tab.routeTag)
              ? 'text-header font-semibold'
              : 'text-white '
          }`"
        >
          {{ tab.name }}
        </bp-normal-text>
      </router-link>
      <template v-if="tab.showSub">
        <router-link
          v-for="(sub, index) in tab.sub"
          :key="index"
          :to="sub.path"
          :class="`flex flex-row py-2 items-center px-4 space-x-3 rounded w-full ${
            tabIsActive(sub.path) ? 'bg-grey200 rounded-md' : ''
          } `"
        >
          <span
            :class="`w-[6px] h-[6px] rounded-full ${
              tabIsActive(sub.path) ? 'bg-black' : 'bg-bodyLight '
            }`"
          >
          </span>
          <bp-normal-text
            custom-class="pt-[2px] "
            :color="`${
              tabIsActive(sub.path) ? 'text-header' : 'text-bodyLight '
            }`"
          >
            {{ sub.name }}
          </bp-normal-text>
        </router-link>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import BpNormalText from "../typography/normalText.vue";
import BpIcon from "../common/icon.vue";
import { ref, defineComponent } from "vue";

export default defineComponent({
  components: {
    BpNormalText,
    BpIcon,
  },
  props: {
    tabIsActive: {
      type: Function,
      required: true,
    },
    tabs: {
      type: Array as () => any[],
    },
  },
  name: "BpSideBar",
  setup() {
    const hoverTab = ref("");

    return {
      hoverTab,
    };
  },
});
</script>
