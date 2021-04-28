<template>
    <div v-on="$listeners">
        <div class="ani-wrap" :class="{'center': center}" ref="wrap">
            <div 
                ref="content" 
                class="ani-content" 
                :class="{'slide-move': moveState}" 
                :style="{'animation-name': moveState ? animationName : '', 'animation-duration': aniDuration + 's'}" 
                v-html="content">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        // 触发动画事件 hover click 默认自动
        trigger: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        alignCenter: {
            type: Boolean,
            default: false
        },
        // 每秒移动像素
        aniSpeed: {
            type: Number,
            default: 30
        },
        // 自定义动画
        animationName: {
            type: String,
            default: 'ani-move'
        }
    },
    data () {
        return {
            moveState: false,
            center: false,
            aniDuration: 0,
        }
    },
    watch: {
        content(val) {
            this.refresh()
        }
    },
    components: {
    },
    created () {
    },
    mounted () {
        this.initMove();
    },
    methods: {
        isExceedContent() {
            const wrap = this.$refs.wrap;
            const content = this.$refs.content;
            const wrapWidth = wrap.getBoundingClientRect().width;
            const contentWidth = content.getBoundingClientRect().width;
            return {wrapWidth, contentWidth, isExceed: wrapWidth < contentWidth}
        },
        initMove() {
            this.$nextTick(() => {
                let {isExceed} = this.isExceedContent();
                if (!this.trigger) {
                    this.setAnimate()
                } else if (this.trigger && isExceed) {
                    this.triggerInstance = this.setTrigger(this.$refs.wrap, this.trigger);
                }
            })
        },
        refresh() {
            this.$nextTick(() => {
                let {isExceed} = this.isExceedContent();
                if (this.triggerInstance && !isExceed) {
                    this.triggerInstance.clear();
                    this.triggerInstance = null;
                } else if (this.trigger) {
                    this.triggerInstance = this.setTrigger(this.$refs.wrap, this.trigger);
                }

                (this.moveState || !this.trigger) && this.setAnimate();
            })
        },
        setTrigger(target, trigger) {
            const mouseenterHandle = e => {
                this.setAnimate()
            };
            const mouseleaveHandle = e => {
                this.setAnimate(true)
            };
            const clickHandle = e => {
                this.setAnimate(this.moveState)
            };
            const triggerMap = {
                hover: [
                    {eventName: 'mouseenter', callback: mouseenterHandle},
                    {eventName: 'mouseleave', callback: mouseleaveHandle}
                ],
                click: [
                    {eventName: 'click', callback: clickHandle}
                ],
                // TODO
            };
            
            let curTrigger = triggerMap[trigger];
            if (curTrigger) {
                curTrigger.forEach(item => {
                    target.addEventListener(item.eventName, item.callback);
                });
            }

            return {
                target,
                clear() {
                    if (curTrigger) {
                        curTrigger.forEach(item => {
                            target.removeEventListener(item.eventName, item.callback);
                        });
                    }
                }
            }
        },
        setAnimate(stop = false) {
            this.$nextTick(() => {
                let {isExceed, wrapWidth, contentWidth} = this.isExceedContent();
                this.moveState = !stop && isExceed;
                this.aniDuration = this.moveState ? contentWidth / this.aniSpeed : 0;
                this.center = !this.moveState && wrapWidth > contentWidth && this.alignCenter;
            })
        }
    },
    beforeDestroy() {
        this.triggerInstance && this.triggerInstance.clear()
    }
}
</script>
<style lang="scss" scoped>
    .ani-wrap {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        &.center {
            justify-content: center;
        }
        .ani-content {
            white-space: nowrap;
        }
    }
    .slide-move {
        animation-timing-function: linear;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-direction: normal;
        animation-fill-mode: none;
        animation-play-state: running;
    }
</style>
<style lang="scss">
    // @keyframes ani-move {
    //     0% {
    //         transform: translateX(calc(0% + 30px));
    //     }
    //     100% {
    //         transform: translateX(calc(-100% + 30px));
    //     }
    // }
    @keyframes ani-move {
        0% {
            margin-left: 100%;
            transform: translateX(0%);
        }
        100% {
            margin-left: 0%;
            transform: translateX(-100%);
        }
    }
</style>