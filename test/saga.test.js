import { takeEvery } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { del, FETCH, get, post } from '../src/actions';
import saga, { fetchSaga } from '../src/saga';

test('the main saga watcher is just `takeEvery`', () => {
  const gen = saga();
  // listen to each fetch action by default
  expect(gen.next()).toEqual({
    done: false,
    value: takeEvery(FETCH, fetchSaga)
  });
  // should be complete once it starts listening
  expect(gen.next()).toEqual({ done: true });
});

const createSuccessAction = payload => ({
  type: 'HELLO',
  payload
});

const createErrorAction = e => ({
  type: 'ERROR',
  payload: e.message,
  error: true
});

function testSaga(triggeringAction, dispatchedAction, responseOrError) {
  return expectSaga(fetchSaga, triggeringAction)
    .provide([
      [
        matchers.call.fn(fetch),
        responseOrError instanceof Error
          ? throwError(responseOrError)
          : responseOrError
      ]
    ])
    .put(dispatchedAction)
    .run();
}

test('the fetch saga works for a `get` action', () => {
  const body = { hello: 'world' };
  const success = response => response.json().then(createSuccessAction);

  return testSaga(
    get('/v1', { success }),
    createSuccessAction(body),
    new Response(JSON.stringify(body))
  );
});

test('`get.json` is a shorthand for doing response.json()', () => {
  const body = { hello: 'world' };
  return testSaga(
    get.json('/v1', { success: createSuccessAction }),
    createSuccessAction(body),
    new Response(JSON.stringify(body))
  );
});

test('the fetch saga allows users to call `response.text`', () => {
  const text = 'i am some useless text :)';
  const success = response => response.text().then(createSuccessAction);

  return testSaga(
    get('/v1', { success }),
    createSuccessAction(text),
    new Response(text)
  );
});

test('the fetch saga handles errors', () => {
  const error = new Error('Failed http code.');
  return testSaga(
    get('/v1', { fail: createErrorAction }),
    createErrorAction(error),
    error
  );
});

test('the fetch saga works for a `post` action', () => {
  const body = 'some=body';
  const mockResponse = 'ok';
  const success = response => response.text().then(createSuccessAction);

  return testSaga(
    post('/v1', { body, success }),
    createSuccessAction(mockResponse),
    new Response(mockResponse, { status: 201 })
  );
});

test('`post.json` is shorthand for stringifying an object and parsing a json response', () => {
  const body = { hello: 'world' };
  const mockResponse = { status: 'object created' };

  return testSaga(
    post.json('/v1', { body, success: createSuccessAction }),
    createSuccessAction(mockResponse),
    new Response(JSON.stringify(mockResponse), { status: 201 })
  );
});

test('the fetch saga works for a `del` action', () => {
  const success = () => createSuccessAction();

  return testSaga(
    del('/v1', { success }),
    createSuccessAction(),
    new Response(null, { status: 204 })
  );
});
