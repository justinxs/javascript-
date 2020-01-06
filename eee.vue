<template>
    <div class="reward-gifts" style="overflow:hidden;">

        <transition-group name="gifts" tag="div">
            <div class="item" :id="'gifts' + item.id" :class="item.color" v-for="item in list" :key="item.id">
                <div class="reward-info">
                    <img class="user-avatar" src="https://memberfiles.hlqczs.com/images/headPortrait/heard_gh10.png" alt="">
                    <div class="name-info">
                        <div class="user-name">{{item.userName}}</div>
                        <div class="gifts-name">送出<span class="name">{{item.giftsName}}</span></div>
                    </div>
                </div>
                <div class="gifts-animation">
                    <canvas height="90" width="90"></canvas>
                    <canvas height="50" width="80" style="vertical-align: top;margin-top: 30px;margin-left: 34px;"></canvas>
                </div>
            </div>


            
        </transition-group>

        <!-- <transition name="gifts">
            <div class="item green" v-show="showItem1">
                <div class="reward-info">
                    <img class="user-avatar" src="https://memberfiles.hlqczs.com/images/headPortrait/heard_gh10.png" alt="">
                    <div class="name-info">
                        <div class="user-name">上天的秀儿</div>
                        <div class="gifts-name">送出<span class="name">傳國玉璽</span></div>
                    </div>
                </div>
                <div class="gifts-animation">
                    
                </div>
            </div>
        </transition>
        <transition name="gifts">
            <div class="item pink" v-show="showItem2">
                <div class="reward-info">
                    <img class="user-avatar" src="https://memberfiles.hlqczs.com/images/headPortrait/heard_gh10.png" alt="">
                    <div class="name-info">
                        <div class="user-name">上天的秀儿</div>
                        <div class="gifts-name">送出<span class="name">傳國玉璽</span></div>
                    </div>
                </div>
                <div class="gifts-animation">

                </div>
            </div>
        </transition> -->

        <!-- <div v-for="gift in svgaList" :key="gift.id">
            <transition name="gifts">
                <div class="item" :id="'gift-' + gift.id" v-show="gift.show" :class="gift.info.color">
                    <div class="reward-info">
                        <img class="user-avatar" src="https://memberfiles.hlqczs.com/images/headPortrait/heard_gh10.png" alt="">
                        <div class="name-info">
                            <div class="user-name">{{gift.info.userName}}</div>
                            <div class="gifts-name">送出<span class="name">{{gift.info.giftsName}}</span></div>
                        </div>
                    </div>
                    <div class="gifts-animation">
                        <canvas height="90" width="90"></canvas>
                        <canvas height="50" width="80"></canvas>
                    </div>
                </div>
            </transition>
        </div> -->
        
    </div>
</template>
<script>


// import SVGA_modify from '../../../lib/svga_modify';

