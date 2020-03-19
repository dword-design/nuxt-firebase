import P from 'path'
import pushPlugins from '@dword-design/nuxt-push-plugins'
import parsePkgName from 'parse-pkg-name'
import packageConfig from '../package.json'

const { name: packageName } = parsePkgName(packageConfig.name)

export default function (config) {
  this.addTemplate({
    src: require.resolve('./config.js.template'),
    fileName: P.join(packageName, 'config.js'),
    options: { firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG), ...config },
  })
  this.addTemplate({ src: require.resolve('./store'), fileName: P.join(packageName, 'store.js') })
  this.addTemplate({ src: require.resolve('./middleware'), fileName: P.join(packageName, 'middleware.js') })
  pushPlugins(this,
    { src: require.resolve('./universal-plugin'), fileName: P.join(packageName, 'universal-plugin.js') },
    { src: require.resolve('./client-plugin'), fileName: P.join(packageName, 'client-plugin.js'), mode: 'client' },
    { src: require.resolve('./axios-plugin'), fileName: P.join(packageName, 'axios-plugin.js') },
    { src: require.resolve('./data-plugin'), fileName: P.join(packageName, 'data-plugin.js'), mode: 'client' },
  )
  this.options.router.middleware.push('auth')
}
