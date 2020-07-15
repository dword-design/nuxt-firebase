import 'firebase/firestore'
import 'firebase/auth'

import firebase from 'firebase/app'

import config from './config'

export default (context, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebaseConfig)
  }
  inject('firestore', firebase.firestore())
  inject('fireAuth', firebase.auth())
}
