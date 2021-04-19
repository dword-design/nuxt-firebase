import { identity } from '@dword-design/functions'
import pushPlugins from '@dword-design/nuxt-push-plugins'
import packageName from 'depcheck-package-name'
import parsePackagejsonName from 'parse-packagejson-name'
import P from 'path'

import packageConfig from '@/package.json'

const name = parsePackagejsonName(packageConfig.name).fullName

export default function (moduleOptions) {
  const options = { ...this.options.firebase, ...moduleOptions }
  this.addModule([
    packageName`@dword-design/nuxt-auth`,
    {
      redirect: options.redirect,
      strategies: {
        firebase: {
          _provider: identity,
          _scheme: require.resolve('./auth-scheme'),
          firebaseAdminConfig: options.firebaseAdminConfig,
        },
        local: false,
      },
    },
  ])
  this.addTemplate({
    fileName: P.join(name, 'config.js'),
    options,
    src: require.resolve('./config.js.template'),
  })
  pushPlugins(
    this,
    {
      fileName: P.join(name, 'universal-plugin.js'),
      src: require.resolve('./universal-plugin'),
    },
    {
      fileName: P.join(name, 'client-plugin.js'),
      mode: 'client',
      src: require.resolve('./client-plugin'),
    },
    {
      fileName: P.join(name, 'axios-plugin.js'),
      src: require.resolve('./axios-plugin'),
    },
    {
      fileName: P.join(name, 'data-plugin.js'),
      mode: 'client',
      src: require.resolve('./data-plugin'),
    }
  )
}
