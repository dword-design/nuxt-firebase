import { property } from '@dword-design/functions'

export default async ({ store, app: { $axios } }) => {
  const { firebaseConfig: { projectId, databaseURL } } = import('./config') |> await |> property('default')
  const host = databaseURL !== undefined ? 'https://firestore.googleapis.com' : 'http://localhost:8080'
  $axios.setBaseURL(`${host}/v1beta1/projects/${projectId}/databases/(default)/documents`)
  $axios.onRequest(config => {
    const { token } = store.getters['auth/user'] ?? {}
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    }
  })
}