import { GET, POST, DELETE, get, post, del } from '../src/actions';

test('the `get` action creator is correct', () => {
  const success = jest.fn();
  const fail = jest.fn();

  const expected = {
    type: GET,
    payload: { url: '/v1', success, fail },
    error: null
  };
  expect(get('/v1', { success, fail })).toEqual(expected);
});

test('the `post` action creator is correct', () => {
  const success = jest.fn();
  const fail = jest.fn();
  const body = { hello: 'world' };
  const fetchOptions = { };

  const expected = {
    type: POST,
    payload: { url: '/v1', body, success, fail, ...fetchOptions },
    error: null
  };
  expect(post('/v1', { body, success, fail, ...fetchOptions })).toEqual(
    expected
  );
});

test('the `post` action creator allows different bodies and headers', () => {
  const success = jest.fn();
  const fail = jest.fn();
  const body = '<hello>world</hello>';
  const fetchOptions = { headers: { 'Content-Type': 'application/xml' } };

  const expected = {
    type: POST,
    payload: { url: '/v1', body, success, fail, ...fetchOptions },
    error: null
  };
  expect(post('/v1', { body, success, fail, ...fetchOptions })).toEqual(
    expected
  );
});
