import { all, call, put, takeEvery } from 'redux-saga/effects';
import { GET, POST, DELETE } from './actions';

// success is an action creator that takes the JSON response
// fail is an action creator that takes any error that was called
export function* getSaga({ payload: { url, success, fail, ...fetchOptions } }) {
  try {
    const response = yield call(fetch, url, {
      credentials: 'include',
      ...fetchOptions
    });
    const json = yield call(() => response.json());
    yield put(success(json));
  } catch (e) {
    yield put(fail(e));
  }
}

// success is an action creator that takes the JSON response
// fail is an action creator that uses the fail
export function* postSaga({
  payload: { url, body, success, fail, ...fetchOptions }
}) {
  try {
    const response = yield call(fetch, url, {
      method: 'POST',
      body,
      credentials: 'include',
      ...fetchOptions
    });
    const json = yield call(() => response.json());
    yield put(success(json));
  } catch (e) {
    yield put(fail(e));
  }
}

// assuming that delete takes no response (201 created response), success is an action creator
// fail is an action creator
export function* deleteSaga({
  payload: { url, success, fail, ...fetchOptions }
}) {
  try {
    yield call(fetch, url, {
      method: 'DELETE',
      credentials: 'include',
      ...fetchOptions
    });
    yield put(success());
  } catch (e) {
    yield put(fail(e));
  }
}

export default function* saga() {
  yield all([
    takeEvery(GET, getSaga),
    takeEvery(POST, postSaga),
    takeEvery(DELETE, deleteSaga)
  ]);
}
