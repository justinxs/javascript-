import Vue from 'vue';
import Toast from "./Toast.vue";

const defaultOptions = {
    type: 'text',
    value: true,
    message: '',
    className: '',
    onClose: null,
    onOpened: null,
    duration: 3000,
    getContainer: 'body'
};
function isObj(x) {
    return !!x && ({}).toString.call(x) === "[object Object]"
}
function parseOptions(message) {
    return isObj(message) ? message : {message}
}
  
let instance;
const initInstance = () => {
	instance = new(Vue.extend(Toast))({
		el: document.createElement('div')
	});
};

const toastService = options => {
	return new Promise((resolve, reject) => {
		if (!instance) {
			initInstance();
		}
        options = parseOptions(options);
        options = {
          ...defaultOptions,
          ...options
        };

        options.clear = () => {
            instance.value = false;
            clearTimeout(instance.timer);
            if (options.onClose) {
                options.onClose();
            }
        };
        
        clearTimeout(instance.timer);
    
        if (options.duration > 0) {
            instance.timer = setTimeout(() => {
                instance.clear();
          }, options.duration);
        }
        
		Object.assign(instance, options, {
			resolve,
			reject
        });
        
        let container = document.querySelector(instance.getContainer);
        if (container && !container.contains(instance.$el)) {
            container.appendChild(instance.$el)
        } else if (!container) {
            document.body.appendChild(instance.$el)
        }
	});
}

toastService.clear = () => {
    instance && instance.clear()
};

Toast.install = (Vue) => {
    Vue.component(Toast.name, Toast);
    Vue.prototype.$toast = toastService;
};

export default Toast;