export default ({ store, app: { $fireStore, $axios } }) => {
  const { projectId } = $fireStore.app.options
  $axios.setBaseURL(`https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default)/documents`)
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