export default {
    data() {
        return {
            list: [],
            bgList: ['red', 'green', 'blue', 'green'],
            giftsNameList: ['彩幣', '贊', '賽車', '上岸', '穩住', '168', '飛艇', '加油'],
            svgaList: [
                {show: false, info: {}, id: 'caibi', src: '/static/images/chat/gifts/svga/caibi_no.svga'},
                {show: false, info: {}, id: 'zan', src: '/static/images/chat/gifts/svga/zan_no.svga'},
                {show: false, info: {}, id: '168', src: '/static/images/chat/gifts/svga/168_no.svga'},
                {show: false, info: {}, id: 'saiche', src: '/static/images/chat/gifts/svga/saiche_no.svga'},
                {show: false, info: {}, id: 'feiting', src: '/static/images/chat/gifts/svga/feiting_no.svga'},
                {show: false, info: {}, id: 'jiayou', src: '/static/images/chat/gifts/svga/jiayou_no.svga'},
                {show: false, info: {}, id: 'wenzhu', src: '/static/images/chat/gifts/svga/wenzhu_no.svga'},
                {show: false, info: {}, id: 'shangan', src: '/static/images/chat/gifts/svga/shangan_no.svga'},
                {show: false, info: {}, id: 'tucao', src: '/static/images/chat/gifts/svga/tucao_no.svga'},
                {show: false, info: {}, id: '666', src: '/static/images/chat/gifts/svga/666_no.svga'},
            ],
            preLoadList: [],
            giftsQueue: [
                {count: 4, id: 'zan', userName: '秀儿', giftsName: '赞', color: 'red', svga: '/static/images/chat/gifts/svga/zan_no.svga'},
                {count: 10, id: 'caibi', userName: '刘德华', giftsName: '彩币', color: 'green', svga: '/static/images/chat/gifts/svga/caibi_no.svga'},
                {count: 168, id: '168', userName: '辰亦须', giftsName: '168', color: 'blue', svga: '/static/images/chat/gifts/svga/168_no.svga'},
                {count: 2, id: 'saiche', userName: '张学友', giftsName: '赛车', color: 'pink', svga: '/static/images/chat/gifts/svga/saiche_no.svga'},
                {count: 9, id: 'feiting', userName: '哈哈哈', giftsName: '飞艇', color: 'red', svga: '/static/images/chat/gifts/svga/feiting_no.svga'},
                {count: 99, id: 'jiayou', userName: '秀儿', giftsName: '加油', color: 'red', svga: '/static/images/chat/gifts/svga/jiayou_no.svga'},
                {count: 1, id: 'wenzhu', userName: '秀儿', giftsName: '稳住', color: 'blue', svga: '/static/images/chat/gifts/svga/wenzhu_no.svga'},
                {count: 7, id: 'shangan', userName: '秀儿', giftsName: '上岸', color: 'green', svga: '/static/images/chat/gifts/svga/shangan_no.svga'},
                {count: 14, id: 'tucao', userName: '秀儿', giftsName: '吐槽', color: 'blue', svga: '/static/images/chat/gifts/svga/tucao_no.svga'},
                {count: 8, id: '666', userName: '秀儿', giftsName: '666', color: 'pink', svga: '/static/images/chat/gifts/svga/666_no.svga'},
            ],
            first: true,
            running: [false, false]
        }
    },
    created() {
        
        

        // this.loop()
        setTimeout(() => {
            this.fadeIn();
        }, 2000)
        setTimeout(() => {
            this.fadeIn();
        }, 3000)
        
    },
    mounted() {
        this.preLoadList = this.svgaList.map(gift => {
            return this.preLoadSvga(gift)
        })

        console.log(this.preLoadList)
        
    },
    computed: {
        showGiftsId() {
            return this.list.map(item => {
                return item.id
            })
        }
    },
    watch: {
        giftsQueue(newV, oldV) {
            //  对象或数组变化时， 旧值和新值是一样的
            if (this.first) {
                this.first = false
                return
            } 
            // console.log(this.running)
            this.running.some(flag => !flag) && newV.length > 0 && this.fadeIn();
        }
    },
    methods: {
        preLoadSvga(gift) {
            var result = {id: gift.id, url: gift.src, svgaBuffer: null}
            const req = this.createXMLHttp();
            req.open("GET", result.url, true);
            req.responseType = "arraybuffer";
            req.setRequestHeader('Accept', 'application/octet-stream');
            req.setRequestHeader('content-type', 'application/octet-stream');
            req.onloadend = () => {
                console.log(gift.id, result.id)
                result.svgaBuffer = req.response.toString() === "[object ArrayBuffer]" ? req.response : null;
            }
            req.send();

            return  result
        },
        fadeIn() {
            
            if (this.giftsQueue.length < 1) return;

            this.running.splice(this.running.indexOf(false), 1, true)

            // console.log('in', this.list.length, this.running)

            let item = this.giftsQueue.splice(0, 1)[0]
            this.list.push(item);
            

            this.$nextTick(() => {
                let canvas = document.querySelector('#gifts' + item.id).querySelectorAll('.gifts-animation > canvas');
                this.drawSvga(canvas[0], this.preLoadList.filter(gift => gift.id == item.id)[0].svgaBuffer)

                this.drawNum(canvas[1])
                setTimeout(() => {
                    this.fadeOut(item)
                }, 3000)

            })
            
            
        },
        fadeOut(gift) {
            let index = this.list.map(item => item.id).indexOf(gift.id);
            this.list.splice(index, 1);
            setTimeout(() => {
                
                this.running.splice(index, 1, false);
                console.log('out',gift.id, index,  this.running)
                this.giftsQueue.length > 0 ? this.fadeIn() : this.running.splice(0, 2, false, false);
                
            }, 500)
            
            
        },

        drawSvga(canvas, svga) {
            let player2 = new SVGA.Player(canvas);
            let parser2 = new SVGA.Parser(canvas);
            parser2.load(svga, function(videoItem) {
                
                setTimeout(() => {
                    player2.setVideoItem(videoItem);
                    player2.clearsAfterStop = false;
                    player2.startAnimation()
                }, 600)
                
            })
            return player2
        },

        drawNum(canvas, item, callback) {
            var ctx = canvas.getContext('2d');
            var img = new Image();   // 创建img元素
            var img1 = new Image();   // 创建img元素
            var img2 = new Image();   // 创建img元素
            var img3 = new Image();   // 创建img元素
            var isScale = false;
            var timer = 0;

            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAMAAAAc9R5vAAABU1BMVEUAAADWUgXWUgXWUgXWUgXWUgXWUgXWUgXbWgXXUgXWUgX/kgXYUwXWUgXdVwbWUgXWUgX8ZxL0YxDWUgXZUwbXVAXWUgXWUgXWUgXWUgXWUgXWUgXWUgX/jwb+kQX/iwj/axP+aBP/jAj/cRH9cA//jgf7aBH6gQj/kQb2fgflWwrjWgnfXQbbVQb8dA7WUgX/dBD/fA3+gAz+iwj9ZxP9aRL8gAv/eQ7/kwb7gQr/bxH/dg/5hgf4gQf7aBL2Zw/0aw36ewv/dBD7jQb/lAXuXw7zYw/tYwz/lAX+cRHscAfsYgz9fAzyfAb/kQbxfAbubAniYAf/lQX/lQX+ew3gYQb/jQjbWQbaVwX+eA7iWQn6aRD+dQ//kgb7bBD+cRH+jgf9dw7/lQX/dQ//eg3/jAj/ahP/fwz/bxH/bRL/chH/lAX/iAn/jwf/hgr/kQb/gwum9e2XAAAAY3RSTlMABRkDFVpTEAkiHd58DQc4LevGeG1qYU5MRTszKCYdFP76+vnv5+Ph1cuUhYBIRkH6+Pj38vDw7Oro5NrZ18/NyMbEwrSysaurpaKhoKCVj46Kh4WEeXd3c3BwaVtLOzkyJA+KeQfKAAABTElEQVQoz1XQxXbDMBBA0TE7jh07zE3SMJeZmZkZAk1V+v9VLVlx3bvRG2mhcwaAS76AQ+rEjU5JrSG0lYK+ATdCqMSYxSDT1L3zHq1KZvL5b+xAtu7JcMibrex/EqUngKSb5FwEP7BiuU0MXiTzJEbP4xoAaHpwvk2frGMnwnL4czZ6VfxwKAsJD2CMErmc/rIVg7oEFo8rXJv46atFeQ7sF/F4pEstuxiwyYmjrm0PHBrDrT9nYHuebDld2wudff3vjv69QuelHI2hBmDb75acWsnSzD4CwMMbtSuENvs9wwF327MUBCMeWuxRGjD1dAdLV3VJigW8HWKBBTm+QdIXZjmOjVYzeBi/UYBxCevejNcXMGQwB7FS6Iz51DoPIMVCftUfbJLdyYbgV9WAiDfP8LooiDHF2p1mhAWx6ZJxMxqrsBLdKSfz1vALC9529dh4AGcAAAAASUVORK5CYII='; // 设置图片源地址
            img1.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAmCAMAAAB9PwLlAAABKVBMVEUAAADWUgXWUgXWUgXWUgXWUgXWUgXWUgXWUgXWUgXaVAbWUgXWUgXWUgXWUgXWUgX+kwXWUgX+ZxT+hwn9hAn9dg78aBL/kgb5gAj7bQ/6dwzzcwr2cAzWUgX0awz0Zw7WUgXWUgX2gQfjYgfWUgXvaQv+lAXWUgX+kAX+cxD+fQz/kAb/lQX9jQb9dQ/5ZRL5gwj9fgz6iQf7cg75fQrzYhD4hAfxYA//lQX4bg76axH+kgb7fQr1fwf1ag7+jQf0aA7+kwX6fQr/lQXxeQfyZQ7iWQnubQnWUgXWUgX4iQXWUgXrcAf1ZBDzdwjWUgX/ahP/bRL/jwf/kwb/lAX/cBH/ew3/iwj/dg//fwz/gwv/hQr/jQj/kAb/cxD/dBD/eQ7/iAn/aBQE/bvwAAAAUHRSTlMAAgUSDhgLFgdJLCIcfDcfaCX39uzq5t/UybudkHZsal9bWlNTODQxI/Pz8O7r5t3d2NTTx8S8u7u5rq2roZ+dj4uJiIR/eHZybWhoZVtJKdKpdIIAAAE0SURBVDjLddHXcsIwEIVhy5ZsbGOIaaF3COm9994bOJX093+ITCQ5mTA6//U3mt2VNthQW0NJEATBxMp+B4J2INolAJBhKc4iQKz3ZHUTDNELi6lFZ/xVNuno6iG6YXOuctLt7m9LURWov/y1yRSAWI3CTPJBdGAohB63z0teVogLqnqDujG7mvrkqZclumk5yf5PKb6ssqs+L+vCb9l75i1ENVBkQ4g8Q4LOPvGKFhLGmBDHBhKte1GDokHLUoxEgNALH7z0NTqHmX/kpeE5jCkh5uE5rNF3Xg6K1ptolaFVKneiLQutUpRix0CrrN2KDpGgOSnKFC2bkaJiAsFuZPDoTigcIMhlKHwChH+0vDidSSS+4ugcbvP0pOR5XhUJQv2YbTdrNZtpiOjUsFg0zv4P+g1IpF9OHmy7zgAAAABJRU5ErkJggg==';
            img2.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAmCAMAAAB9PwLlAAABg1BMVEUAAADWUgXWUgXWUgXgVwjWUgXWUgXWUgX/bhLWUgXWUgXWUgXWUgXWUgXWUgX/lQXWUgXWUgXWUgX6gAnWUgXWUgXWUgXWUgXWUgX/eA7WUgXWUgX6aBH/kwX3cwzzcwrWUgXWUgX/lAX7cQ7WUgXWUgX+iQj/fwv+ew39fwv8bBD/fgz7hAn/eg36gAn2ZQ/7egv/kgXxZQ36gwj7hgjvZQzraAjhYQbgVwn6dgzcWAXZUwbmZQf/eQ7WUgX/kgXpYQr/lQXWUgXWUgX/dg/+ahP/cRH/lAX7hwj7ewv7hQj/jQf/cBH7ZhP+jgf/bhL/lAX2cgzzbAz+axL/kwb/bRL/dBDvdgfrcgf2egnkaAb3aA/pXQv0eAjgWQj/lQX7axH7hQjscAf6hgj9jQf+kQb/cRH7fgreVgjnXQv6hgj/bhL2ggf/lQX/jgf/kwX/bBL/ahP/aBP/gwv/hgr/cBH/cxD/dg//kAb/eg7/iwj/bhL/ign/iAn/gAz/fA3/fgyvLv31AAAAbnRSTlMABWQpkRIDAXgcOl8ODBh3bEIJtIB1U0cyIiAW3t7VrWlZVUY1Jffz7uzo393Ozsq+vLixq6mgjYuKh3dcVk5FOzMrIxH07u7m5eXg3dLQzMzJwsGrqqqqqpyZmJeQjoiGhoN1amhmX15UTjMsIn/qPxAAAAHBSURBVDjLfdJlQ+MwGMDxJ+01vcratVO2MWW4u8MB5+7ufgcb7vbRKRFIWbffu7T/JM+LgN9K0bY/2/YNCDY3cLvKPSlCjWJz1af56kEvqjVsX8AO8PspBAO7geaA+1EJ9gizAN+v1LHMin8VrvvNZDQafXeHr7+r9Iiv+1TrWCwsGYaRj91jX4YRKdzhQ6J1TJrV5VRqMRl/fUgNhUhhDh0RvYWkFUIqYLf87YiKKKRQIptEfzKkAmFObFK8eEuX3RYLINTLio+smN6gSsD83mCmaWHqHXQdwTRoamNBh04nRQu5Y8/d3LxL1mrXMZOTEf2ixduzo9EpqYXu6Dll2uIaH13Px/JGXNfQ+RVdJ9yobgKFNCeRXLRM5O2Yad/jnhZSCBikpF0y5VL/3oUsvdVvZudSNuykMfg19QjBs3CCjCVYerUtGKkNJsT/neOScyX4dWtLMBgz9LQvKD0Q/2cmw7MLChYHfHwg6hscef/lOvffC16uNlLCgJ43LOYRKH9vrjUge4XzoUHQ6RWuXOhbryuTUkE1W6RM3eKhBgA47Ux9uhZs/I9FX0fCkIIZugIkscpysLLF3ilG9WAVzgBMnBnMMrQHiQAAAABJRU5ErkJggg==';
            img3.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAmCAMAAAB9PwLlAAABhlBMVEUAAADWUgXWUgXWUgXWUgXWUgXWUgXWUgXWUgXWUgXWUgXXUwXWUgXWUgXWUgXWUgXWUgXWUgXWUgX+jAfWUgXWUgXWUgX+bhH3ZBDWUgX/lQXWUgXWUgXWUgXWUgX+kAbWUgXWUgX/hArWUgX+ZxP/igj/eA7/kwX8hgj8bw/9hwj8cg7eWAf7dA3/kAbWUgXWUgX0bgv+axL+hQr+iAn+cw/9cA/1aw3ybgv/dw7rXQzvawrkZgb/bxHcVwb/kwb5hAfybgr8iwb/bxH/ggv+eQ7+hgr8axH9hAr7fAv5cw35fgn/lAX5ZxH8fAz5hQj3eQr/lAX2eQn6aw/+jgf+fA30ZQ/xYQ74ggj1egnrcgf/lAX8igfoXAz/hwrzZg7gXAf9dg7+ew3/eg7wdgf/lQX+kQb/lAXyegjzcQveXAbeWAf/cRHWUgXtbgn/kgb/aRP/bBL/bhH/jwf/fA3/cRD/gwv/dw7/hgr/jQj/lAX/dBD/dQ//fwz/iQn/gQz/ign/eg4F8tQ1AAAAb3RSTlMAAwYfXxsXCYBWIn0RdGZcPBMM9203J+DVeXdqUEpGNC8qEQ/39O/v487NxoWBREMzF/bu7ubTxbCsqZyZiIBnXVpVRCL39u7r5d3d3dzb29TMycTAvrq6uLWqqqWhmZWRkIuIiIhoZmRiX1pEQj0MeZroAAAB+0lEQVQ4y23S92OaQBQH8GMcCLIjuI3WOBI1avbe3XvvvaetjQ1N0rT9zwPcQbjI5yd4fIF39w4QzkxmMm8zmVEQbfRxbd935T0YsnNzn1CbBKT13pB1IvCuF2Er3EIvSo0KAtSdn5E2ggRfOamOOPzrJ8FHtn4jM4+asbhjZQTdT/D+TzZQoZ5OKKyqqmz2Ok5IOEF/+OepC5olMgwjahVUeMD5bRSPPJWSQXkrqx8hb/wEXbxg2/b0ggDdyTybsbFzbcnvQ3xoX15JZwsT03bYcocHGPy0JiuCJv4i3BKYYLWSKeSLsMwRgRuKaQAfrUOOp8C3vyEXE22OAgHKu978E3YN0uAU+uMu4S5x+rxtae2SXoUC1eprJ9HJxhwv5s/+x7pBYnHPsdgt5ViHIqcv7SEvAdbFhRZ0h1L8qsZxoeH32jr0VCXKa1iycofIbBmvoXHgaVg8LmweILN4cuXxgWdZpPDuzA2QOYgKHE6M4ze+JAfYgp+43UeSq9s726vJfuAzhxPP+9HmNdypXpj6EeU8a+HVGua9qMBUs60HR0y9+n1Ici0nBsOVtETqdOC+LJT4k7HDfGJpLPw81UzkLCN8MpiCkn6aQqGx1FJcZjXIk4eHMwVFjsdccTmrFkrOjEiUwXTyAusS8qao02AYxeuQcUHdIN4/Bj7bDkROBeIOAAAAAElFTkSuQmCC';

            var imgList = [img1, img2, img3]

            var baseSize = 1000;
            var resultSize = 0;
            var smallScale = 0.1;

            setTimeout(function() {
                drawX();
            }, 1000)


            function drawX() {
            
                var _tmpDiff = resultSize - baseSize;
                ctx.clearRect(0,0, 80, 50);

                ctx.drawImage(imgList[timer], 25, 0);


                if(isScale) {
                    if(smallScale > 0) {
                        smallScale -= 0.1;
                        var _tmpResult = (baseSize + _tmpDiff * smallScale)/resultSize;
                        resultSize = baseSize + _tmpDiff * smallScale;
                        ctx.scale(_tmpResult, _tmpResult);

                    } else {
                        var _tmpResult = baseSize/resultSize;
                        ctx.scale(_tmpResult, _tmpResult);
                        smallScale = 1;
                        isScale = !isScale;
                    }

                } else {
                    resultSize = baseSize * 1.3;
                    ctx.scale(1.3, 1.3);
                    isScale = !isScale;
                    ctx.drawImage(imgList[timer], 25, 0);

                    timer ++;
                    if(timer == 3) {
                        timer = 0;
                    }
                }

                ctx.drawImage(img, 0, 5);
                setTimeout(drawX, 20);
            }
        },


        loop() {
            setTimeout(() => {
                if(this.list.length >= 2) {
                this.list.shift();
                // this.list.push({id: Date.now(), bg: this.bgList[Math.round(Math.random() * 3)]})
                } else {
                    let id = Date.now();
                    let bg = this.bgList[Math.round(Math.random() * (this.bgList.length - 1))];
                    let userName = '秀兒' + bg;
                    let giftsName = this.giftsNameList[Math.round(Math.random() * (this.giftsNameList.length - 1))];
                    let item = {id, bg, userName, giftsName}
                    this.list.push(item)

                    this.$nextTick(() => {
                        let canvas = document.querySelector('#gifts' + id).querySelectorAll('.gifts-animation > canvas');

                        let player2 = new SVGA.Player(canvas[0]);
                        let parser2 = new SVGA.Parser(canvas[0]);
                        let svgaSrc = this.svgaList[Math.round(Math.random() * (this.svgaList.length - 1))]
                        parser2.load(svgaSrc, function(videoItem) {
                            player2.setVideoItem(videoItem);
                            // player2.loops = 1;
                            player2.clearsAfterStop = false;
                            player2.startAnimation();
                            
                        })
                        console.log(document.querySelector('#gifts' + id).querySelectorAll('.gifts-animation > canvas'))
                    })

                }
                this.loop()
            }, 1000);
        },

        createXMLHttp() {
            let xmlhttp;

			try {
				xmlhttp = new XMLHttpRequest(); //尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
			} catch (e) {
				try {
					xmlhttp = ActiveXobject('Msxml12.XMLHTTP'); //使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
				} catch (ex) {
					try {
						xmlhttp = ActiveXobject('Microsoft.XMLHTTP'); //使用较老版本的 IE 创建 IE 兼容的对象（Microsoft.XMLHTTP）。
					} catch (failed) {
						xmlhttp = false; //如果失败了还保持false
					}
				}
			}
			return xmlhttp;
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>