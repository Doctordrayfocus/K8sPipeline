<template>
  <div :class="`flex flex-col space-y-2 ${defaultSize} `">
    <bp-normal-text v-if="hasTitle" :customClass="`!font-semibold ${labelStyle ? labelStyle : ''} !text-lightBlack`">
      <slot name="title" />
      <!-- <sup class="text-primaryOrange px-1">*</sup> -->
    </bp-normal-text>
    <div
      :class="`flex relative flex-row items-center space-x-1 justify-between w-full  ${customClass} border-[#E4E4E4] !border-[1px] !rounded-[8px] bg-white ${paddings}`"
      :id="'container' + tabIndex"
      @focus="
        showOption = true;
        isFocused = true;
        ShowSelectModal = true;
        hasAutoComplete = true;
      "
      @blur="
        isFocused = false;
        hideOptions();
      "
      :tabindex="tabIndex"
      @click="showAutoComplete()"
    >
      <input
        ref="select"
        :value="withKey ? valueData : textValue"
        :placeholder="placeholder"
        v-if="!isMultiple"
        disabled
        :class="` !text-lightBlack flex-grow bg-transparent placeholder-lightBlack focus input w-full focus:outline-none  focus:border-primaryOrange`"
      />
      <div
        v-else
        class="w-full flex flex-row whitespace-nowrap overflow-x-auto scrollbar-hide space-x-2 focus"
        :id="`mutipleItemContainer` + tabIndex"
      >
        <bp-badge :color="'newgray'" v-for="(option, index) in selectedItems" :key="index">{{ getSelectedOption(option) }}</bp-badge>
      </div>
      <span class="pr-1">
        <bp-icon
          @click.stop="
            showOption = true;
            isFocused = true;
          "
          name="angle-small-down"
          custom-class="md:h-[19px] h-[15px] cursor-pointer"
        />
      </span>

      <div
        v-if="showOption && hasAutoComplete"
        @click.stop="null"
        class="w-full flex flex-col abolute top-[101%] left-0 bg-white z-50 max-h-[300px] overflow-y-auto rounded-md pb-3 px-3 shadow-md absolute"
      >
        <div class="w-full py-2 sticky top-0 bg-white flex flex-row items-center justify-between" v-if="autoComplete">
          <bp-text-field placeholder="Search" v-model="searchValue" custom-class="w-full !border-none !border-b-[1px] !bg-[whitesmoke]">
          </bp-text-field>
          <span
            class="pl-3 cursor-pointer"
            @click.stop="
              showOption = false;
              hasAutoComplete = false;
            "
          >
            <bp-icon :name="'cross-circle'" :customClass="'h-[19px]'" />
          </span>
        </div>
        <div class="w-full flex flex-row py-2 bg-white" v-if="!autoComplete"></div>
        <div
          class="py-3 px-3 w-full flex flex-row items-center hover:bg-gray-100 cursor-pointer"
          v-for="(item, index) in searchResult"
          :key="index"
          @click.stop="selectValue(item)"
        >
          <template v-if="isMultiple">
            <div class="w-full flex flex-row space-x-3 items-center">
              <bp-icon :name="itemIsSelected(item.key) ? 'checkbox-active' : 'checkbox'" custom-class="h-[16px]" />
              <bp-normal-text>
                {{ item.value }}
              </bp-normal-text>
            </div>
          </template>
          <bp-normal-text v-else>
            {{ item.value }}
          </bp-normal-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { capitalize, defineComponent, onMounted, ref, toRef, watch } from 'vue';
import BpIcon from '../common/icon.vue';
import BpNormalText from '../typography/normalText.vue';
import BpTextField from './textField.vue';
import BpBadge from '@/components/common/badge.vue';
import { SelectOption } from '@/modules/types';
import { Logic } from '@/composables';

