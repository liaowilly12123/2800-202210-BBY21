'use strict';

const sanitize = require('mongo-sanitize');

// Sanitize all body / query / params using mongo-sanitize
module.exports = function (req, _, next) {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  req.query = sanitize(req.query);
  next();
};
