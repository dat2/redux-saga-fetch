export const FETCH = '@@redux-saga/FETCH';

function createFetchAction({ method, ...fetchOptions }) {
  return {
    type: FETCH,
    payload: { method, ...fetchOptions },
    error: null
  };
}

export function get(url, { success, fail }) {
  return createFetchAction({
    method: 'GET',
    url,
    success,
    fail
  });
}

export function post(url, { body, success, fail, ...fetchOptions }) {
  return createFetchAction({
    method: 'POST',
    url,
    body,
    success,
    fail,
    ...fetchOptions
  });
}

post.json = function json(
  url,
  { body, success, fail, headers = {}, ...fetchOptions }
) {
  return post(url, {
    body: JSON.stringify(body),
    success,
    fail,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...fetchOptions
  });
};

export function del(url, { success, fail }) {
  return createFetchAction({
    method: 'DELETE',
    url,
    success,
    fail
  });
}
