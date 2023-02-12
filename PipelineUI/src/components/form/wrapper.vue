<template>
  <form>
    <slot />
  </form>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  components: {},
  props: {
    parentRefs: {
      required: true,
    },
  },
  name: "BpFormWrapper",
  setup(props: any) {
    const formWrapper = ref<any>(null);

    const fieldsToValidate = ref<any[]>();

    watch(props, () => {
      fieldsToValidate.value = props.parentRefs;
    });

    const validate = () => {
      let formIsValid = true;
      for (const key in fieldsToValidate.value) {
        const componentName: any = key;
        const element = fieldsToValidate.value[componentName];
        if (element) {
          if ("checkValidation" in element) {
            element.checkValidation();
            formIsValid = formIsValid && element.validationStatus;
          }
        }
      }
      return formIsValid;
    };

    return {
      formWrapper,
      validate,
      fieldsToValidate,
    };
  },
});
</script>
