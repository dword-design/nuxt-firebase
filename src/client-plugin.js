import Cookie from 'js-cookie'
import { property } from '@dword-design/functions'
import firebase from 'firebase/app'
import 'firebase/analytics'

export default async ({ app: { $auth, $firestore }, store }) => {

  const { firebaseConfig: { databaseURL } } = import('./config') |> await |> property('default')
  if (databaseURL === undefined) {
    console.log('No database URL set. Using firebase emulator …')
    $firestore.settings({ host: 'localhost:8080', ssl: false })
  }

  firebase.analytics()
  
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