import { property } from '@dword-design/functions'
import cookie from 'cookie'
import jwtDecode from 'jwt-decode'
import Vue from 'vue'

import config from './config'

export default {
  actions: {
    async deleteUser(context, payload = {}) {
      await this.app.$auth.currentUser.delete()
      await this.app.router.push(
        payload.destination || config.redirect.call(this).logout
      )
    },
    async login(context, payload) {
      await this.app.$auth.signInWithEmailAndPassword(
        payload.email,
        payload.password
      )
      await this.app.router.push(
        payload.destination || config.redirect.call(this).home
      )
    },
    async logout(context, payload = {}) {
      await this.app.$auth.signOut()
      await this.app.router.push(
        payload.destination || config.redirect.call(this).logout
      )
    },
    nuxtServerInit: (context, payload) => {
      if (process.server && process.static) {
        return
      }
      if (!payload.req.headers.cookie) {
        return
      }
      const cookies = cookie.parse(payload.req.headers.cookie)
      const token = cookies.authSession
      if (token === undefined) {
        return
      }
      const user = jwtDecode(token)
      if (user !== null) {
        context.dispatch('setUser', { ...user, token })
      }
    },
    async register(context, payload) {
      await this.app.$auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      )
      await this.app.router.push(
        payload.destination || config.redirect.call(this).home
      )
    },
    sendPasswordResetEmail(context, email) {
      return this.app.$auth.sendPasswordResetEmail(email)
    },
    setUser: (context, user) => {
      context.commit(
        'setUser',
        user
          ? { email: user.email, id: user.user_id, token: user.token }
          : undefined
      )
    },
  },
  getters: {
    isAuthenticated: state => state.user !== undefined,
    user: property('user'),
  },
  mutations: {
    setUser: (state, user) => Vue.set(state, 'user', user),
  },
  namespaced: true,
  state: () => ({}),
}
