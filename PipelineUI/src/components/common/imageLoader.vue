<template>
  <div
    id=""
    :class="`${customClass} blend-in `"
    style="
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    "
    :style="` ${
      imageUrl ? `background-image:url(${imageUrl});` : ''
    }  ${customStyle}`"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "BpImageLoader",
  props: {
    photoUrl: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      default: "",
    },
    customStyle: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const image = ref("");
    const imageUrl = ref("");

    const setImage = () => {
      imageUrl.value = props.photoUrl || "";

      const highResImage = new Image();

      highResImage.onload = function () {
        image.value = imageUrl.value;
      };

      highResImage.src = imageUrl.value;
    };

    onMounted(() => {
      setImage();
    });

    return {
      image,
      imageUrl,
    };
  },
});
</script>
