("use strict");
// import Vue from "vue";
import { ipcRenderer } from "electron";
import { GlobalVar } from "./../../GlobalVar";
import SidebarComponent from "../components/Sidebar/Sidebar_index.vue";
import NavbarComponent from "../components/Navbar/Navbar_index.vue";
import TcpReader from "../components/TCP_Comms/TCP_Client.vue";
import TcpServer from "../components/TCP_Comms/TCP_Server.vue";
import Qrcodeger from "../components/Qrcode_ger/Qrcode_ger.vue";
import axios from "axios";
import { networkInterfaces } from "os";
const nets: any = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object
// const net = require("net");

export default {
  async beforeCreate() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appVer: string = await ipcRenderer.invoke("getAppVer");
    sessionStorage.setItem("appVer", appVer as string);
    if (appVer?.indexOf("beta") !== -1) {
      sessionStorage.setItem("apiURL", GlobalVar.API_URL_DEV as string);
    } // if
    else {
      sessionStorage.setItem("apiURL", GlobalVar.API_URL_PRODUCTION as string);
    } // else
    let nrName = "";
    for (const name of Object.keys(nets)) {
      // get the ipv4 address of this computer
      for (const nr of nets[name]) {
        // find self ipv4 address
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof nr.family === "string" ? "IPv4" : 4;
        if (nr.family === familyV4Value && !nr.internal) {
          if (!results[name]) {
            results[name] = [];
          } // if
          results[name].push(nr.address);

          if (nrName === "") {
            nrName = name;
          } // if
        } // if
      } // for
    } // for

    // when init, get a token before everything else
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    axios
      .post(
        sessionStorage.getItem("apiURL") + "/registerUserByIP",
        {
          name: results[nrName][0],
          password: results[nrName][0],
        },
        { headers: headers }
      )
      .then(async function (response) {
        sessionStorage.setItem(
          "apiKey",
          await ipcRenderer.invoke("EncryptApiToken", response.data.token)
        );
      })
      .catch((error) => console.log(error));
  },
  mounted() {
    // do nothing for now
    if (sessionStorage.getItem("rNo") !== null) {
      const connect = document.getElementById("orderconnect");
      if (connect !== null) {
        connect.style.display = "block";
      }
    }
  },
  components: {
    SidebarComponent,
    NavbarComponent,
    TcpReader,
    TcpServer,
    Qrcodeger,
  },
  methods: {
    // do nothing for now
  },
  watch: {
    // for debug purpose
    // watch route change, to and from are both $route Obj
    $route(to, from) {
      // console.log("Going from " + "__ " + from.name); // test
      // console.log("To " + "__ " + to.name); // test
    },
  },
};
