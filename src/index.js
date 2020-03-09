import P from 'path'
import getPackageName from 'get-package-name'
import pushPlugins from '@dword-design/nuxt-push-plugins'

export default function (config) {

  this.addTemplate({ src: require.resolve('./store'), fileName: P.join('firebase', 'store.js') })
  this.addTemplate({ src: require.resolve('./middleware'), fileName: P.join('firebase', 'middleware.js') })
  pushPlugins(this,
    { src: require.resolve('./universal-plugin'), fileName: P.join('firebase', 'universal-plugin.js') },
    { src: require.resolve('./client-plugin'), fileName: P.join('firebase', 'client-plugin.js'), mode: 'client' },
    { src: require.resolve('./axios-plugin'), fileName: P.join('firebase', 'axios-plugin.js') },
    { src: require.resolve('./data-plugin'), fileName: P.join('firebase', 'data-plugin.js'), mode: 'client' },
  )
  this.addModule([getPackageName(require.resolve('@nuxtjs/firebase')), {
    config,
    services: {
      firestore: true,
      auth: true,
    },
  }])
  this.options.router.middleware.push('auth')
}
