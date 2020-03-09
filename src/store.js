import { property } from '@dword-design/functions'
import Vue from 'vue'
import jwtDecode from 'jwt-decode'
import cookie from 'cookie'

export default {
  namespaced: true,
  state: () => ({}),
  getters: {
    user: property('user'),
    isAuthenticated: ({ user }) => user !== undefined,
  },
  mutations: {
    setUser: (state, user) => Vue.set(state, 'user', user),
  },
  actions: {
    nuxtServerInit: ({ dispatch }, { req }) => {
      if (process.server && process.static) {
        return
      }
      if (!req.headers.cookie) {
        return
      }

      const cookies = cookie.parse(req.headers.cookie)
      const token = cookies.authSession
      if (token === undefined) {
        return
      }
      const user = jwtDecode(token)

      if (user !== null) {
        dispatch('setUser', { ...user, token })
      }
    },
    setUser: ({ commit }, user) => {
      commit('setUser', user !== undefined ? { id: user.user_id, email: user.email, token: user.token } : undefined)
    },
    async register(context, { username, password }) {
      await this.app.$auth.createUserWithEmailAndPassword(username, password)
      await this.app.router.push({ name: 'user' })
    },
    async login(context, { username, password }) {
      await this.app.$auth.signInWithEmailAndPassword(username, password)
      await this.app.router.push({ name: 'user' })
    },
    async logout() {
      await this.app.$auth.signOut()
      await this.app.router.push({ name: 'index' })
    },
  },
}