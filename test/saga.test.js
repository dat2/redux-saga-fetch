global.fetch = require('jest-fetch-mock');

import { call, put, takeEvery } from 'redux-saga/effects';

import { FETCH, get, post, del } from '../src/actions';
import saga, { fetchSaga } from '../src/saga';

test('the main saga is just `takeEvery`', () => {
  const gen = saga();
  // listen to each fetch action by default
  expect(gen.next()).toEqual({
    done: false,
    value: takeEvery(FETCH, fetchSaga)
  });
  // should be complete once it starts listening
  expect(gen.next()).toEqual({ done: true });
});

test('the `get` action is handled correctly', () => {
  const body = { hello: 'world' };
  const response = new Response(JSON.stringify(body));

  const createHelloAction = payload => ({
    type: 'HELLO',
    payload,
    error: null
  });
  const success = response => response.json().then(createHelloAction);

  const action = get('/v1', { success, fail: jest.fn() });
  const gen = fetchSaga(action);

  // first, it should call with the right method
  expect(gen.next()).toEqual({
    done: false,
    value: call(fetch, '/v1', { method: 'GET', credentials: 'include' })
  });

  // then, it should try and call the success handler
  expect(gen.next(response)).toEqual({
    done: false,
    value: call(Promise.resolve, success(response))
  });

  // then, it should call the success action creator
  expect(gen.next(createHelloAction(body))).toEqual({
    done: false,
    value: put(createHelloAction(body))
  });

  // then, it should be done
  expect(gen.next()).toEqual({ done: true });
});
