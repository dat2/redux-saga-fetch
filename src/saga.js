import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH } from './actions';

// success is an action creator that takes the JSON response
// fail is an action creator that takes any error that was called
export function* fetchSaga({
  payload: { method, url, success, fail, ...fetchOptions }
}) {
  try {
    const response = yield call(fetch, url, {
      method,
      credentials: 'include',
      ...fetchOptions
    });
    const json = yield call(() => response.json());
    yield put(success(json));
  } catch (e) {
    yield put(fail(e));
  }
}

export default function* saga() {
  yield takeEvery(FETCH, fetchSaga);
}
