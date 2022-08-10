("use strict");
// import Vue from "vue";
import SidebarComponent from "../components/Sidebar/Sidebar_index.vue";
import NavbarComponent from "../components/Navbar/Navbar_index.vue";
import TcpReader from "../components/TCP_Comms/TCP_Client.vue";
import TcpServer from "../components/TCP_Comms/TCP_Server.vue";
// const net = require("net");

export default {
  mounted() {
    // do nothing for now
  },
  components: {
    SidebarComponent,
    NavbarComponent,
    TcpReader,
    TcpServer,
  },
  methods: {
    // do nothing for now
  },
  watch: {
    // for debug purpose
    // watch route change, to and from are both $route Obj
    $route(to, from) {
      console.log("Going from " + "__ " + from.name); // test
      console.log("To " + "__ " + to.name); // test
    },
  },
};
