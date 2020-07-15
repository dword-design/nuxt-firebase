import 'firebase/analytics'

// Current version of @nuxtjs/auth does not support external deps in schemes
// because the schemes are copied to a schemes subfolder
import getUserFromToken from '@dword-design/firebase-get-user-from-token'
import firebase from 'firebase/app'
import Cookie from 'js-cookie'

import config from './config'

export default context => {
  if (config.firebaseConfig.databaseURL === undefined) {
    console.log('No database URL set. Using firebase emulator …')
    context.app.$firestore.settings({ host: 'localhost:8080', ssl: false })
  }
  firebase.analytics()
  context.app.$fireAuth.onIdTokenChanged(async user => {
    if (user) {
      const token = await user.getIdToken()
      context.app.$auth.setUser(token |> getUserFromToken |> await)
      Cookie.set('authSession', token)
    } else {
      await context.app.$auth.reset()
      Cookie.remove('authSession')
    }
  })
}
