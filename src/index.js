import { identity } from '@dword-design/functions'
import pushPlugins from '@dword-design/nuxt-push-plugins'
import getPackageName from 'get-package-name'
import parsePkgName from 'parse-pkg-name'
import P from 'path'

import packageConfig from '@/package.json'

const packageName = parsePkgName(packageConfig.name).name

export default function (moduleOptions) {
  const options = { ...this.options.firebase, ...moduleOptions }
  this.addModule([
    getPackageName(require.resolve('@dword-design/nuxt-auth')),
    {
      redirect: options.redirect,
      strategies: {
        firebase: {
          _provider: identity,
          _scheme: require.resolve('./auth-scheme'),
        },
        local: false,
      },
    },
  ])
  this.addTemplate({
    fileName: P.join(packageName, 'config.js'),
    options,
    src: require.resolve('./config.js.template'),
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
}
