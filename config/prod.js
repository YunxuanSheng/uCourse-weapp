module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    BASE_URL: '"https://songkeys.top"'
  },
  weapp: {},
  h5: {},
  plugins: {
    csso: {
      enable: true,
      config: {
        restructure: false
      }
    }
  }
}
