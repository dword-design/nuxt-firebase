import 'firebase/analytics'

import firebase from 'firebase/app'
import Cookie from 'js-cookie'

import config from './config'

export default (context, inject) => {
  if (config.firebaseConfig.databaseURL === undefined) {
    console.log('No database URL set. Using firebase emulator …')
    context.app.$firestore.settings({ host: 'localhost:8080', ssl: false })
  }
  inject('fireAnalytics', firebase.analytics())
  context.app.$fireAuth.onIdTokenChanged(async user => {
    if (user) {
      const token = await user.getIdToken()
      context.app.$auth.setUser({
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.uid,
        token,
      })
      Cookie.set('authSession', token)
    } else {
      await context.app.$auth.reset()
      Cookie.remove('authSession')
    }
  })
}
