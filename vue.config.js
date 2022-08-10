// const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.extensions.add(".json");
    config.resolve.extensions.add(".js");
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          icon: "./src/assets/img/icons/appIcon.ico",
        },
        nsis: {
          installerIcon: "./src/assets/img/icons/installerIcon.ico",
          installerHeaderIcon: "./src/assets/img/icons/installerIcon.ico",
        },
      },
      preload: "src/preload.ts",
      nodeIntegration: true,
      chainWebpackMainProcess: (config) => {
        config.module
          .rule("babel")
          .before("ts")
          .use("babel")
          .loader("babel-loader")
          .options({
            presets: [["@babel/preset-env", { modules: false }]],
            plugins: ["@babel/plugin-proposal-class-properties"],
          });
      },
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
    },
  },
};
