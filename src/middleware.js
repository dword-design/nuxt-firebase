import { last, property } from '@dword-design/functions'

export default ({ route, redirect, store }) => {
  if ((route.meta |> last |> property('auth')) !== 'guest'
    && !store.getters['auth/isAuthenticated']
  ) {
    return redirect('/')
  }
}