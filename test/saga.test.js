global.fetch = require('jest-fetch-mock');

import { all, call, put, takeEvery } from 'redux-saga/effects';

import { GET, POST, DELETE, get, post, del } from '../src/actions';
import saga, { getSaga, postSaga, deleteSaga } from '../src/saga';

test('the saga should be listening for all of the actions', () => {
  const gen = saga();

  expect(gen.next().value).toEqual(
    all([
      takeEvery(GET, getSaga),
      takeEvery(POST, postSaga),
      takeEvery(DELETE, deleteSaga)
    ])
  );
});

test('the saga should call the success action creator for get correctly.', () => {
  const body = { hello: 'world' };
  const response = new Response(JSON.stringify(body));

  const success = payload => ({ type: 'HELLO', payload, error: null });
  const action = get('/v1', { success, fail: jest.fn() });

  const gen = getSaga(action);
  expect(gen.next(response).value).toEqual(
    call(fetch, '/v1', { credentials: 'include' })
  );
  // the saga calls response.json, which just returns body
  gen.next();
  expect(gen.next(body).value).toEqual(put(success(body)));
});
