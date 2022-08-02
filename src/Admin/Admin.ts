("use strict");
// import Vue from "vue";
import SidebarComponent from "../components/Sidebar/Sidebar_index.vue";
import NavbarComponent from "../components/Navbar/Navbar_index.vue";
// const net = require("net");

export default {
  data() {
    return {
      ip: "172.20.10.2",
      port: "23",
      message: "test message",
    };
  },
  mounted() {
    // do nothing
  },
  components: {
    SidebarComponent,
    NavbarComponent,
  },
  methods: {},
};
