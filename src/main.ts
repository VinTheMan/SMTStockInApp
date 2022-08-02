// import { createApp } from 'vue';
import { createApp } from "vue/dist/vue.esm-bundler";
import App from "./App.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { faBell } from "@fortawesome/free-regular-svg-icons";

import TCPReader from "./components/TCP_Client.vue";
import TCPServer from "./components/TCP_Server.vue";
import AdminTemplate from "./Admin/layout_index.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "../src/Admin/Admin.css";
// import "../src/assets/css/app.css";

/* add icons to the library */
library.add(faBell);

createApp({
  components: {
    app: App,
    "font-awesome-icon": FontAwesomeIcon,
    "admin-template": AdminTemplate,
    "tcp-reader": TCPReader,
    "tcp-server": TCPServer,
  },
})
  .use(router)
  .mount("#mountingPoint");
