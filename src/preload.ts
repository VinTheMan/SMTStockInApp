/* eslint-disable */
const { ipcRenderer } = require("electron");
window.ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("need-clean-reply", (event, arg) => {
  console.log(arg); // 印出 "貓咪肚子餓"
});

ipcRenderer.send("take-cat-home-message", "帶小貓回家");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  ipcRenderer.on("update-message", function (event, args) {
    console.log(
      "ipcRenderer,message: " + JSON.stringify(args.message)
    );
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

  setTimeout(() => {
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
      console.log("ipcRenderer,checkForUpdate");
      ipcRenderer.send("checkForUpdate");
    } // if
  }, 3000);
});
