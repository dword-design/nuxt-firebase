import { property } from '@dword-design/functions'
import storeModule from './store'
import middleware from './middleware'

export default async ({ store }) => {
  store.registerModule('auth', storeModule)
  const Middleware = import('../middleware') |> await |> property('default')
  Middleware.auth = middleware
}