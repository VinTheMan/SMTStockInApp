// const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.extensions.add(".json");
    config.resolve.extensions.add(".js");
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.ts",
      // Or, for multiple preload files:
      // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' },
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
  },
};
