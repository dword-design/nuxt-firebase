import Cookie from 'js-cookie'

export default async ({ app: { $auth }, store }) => {
  if (!store.getters['auth/isAuthenticated']) {
    await $auth.signOut()
  }
  $auth.onIdTokenChanged(async user => {
    if (user) {
      const { claims, token } = await user.getIdTokenResult()
      store.dispatch('auth/setUser', { ...claims, token })
      Cookie.set('authSession', token)
    } else {
      store.dispatch('auth/setUser', undefined)
      Cookie.remove('authSession')
    }
  })
}