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
    const action = yield call(success, response)
    yield put(action);
  } catch (e) {
    yield put(fail(e));
  }
}

export default function* sagaWatcher() {
  yield takeEvery(FETCH, fetchSaga);
}
