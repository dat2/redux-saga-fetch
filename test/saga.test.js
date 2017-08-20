global.fetch = require('jest-fetch-mock');

import { call, put, takeEvery } from 'redux-saga/effects';

import { FETCH, get, post, del } from '../src/actions';
import saga, { fetchSaga } from '../src/saga';

test('the main saga is just `takeEvery`', () => {
  const gen = saga();
  expect(gen.next()).toEqual({
    done: false,
    value: takeEvery(FETCH, fetchSaga)
  });
  expect(gen.next()).toEqual({ done: true });
});

test('the `get` action is handled correctly', () => {
  const body = { hello: 'world' };
  const response = new Response(JSON.stringify(body));

  const success = payload => ({ type: 'HELLO', payload, error: null });
  const action = get('/v1', { success, fail: jest.fn() });

  const gen = fetchSaga(action);

  // first, it should call with the right method
  expect(gen.next(response)).toEqual({
    done: false,
    value: call(fetch, '/v1', { method: 'GET', credentials: 'include' })
  });

  // then, it should try and call response.json
  const val = call(() => response.json());
  delete val.CALL.fn;
  expect(gen.next()).toMatchObject({
    done: false,
    value: val
  })

  // then, it should call the success action creator
  expect(gen.next(body)).toEqual({
    done: false,
    value: put(success(body))
  });

  // then, it should be done
  expect(gen.next()).toEqual({ done: true });
});