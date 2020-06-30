import 'firebase/firestore'
import 'firebase/auth'

import { property } from '@dword-design/functions'
import firebase from 'firebase/app'

import config from './config'
import middleware from './middleware'
import storeModule from './store'

export default async (context, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebaseConfig)
  }
  inject('firestore', firebase.firestore())
  inject('auth', firebase.auth())
  context.store.registerModule('auth', storeModule)
  const Middleware = import('../middleware') |> await |> property('default')
  Middleware.auth = middleware
}
