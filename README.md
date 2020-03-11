<!-- TITLE/ -->
# @dword-design/nuxt-firebase
<!-- /TITLE -->

<!-- BADGES/ -->
[![NPM version](https://img.shields.io/npm/v/@dword-design/nuxt-firebase.svg)](https://npmjs.org/package/@dword-design/nuxt-firebase)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)
[![Build status](https://img.shields.io/github/workflow/status/dword-design/nuxt-firebase/build)](https://github.com/dword-design/nuxt-firebase/actions)
[![Coverage status](https://img.shields.io/coveralls/dword-design/nuxt-firebase)](https://coveralls.io/github/dword-design/nuxt-firebase)
[![Dependency status](https://img.shields.io/david/dword-design/nuxt-firebase)](https://david-dm.org/dword-design/nuxt-firebase)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dword-design/nuxt-firebase)
<!-- /BADGES -->

<!-- DESCRIPTION/ -->

<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
## Install

```bash
# NPM
$ npm install @dword-design/nuxt-firebase

# Yarn
$ yarn add @dword-design/nuxt-firebase
```
<!-- /INSTALL -->

## Usage

Add the module to your `nuxt.config.js`:
```
{
  modules: [
    ['@dword-design/nuxt-firebase', {
      apiKey: <api key>,
      authDomain: <auth domain>,
      databaseURL: <database url>,
      projectId: <project id>,
      storageBucket: <storage bucket>,
      messagingSenderId: <messaging sender id>,
      appId: <app id>,
      measurementId: <measurement id>,
    }],
  ],
}
```

Add firebase properties to a nuxt page:
```
import { firestoreData } from '@dword-design/nuxt-firebase/dist/helper'

export default {
  ...firestoreData(({ store, app: { $firestore } }) => ({
    feeds: $firestore
      .collection('users')
      .doc(store.getters['auth/user'].id)
      .collection('feeds'),
  })),
  render: () => ...
}
```

Now you have server-side data and also reactive data on the client side!

<!-- LICENSE/ -->
## License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->
