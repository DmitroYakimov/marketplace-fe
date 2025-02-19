import { put, call } from 'redux-saga/effects'
import _map from 'lodash/map'
import _isString from 'lodash/isString'
import Debug from 'debug'

import UIActions from 'redux/actions/ui'

import { ENTRIES_PER_PAGE_DASHBOARD } from 'redux/constants'
import {
  getExtensions, getOverallStats,
} from '../../../api'

const debug = Debug('swetrix:rx:s:load-projects')

export default function* loadExtensions({ payload: { take = ENTRIES_PER_PAGE_DASHBOARD, skip = 0 } }) {
  try {
    yield put(UIActions.setExtensionsLoading(true))

    let {
      // eslint-disable-next-line prefer-const
      extensions, count,
    } = yield call(getExtensions, take, skip)

    const pids = _map(extensions, result => result.id)
    let overall

    try {
      overall = yield call(getOverallStats, pids)
    } catch (e) {
      debug('failed to overall stats: %s', e)
    }

    extensions = _map(extensions, res => ({
      ...res,
      overall: overall?.[res.id],
    }))

    yield put(UIActions.setExtensions(extensions))
    yield put(UIActions.setTotal(count))
  } catch ({ message }) {
    if (_isString(message)) {
      yield put(UIActions.setExtensionsError(message))
    }
    debug('failed to load projects: %s', message)
  }
}
