import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import { NsisUpdater } from "electron-updater";
import { AllPublishOptions } from "builder-util-runtime";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const log = require("electron-log");

export class AppUpdater {
  mainWindow: BrowserWindow | null | undefined;
  nsisUpdater: NsisUpdater;

  private static instance: AppUpdater = new AppUpdater();
  public static getInstance() {
    return this.instance;
  } // getter

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appVer: string = app.getVersion();

    let platform = "";
    let arch = "";

    if (process.platform === "darwin") {
      platform = "osx";
      if (process.arch === "arm64") {
        arch = "arm64";
      } else {
        arch = "64";
      } // else
    } else if (process.platform === "win32") {
      platform = "windows";
      if (process.arch === "x64") {
        arch = "64";
      } else {
        arch = "32";
      } // else
    } else if (process.platform === "linux") {
      platform = "linux";
      if (process.arch === "x64" || process.arch === "x86_64") {
        arch = "64";
      } else {
        arch = "32";
      } // else
    } // else if

    const updateServerUrl: string =
      appVer.indexOf("beta") !== -1 // if the version has trailing "beta" tag
        ? "http://192.168.164.51:5000/update/" + platform + arch + "/beta"
        : "http://172.22.252.160:5000/update/" + platform + arch + "/stable";
    const options: AllPublishOptions = {
      // requestHeaders: {
      //   // Any request headers to include here
      // },
      provider: "generic",
      url: updateServerUrl,
    };

    this.nsisUpdater = new NsisUpdater(options);
    // this.nsisUpdater.addAuthHeader(`Bearer ${token}`);
  } // constructor

  sendUpdateMessage(text: any) {
    this.mainWindow?.webContents.send("update-message", text);
  } // sendUpdateMessage

  init(window: BrowserWindow) {
    console.log("ipcMain-update,init");
    this.mainWindow = window;

    //-------------------------------------------------------------------
    // Logging
    //
    // THIS SECTION IS NOT REQUIRED
    //
    // This logging setup is not required for auto-updates to work,
    // but it sure makes debugging easier :)
    //-------------------------------------------------------------------
    log.transports.file.level = "info";
    this.nsisUpdater.logger = log;
    log.info("App starting...");
    log.info("version: " + app.getVersion());
    this.sendUpdateMessage({
      cmd: "starting",
      message: "current version: " + app.getVersion(),
    });

    //-------------------------------------------------------------------
    // Define the menu
    //
    // THIS SECTION IS NOT REQUIRED
    //-------------------------------------------------------------------
    const template: any[] = [];
    if (process.platform === "darwin") {
      // OS X
      const name = app.getName();
      template.unshift({
        label: name,
        submenu: [
          {
            label: "About " + name,
            role: "about",
          },
          {
            label: "Quit",
            accelerator: "Command+Q",
            click() {
              app.quit();
            },
          },
        ],
      });
    } // define the menu

    //-------------------------------------------------------------------
    // Open a window that displays the version
    //
    // THIS SECTION IS NOT REQUIRED
    //
    //
    // This isn't required for auto-updates to work, but it's easier
    // for the app to show a window than to have to click "About" to see
    // that updates are working.
    //-------------------------------------------------------------------
    let win;

    function sendStatusToWindow(text) {
      log.info(text);
      // win.webContents.send("message", text);
    } // sendStatusToWindow

    function createDefaultWindow() {
      win = new BrowserWindow();
      win.webContents.openDevTools();
      win.on("closed", () => {
        win = null;
      });
      win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
      return win;
    } // createDefaultWindow

    //-------------------------------------------------------------------
    // Auto updates
    //
    // For details about these events, see the Wiki:
    // https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
    //
    // The app doesn't need to listen to any events except `update-downloaded`
    //
    // Uncomment any of the below events to listen for them.  Also,
    // look in the previous section to see them being used.
    //-------------------------------------------------------------------
    this.nsisUpdater.on("update-available", (info) => {
      sendStatusToWindow("Update available.");
      console.log("ipcMain-update,update-available");
      this.sendUpdateMessage({
        cmd: "update-available",
        message: "new version found",
      });
    });
    this.nsisUpdater.on("update-not-available", (info) => {
      console.log("ipcMain-update,update-not-available");
      sendStatusToWindow("Update not available.");
      this.sendUpdateMessage({
        cmd: "update-not-available",
        message: "has not found any updates",
      });
    });
    this.nsisUpdater.on("checking-for-update", () => {
      sendStatusToWindow("Checking for update...");
    });
    this.nsisUpdater.on("error", (ev, err) => {
      sendStatusToWindow("Error in auto-updater.");
      this.sendUpdateMessage({
        cmd: "error",
        message: err,
      });

      setTimeout(function () {
        // retry after 10 minutes
        this.nsisUpdater.checkForUpdates();
      }, 600000);
    });
    this.nsisUpdater.on("download-progress", (progressInfo) => {
      sendStatusToWindow("Download progress...");
    });
    this.nsisUpdater.on("update-downloaded", (event) => {
      sendStatusToWindow("Update downloaded");
      this.sendUpdateMessage({
        cmd: "update-downloaded",
        message: "update-downloaded",
      });
      // Wait 2 seconds, then quit and install
      // In your application, you don't need to wait 5 seconds.
      // You could call nsisUpdater.quitAndInstall(); immediately
      // setTimeout(function () {
      //   this.nsisUpdater.quitAndInstall();
      // }, 2000);

      const dialogOpts = {
        type: "question",
        buttons: ["Now", "Later"],
        title: "Update for SMT-StockIn-App",
        message: "New version found, close to update now?",
      };
      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
          try {
            this.nsisUpdater.quitAndInstall(false, true);
          } catch (error) {
            sendStatusToWindow(JSON.stringify(error));
            this.sendUpdateMessage({
              cmd: "error",
              message: "quitAndInstall error:" + JSON.stringify(error),
            });

            app.quit();
          } // try-catch
        } // if
      });
    });

    ipcMain.on("checkForUpdate", (event, args) => {
      console.log("ipcMain-update,checkForUpdate");
      // Create the Menu for autoupdate
      // const menu = Menu.buildFromTemplate(template);
      // Menu.setApplicationMenu(menu);
      // createDefaultWindow(); // for autoupdate
      this.nsisUpdater.checkForUpdates();
    });
  } // init
}
