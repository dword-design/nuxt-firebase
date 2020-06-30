import { last, map, mapValues, property, split } from '@dword-design/functions'
import firestoreParser from 'firestore-parser'
import pProps from 'p-props'

export const firestoreToJson = doc => ({
  id: doc.name |> split('/') |> last,
  ...doc.fields,
})

export const firestoreData = data => ({
  asyncData: context => {
    if (process.client) {
      return {}
    }
    return (
      data(context)
      |> mapValues(
        async ref =>
          context.app.$fireAxios.$get(`/${ref.path}`)
          |> await
          |> firestoreParser
          |> property('documents')
          |> map(firestoreToJson)
      )
      |> pProps
    )
  },
  firestore: data,
})
