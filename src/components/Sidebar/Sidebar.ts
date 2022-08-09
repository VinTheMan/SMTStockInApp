import { computed } from "vue";

("use strict");

export default {
  data() {
    return {
      active_el: "",
    };
  },
  mounted() {
    // do nothing
  },
  watch: {
    // watch route change, to and from are both $route Obj
    $route(to, from) {
      this.active_el = to.name;
      // console.log(to.name); // test
    },
  },
  name: "SidebarComponent",
  methods: {
    // do nothing
  },
};
