module.exports = {
  transpileDependencies: [],

  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true,
        pathRewrite: {'^/api' : ''}
      }
    },
    client: {
      webSocketURL: process.env.NGROK_URL ? `${process.env.NGROK_URL}/ws` : 'wss://localhost:8080/wss',
    }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
};

