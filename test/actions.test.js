import { FETCH, get, post, del } from '../src/actions';

test('the `get` action creator is correct', () => {
  const success = jest.fn();
  const fail = jest.fn();

  const expected = {
    type: FETCH,
    payload: { method: 'GET', url: '/v1', success, fail },
    error: null
  };
  expect(get('/v1', { success, fail })).toEqual(expected);
});

test('the `post` action creator allows different bodies and headers', () => {
  const success = jest.fn();
  const fail = jest.fn();
  const body = '<hello>world</hello>';
  const fetchOptions = { headers: { 'Content-Type': 'application/xml' } };

  const expected = {
    type: FETCH,
    payload: {
      method: 'POST',
      url: '/v1',
      body,
      success,
      fail,
      ...fetchOptions
    },
    error: null
  };
  expect(post('/v1', { body, success, fail, ...fetchOptions })).toEqual(
    expected
  );
});

test('the `post.json` action creator is correct', () => {
  const success = jest.fn();
  const fail = jest.fn();
  const body = { hello: 'world' };

  const expected = {
    type: FETCH,
    payload: {
      method: 'POST',
      url: '/v1',
      body: JSON.stringify(body),
      success,
      fail,
      headers: { 'Content-Type': 'application/json' }
    },
    error: null
  };
  expect(post.json('/v1', { body, success, fail })).toEqual(expected);
});

test('the `del` action creator is correct', () => {
  const success = jest.fn();
  const fail = jest.fn();

  const expected = {
    type: FETCH,
    payload: { method: 'DELETE', url: '/v1', success, fail },
    error: null
  };
  expect(del('/v1', { success, fail })).toEqual(expected);
});
