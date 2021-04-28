import directive from './directive';
import service from './service';
/**
 * 指令调用 v-loading 修饰符 fullscreen|body|lock 参数绑定当前el loading-size | loading-text | loading-spinner | loading-background | loading-custom-class
 * 服务调用 let instance = Loading.service(options); instance.close();
 * vue实例方法调用 let instance = this.$loading(options); instance.close();
 * 全局调用 let instance = window.loading(options); instance.close();
 * 
 * @param {String} size loading icon大小，可选min,sm,md,lg,max。默认是sm
 * @param {String} text loading文字提示，默认空
 * @param {String} spinner 自定义icon样式class
 * @param {String} background mask 背景颜色，默认transparent
 * @param {String} customClass 自定义class
 * @param {Boolean} fullscreen 是否全屏显示
 * @param {String|Element} target 挂载元素
 * @param {Boolean} visible 是否显示
 * 
 * 注：该组件依赖Vue,由于使用了Vue.extend()实例化
 */
export default {
    install(Vue) {
        Vue.use(directive);
        Vue.prototype.$loading = service;
    },
    directive,
    service
};