'use strict';

const utility = require('utility');
const util = require('util');

module.exports = (options, app) => {
    return function* accesslogMiddleware(next) {
        yield next;
        const data = {
            ip: this.get('X-Real-IP') || this.ip,
            port: this.get('X-Real-Port') || '-',
            xForwardedFor: this.get('x-forwarded-for') || '-',
            method: this.method,
            url: this.url,
            host: this.host || '-',
            protocol: this.protocol.toUpperCase(),
            statusCode: this.status || '-',
            contentLength: this.length || '-',
            userAgent: this.get('user-agent') || '-',
            referer: this.get('referrer') || '-',
            datetime: utility.logDate(','),
            serverTime: this.response.get('X-Server-Response-Time') || '-',
        };

        let content = '';
        if (typeof options.format === 'function') {
            // 自定义格式
            content = options.format(data);
        } else {
            content = util.format('%s %s "%s %s %s" %s %s "%s" "%s" "%s" "%s" %s "%s"',
                data.datetime,
                data.ip,
                data.method,
                data.url,
                data.protocol,
                data.statusCode,
                data.contentLength,
                data.referer,
                data.userAgent,
                data.xForwardedFor,
                data.host,
                data.serverTime,
                data.port);
        }
        app.getLogger('accessLogger').write(content);
    };
};
