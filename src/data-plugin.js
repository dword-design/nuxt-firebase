import Vue from 'vue'
import { mapValues, forIn, some, negate, constant, pickBy } from '@dword-design/functions'

Vue.mixin({
  data() {
    return this.$options.firestore?.call(this, { store: this.$store, app: this })
      |> pickBy((value, key) => this[key] === undefined)
      |> mapValues(constant(undefined))
  },
  created() {
    this.$firestoreUnsubscribers = this.$options.firestore?.call(this, { store: this.$store, app: this })
      |> mapValues((ref, name) => {
        if (this[name] === undefined && ref.where !== undefined) {
          Vue.util.defineReactive(this, name, [])
        }
        return ref.onSnapshot(snapshot => {
          if (snapshot.docChanges !== undefined) {
            if (this[name] === undefined) {
              this[name] = []
            }
            return snapshot.docChanges() |> forIn(({ type, oldIndex, newIndex, doc }) => {
              const value = { id: doc.id, ...doc.data() }
              switch (type) {
                case 'added':
                  if (this[name] |> (some({ id: value.id }) |> negate)) {
                    this[name].splice(newIndex, 0, value)
                  }
                  break
                case 'removed': this[name].splice(oldIndex, 1); break
                case 'modified':
                  if (oldIndex !== newIndex) {
                    this[name].splice(oldIndex, 1)
                    this[name].splice(newIndex, 0, value)
                  } else {
                    this[name].splice(newIndex, 1, value)
                  }
                  break
              }
            })
          } else {
            this[name] = snapshot.data()
          }
        })
      })
  },
  beforeDestroy() {
    this.$firestoreUnsubscribers |> forIn(unsubscriber => unsubscriber())
  },
})
