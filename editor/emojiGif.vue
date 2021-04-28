<template>
    <div class="emoji-gif" ref="main">
        <span class="smile-face" @click="toggole">☺</span>
        <transition name="slide-emoji">
            <div class="face-panel" v-show="isShow">
                <span class="emoji-item" v-for="code in emojiList" :key="code" @click="select(code)">{{code}}</span>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isShow: false,
            emojiList: [
                '😀',
                '😁',
                '😂',
                '😃',
                '😄',
                '😅',
                '😆',
                '😉',
                '😊',
                '😋',
                '😎',
                '😍',
                '😘',
                '😗',
                '😙',
                '😚',
                '😇',
                '😐',
                '😑',
                '😶',
                '😏',
                '😣',
                '😥',
                '😮',
                '😯',
                '😪',
                '😫',
                '😴',
                '😌',
                '😛',
                '😜',
                '😝',
                '😒',
                '😓',
                '😔',
                '😕',
                '😲',
                '😷',
                '😖',
                '😞',
                '😟',
                '😤',
                '😢',
                '😭',
                '😦',
                '😧',
                '😨',
                '😬',
                '😰',
                '😱',
                '😳',
                '😵',
                '😡',
                '😠',
                '😈',
                '👿',
                '👹',
                '👺',
                '👻',
                '💀'
            ]
        }
    },
    components: {
    },
    created () {
    },
    mounted () {
        window.addEventListener('click', this.globalClick)
    },
    methods: {
        toggole() {
            this.isShow = !this.isShow
        },
        close() {
            this.isShow = false
        },
        select(code) {
            this.$emit('select', code)
        },
        globalClick(e) {
            const main = this.$refs.main;
            const target = e.target;
            if (this.isShow && main !== target && !main.contains(target)) {
                this.close()
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('click', this.globalClick)
    }
}
</script>
<style lang="scss" scoped>
    .emoji-gif {
        flex: none;
        width: 34px;
        height: 100%;
        cursor: pointer;
        user-select: none;
        .smile-face {
            display: flex;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: 20px;
            &:hover {
                color: #ff4700;
            }
        }
        .face-panel {
            position: absolute;
            left: 0;
            bottom: 100%;
            width: 210px;
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            background-color: #222;
            .emoji-item {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                font-size: 16px;
                cursor: pointer;
                &:hover {
                    font-size: 18px;
                    background-color: #ddd;
                }
            }
        }
    }
</style>
<style lang="scss">
    .slide-emoji-enter-active {
        animation: slide-emoji .5s ease-in;
    }
    .slide-emoji-leave-active {
        animation: slide-emoji .5s reverse ease-out;
    }
    @keyframes slide-emoji {
        0% {
            transform: translateX(-100%);
            opacity: 0;
        }
        50% {
            transform: translateX(10%);
            opacity: 1;
        }
        100% {
            transform: translateX(0);
        }
    }
</style>