<template>
    <div class="chat-editor">
        <!-- emoji表情 -->
        <emoji-gif @select="selectEmoji" v-if="isShowEmoji"></emoji-gif>
        <!-- 插入外链 -->
        <add-link @add="insertLink" v-if="isAddLink"></add-link>

        <div class="editor-box">
            <vue-scroll :ops="ops" ref="vs">
                <div 
                    id="editor"
                    class="editor" 
                    ref="editor" 
                    contenteditable="true" 
                    @focus="focusEditor"
                    @blur="blurEditor"
                    @click="changeSelection"
                    @keyup="changeSelection"
                    @keydown="enterHandle">
                </div>
            </vue-scroll>
            <p class="editor-placeholder" v-show="isPlaceholder" @click="placeholderClick">{{lang.obs_chat_placeholder}}</p>
        </div>
        <ani-content class="send-btn" :class="{'disabled': isDisabled}" :content="lang.obs_chat_send" :alignCenter="true" @click="send"></ani-content>
    </div>
</template>
<script>
import aniContent from '@/components/aniContent'
import emojiGif from './emojiGif'
import addLink from './addLink'
import vueScroll from 'vuescroll/dist/vuescroll-native'
import roomAction from '@/pages/room/mixin/roomAction'
import {hasUnicode, unicodeSize, unicodeToArray} from '@/js/unicode'
export default {
    mixins: [roomAction],
    data () {
        return {
            isShowEmoji: false,
            isAddLink: false,
            visible: true,
            ops: {
                vuescroll: {
                    mode: 'native',
                    sizeStrategy: 'number',
                    detectResize: false
                },
                scrollPanel: {
                    initialScrollY: false,
                    initialScrollX: false,
                    scrollingX: false,
                    scrollingY: true,
                    speed: 300,
                    easing: undefined,
                    verticalNativeBarPos: 'right',
                    maxHeight: undefined,
                    maxWidth: undefined
                },
                rail: {
                    background: '#666666',
                    opacity: 0,
                    size: '4px',
                    specifyBorderRadius: false,
                    gutterOfEnds: null,
                    gutterOfSide: '2px',
                    keepShow: false
                },
                bar: {
                    showDelay: 500,
                    onlyShowBarOnScroll: true,
                    keepShow: true,
                    background: '#cccccc',
                    opacity: 1,
                    hoverStyle: false,
                    specifyBorderRadius: false,
                    minSize: false,
                    size: '4px',
                    disable: false
                }
            },
            isPlaceholder: false,
            lastEditRange: null,
            isFocus: false,
            startMove: false,
            atMembers: [],
            atLimit: Infinity,
            lastSendTime: 0,
            lastSendContent: ''
        }
    },
    components: {
        aniContent,
        vueScroll,
        emojiGif,
        addLink,
    },
    computed: {
        lang() {
            return this.$store.state.lang
        },
        globalAtMembers() {
            return this.$store.state.chat.globalAtMembers
        },
        liveStatus() {
            return this.$store.state.chat.liveStatus
        },
        isDisabled() {
            return this.liveStatus != 0
        },
        roomInfo() {
            return this.$store.state.chat.roomInfo
        },
        userInfo() {
            return this.$store.state.userInfo
        },
        memberLiveInfo() {
            return this.$store.state.chat.memberLiveInfo
        },
        privsData() {
            return this.$store.state.chat.privsData
        },
        privs() {
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
            return this.privsData.privs || [];
        },
        sendInterval() {
            // Lv0限制为5秒，Lv1及以上限制为3秒，勾选了不受发言时间间隔限制no_send_interval
            // tips 发言太频繁了
            let limit = this.privsData.sendInterval || 5;
            if (this.privs.includes('no_send_interval')) {
                limit = 0
            }
            return limit
        },
        sendLength() {
            // Lv0及以上发言不能超过100字符，勾选了no_send_length不受此逻辑限制
            // tips 发言字数超长
            let limit = this.privsData.sendLength || 100;
            if (this.privs.includes('no_send_length')) {
                limit = Infinity
            }
            return limit
        },
        sendRepeatInterval() {
            // 重复消息发送的时间间隔为20秒，勾选了no_send_length不受此逻辑限制
            // tips 请勿刷屏
            let limit = this.privsData.sendRepeatInterval || 20;
            if (this.privs.includes('no_send_repeat')) {
                limit = 0
            }
            return limit
        },
        dayChatLimit() {
            // Lv0及以上单日发言次数限制为99999999，勾选了no_day_chat_limit不受此逻辑限制
            // tips 今日发言次数已满
            let limit = this.privsData.dayChatLimit || 99999999;
            if (this.privs.includes('no_day_chat_limit')) {
                limit = Infinity
            }
            return limit
        },
        numLength() {
            // 超过9位数会提示发言违规请修改，勾选了no_num_length不受此逻辑限制
            // tips 发言内容连续数字超长
            let limit = this.privsData.numLength || 9;
            if (this.privs.includes('no_num_length')) {
                limit = Infinity
            }
            return limit
        },
        riskControlList() {
            // 类型  0、IP黑名单 1、特殊词库 2、违规词库 3、封杀词库
            return this.$store.state.chat.riskControlList
        }

    },
    watch: {
        globalAtMembers(val) {
            this.consumeGlobalAtMembers()
        },
        isShowEmoji(val) {
            this.refreshScroll()
        },
        isAddLink(val) {
            this.refreshScroll()
        }
    },
    created () {
        
    },
    mounted () {
        this.togglePlaceholder();
        this.inputInstance = this.compositeInput('#editor', this.contentChange);
        window.addEventListener('resize', this.winResize)
    },
    activated() {
        this.visible = true;
        this.refreshScroll()
        this.consumeGlobalAtMembers();
    },
    deactivated() {
        this.visible = false;
    },
    methods: {
        winResize(e) {
            this.resizeTimer && clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => {
                if (this.visible) {
                    this.refreshScroll()
                }
            }, 300);
        },
        refreshScroll() {
            this.$nextTick(() => {
                const scroller = this.$refs.vs;
                if (scroller) {
                    scroller.refresh();
                    scroller.scrollTo({y: '100%'}, 0)
                }
            })
        },
        insertLink({url, content, target}) {
            const link = document.createElement('a');
            link.href = url;
            link.innerText = content;
            this.insertContent(link)
        },
        selectEmoji(code) {
            this.insertContent(code)
        },
        consumeGlobalAtMembers() {
            let members = this.globalAtMembers;
            if (members && members.length > 0 && this.visible) {
                this.$nextTick(() => {
                    members.forEach(member => this.atMember(member))
                });
                this.clearGlobalAtMembers();
            }
        },
        enterHandle(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                // shift+enter 换行 enter发送
                let no_limit_say = this.privs.includes('no_limit_say');
                e.shiftKey ? (no_limit_say && this.insertContent(document.createElement('br'))) : this.send();
            }
        },
        placeholderClick() {
            this.$refs.editor.focus()
        },
        togglePlaceholder() {
            const editor = this.$refs.editor;
            let hasContent = !!editor.innerHTML.replace(/<!---->/g, '');
            if (!this.isFocus && !hasContent && !this.isPlaceholder) {
               this.isPlaceholder = true;
            } else if (this.isPlaceholder) {
                this.isPlaceholder = false;
            }
        },
        changeSelection(e) {
            let selection = window.getSelection()
            this.lastEditRange = selection.getRangeAt(0);
        },
        focusEditor() {
            this.isFocus = true;
            this.togglePlaceholder()
        },
        blurEditor() {
            this.isFocus = false;
            this.togglePlaceholder()
        },
        stayScroll() {
            const scroller = this.$refs.vs;
            if (scroller) {
                const {scrollTop} = scroller.getPosition();
                this.$nextTick(() => {
                    if (scrollTop != scroller.getPosition().scrollTop) {
                        scroller.scrollTo({y: scrollTop}, 0);
                    }
                })
            }
        },
        textCountLimit({parentNode, limit = 0, ignoreId, ignoreClass}) {
            let textCount = 0;
            let isOverstep = false;
            const rootNode = parentNode;
            const isRoot = (el, rootNode) => rootNode === el;
            const hasId = (el, id) => id && el.id === id;
            const hasClass = (el, className) => {
                if (className) {
                    return Array.isArray(className) 
                        ? className.some(name => el.classList && el.classList.contains(name)) 
                        : el.classList && el.classList.contains(className)
                }
                return false
            };
            const removeNode = el => {
                if (!isRoot(el, rootNode) && !hasId(el, ignoreId) && !hasClass(el, ignoreClass)) {
                    el.parentNode.removeChild(el)
                }
            };
            const handler = el => {
                if (textCount >= limit) {
                    removeNode(el)
                    isOverstep = true;
                } else {
                    if (el.nodeType === Node.TEXT_NODE) {
                        // 注意unicode编码字符(emoji)的影响
                        let value = el.nodeValue,
                        isHasUnicode = hasUnicode(value),
                        len = isHasUnicode ? unicodeSize(value) : value.length;
                        if (textCount + len > limit) {
                            el.nodeValue = isHasUnicode ? unicodeToArray(value).slice(0, limit - textCount).join('') : value.slice(0, limit - textCount);
                            textCount = limit;
                            isOverstep = true;
                        } else {
                            textCount += len;
                        }
                    } else if (el.nodeType === Node.ELEMENT_NODE) {
                        if (!hasId(el, ignoreId) && !hasClass(el, ignoreClass)) {
                            let childNodes = Array.prototype.slice.call(el.childNodes);
                            if (childNodes.length > 0) {
                                childNodes.forEach(element => handler(element))
                            }
                        }
                    }
                }
            }
            handler(rootNode)
            return {textCount, isOverstep}
        },
        getAtMembers() {
            const editor = this.$refs.editor;
            const atMemberTags = [...editor.querySelectorAll('span.at-member[data-id]')]
            return atMemberTags.map(tag => {
                return {
                    toId: +tag.getAttribute('data-id'),
                    toNick: tag.getAttribute('data-nickname')
                }
            })
        },
        insertHtml(content, position = 'last') {
            const editor = this.$refs.editor;
            editor.innerHTML = position === 'prev' ? content + editor.innerHTML : editor.innerHTML + content;
            this.setRangeEnd(editor);
            this.isPlaceholder = false;
            // 主动触发输入事件
            this.contentChange(editor)
        },
        insertContent(content, position) {
            const editor = this.$refs.editor;
            const rangeInsert = (editor, element) => {
                let childs = [...editor.childNodes];
                let childLen = childs.length;
                editor.focus();
                let selection = window.getSelection();
                let range = null;
                if (this.lastEditRange) {
                    selection.removeAllRanges();
                    selection.addRange(this.lastEditRange);
                }
                if (selection.anchorNode.nodeType != Node.TEXT_NODE) {
                    if (childLen == 1 && childs[0].nodeType == Node.COMMENT_NODE) {
                        editor.insertBefore(element, childs[0].nextSibling)
                    } else if (childLen > 0 && selection.anchorOffset > 0) {
                        for (var i = 0; i < childLen; i++) {
                            if (i == selection.anchorOffset - 1) {
                                editor.insertBefore(element, childs[i].nextSibling)
                                break;
                            }
                        }
                    } else {
                        editor.appendChild(element)
                    }
                    range = document.createRange()
                    range.selectNodeContents(element.parentNode)
                    range.setStart(element.parentNode, selection.anchorOffset + 1)
                } else {
                    let oldNode = selection.anchorNode;
                    let lastChild = oldNode.splitText(selection.anchorOffset);
                    oldNode.parentNode.insertBefore(element, lastChild);
                    // 末尾插入多一个换行标签实现换行
                    if (!lastChild.nodeValue && element.nodeName === 'BR') {
                        oldNode.parentNode.insertBefore(document.createElement('br'), lastChild);
                    }
                    range = document.createRange()
                    range.selectNodeContents(lastChild)
                    range.setStart(lastChild, 0)
                }
                range.collapse(true)
                selection.removeAllRanges()
                selection.addRange(range)
                this.lastEditRange = selection.getRangeAt(0);
            };
            let element = content instanceof HTMLElement ? content : document.createTextNode(content);
            if (position) {
                position === 'prev' ? editor.insertBefore(element, editor.firstChild) : editor.appendChild(element);
                this.setRangeEnd(editor)
            } else {
                rangeInsert(editor, element);
            }
            this.isPlaceholder = false;
            // 主动触发输入事件
            this.contentChange(editor)
        },
        clearEditor() {
            const editor = this.$refs.editor;
            editor.innerHTML = '';
            this.atMembers = [];
            // 主动触发输入事件
            this.contentChange(editor)
            this.togglePlaceholder()
        },
        atMember(member) {
            if (!this.privs.includes('at_say')) return console.log('您暂无@权限')
            // 实际@用户集合保存在html里面
            this.atMembers = this.getAtMembers();
            if (!this.atMembers.some(item => item.toId == member.memberId)) {
                if (this.atMembers.length < this.atLimit) {
                    // 标签属性顺序不可变，保证后面正则匹配生效
                    const content = document.createElement('span');
                    content.setAttribute('class', 'at-member');
                    content.setAttribute('data-id', member.memberId);
                    content.setAttribute('data-nickname', member.nickname);
                    content.setAttribute('contenteditable', false);
                    content.innerText = `@${member.nickname}`;

                    this.atMembers.push({
                        toId: member.memberId,
                        toNick: member.nickname,
                    });
                    this.insertContent(content, 'prev');
                } else if (this.atLimit > 0) {
                    // 超出@用户限制，先进先出规则替换
                    const atTags = editor.querySelectorAll('span.at-member[data-id]');
                    const firstInTag = atTags[atTags.length - 1];
                    firstInTag.parentNode.removeChild(firstInTag);
                    this.atMember(member);
                }
            }
        },
        compositeInput(target, callback) {
            const isString = val => Object.prototype.toString.call(val) === "[object String]";
            const isDom = val => val instanceof HTMLElement;
            if (!isDom(target = isString(target) ? document.querySelector(target) : target)) return;

            let flag = false;
            let cp_start_cb = e => flag = true;
            let cp_end_cb = e => {
                flag = false;
                callback && callback(e.target, 'compositionend')
            };
            let input_cb = e => {
                !flag && callback && callback(e.target, 'input')
            };
            let blur_cb = e => callback && callback(e.target, 'blur');

            target.addEventListener('compositionstart', function (e) {
                cp_start_cb(e)
            }, false);
            target.addEventListener('compositionend', function (e) {
                cp_end_cb(e)
            }, false);
            target.addEventListener('input', function (e) {
                input_cb(e)
            }, false);
            target.addEventListener('blur', function (e) {
                blur_cb(e)
            }, false);
            
            return {
                target,
                clear() {
                    target.removeEventListener('compositionstart', cp_start_cb, false);
                    target.removeEventListener('compositionend', cp_end_cb, false);
                    target.removeEventListener('input', input_cb, false);
                    target.removeEventListener('blur', blur_cb, false);
                }
            }
        },
        contentChange(target, action = 'input') {
            const content = target.innerHTML;
            let _content = this.contentHandle(content, false);
            let isReset = _content !== content;
            if (isReset) {
                // 替换所有html内容
                target.innerHTML = _content;
            }
            // 字数限制(DOM操作去除多出的文字与标签，返回纯文字字数)
            let {textCount, isOverstep} = this.textCountLimit({
                parentNode: target, 
                limit: this.sendLength, 
                ignoreClass: 'at-member'
            });
            isReset = isReset || textCount >= this.sendLength;

            if (isReset && action !== 'blur') {
                this.setRangeEnd(target)
            }
            // 更新@用户
            this.atMembers = this.getAtMembers();
            // isOverstep && this.$toast('字数超出限制')
        },
        contentHandle(content, replaceAt = true) {
            const no_limit_say = this.privs.includes('no_limit_say');
            const allTagReg = /<\/?(?!a|\/a).+?\/?>/g;
            const illegalTagReg = /<\/?script|link|video|img.*?\/?>/ig;
            const atReg = /<span class="at-member"[^>]*>.*?<\/span>/ig;
            const atIdReg = /<span class="at-member" data-id="(\w+)"[^>]*>.*?<\/span>/i;

            let atMembers = this.atMembers;
            let existMemberIds = [];
            let tagReg = no_limit_say ? illegalTagReg : allTagReg;
            if (replaceAt) {
                // 去除@用户的标签
                content = content.replace(atReg, '').replace(tagReg, '');
            } else {
                // 替换非法@用户（如：复制粘贴）标签为纯文本，避免污染@用户集合
                let tagMatches = content.match(atReg) || [];
                let atTags = [...tagMatches].map(atTag => {
                    let idMatches = atIdReg.exec(atTag);
                    let isPaste = !idMatches;
                    if (idMatches) {
                        let curId = idMatches[1];
                        let isExist = existMemberIds.some(id => id == curId);
                        !isExist && existMemberIds.push(curId);
                        isPaste = isExist || !atMembers.some(item => item.toId == curId)
                    }
                    return isPaste ? atTag.replace(allTagReg, '') : atTag
                });

                let fragments = content.split(atReg).map(fragment => fragment.replace(tagReg, ''));
                content = fragments.reduce((c, f, i) => {
                    c += i > 0 ? atTags[i - 1] + f : f;
                    return c
                }, '');
            }
            
            content = this.aTagHandler(content)

			return content
        },
        aTagHandler(content) {
            // 外链限制，去除a标签多余的属性只保留href避免样式奇奇怪怪
            const send_url = this.privs.includes('send_url');
            const aTagHandle = content => {
                const linkReg = /<a.*?href="(\S+)".*?>(.+?)<\/a>/ig;
                return content.replace(linkReg, !send_url ? '$2' : '<a href="$1">$2</a>')
            }
            const aTextTagHandle = content => {
                const linkReg = /(<|\&lt;)a.*?href="(\S+)".*?(>|\&gt;)(.+?)(<|\&lt;)\/a(>|\&gt;)/ig;
                return content.replace(linkReg, !send_url ? '$4' : '<a href="$2">$4</a>')
            }
            
            return aTagHandle(content)
        },
        setRangeEnd(target) {
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(target);
            range.setStart(target, target.childNodes.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            this.lastEditRange = selection.getRangeAt(0);
        },
        isEmpty(content, gif) {
            const emptyReg = /(&nbsp;)|(\s+)|(\n)|(\r)/ig;
            return !(content && content.replace(emptyReg, '')) && !gif
        },
        riskController(content) {
            const no_filter_dic = this.privs.includes('no_filter_dic');
            const no_replace_dic = this.privs.includes('no_replace_dic');
            const no_black_dic = this.privs.includes('no_black_dic');
            const regxpCodeHandle = (str = '') => {
                // 需要转义的正则特殊符号
                const regxpCodes = ['^', '$', '(', ')', '[', ']', '+', '.', '?', '!'];
                return regxpCodes.reduce((val, code) => {
                    const regCode = '\\' + code;
                    return val.replace(new RegExp(regCode, 'g'), regCode)
                }, str)
            };
            const replaceSpecial = (str, specialCode) => {
                // 去除特殊字符
                const reg = new RegExp(regxpCodeHandle(specialCode), 'ig')
                return str.replace(reg, '')
            }
            const testContent = (str, code, specialCode) => {
                // 包含违规字符或者经过特殊字符过滤后包含违规字符
                const reg = new RegExp(regxpCodeHandle(code), 'i')
                return reg.test(str) || specialCode && reg.test(replaceSpecial(str, specialCode))
            }
            const specialCodeItem = this.riskControlList.filter(item => item.type == 1)[0];
            const specialCode = specialCodeItem ? specialCodeItem.value : '';
            for (let i = 0; i < this.riskControlList.length; i++) {
                const item = this.riskControlList[i];
                const type = item.type;
                // 0、IP黑名单 1、特殊词库 2、违规词库 3、封杀词库
                switch (type) {
                    case 0:
                        // 纯前端js无法获取本机ip
                        // if (new RegExp(item.value, 'g').test(ip)) {
                        //     return 'IP异常，发言失败'
                        // }
                        break;
                    case 1:
                        break;
                    case 2:
                        if (!no_filter_dic && testContent(content, item.value, !no_replace_dic ? specialCode : '')) {
                            return this.lang.obs_say_illegal_content
                        }
                        break;
                    case 3:
                        if (!no_black_dic && testContent(content, item.value, !no_replace_dic ? specialCode : '')) {
                            return this.lang.obs_say_illegal_content
                        }
                        break;
                
                    default:
                        break;
                }
            }
        },
        beforeSend() {
            const eidtor = this.$refs.editor;
            let content = eidtor.innerHTML;
            let atIds = this.getAtMembers();
            let result = {
                code: 1,
                data: this.contentHandle(content),
                toMember: atIds,
                msg: ''
            }
            // 未登录
            if (!this.userInfo || !this.userInfo.id) {
                result.code = 500;
                result.msg = this.lang.obs_un_login
                return result
            }
            // 被全局禁言或者房间禁言
            const muteInfo = this.memberLiveInfo.mute;
            if (muteInfo && muteInfo.status == 0 && (muteInfo.expireTime == -1 || Math.floor(Date.now() / 1000) <= muteInfo.expireTime)) {
                result.code = 500;
                result.msg = muteInfo.type == 1 ? this.lang.obs_be_room_muted : this.lang.obs_be_muted
                return result
            }
            // 主播已经下播
            if (this.liveStatus != 0) {
                result.code = 500;
                result.msg = this.lang.obs_anchor_off_live
                return result
            }
            // 请输入发言内容
            if (this.isEmpty(result.data)) {
                result.code = 500;
                result.msg = this.lang.obs_input_word_please
                return result
            }
            // 您暂无@权限
            if (result.toMember.length > 0 && !this.privs.includes('at_say')) {
                result.code = 500;
                result.msg = this.lang.obs_has_no_at;
                return result
            }
            // 今日发言次数已满
            if (this.privsData.dayChatCount > this.dayChatLimit) {
                result.code = 500;
                result.msg = this.lang.obs_daliy_say_full
                return result
            }
            // 请勿刷屏
            if (result.data === this.lastSendContent && Date.now() - this.lastSendTime < this.sendRepeatInterval * 1000) {
                result.code = 500;
                result.msg = this.lang.obs_dont_say_same
                return result
            }
            // 发言太频繁了
            if (this.lastSendTime && Date.now() - this.lastSendTime < this.sendInterval * 1000) {
                result.code = 500;
                result.msg = this.lang.obs_say_too_fast
                return result
            }
            
            // 发言内容连续数字超长
            if (this.numLength != Infinity && new RegExp(`\\d{${this.numLength}}`).test(result.data)) {
                result.code = 500;
                result.msg = this.lang.obs_content_number_limit
                return result
            }

            // 违规字符限制，TODO--ip限制
            const riskMessage = this.riskController(result.data);
            if (riskMessage) {
                result.code = 500;
                result.msg = riskMessage;
                return result
            }
            
            return result
        },
        send() {
            if (this.sending) return console.log('发送中');

            const result = this.beforeSend();
            if (result.code == 1) {
                this.sending = true;
                const sendFn = result.toMember.length > 0 ? this.sendAtMessage : this.sendMessage;
                sendFn(result.data, result.toMember).then(data => {
                    this.sending = false;
                    this.lastSendTime = Date.now();
                    this.lastSendContent = result.data;
                    this.$store.commit('chat/setPrivsData', Object.assign({}, this.privsData, {dayChatCount: this.privsData.dayChatCount + 1}))
                    this.clearEditor();
                }).catch(err => {
                    this.sending = false;
                    console.error(err);
                    window.$qt.sendMessage({
                        action: 'toast',
                        data: {
                            content: this.lang.obs_send_fail
                        }
                    })
                });
            } else {
                console.log(result.msg)
                window.$qt.sendMessage({
                    action: 'toast',
                    data: {content: result.msg}
                })
            }
        }
    },
    beforeDestroy() {
        this.inputInstance && this.inputInstance.clear()
        window.removeEventListener('resize', this.winResize)
        this.resizeTimer && clearTimeout(this.resizeTimer)
    }
}
</script>
<style lang="scss" scoped>
    .chat-editor {
        flex: none;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 34px;
        background-color: #222222;
        .editor-box {
            position: relative;
            flex: auto;
            width: 0;
            height: 100%;
            overflow: hidden;
        }
        .editor {
            width: 100%;
            line-height: 1.5em;
            font-size: 12px;
            padding: 8px 4px 8px 10px;
            color: #fff;
            box-sizing: border-box;
            word-break: break-all;
        }
        .editor-placeholder {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            line-height: 34px;
            font-size: 12px;
            color: #666666;
            padding-left: 10px;
            box-sizing: border-box;
            z-index: 2;
        }
        .send-btn {
            flex: none;
            width: auto;
            min-width: 56px;
            max-width: 150px;
            height: 100%;
            line-height: 34px;
            padding: 0 6px;
            text-align: center;
            background-color: #ff4700;
            color: #fff;
            font-size: 12px;
            box-sizing: border-box;
            cursor: pointer;
            user-select: none;
            &.disabled {
                background-color: #999999;
            }
        }
    }
</style>
<style lang="scss">
    .editor {
        a {
            color: #4992ff;
        }
    }
    .at-member {
        margin-right: 4px;
    }
</style>