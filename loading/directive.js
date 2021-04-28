import Vue from 'vue';
import Loading from './loading.vue';
import { addClass, removeClass, getStyle } from './dom';
import { afterLeave } from './transition';
const isServer = Vue && Vue.prototype.$isServer;
const Mask = Vue.extend(Loading);

const loadingDirective = {};
loadingDirective.install = Vue => {
    if (isServer) return;
    const toggleLoading = (el, binding) => {
        if (binding.value) {
            Vue.nextTick(() => {
                //  是否存在fullscreen 修饰符
                if (binding.modifiers.fullscreen) {
                    el.originalPosition = getStyle(document.body, 'position');
                    el.originalOverflow = getStyle(document.body, 'overflow');
                    el.maskStyle.zIndex = 10003;

                    addClass(el.mask, 'is-fullscreen');
                    insertDom(document.body, el, binding);
                } else {
                    removeClass(el.mask, 'is-fullscreen');
                    //  是否存在body 修饰符
                    if (binding.modifiers.body) {
                        el.originalPosition = getStyle(document.body, 'position');

                        ['top', 'left'].forEach(property => {
                            const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
                            el.maskStyle[property] = el.getBoundingClientRect()[property] +
                                document.body[scroll] +
                                document.documentElement[scroll] -
                                parseInt(getStyle(document.body, `margin-${ property }`), 10) +
                                'px';
                        });
                        ['height', 'width'].forEach(property => {
                            el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
                        });

                        insertDom(document.body, el, binding);
                    } else {
                        el.originalPosition = getStyle(el, 'position');
                        insertDom(el, el, binding);
                    }
                }
            });
        } else {
            afterLeave(el.instance, _ => {
                el.domVisible = false;
                const target = binding.modifiers.fullscreen || binding.modifiers.body
                ? document.body
                : el;
                removeClass(target, 'kx-loading-parent--relative');
                removeClass(target, 'kx-loading-parent--hidden');
                el.instance.hiding = false;
            }, 300, true);
            el.instance.visible = false;
            el.instance.hiding = true;
        }
    };
    const insertDom = (parent, el, binding) => {
        if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
            Object.keys(el.maskStyle).forEach(property => {
                el.mask.style[property] = el.maskStyle[property];
            });
            if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
                addClass(parent, 'kx-loading-parent--relative');
            }
            if (binding.modifiers.fullscreen && binding.modifiers.lock) {
                addClass(parent, 'kx-loading-parent--hidden');
            }
            el.domVisible = true;
            parent.appendChild(el.mask);
            Vue.nextTick(() => {
                if (el.instance.hiding) {
                    el.instance.$emit('after-leave');
                } else {
                    el.instance.visible = true;
                }
            });
            el.domInserted = true;
        }
    };

    Vue.directive('loading', {
        bind: function(el, binding, vnode) {
            const sizeExr = el.getAttribute('loading-size');
            const textExr = el.getAttribute('loading-text');
            const spinnerExr = el.getAttribute('loading-spinner');
            const backgroundExr = el.getAttribute('loading-background');
            const customClassExr = el.getAttribute('loading-custom-class');
            const vm = vnode.context;
            const mask = new Mask({
                el: document.createElement('div'),
                data: {
                    size: vm && vm[sizeExr] || sizeExr || 'sm',
                    text: vm && vm[textExr] || textExr,
                    spinner: vm && vm[spinnerExr] || spinnerExr,
                    background: vm && vm[backgroundExr] || backgroundExr,
                    customClass: vm && vm[customClassExr] || customClassExr,
                    fullscreen: !!binding.modifiers.fullscreen
                }
            });
            el.instance = mask;
            el.mask = mask.$el;
            el.maskStyle = {};

            binding.value && toggleLoading(el, binding);
        },

        update: function(el, binding) {
            el.instance.setText(el.getAttribute('loading-text'));
            if (binding.oldValue !== binding.value) {
                toggleLoading(el, binding);
            }
        },

        unbind: function(el, binding) {
            if (el.domInserted) {
                el.mask &&
                el.mask.parentNode &&
                el.mask.parentNode.removeChild(el.mask);
                toggleLoading(el, { value: false, modifiers: binding.modifiers });
            }
            el.instance && el.instance.$destroy();
        }
    });
};

export default loadingDirective;
