# redux-saga-fetch  [![Build Status](https://travis-ci.org/dat2/redux-saga-fetch.svg?branch=master)](https://travis-ci.org/dat2/redux-saga-fetch) [![codecov](https://codecov.io/gh/dat2/redux-saga-fetch/branch/master/graph/badge.svg)](https://codecov.io/gh/dat2/redux-saga-fetch/)
A saga that helps reduce http duplication when writing `redux-saga` code.

# Getting Started

## Install

```
$ npm install --save redux-saga-fetch
```

or

```
$ yarn add redux-saga-fetch
```

## Usage Example
Let's say you read the `redux-saga` readme, and start implementing the 3 kinds
of actions `USER_FETCH_REQUESTED`,`USER_FETCH_SUCCEEDED` and `USER_FETCH_FAILED`.
Then you start to create the `userSaga`. You start copy/pasting this `userSaga`
for all of your objects, and start thinking "This is not very DRY", and maybe
even give up `redux-saga`. `redux-saga-fetch` is here to save the day!

Let's create a simple actions file for now. This will use the same actions from
the `redux-saga` readme.

#### `actions.js`
```javascript
import { get } from 'redux-saga-fetch';

// this is where the magic happens
// the `get` is an action creator, that takes a url and 2 important functions
// success: an action creator that can return a Promise, or an action
// fail: an action creator that catches any errors, either in fetch or in the
//       success action creator
export function userFetchRequested(userId) {
    return get(`/users/${userId}`, {
        success: response => response.json().then(userFetchSucceeded),
        fail: userFetchFailed
    })
}

export function userFetchSucceeeded(user) {
    return { type: 'USER_FETCH_SUCCEEDED', user: user }
}

export function userFetchFailed(e) {
    return { type: 'USER_FETCH_FAILED', message: e.message }
}
```

This is the `main.js` taken from the `redux-saga` readme.

#### `main.js`
```diff
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
+import fetchSaga from 'redux-saga-fetch'

import reducer from './reducers'
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// then run the saga
-sagaMiddleware.run(mySaga)
+sagaMiddleware.run(fetchSaga)

// render the application
```

And there you have it! `redux-saga-fetch` removes the need to write an entire
saga for basic use cases.

### Kicking off other actions on success

#### `actions.js`
```diff
-export function userFetchSucceeeded(user) {
-    return { type: 'USER_FETCH_SUCCEEDED', user: user }
-}
+export function userFetchSucceeded(uesr) {
+    return function(dispatch) {
+        dispatch({ type: 'USER_FETCH_SUCCEEDED', user: user })
+        // start kicking off some other actions
+        dispatch({ type: 'FETCH_TODOS_FOR_USER', user: user })
+        dispatch({ type: 'FETCH_FRIENDS_FOR_USER', user: user });
+    }
+}
```

## Documentation

## Examples