import config from './config'

export default (context, inject) => {
  const host =
    config.firebaseConfig.databaseURL === undefined
      ? 'http://localhost:8080'
      : 'https://firestore.googleapis.com'
  const fireAxios = context.app.$axios.create({
    baseURL: `${host}/v1beta1/projects/${config.firebaseConfig.projectId}/databases/(default)/documents`,
  })
  fireAxios.onRequest(axiosConfig => {
    const user = context.store.getters['auth/user']
    return {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
      },
    }
  })
  inject('fireAxios', fireAxios)
}
