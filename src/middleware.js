import { last, property } from '@dword-design/functions'

export default async ({ route, redirect, store }) => {
  const { redirect: redirectConfig } = import('./config') |> await |> property('default')
  const auth = route.meta |> last |> property('auth')
  if (auth === 'guest' && store.getters['auth/isAuthenticated']) {
    return redirect(redirectConfig.home)
  } else if (auth === undefined && !store.getters['auth/isAuthenticated']) {
    return redirect(redirectConfig.login)
  }
}