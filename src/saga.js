import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH } from './actions';

export function* fetchSaga({
  payload: { method, url, success, fail, ...fetchOptions }
}) {
  try {
    const response = yield call(fetch, url, {
      method,
      credentials: 'include',
      ...fetchOptions
    });
    const next = yield call(Promise.resolve, success(response));
    yield put(next);
  } catch (e) {
    yield put(fail(e));
  }
}

export default function* saga() {
  yield takeEvery(FETCH, fetchSaga);
}
