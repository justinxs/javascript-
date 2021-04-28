<template>
    <div class="add-link">
        <span class="link-tag" @click="toggleLink">
            <i class="link-icon-white"></i>
            <i class="link-icon-red"></i>
        </span>
        <div class="add-link-form" v-show="isShow">
            <div class="link-form-item">
                <span class="link-form-label">{{lang.obs_link}}：</span>
                <input class="link-form-input" type="text" v-model="formData.url" :placeholder="lang.obs_link_placeholder">
            </div>
            <div class="link-form-item">
                <span class="link-form-label">{{lang.obs_content}}：</span>
                <input class="link-form-input" type="text" v-model="formData.content" :placeholder="lang.obs_content_placeholder">
            </div>
            <div class="link-form-footer">
                <span class="link-form-btn cancel" @click="close">{{lang.obs_common_cancel}}</span>
                <span class="link-form-btn confirm" :class="{'disabled': isDisabled}" @click="add">{{lang.obs_live_room_add}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isShow: false,
            formData: {
                url: '',
                content: ''
            }
        }
    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
        isDisabled() {
            let {url, content} = this.formData;
            return !url || !content
        }
    },
    components: {
    },
    created () {
    },
    mounted () {
    },
    methods: {
        toggleLink() {
            this.isShow = !this.isShow
        },
        close() {
            this.isShow = false
            this.formData = {
                url: '',
                content: ''
            }
        },
        add() {
            if (!this.isDisabled) {
                this.$emit('add', this.formData)
                this.close()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .add-link {
        flex: none;
        width: 34px;
        height: 100%;
        .link-tag {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
            .link-icon-red {
                display: none;
            }
            &:hover {
                .link-icon-white {
                    display: none;
                }
                .link-icon-red {
                    display: inline-block;
                }
            }
        }

        .add-link-form {
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            width: 100vw;
            z-index: 9;
            background-color: #222;
            .link-form-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 34px;
                width: 100%;
                padding: 0 10px;
                box-sizing: border-box;
            }
            .link-form-label {
                flex: none;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                font-size: 12px;
                color: #fff;;
            }
            .link-form-input {
                flex: auto;
                padding-left: 10px;
                border: 0;
                background-color: #333;
                color: #333;
                font-size: 12px;
                height: 30px;
                line-height: 30px;
                color: #fff;
                box-sizing: border-box;
            }
            .link-form-footer {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 4px;
            }
            .link-form-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2px 10px;
                cursor: pointer;
                color: #fff;
                font-size: 12px;
                margin-right: 10px;
                &:nth-last-of-type(1) {
                    margin-right: 0;
                }
                &.cancel {
                    background-color: #666;
                }
                &.confirm {
                    background-color: #ff4700;
                }
                &.disabled {
                    background-color: #666;
                }
            }
        }
    }
</style>