import { del, FETCH, get, post } from '../src/actions';

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

test('the `.json` action creators auth-convert json', () => {
  const success = jest.fn();

  const body = { hello: 'world' };
  const mockResponseData = { status: 'ok' };
  const mockResponseObj = new Response(JSON.stringify(mockResponseData));

  const action = post.json('/v1', { body, success });
  const payload = action.payload;
  expect(payload.body).toEqual(JSON.stringify(body));
  expect(payload.headers).toEqual({ 'Content-Type': 'application/json' });

  return payload
    .success(mockResponseObj)
    .then(() => expect(success).toHaveBeenCalledWith(mockResponseData));
});
