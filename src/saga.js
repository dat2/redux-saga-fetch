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
    yield put(yield call(success, response));
  } catch (e) {
    yield put(yield call(fail, e));
  }
}

export default function* saga() {
  yield takeEvery(FETCH, fetchSaga);
}
