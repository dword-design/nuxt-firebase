import { map, mapValues, property, split, last } from '@dword-design/functions'
import firestoreParser from 'firestore-parser'
import pProps from 'p-props'

export const firestoreToJson = ({ name, fields }) => ({ id: name |> split('/') |> last, ...fields })

export const firestoreData = data => ({
  asyncData: context => {
    const { app: { $axios } } = context
    if (process.client) {
      return
    }
    return data(context)
      |> mapValues(async ({ path }) => $axios.$get(`/${path}`)
        |> await
        |> firestoreParser
        |> property('documents')
        |> map(firestoreToJson),
      )
      |> pProps
  },
  firestore: data,
})