import { last, map, mapValues, split } from '@dword-design/functions'
import firestoreParser from 'firestore-parser'
import pProps from 'p-props'

export const firestoreToJson = doc => ({
  id: doc.name |> split('/') |> last,
  ...doc.fields,
})

export const firestoreData = data => ({
  asyncData: context =>
    data(context)
    |> mapValues(async ref => {
      if (process.client) {
        return ref.where === undefined ? undefined : []
      }
      try {
        const result =
          context.app.$fireAxios.$get(`/${ref.path}`)
          |> await
          |> firestoreParser

        return ref.where === undefined
          ? result |> firestoreToJson
          : result.documents |> map(firestoreToJson)
      } catch (error) {
        if (error.response.status !== 404) {
          throw error
        }
      }

      return undefined
    })
    |> pProps,
  firestore: data,
})
