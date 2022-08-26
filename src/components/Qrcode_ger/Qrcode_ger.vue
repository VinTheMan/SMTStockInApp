<template>
  <qrcode-vue :value="value" :size="size" level="H" />
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import QrcodeVue from "qrcode.vue";
export default {
  name: "qrcode-ger",
  props: {
    value: {
      type: String,
      require: true,
    },
    size: {
      type: Number,
      default: 100,
    },
  },
  components: {
    QrcodeVue,
  },
  setup(props) {
    const state = reactive({
      value: props.value,
      size: props.size,
    });
    return {
      ...toRefs(state),
    };
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!"
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
};
</script>
