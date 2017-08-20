/*globals Promise:true*/
global.fetch = require('jest-fetch-mock');

import { call, put, takeEvery } from 'redux-saga/effects';

import { FETCH, get } from '../src/actions';
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

test('the fetch saga works for a `get` action', () => {
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

  // first, it should wait for the result of the fetch
  expect(gen.next()).toEqual({
    done: false,
    value: call(fetch, '/v1', { method: 'GET', credentials: 'include' })
  });

  // then, once it gets the fetch result, it should wait for the next action
  expect(gen.next(response)).toEqual({
    done: false,
    value: call(Promise.resolve, success(response))
  });

  // then, it should try and give back that action
  expect(gen.next(createHelloAction(body))).toEqual({
    done: false,
    value: put(createHelloAction(body))
  });

  // then, it should be done
  expect(gen.next()).toEqual({ done: true });
});

test('the fetch saga allows users to call `response.text`', () => {
  const text = 'i am some useless text :)';
  const response = new Response(text);

  const createHelloAction = payload => ({
    type: 'HELLO',
    payload,
    error: null
  });
  const success = response => response.text().then(createHelloAction);

  const action = get('/v1', { success, fail: jest.fn() });
  const gen = fetchSaga(action);

  // first yield (call, waiting for fetch response)
  gen.next();
  // second yield (got fetch response, waiting for next action)
  gen.next(response);
  // third yield, (got next action, should return it correctly)
  expect(gen.next(createHelloAction(text))).toEqual({
    done: false,
    value: put(createHelloAction(text))
  });
});

test('the fetch saga will call the fail action creator when it gets an error', () => {
  const text = 'i am some useless text :)';
  const response = new Response(text, { status: 400 });

  const success = jest.fn();
  const error = new Error('Failed http code.');
  const fail = err => ({ type: 'ERROR', payload: err, error: true });

  const action = get('/v1', { success, fail });
  const gen = fetchSaga(action);

  // first yield (call, waiting for fetch response)
  gen.next();
  // second yield (got fetch response, waiting for next action)
  gen.next(response);
  expect(success).toBeCalledWith(response);
  // throw an error
  expect(gen.throw(error)).toEqual({
    done: false,
    value: put(fail(error))
  });
  expect(gen.next()).toEqual({ done: true });
});
