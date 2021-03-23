import { forEach, mapValues, negate, some } from '@dword-design/functions'
import Vue from 'vue'

Vue.mixin({
  beforeDestroy() {
    forEach(this.$firestoreUnsubscribers, unsubscriber => unsubscriber())
  },
  created() {
    this.$firestoreUnsubscribers =
      this.$options.firestore?.call(this, { app: this, store: this.$store })
      |> mapValues((ref, name) =>
        ref.onSnapshot(snapshot => {
          if (snapshot.docChanges === undefined) {
            this[name] = snapshot.data()
          } else {
            forEach(snapshot.docChanges(), change => {
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
            })
          }
        })
      )
  },
  data() {
    return (
      this.$options.firestore?.call(this, { app: this, store: this.$store })
      |> mapValues(ref => (ref.where === undefined ? undefined : []))
    )
  },
})
