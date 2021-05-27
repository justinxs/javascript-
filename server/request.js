const { URL } = require('url')
const qs = require('querystring')
const net = require('net')

class Request {
    constructor(req, proxy = false) {
        this.req = req
        this.proxy = proxy
        this.originalUrl = req.url
    }
    get method() {
        return this.req.method;
    }
    set method(val) {
        this.req.method = val;
    }

    get header() {
        return this.req.headers;
    }
    set header(val) {
        this.req.headers = val;
    }

    get headers() {
        return this.req.headers;
    }
    set headers(val) {
        this.req.headers = val;
    }

    get protocol() {
        if (this.socket.encrypted) return 'https';
        if (!this.proxy) return 'http';
        const proto = this.get('X-Forwarded-Proto');
        return proto ? proto.split(/\s*,\s*/, 1)[0] : 'http';
    }

    get host() {
        let host = this.proxy && this.get('X-Forwarded-Host');
        if (!host) {
            if (this.req.httpVersionMajor >= 2) host = this.get(':authority');
            if (!host) host = this.get('Host');
        }
        if (!host) return '';
        return host.split(/\s*,\s*/, 1)[0];
    }

    get origin() {
        return `${this.protocol}://${this.host}`;
    }

    get URL() {
        /* istanbul ignore else */
        if (!this.memoizedURL) {
            const originalUrl = this.originalUrl || ''; // avoid undefined in template string
            try {
                this.memoizedURL = new URL(originalUrl, this.origin);
            } catch (err) {
                this.memoizedURL = Object.create(null);
            }
        }
        return this.memoizedURL;
    }

    get hostname() {
        const host = this.host;
        if (!host) return '';
        if ('[' === host[0]) return this.URL.hostname || ''; // IPv6
        return host.split(':', 1)[0];
    }

    get url() {
        return this.req.url;
    }
    set url(val) {
        this.req.url = val;
    }

    get path() {
        return this.URL.pathname;
    }
    set path(path) {
        const url = this.URL;
        if (url.pathname === path) return;

        url.pathname = path;
        url.path = null;

        this.url = url.toString();
    }


    get href() {
        // support: `GET http://example.com/foo`
        if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
        return this.origin + this.originalUrl;
    }

    get querystring() {
        if (!this.req) return '';
        return this.URL.search.replace(/^\?/, '') || '';
    }
    set querystring(str) {
      const url = this.URL;
      if (url.search === `?${str}`) return;

      url.search = str;
      url.path = null;

      this.url = url.toString();
    }

    get query() {
        const str = this.querystring;
        const c = this._querycache = this._querycache || {};
        return c[str] || (c[str] = qs.parse(str));
    }
    set query(obj) {
        this.querystring = qs.stringify(obj);
    }
    
    get search() {
        if (!this.querystring) return '';
        return `?${this.querystring}`;
    }
    set search(str) {
        this.querystring = str;
    }
    
    
    get fresh() {
        const method = this.method;
        const s = this.ctx.status;

        // GET or HEAD for weak freshness validation only
        if ('GET' !== method && 'HEAD' !== method) return false;

        // 2xx or 304 as per rfc2616 14.26
        if ((s >= 200 && s < 300) || 304 === s) {
            return fresh(this.header, this.response.header);
        }

        return false;
    }
    get stale() {
        return !this.fresh;
    }
    get idempotent() {
        const methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
        return !!~methods.indexOf(this.method);
    }
    get socket() {
        return this.req.socket;
    }

    get charset() {
        try {
            const { parameters } = contentType.parse(this.req);
            return parameters.charset || '';
        } catch (e) {
            return '';
        }
    }

    get length() {
        const len = this.get('Content-Length');
        if (len === '') return;
        return ~~len;
    }
    
    
    get secure() {
        return 'https' === this.protocol;
    }

    get ips() {
        const proxy = this.app.proxy;
        const val = this.get(this.app.proxyIpHeader);
        let ips = proxy && val
            ? val.split(/\s*,\s*/)
            : [];
        if (this.app.maxIpsCount > 0) {
            ips = ips.slice(-this.app.maxIpsCount);
        }
        return ips;
    }
    get ip() {
        if (!this[IP]) {
            this[IP] = this.ips[0] || this.socket.remoteAddress || '';
        }
        return this[IP];
    }
    set ip(_ip) {
        this[IP] = _ip;
    }
    
    get subdomains() {
        const offset = this.app.subdomainOffset;
        const hostname = this.hostname;
        if (net.isIP(hostname)) return [];
        return hostname
            .split('.')
            .reverse()
            .slice(offset);
    }
    
    get accept() {
        return this._accept || (this._accept = accepts(this.req));
    }
    
    set accept(obj) {
        this._accept = obj;
    }

    accepts(...args) {
        return this.accept.types(...args);
    }
    
    acceptsEncodings(...args) {
        return this.accept.encodings(...args);
    }
    
    acceptsCharsets(...args) {
        return this.accept.charsets(...args);
    }
    
    acceptsLanguages(...args) {
        return this.accept.languages(...args);
    }
    is(type, ...types) {
        return typeis(this.req, type, ...types);
    }
    get type() {
        const type = this.get('Content-Type');
        if (!type) return '';
        return type.split(';')[0];
    }
    get(field) {
        const req = this.req;
        switch (field = field.toLowerCase()) {
            case 'referer':
            case 'referrer':
            return req.headers.referrer || req.headers.referer || '';
            default:
            return req.headers[field] || '';
        }
    }
    
    inspect() {
        if (!this.req) return;
        return this.toJSON();
    }
    
    toJSON() {
        return only(this, [
            'method',
            'url',
            'header'
        ]);
    }
}

module.exports = Request