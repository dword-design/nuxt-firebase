import { property } from '@dword-design/functions'

export default async ({ store, app: { $axios } }, inject) => {
  const { firebaseConfig: { projectId, databaseURL } } = import('./config') |> await |> property('default')
  const host = databaseURL !== undefined ? 'https://firestore.googleapis.com' : 'http://localhost:8080'
  const fireAxios = $axios.create({
    baseURL: `${host}/v1beta1/projects/${projectId}/databases/(default)/documents`,
  })
  fireAxios.onRequest(config => {
    const { token } = store.getters['auth/user'] ?? {}
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    }
  })
  inject('fireAxios', fireAxios)
}