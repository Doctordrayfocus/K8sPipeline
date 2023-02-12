<template>
  <div class="flex w-full flex-col relative">
    <bp-normal-text
      v-if="hasTitle"
      :customClass="`!pb-2 !font-semibold ${
        labelStyle ? labelStyle : ''
      } !text-lightBlack`"
    >
      <slot name="title" /><sup
        class="text-primaryOrange px-1"
        v-if="fieldIsRequired"
        >*</sup
      >
    </bp-normal-text>
    <div
      class="w-full flex flex-row items-center"
      :tabindex="tabIndex"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <slot name="outer-prefix" />
      <div
        :class="`flew-grow w-full space-x-1 flex-row flex items-center justify-between ${padding} ${customClass} border-[#E4E4E4] !border-[1px]  bg-white rounded-[8px] ${
          isFocused ? 'border-primaryOrange ' : ''
        } ${validationStatus == false ? '!border-primaryRed ' : ''}`"
      >
        <slot name="inner-prefix" />
        <input
          v-model="content"
          :placeholder="placeholder"
          @focus="isFocused = true"
          @blur="
            isFocused = false;
            checkValidation();
          "
          @keypress="isNumber"
          @keydown="applyContentRule"
          :disabled="fieldType == 'date' ? true : disabled"
          :type="fieldType == 'date' ? 'text' : fieldType"
          :class="` text-lightBlack flex-grow bg-transparent placeholder-primaryGray focus input w-full focus:outline-none  `"
        />
        <slot name="inner-suffix" />
        <bp-icon
          :name="`${fieldType == 'password' ? 'show' : 'hide'}`"
          :customClass="`${fieldType == 'password' ? 'h-[12px]' : 'h-[15px]'}`"
          v-if="type == 'password'"
          @click.stop="
            fieldType == 'password'
              ? (fieldType = 'text')
              : (fieldType = 'password')
          "
        />
        <span class="pr-1" v-if="fieldType == 'date'">
          <bp-icon name="calendar" custom-class="h-[18px] cursor-pointer" />
        </span>
      </div>
      <slot name="outer-suffix" />
    </div>
    <div
      v-if="!validationStatus"
      class="w-full flex flex-row pt-1 justify-start"
    >
      <bp-normal-text :customClass="' text-left'" :color="`text-primaryRed`">
        {{ errorMessage }}
      </bp-normal-text>
    </div>
  </div>
</template>
<script lang="ts">
import BpNormalText from "../typography/normalText.vue";
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
import BpIcon from "../common/icon.vue";

import { FormRule, FormContentRule } from "@/modules/types";

export default defineComponent({
  components: {
    BpNormalText,
    BpIcon,
  },
  props: {
    padding: {
      type: String,
      default: "py-3 px-3",
    },
    placeholder: {
      type: String,
      default: "",
    },
    customClass: {
      type: String,
      default: "",
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Object as () => FormRule[],
      required: false,
    },
    modelValue: {
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    updateValue: {
      type: String,
      default: "",
    },
    isFormatted: {
      type: Boolean,
      default: false,
    },
    labelStyle: {
      type: String,
      default: "",
    },
    contentRule: {
      type: Object as () => FormContentRule,
      required: false,
    },
  },
  name: "BpTextField",
  emits: ["update:modelValue"],
  setup(props: any, context: any) {
    const content = ref("");

    const fieldType = ref("text");

    const fieldIsRequired = ref(false);

    const updateValueRef = toRef(props, "updateValue");

    const selectedDate = ref("");

    watch(content, () => {
      context.emit("update:modelValue", content.value);
      setTimeout(() => {
        checkValidation();
      }, 500);
    });

    onMounted(() => {
      if (props.modelValue) {
        content.value = props.modelValue;
      }
      if (props.type) {
        fieldType.value = props.type;
      }
      // check if it is required
      if (props.rules) {
        const requiredRule = props.rules.filter((rule: any) => {
          return rule.type == "isRequired";
        });

        if (requiredRule.length > 0) {
          fieldIsRequired.value = true;
        }
      }
    });
    const validationStatus = ref(true);
    const errorMessage = ref("");

    const isRequired = () => {
      if (content.value) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = `${props.name} is required`;
      }
    };

    const isGreaterThan = (count: number) => {
      if (content.value.length > count) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = `${props.name} must be more than ${count} characters`;
      }
    };

    const isLessThan = (count: number) => {
      if (content.value.length < count) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = `${props.name} must be less than ${count} characters`;
      }
    };

    const isEqualsTo = (count: number) => {
      if (content.value.length == count) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = `${props.name} must be ${count} characters`;
      }
    };

    const isCondition = (condition: any, errMsg: string) => {
      if (condition) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = errMsg;
      }
    };

    const isGreaterThanOrEqualsTo = (count: number) => {
      if (content.value.length >= count) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = `${props.name} must be more than ${
          count - 1
        } characters`;
      }
    };

    const isLessThanOrEqualsTo = (count: number) => {
      if (content.value.length <= count) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = `${props.name} must be less than ${
          count + 1
        } characters`;
      }
    };

    const isRegex = (regex: any, errMsg: string) => {
      if (content.value.match(regex)) {
        validationStatus.value = true;
      } else {
        validationStatus.value = false;
        errorMessage.value = errMsg;
      }
    };

    const checkValidation = () => {
      if (props.rules) {
        for (let index = 0; index < props.rules.length; index++) {
          const rule = props.rules[index];
          if (rule.type == "isRequired") {
            isRequired();
          }

          if (rule.type == "isGreaterThan") {
            isGreaterThan(rule.value);
          }

          if (rule.type == "isLessThan") {
            isLessThan(rule.value);
          }

          if (rule.type == "isEqualsTo") {
            isEqualsTo(rule.value);
          }

          if (rule.type == "isGreaterThanOrEqualsTo") {
            isGreaterThanOrEqualsTo(rule.value);
          }

          if (rule.type == "isLessThanOrEqualsTo") {
            isLessThanOrEqualsTo(rule.value);
          }

          if (rule.type == "isRegex") {
            isRegex(rule.value, rule.errorMessage);
          }

          if (rule.type == "isCondition") {
            isCondition(rule.value, rule.errorMessage);
          }
        }
      }
    };

    watch(content, () => {
      checkValidation();
    });

    watch(updateValueRef, () => {
      if (props.updateValue) {
        content.value = props.updateValue;
      }
    });

    const isNumber = (evt: any) => {
      if (props.type != "tel") return true;

      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    };

    const contentCharacterStop = ref(0);

    const applyContentRule = (evt: any) => {
      if (props.contentRule) {
        evt = evt ? evt : window.event;
        var charCode = evt.which ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode != 8) {
          if (content.value.length >= props.contentRule.max) {
            evt.preventDefault();
            return;
          }

          if (
            content.value.length != 0 &&
            content.value.length % props.contentRule.addAfterCount ==
              contentCharacterStop.value
          ) {
            content.value += props.contentRule.characterToAdd;
            if (
              contentCharacterStop.value >=
              props.contentRule.addAfterCount - 1
            ) {
              contentCharacterStop.value = 0;
            } else {
              contentCharacterStop.value++;
            }
          }
        }
      }
      return true;
    };

    const showError = (message: string) => {
      validationStatus.value = false;
      errorMessage.value = message;
    };

    const isFocused = ref(false);

    const tabIndex = Math.random();

    return {
      content,
      checkValidation,
      isNumber,
      errorMessage,
      validationStatus,
      showError,
      isFocused,
      tabIndex,
      fieldType,
      fieldIsRequired,
      selectedDate,
      applyContentRule,
    };
  },
});
</script>
