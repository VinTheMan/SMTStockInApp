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
});
