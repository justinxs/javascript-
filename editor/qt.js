import {QWebChannel} from 'qwebchannel'
import md5 from 'md5'
import http from './http'

class QT {
    constructor({bridgeName, connectName}) {
        this.isDev = process.env.NODE_ENV === 'development';
        this.bridgeName = bridgeName;
        this.connectName = connectName;
        this.qtBridge = null;
        this.eventMap = {};
        this.waitQueue = [];
        this.buildBridge();
    }
    buildBridge() {
        const that = this;
        const install = () => {
            new QWebChannel(window.qt.webChannelTransport, (channel) => {
                that.qtBridge = channel.objects[that.bridgeName];
                that.waitQueue.forEach(cb => cb(that.qtBridge));
                that.waitQueue = [];
                // that.connectName && that.qtBridge[that.connectName].connect(that.eventHandle);
            })
            // 接收qt消息
            window[that.connectName] = that.eventHandle.bind(that)
        };
        if (document.readyState === "complete" || (document.readyState !== "loading" && window.qt && window.qt.webChannelTransport)) {
			window.setTimeout(install);
		} else {
			window.addEventListener("load", install);
		}
    }
    getBridge(callback) {
        if (!this.qtBridge) {
            console.warn('qtBridge is not inited now')
            callback && this.waitQueue.push(callback);
        } else {
            callback && callback(this.qtBridge)
        }
    }
    sendMessage(message) {
        this.getBridge(qtBridge => {
            qtBridge.jsSend(JSON.stringify(message))
        })
    }
    eventHandle(message) {
        let eventName = message.action;
        let callbackId = message.callbackId;
        this.emit(eventName, message, callbackId)
    }
    getRegister(eventName, callback) {
        let register = null;
        if (!eventName || !(callback && callback instanceof Function)) {
            console.error(callback && callback instanceof Function ? 'eventName is required' : 'callback function is required')
        } else {
            let index = undefined;
            const group = this.eventMap[eventName];
            if (group) {
                for (let i = 0; i < group.length; i++) {
                    const item = group[i]
                    if (item.callback === callback) {
                        index = i
                        break
                    }
                }

                register = {group, index, isRegist: index !== undefined}
            }
        }
        return register
    }
    on(eventName, callback, callbackId = '') {
        let register = this.getRegister(eventName, callback);
        if (register) {
            !register.isRegist && register.group.push({callbackId, callback})
        } else {
            this.eventMap[eventName] = [
                {callbackId, callback}
            ]
        }
    }
    once(eventName, callback, callbackId = '') {
        const onceCallback = (...arg) => {
            this.off(eventName, onceCallback)
            callback(...arg)
        }
        this.on(eventName, onceCallback, callbackId)
    }
    off(eventName, callback) {
        let register = this.getRegister(eventName, callback);
        if (register && register.isRegist) {
            register.group.splice(register.index, 1)
        }
    }
    emit(eventName, data, callbackId = '') {
        const callbackGroup = this.eventMap[eventName];
        if (callbackGroup) {
            for (let i = 0; i < callbackGroup.length; i++) {
                const item = callbackGroup[i];
                if (!callbackId) {
                    !item.callbackId && item.callback(data)
                } else {
                    callbackId === item.callbackId && item.callback(data)
                }
            }
        }
    }
    getCallbackId(key = '') {
        return key + Date.now() + parseInt(Math.random() * 10000)
    }
    getBaseApi() {
        return this.isDev ? '/api' : window.WEB_CONFIG.apiurl;
    }
    getDevHeaders() {
        let headers = {}
        if(window.salt) {
            let timestamp = new Date().getTime();
            let signature = md5(`${window.UUID}${timestamp}${salt}${window.token || ''}`)
            headers = {
                'x-token': window.token || '',
                'x-value':`${window.SERVICE_ID}-${window.SERVICE_ID},${window.UUID},${timestamp},1.0.0,${window.LANG_CODE}`,
                'signature': signature
            }
        }
        return headers
    }
    nativeGet(url, params, header) {
        return http.get(url, params, header)
    }
    nativePost(url, params, header) {
        return http.post(url, params, header)
    }
    get(url, params, header) {
        if (this.isDev) {
            return http.get(this.getBaseApi() + url, params, Object.assign(this.getDevHeaders(), header))
        } else {
            return new Promise((resolve, reject) => {
                const callbackId = this.getCallbackId('header_getted')
                this.once('header_getted', message => {
                    const defaultHeader = message.data;
                    resolve(http.get(this.getBaseApi() + url, params, Object.assign(defaultHeader, header)))
                }, callbackId);

                this.sendMessage({action: 'get_header', callbackId});
            })
        }
    }
    post(url, params, header) {
        if (this.isDev) {
            return http.post(this.getBaseApi() + url, params, Object.assign(this.getDevHeaders(), header))
        } else {
            return new Promise((resolve, reject) => {
                const callbackId = this.getCallbackId('header_getted')
                this.once('header_getted', message => {
                    const defaultHeader = message.data;
                    resolve(http.post(this.getBaseApi() + url, params, Object.assign(defaultHeader, header)))
                }, callbackId);

                this.sendMessage({action: 'get_header', callbackId});
            })
        }
    }
    put(url, params, data, header) {
        if (this.isDev) {
            return http.put(this.getBaseApi() + url, params, data, Object.assign(this.getDevHeaders(), header))
        } else {
            return new Promise((resolve, reject) => {
                const callbackId = this.getCallbackId('header_getted')
                this.once('header_getted', message => {
                    const defaultHeader = message.data;
                    resolve(http.put(this.getBaseApi() + url, params, data, Object.assign(defaultHeader, header)))
                }, callbackId);

                this.sendMessage({action: 'get_header', callbackId});
            })
        }
        
    }
    delete(url, params, data, header) {
        if (this.isDev) {
            return http.delete(this.getBaseApi() + url, params, data, Object.assign(this.getDevHeaders(), header))
        } else {
            return new Promise((resolve, reject) => {
                const callbackId = this.getCallbackId('header_getted')
                this.once('header_getted', message => {
                    const defaultHeader = message.data;
                    resolve(http.delete(this.getBaseApi() + url, params, data, Object.assign(defaultHeader, header)))
                }, callbackId);

                this.sendMessage({action: 'get_header', callbackId});
            })
        }
    }
    postForm(url, data, header) {
        if (this.isDev) {
            return http.postForm(this.getBaseApi() + url, data, Object.assign(this.getDevHeaders(), header))
        } else {
            return new Promise((resolve, reject) => {
                const callbackId = this.getCallbackId('header_getted')
                this.once('header_getted', message => {
                    const defaultHeader = message.data;
                    resolve(http.postForm(this.getBaseApi() + url, params, data, Object.assign(defaultHeader, header)))
                }, callbackId);

                this.sendMessage({action: 'get_header', callbackId});
            })
        }
    }
    destroy() {
        this.qtBridge = null;
        this.eventMap = {};
        this.waitQueue = [];
    }
}
export default QT