<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts">
import AppLayoutDefault from './AppLayoutDefault.vue';
import { shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import Dashboard from './Dashboard.vue';

export default {
  name: 'AppLayout',
  setup() {
    const layout = shallowRef<any>();
    const route = useRoute();

    watch(
      () => route.meta,
      async meta => {
        try {
          if (meta.layout) {
            const component = meta.layout;
            if (component == 'Dashboard') {
              layout.value = Dashboard;
            }
          }
        } catch (e) {
          layout.value = AppLayoutDefault;
        }
      },
      { immediate: true },
    );
    return { layout };
  },
};
</script>
