// Current version of @nuxtjs/auth does not support external deps in schemes
// because the schemes are copied to a schemes subfolder
import getUserFromToken from '@dword-design/firebase-get-user-from-token'
import cookie from 'cookie'

export default class {
  constructor(auth) {
    this.$auth = auth
  }

  async login(credentials) {
    await this.$auth.reset()
    await this.$auth.ctx.app.$fireAuth.signInWithEmailAndPassword(
      credentials.username,
      credentials.password
    )
  }

  getUser() {
    if (!this.$auth.ctx.req.headers.cookie) {
      return undefined
    }
    const cookies = cookie.parse(this.$auth.ctx.req.headers.cookie)
    const token = cookies.authSession
    if (token === undefined) {
      return undefined
    }
    return token |> getUserFromToken
  }

  async fetchUser() {
    this.$auth.setUser(await this.getUser())
  }

  logout() {
    return this.$auth.ctx.app.$fireAuth.signOut()
  }
}
