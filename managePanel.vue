<template>
    <div class="manage-panel" ref="main" :style="position">
        <div class="manage-list" v-if="show">
            <ani-content 
                class="manage-item"
                :class="{'disabled': item.loading}"
                trigger="hover"
                v-for="item in renderActionList" 
                :key="item.command" 
                :content="item.text" 
                @click="commandHandle(item)">
            </ani-content>
        </div>
    </div>
</template>
<script>
import aniContent from '@/components/aniContent'
import {isFollow} from '@/services/member.service'
import {getForbidStatus, roomManageList} from '@/services/chat.service'
export default {
    props: {
        // 操作面板包含的命令
        containCommands: {
            type: Array,
            default: () => ['follow', 'at', 'kitout', 'roomMute', 'roomManage']
        }
    },
    data () {
        return {
            show: false,
            position: {},
            detail: null,
            actionList: [],
        }
    },
    components: {
        aniContent
    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
        roomInfo() {
            return this.$store.state.chat.roomInfo
        },
        userInfo() {
            return this.$store.state.userInfo || {}
        },
        privsData() {
            return this.$store.state.chat.privsData
        },
        renderActionList() {
            return this.actionList.map(action => {
                return {
                    ...action,
                    text: action.text || (action.status ? this.lang[action.cancelTextCode] : this.lang[action.textCode])
                }
            })
        }
    },
    created () {
    },
    mounted () {
        this.positionParent = this.getParent();
        window.addEventListener('click', this.globalClick)
    },
    methods: {
        getParent() {
            const main = this.$refs.main;
            const parentPosition = target => {
                const parent = target.parentNode;
                if (parent) {
                    const styleObj = window.getComputedStyle(parent, null);
                    if (styleObj.getPropertyValue('position') !== 'static') {
                        return parent
                    } else {
                        return parentPosition(parent)
                    }
                } else {
                    return target
                }
            }
            return parentPosition(main)
        },
        getActionList(detail) {
            // send_url	可发外链
            // no_send_interval	不受发言时间间隔限制
            // no_send_length	不受字符长度限制
            // no_send_repeat	不受重发发送限制
            // no_filter_dic	不受过滤词库逻辑限制
            // no_replace_dic	不受特殊字符库逻辑限制
            // no_black_dic	不受封杀词库逻辑限制
            // no_day_chat_limit	不限制单日发言次数
            // no_limit_say	不過濾HTML標簽
            // no_num_length	不受连续数字长度限制
            // at_say	可@发言
            // live_charge	开播可设置收费
            // home_transfer	个人主页开放转增入口
            // home_chat	个人主页开放私聊入口~~~~
            // remove_avatar	删除用户头像
            // remove_nickname	删除用户昵称
            // forbid_account	账号禁用
            // forbid_live	禁播
            // global_mute	全局禁言
            // publish_notice	发公告
            // force_off_live	强制下播
            // whisper	可私聊
            // accept_transfer	可转赠
            // room_lock	可设置密码房

            // room_mute	房间禁言
            // kickout_room	踢出房间
            // top_msg	置顶消息
            const privs = this.privsData.privs || [];
            const isMyRoom = this.userInfo.id == this.roomInfo.anchorId;
            const isRoomOwner = detail.memberId == this.roomInfo.anchorId;
            const atSayPrivs = privs.includes('at_say');
            const kitoutPrivs = isMyRoom || privs.includes('kickout_room');
            const mutePrivs = isMyRoom || privs.includes('room_mute');
            const allList = [
                {command: 'follow', show: true, status: false, loading: true, textCode: 'obs_follow', cancelTextCode: 'obs_follow_cancel'},
                {command: 'at', show: atSayPrivs, status: false, loading: false, text: '@TA'},
                // {command: 'kitout', show: kitoutPrivs && !isRoomOwner, status: false, loading: true, textCode: 'obs_kitout_room', cancelTextCode: 'obs_kitout_cancel'},
                // {command: 'roomMute', show: mutePrivs && !isRoomOwner, status: false, loading: true, textCode: 'obs_mute_room', cancelTextCode: 'obs_mute_cancel'},
                // {command: 'roomManage', show: isMyRoom, status: false, loading: true, textCode: 'obs_room_manage_set', cancelTextCode: 'obs_room_manage_cancel'},
            ];
            let actionList = allList.filter(item => item.show && this.containCommands.includes(item.command));
            let {
                followItem, 
                forbidonItems, 
                roomManageItem
            } = actionList.reduce((obj, item) => {
                switch (item.command) {
                    case 'follow':
                        obj.followItem = item
                        break;
                    case 'roomManage':
                        obj.roomManageItem = item
                        break;
                    case 'kitout':
                    case 'roomMute':
                        obj.forbidonItems.push(item)
                        break;
                    default:
                        break;
                }
                return obj
            }, {
                followItem: null, 
                forbidonItems: [], 
                roomManageItem: null
            });

            if (followItem) {
                isFollow(detail.memberId).then(data => {
                    followItem.loading = false;
                    followItem.status = data.code == 1 ? data.data.isFollow : item.status;
                });
            }
            if (forbidonItems.length > 0) {
                getForbidStatus({
                    memberId: detail.memberId,
                    anchorId: this.roomInfo.anchorId
                }).then(data => {
                    for (let i = 0; i < forbidonItems.length; i++) {
                        const item = forbidonItems[i];
                        switch (item.command) {
                            case 'roomMute':
                                item.loading = false;
                                item.status = data.code == 1 ? data.data.roomMute : item.status;
                                break;
                            case 'kitout':
                                item.loading = false;
                                item.status = data.code == 1 ? data.data.kickOutRoom : item.status;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            if (roomManageItem) {
                roomManageList({
                    anchorId: this.roomInfo.anchorId,
                    page: 1,
                    limit: 1000
                }).then(data => {
                    roomManageItem.loading = false;
                    roomManageItem.status = data.code == 1 ? data.data.items.some(manager => manager.memberId == detail.memberId) : roomManageItem.status;
                })
            }

            return actionList
        },
        open(detail, {x, y}) {
            if (!this.userInfo || !this.userInfo.id || this.userInfo.id == detail.memberId) return;
            const parentLayout = this.positionParent.getBoundingClientRect();

            this.actionList = this.getActionList(detail);
            this.show = false;
            this.detail = detail;
            this.position = {
                left: x - parentLayout.left + 'px',
                top: y - parentLayout.top + 'px'
            };
            setTimeout(() => {
                this.show = true;
            }, 0);
        },
        close() {
            this.show = false;
            this.detail = null;
            this.actionList = [];
        },
        globalClick(e) {
            const main = this.$refs.main;
            const target = e.target;
            if (this.show && main !== target && !main.contains(target)) {
                this.close()
            }
        },
        commandHandle(event) {
            if (!event.loading) {
                this.$emit('command', {event, detail: this.detail})
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('click', this.globalClick)
    }
}
</script>
<style lang="scss" scoped>
    .manage-panel {
        position: absolute;
        z-index: 10;
        .manage-list {
            padding: 5px;
            border: 1px solid #666666;
            background-color: #333333;
            box-sizing: border-box;
        }
        .manage-item {
            width: auto;
            max-width: 110px;
            min-width: 80px;
            line-height: 24px;
            font-size: 12px;
            color: #ffffff;
            box-sizing: border-box;
            user-select: none;
            cursor: pointer;
            &:hover {
                color: #f14603;
            }
            &.disabled {
                opacity: 0.2;
                color: #999999;
                cursor: auto;
                &:hover {
                    color: #999999;
                }
            }
        }
    }
</style>