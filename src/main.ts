// import { createApp } from 'vue';
import { createApp } from "vue/dist/vue.esm-bundler";
import { createI18n } from "vue-i18n";
import enUS from "./locales/en-US.json";
import zhTW from "./locales/zh-TW.json";
import zhCN from "./locales/zh-CN.json";

import App from "./App.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { faBell } from "@fortawesome/free-regular-svg-icons";

import AdminTemplate from "./Admin/layout_index.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "../src/Admin/Admin.css";
// import "../src/assets/css/app.css";

/* add icons to the library */
library.add(faBell);

// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof enUS;

const i18n = createI18n<[MessageSchema], "en-US" | "zh-TW" | "zh-CN">({
  locale: "en-US",
  messages: {
    "en-US": enUS,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
  },
});

createApp({
  components: {
    app: App,
    "font-awesome-icon": FontAwesomeIcon,
    "admin-template": AdminTemplate,
  },
})
  .use(i18n)
  .use(router)
  .mount("#mountingPoint");
