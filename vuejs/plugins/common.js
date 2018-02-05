import _ from 'lodash'

if (process.browser)
  window._ = _;
else
  global._ = _;
