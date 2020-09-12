import {
  forIn,
  mapValues,
  negate,
  /* pickBy, */ some,
} from '@dword-design/functions'
import Vue from 'vue'

Vue.mixin({
  beforeDestroy() {
    forIn(unsubscriber => unsubscriber())(this.$firestoreUnsubscribers)
  },
  created() {
    this.$firestoreUnsubscribers =
      this.$options.firestore?.call(this, { app: this, store: this.$store })
      |> mapValues((ref, name) =>
        ref.onSnapshot(snapshot => {
          if (snapshot.docChanges === undefined) {
            this[name] = snapshot.data()
          } else {
            forIn(change => {
              const value = { id: change.doc.id, ...change.doc.data() }
              switch (change.type) {
                case 'added':
                  if (this[name] |> (some({ id: value.id }) |> negate)) {
                    this[name].splice(change.newIndex, 0, value)
                  }
                  break
                case 'removed':
                  this[name].splice(change.oldIndex, 1)
                  break
                case 'modified':
                  if (change.oldIndex === change.newIndex) {
                    this[name].splice(change.newIndex, 1, value)
                  } else {
                    this[name].splice(change.oldIndex, 1)
                    this[name].splice(change.newIndex, 0, value)
                  }
                  break
                default:
              }
            })(snapshot.docChanges())
          }
        })
      )
  },
  data() {
    return (
      this.$options.firestore?.call(this, { app: this, store: this.$store }) |>
      // ((ref, key) => !(key in this))
      mapValues(ref => (ref.where === undefined ? undefined : []))
    )
  },
})
