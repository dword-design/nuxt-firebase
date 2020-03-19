import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { property } from '@dword-design/functions'
import storeModule from './store'
import middleware from './middleware'

export default async ({ store }, inject) => {

  if (!firebase.apps.length) {
    const { firebaseConfig } = import('./config') |> await |> property('default')
    firebase.initializeApp(firebaseConfig)
  }

  inject('firestore', firebase.firestore())
  inject('auth', firebase.auth())

  store.registerModule('auth', storeModule)
  const Middleware = import('../middleware') |> await |> property('default')
  Middleware.auth = middleware
}