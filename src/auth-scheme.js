import cookie from 'cookie'

export default class {
  constructor(auth, options) {
    this.$auth = auth
    if (process.server) {
      this.firebase = require('firebase-admin')
      if (this.firebase.apps.length === 0) {
        this.firebase.initializeApp({
          credential: this.firebase.credential.cert(
            options.firebaseAdminConfig
          ),
        })
      }
    }
  }

  async login(credentials) {
    await this.$auth.reset()
    await this.$auth.ctx.app.$fireAuth.signInWithEmailAndPassword(
      credentials.username,
      credentials.password
    )
  }

  async getUser() {
    if (!this.$auth.ctx.req.headers.cookie) {
      return undefined
    }
    const cookies = cookie.parse(this.$auth.ctx.req.headers.cookie)
    const token = cookies.authSession
    try {
      const user = await this.firebase.auth().verifyIdToken(token)
      return {
        email: user.email,
        emailVerified: user.email_verified,
        id: user.uid,
        token,
      }
    } catch {
      return undefined
    }
  }

  async fetchUser() {
    this.$auth.setUser(await this.getUser())
  }

  logout() {
    return this.$auth.ctx.app.$fireAuth.signOut()
  }
}
