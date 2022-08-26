("use strict");
/* eslint-disable */
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
import { AppUpdater } from "./js/update";

import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
// import { text } from 'body-parser'
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");

ipcMain.on("take-cat-home-message", (event, arg) => {
  console.log(arg); // prints "帶小貓回家"
  event.reply("need-clean-reply", "貓咪肚子餓");
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration:
        process.env.ELECTRON_NODE_INTEGRATION?.toString().toLowerCase() ===
        "true",
      contextIsolation: !(
        process.env.ELECTRON_NODE_INTEGRATION?.toString().toLowerCase() ===
        "true"
      ),
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    AppUpdater.getInstance().init(win); // fireup the updater
  } // if else
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
      // await installExtension(VUEJS3_DEVTOOLS, {
      //   loadExtensionOptions: {
      //     allowFileAccess: true,
      //   },
      // });
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    } // try-catch
  }

  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error);
});
