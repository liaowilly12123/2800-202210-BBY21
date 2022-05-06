'use strict';
// Utility functions for sending json data
// Modified from here
// https://stackoverflow.com/questions/35782223/how-to-extend-express-js-res-object-in-nodejs
module.exports = function(_, res, next) {
    res.success = function(payload) {
        return res.json({
            success: true,
            payload: payload
        })
    }

    res.fail = function(payload) {
        return res.json({
            success: false,
            payload: payload
        })
    }

    next()
}
