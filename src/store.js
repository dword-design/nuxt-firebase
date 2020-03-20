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
    async register(context, { email, password, destination }) {
      const { user } = await this.app.$auth.createUserWithEmailAndPassword(email, password)
      const { redirect } = import('./config') |> await |> property('default')
      await this.app.$firestore.collection('users').doc(user.uid).set({})
      await this.app.router.push(destination ?? redirect.home)
    },
    async login(context, { email, password, destination }) {
      const { redirect } = import('./config') |> await |> property('default')
      await this.app.$auth.signInWithEmailAndPassword(email, password)
      await this.app.router.push(destination ?? redirect.home)
    },
    async logout(context, { destination } = {}) {
      const { redirect } = import('./config') |> await |> property('default')
      await this.app.$auth.signOut()
      await this.app.router.push(destination ?? redirect.logout)
    },
    async deleteUser(context, { destination } = {}) {
      const { redirect } = import('./config') |> await |> property('default')
      await this.app.$auth.currentUser.delete()
      await this.app.router.push(destination ?? redirect.logout)
    },
    sendPasswordResetEmail(context, email) {
      return this.app.$auth.sendPasswordResetEmail(email)
    },
  },
}