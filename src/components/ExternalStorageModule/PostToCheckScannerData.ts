("use strict");
// import Vue from "vue";
// const net = require("net");
export default {
  data() {
    return {
      test_api: "None",
    };
  },
  mounted() {
    // do nothing
  },
  name: "PostToCheckScannerDataComponent",
  methods: {
    postRequest() {
      this.axios
        .post(sessionStorage.getItem("apiURL") + "/test2")
        .then((response) => (this.test_api = response.data.message))
        .catch((error) => console.log(error));
    },
  },
};
