var _ = require('underscore');

module.exports = {
  IS_MOBILE: ('ontouchstart' in window),
  OBSERVE: (_.isFunction(Object.observe) && _.isFunction(Array.observe))
};
