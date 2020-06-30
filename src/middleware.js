import { last, property } from '@dword-design/functions'

import config from './config'

export default context => {
  const auth = context.route.meta |> last |> property('auth')
  if (auth === 'guest' && context.store.getters['auth/isAuthenticated']) {
    return context.redirect(config.redirect.call(context).home)
  }
  if (auth === undefined && !context.store.getters['auth/isAuthenticated']) {
    return context.redirect(config.redirect.call(context).login)
  }
  return undefined
}
