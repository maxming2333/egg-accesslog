'use strict';

module.exports = app => {
    app.config.coreMiddleware.push('accesslog');
};
