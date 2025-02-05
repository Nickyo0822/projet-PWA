const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "My PWA",
    themeColor: "#42b983",
    msTileColor: "#42b983",
    manifestOptions: {
      background_color: "#ffffff",
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
})
