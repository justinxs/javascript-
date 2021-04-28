<template>
    <transition name="toast">
        <div class="toast-view" :class="className" v-if="value">
            <div class="toast-content">{{message}}</div>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'Toast',
    props: {
        value: {
            type: [Boolean, Number]
        },
        message: {
            type: [String, Number]
        },
        className: {
            type: String
        }
    },

    data () {
        return {
            
        }
    },
    components: {
    },
    watch: {
       
    },
    created () {

    },
    mounted () {
        
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
    @keyframes toast-fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes toast-fade-out {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .toast {
        &-enter-active {
            animation: .3s toast-fade-in;
        }
        &-leave-active {
            animation: .3s toast-fade-out;
        }
    }

    .toast-view {
        position: fixed;
        top: 50%;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10005;
        text-align: center;
        line-height: 30px;
        transform: translateY(-50%);
        font-size: 0;
    }
    .toast-content {
        word-break: break-all;
        word-wrap: break-word;
        display: inline-block;
        padding: 0 20px;
        color: #fff;
        font-size: 14px;
        border-radius: 30px;
        background-color: #e91244;
        max-width: 100%;
        min-width: 120px;
    }
</style>