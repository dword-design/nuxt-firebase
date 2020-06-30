import 'firebase/analytics'

import firebase from 'firebase/app'
import Cookie from 'js-cookie'

import config from './config'

export default async context => {
  if (config.firebaseConfig.databaseURL === undefined) {
    console.log('No database URL set. Using firebase emulator …')
    context.app.$firestore.settings({ host: 'localhost:8080', ssl: false })
  }
  firebase.analytics()
  if (!context.store.getters['auth/isAuthenticated']) {
    await context.app.$auth.signOut()
  }
  context.app.$auth.onIdTokenChanged(async user => {
    if (user) {
      const credentials = await user.getIdTokenResult()
      context.store.dispatch('auth/setUser', {
        ...credentials.claims,
        token: credentials.token,
      })
      Cookie.set('authSession', credentials.token)
    } else {
      context.store.dispatch('auth/setUser', undefined)
      Cookie.remove('authSession')
    }
  })
}
