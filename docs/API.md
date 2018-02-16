# API

## TOC
* [Actions](#actions)
  + [`get()`](#get)
  + [`post()`](#post)
  + [`del`](#del)
  + [`.json()`](#json)

## Actions

All the action creators are factories for the `FETCH` action. The saga then uses the `FETCH` action to call
the  [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). The `FETCH` action look like this:
```js
{
  type: '@@redux-saga-fetch/FETCH',
  payload: {
    method: 'GET' | 'POST' | 'DELETE',
    success: (response: Response) => Promise<Action> | Action,
    fail: (error: Error) => Object,
    ...options: Object
  }
}
```
The `success` callback takes a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), and
can return either a `Promise<Action>` or an `Action` directly. `Action` will get converted to `Promise<Action>` with
[`Promise.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).
The `Action` will then get dispatched when the `Promise` completes.

The `fail` callback takes an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
and can only return with an `Action` directly.

### `get()`
```js
get(
  url: string,
  config: {
    success: (response: Response) => Promise | Object,
    fail: (error: Error) => Promise | Object
  }
): FetchAction
```

This sets the method to `'GET'`.

### `post()`
```js
post(
  url: string,
  config: {
    body: Object | Blob | string,
    success: (response: Response) => Promise | Object,
    fail: (error: Error) => Promise | Object,
    ...options: Object
  }
): FetchAction
```

This sets the method to `'POST'`.

### `del()`
```js
del(
  url: string,
  config: {
    success: (response: Response) => Promise | Object,
    fail: (error: Error) => Promise | Object
  }
): FetchAction
```

This sets the method to `'DELETE'`.

### `.json()`
```js
post.json(
  url: string,
  config: {
    body: Object,
    success: (response: Response) => Promise | Object,
    fail: (error: Error) => Promise | Object,
    ...options: Object
  }
): FetchAction
```

This is a factory action that only accepts an `Object` for the `body` (if any). It
also adds the `{ 'Content-Type': 'application/json' }` header and automatically parses a response as JSON. If the response is not valid JSON, the `fail` action is dispatched.
