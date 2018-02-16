export const FETCH = '@@redux-saga-fetch/FETCH';

export const withJsonResponse = success => r => r.json().then(success);

const createFetchActionCreator = method => (
  url,
  { success, fail, ...fetchOptions }
) => ({
  type: FETCH,
  payload: { method, url, success, fail, ...fetchOptions },
  error: null
});

const createFetchFunction = method => {
  const func = createFetchActionCreator(method);
  func.json = (url, { body, headers, success, ...fetchOptions }) => {
    if (body) {
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers = {
        ...headers,
        'Content-Type': 'application/json'
      };
    }

    if (success) {
      fetchOptions.success = withJsonResponse(success);
    }

    return func(url, fetchOptions);
  };

  return func;
};

export const get = createFetchFunction('GET');
export const post = createFetchFunction('POST');
export const del = createFetchFunction('DELETE');
