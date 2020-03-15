import { last, property } from '@dword-design/functions'

export default async ({ route, redirect, store }) => {
  const config = import('./config') |> await |> property('default')
  const auth = route.meta |> last |> property('auth')
  if (auth === 'guest' && store.getters['auth/isAuthenticated']) {
    return redirect(redirect.home)
  } else if (auth === undefined && !store.getters['auth/isAuthenticated']) {
    return redirect(config.redirect.login)
  }
}