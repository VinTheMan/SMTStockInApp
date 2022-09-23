// eslint-disable-next-line @typescript-eslint/no-var-requires
window.ipcRenderer = require("electron").ipcRenderer;
import { ipcRenderer } from "electron";

ipcRenderer.on("update-message", function (event, args) {
  console.log("ipcRenderer,message: " + JSON.stringify(args.message));
  if ("update-not-available" === args.cmd) {
    console.log("ipcRenderer," + JSON.stringify(args.message));
  } else if ("update-available" === args.cmd) {
    console.log("ipcRenderer," + JSON.stringify(args.message));
  } else if ("update-downloaded" === args.cmd) {
    console.log("ipcRenderer,update-downloaded");
  } else if ("error" === args.cmd) {
    console.log("ipcRenderer,error," + JSON.stringify(args));
  } // if else
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  } // for

  setTimeout(() => {
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
      console.log("ipcRenderer,checkForUpdate");
      ipcRenderer.send("checkForUpdate");
    } // if
  }, 3000);
});