export default defineComponent({
  name: 'BpSelect',
  components: {
    BpIcon,
    BpNormalText,
    BpTextField,
    BpBadge,
  },
  props: {
    withKey: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: Array as () => SelectOption[],
    },
    paddings: {
      type: String,
      default: 'py-4 px-3',
    },
    padding: {
      type: String,
      default: 'py-4 px-3',
    },
    customClass: {
      type: String,
      default: '',
    },
    defaultValues: {
      type: Array as () => string[],
      default: () => {
        return [];
      },
    },
    modelValue: {
      type: String || Array,
      default: false,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    defaultSize: {
      type: String,
      default: 'w-full',
    },
    autoComplete: {
      type: Boolean,
      default: false,
    },
    usePlaceHolder: {
      type: Boolean,
      default: true,
    },
    action: {
      type: Function,
      required: false,
    },
    actionLabel: {
      type: String,
      default: 'Done',
    },
    labelStyle: {
      type: String,
      default: '',
    },
    disablePropWatch: {
      type: Boolean,
      default: false,
    },
    hasConfirmation: {
      type: Boolean,
      default: false,
    },
    extraData: {
      type: Object as () => any,
    },
  },
  emits: ['update:modelValue', 'OnOptionSelected', 'OnSearch'],
  setup(props: any, context: any) {
    const isFocused = ref(false);
    const showOption = ref(false);

    const tabIndex = Math.random();

    const ShowSelectModal = ref(false);

    const OptionRef = ref<SelectOption[]>([]);

    const searchResult = ref<SelectOption[]>([]);

    const hasAutoComplete = ref(false);

    const selectedKey = ref();

    const valueData = ref('');

    const textValue = ref('');

    const searchValue = ref('');

    const selectOptions = ref<any[]>([]);

    const showAutoComplete = () => {
      if (props.autoComplete) {
        hasAutoComplete.value = true;
      }
    };

    const hideOptions = () => {
      if (!props.autoComplete) {
        showOption.value = false;
      }
    };

    const prepareSelectOptions = () => {
      selectOptions.value.length = 0;

      if (Array.isArray(searchResult.value)) {
        searchResult.value.forEach((item: any) => {
          selectOptions.value.push({
            key: item.key,
            value: `${item.value}${props.withKey ? ` (${item.key})` : ''}`,
            hasIcon: item.hasIcon ? item.hasIcon : false,
            extras: item.extras ? item.extras : '',
            isImage: item.isImage ? item.isImage : false,
            isForm: item.isForm ? item.isForm : false,
            formField: item.formField ? item.formField : [],
          });
        });
      }
    };

    watch(selectedKey, () => {
      if (selectedKey.value != 0) {
        const selectedOption = searchResult.value.filter((eachItem: any) => {
          return eachItem.key == selectedKey.value;
        });
        selectValue(selectedOption[0]);
      }
    });

    const selectedItems = ref<any>([]);

    watch(props, () => {
      if (props.options) {
        OptionRef.value = props.options;
      }
      if (props.modelValue) {
        selectedKey.value = props.modelValue;
      }
      prepareSelectOptions();
    });

    onMounted(() => {
      if (props.defaultValues.length > 0) {
        const defaultVaule = toRef(props, 'defaultValues');
        selectedItems.value = defaultVaule.value;
      }
      if (props.options) {
        OptionRef.value = props.options;
        searchResult.value = props.options;
      }

      if (props.autoComplete) {
        hasAutoComplete.value = props.autoComplete;
      }

      if (props.modelValue) {
        const selectedOption = searchResult.value.filter((eachItem: any) => {
          return eachItem.key == props.modelValue;
        });
        selectedKey.value = props.modelValue;
        if (selectedOption.length > 0) {
          selectValue(selectedOption[0]);
        }
      }
      prepareSelectOptions();
    });

    const itemIsSelected = (inputKey: string) => {
      const item = selectedItems.value.filter((key: any) => {
        return key == inputKey;
      });

      return item.length > 0;
    };

    const selectValue = (option: any) => {
      if (!option) return;
      if (props.autoComplete) {
        context.emit('OnOptionSelected', option.key);

        isFocused.value = false;
        showOption.value = false;
        hasAutoComplete.value = false;

        if (props.withKey) {
          valueData.value = option.key;
        } else {
          valueData.value = option.value;
          textValue.value = option.value;
        }

        context.emit('update:modelValue', option.key);

        document.getElementById('container' + tabIndex)?.blur();

        if (!props.hasConfirmation) {
          ShowSelectModal.value = false;
        }
        return;
      }
      if (props.isMultiple) {
        if (itemIsSelected(option.key)) {
          selectedItems.value = selectedItems.value.filter((key: any) => {
            return key != option.key;
          });

          document.getElementById('mutipleItemContainer' + tabIndex)?.scrollTo({
            left: 8000,
          });

          context.emit('OnOptionSelected', {
            selectedItems: selectedItems.value,
            extraData: props.extraData,
          });

          return;
        }

        selectedItems.value.push(option.key);

        document.getElementById('mutipleItemContainer' + tabIndex)?.scrollTo({
          left: 8000,
        });
        // context.emit("update:modelValue", selectedItems.value);
        context.emit('OnOptionSelected', {
          selectedItems: selectedItems.value,
          extraData: props.extraData,
        });
      } else {
        context.emit('update:modelValue', option.key);
        context.emit('OnOptionSelected', option.key);
        if (props.withKey) {
          valueData.value = option.key;
        } else {
          valueData.value = option.value;
          textValue.value = option.value;
        }
        isFocused.value = false;
        showOption.value = false;

        document.getElementById('container' + tabIndex)?.blur();

        if (!props.hasConfirmation) {
          ShowSelectModal.value = false;
        }
      }
    };

    const getSelectedOption = (keyValue: any) => {
      const option = searchResult.value.filter((eachItem: any) => {
        return eachItem.key == keyValue;
      });

      return option[0].value;
    };

    const searchOption = () => {
      if (props.autoComplete && searchValue.value) {
        searchResult.value = Logic.Common.searchArray(OptionRef.value, capitalize(searchValue.value));
      } else {
        searchResult.value = props.options;
      }
    };

    watch(searchValue, () => {
      searchOption();
    });

    watch(OptionRef, () => {
      searchOption();
    });

    watch(searchResult, () => {
      prepareSelectOptions();
    });

    return {
      showOption,
      valueData,
      isFocused,
      selectValue,
      tabIndex,
      textValue,
      itemIsSelected,
      selectedItems,
      getSelectedOption,
      ShowSelectModal,
      selectOptions,
      selectedKey,
      searchValue,
      searchResult,
      hasAutoComplete,
      showAutoComplete,
      hideOptions,
    };
  },
});
</script>
