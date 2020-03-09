import Vue from 'vue'
import { mapValues, forIn, some, negate } from '@dword-design/functions'

Vue.mixin({
  created() {
    this.$firestoreUnsubscribers = this.$options.firestore?.({ store: this.$store, app: this })
      |> mapValues((ref, name) => ref
        .onSnapshot(snapshot => snapshot.docChanges !== undefined
          ? snapshot.docChanges() |> forIn(({ type, oldIndex, newIndex, doc }) => {
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
          : this[name] = snapshot.data(),
        ),
      )
  },
  beforeDestroy() {
    this.$firestoreUnsubscribers |> forIn(unsubscriber => unsubscriber())
  },
})
