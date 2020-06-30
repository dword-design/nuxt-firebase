import pushPlugins from '@dword-design/nuxt-push-plugins'
import parsePkgName from 'parse-pkg-name'
import P from 'path'

import packageConfig from '@/package.json'

const packageName = parsePkgName(packageConfig.name).name

export default function (moduleOptions) {
  const options = { ...this.options.firebase, ...moduleOptions }
  this.addTemplate({
    fileName: P.join(packageName, 'config.js'),
    options: {
      firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG),
      ...options,
    },
    src: require.resolve('./config.js.template'),
  })
  this.addTemplate({
    fileName: P.join(packageName, 'store.js'),
    src: require.resolve('./store'),
  })
  this.addTemplate({
    fileName: P.join(packageName, 'middleware.js'),
    src: require.resolve('./middleware'),
  })
  pushPlugins(
    this,
    {
      fileName: P.join(packageName, 'universal-plugin.js'),
      src: require.resolve('./universal-plugin'),
    },
    {
      fileName: P.join(packageName, 'client-plugin.js'),
      mode: 'client',
      src: require.resolve('./client-plugin'),
    },
    {
      fileName: P.join(packageName, 'axios-plugin.js'),
      src: require.resolve('./axios-plugin'),
    },
    {
      fileName: P.join(packageName, 'data-plugin.js'),
      mode: 'client',
      src: require.resolve('./data-plugin'),
    }
  )
  this.options.router.middleware.push('auth')
}
