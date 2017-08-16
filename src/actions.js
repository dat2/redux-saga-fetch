export const GET = '@@redux-saga/GET';
export const POST = '@@redux-saga/POST';
export const DELETE = '@@redux-saga/DELETE';

/**
 * This returns a GET action, with a success action creator and a fail action creator.
 * 
 * @param {*} url 
 * @param {*} { success, fail } 
 */
export function get(url, { success, fail }) {
  return {
    type: GET,
    payload: { url, success, fail },
    error: null
  };
}

export function post(url, { body, success, fail, ...fetchOptions }) {
  return {
    type: POST,
    payload: { url, body, success, fail, ...fetchOptions },
    error: null
  };
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
  return {
    type: DELETE,
    payload: { url, success, fail },
    error: null
  };
}
