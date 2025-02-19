import { put, call } from 'redux-saga/effects'
import _isString from 'lodash/isString'
import Debug from 'debug'

import UIActions from 'redux/actions/ui'

import {
  getCategories,
} from '../../../api'

const debug = Debug('swetrix:rx:s:load-projects')

export default function* loadExtensions() {
  try {
    const {
      category,
    } = yield call(getCategories)

    yield put(UIActions.setCategory(category))
  } catch ({ message }) {
    if (_isString(message)) {
      yield put(UIActions.setExtensionsError(message))
    }
    debug('failed to load projects: %s', message)
  }
}
