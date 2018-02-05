module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'vue-coreui',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/font-awesome',
    '@nuxtjs/pwa',
  ],

  plugins: [
    //{ src: '~plugins/persistence.js'},
    { src: '~plugins/axios.js' },
    { src: '~plugins/common.js' },
    { src: '~plugins/user.js' }
  ],

  router: {
    middleware: ['auth']
  },

  css: [
    '@/assets/scss/style.scss',
  ],

  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'lodash'],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
