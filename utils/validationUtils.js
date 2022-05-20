'use strict';
// Checks if data is undefined and sends a fail message back to the client if it
// is.
// Returns true if data is undefined, else false
function validate(res, data, msg) {
  if (typeof data === 'undefined' || data === null) {
    res.fail(msg);
    return true;
  }
  return false;
}

module.exports = validate;
