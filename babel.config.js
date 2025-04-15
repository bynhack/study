module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [],
  assumptions: {
    privateFieldsAsProperties: true,
    setPublicClassFields: true
  },
  env: {
    production: {
      plugins: [
        ['transform-remove-console', { exclude: ['error', 'warn'] }]
      ]
    }
  }
} 