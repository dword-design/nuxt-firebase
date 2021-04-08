import config from './config'

export default (context, inject) => {
  const host = 'https://firestore.googleapis.com'

  const fireAxios = context.app.$axios.create({
    baseURL: `${host}/v1beta1/projects/${config.firebaseConfig.projectId}/databases/(default)/documents`,
  })
  fireAxios.onRequest(axiosConfig => {
    const user = context.app.$auth.user

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
