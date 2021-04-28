<template>
    <transition name="loading-fade" @after-leave="handleAfterLeave">
        <div
            v-show="visible"
            class="loading-mask"
            :style="{ backgroundColor: background || '' }"
            :class="[customClass, { 'is-fullscreen': fullscreen }]">
            <div class="loading-spinner">
                <div class="default-spinner" :class="size" v-if="!spinner"></div>
                <i v-else :class="spinner"></i>
                <p v-if="text" class="loading-text">{{ text }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            size: '',
            text: null,
            spinner: null,
            background: null,
            fullscreen: true,
            visible: false,
            customClass: ''
        };
    },
    methods: {
        handleAfterLeave() {
            this.$emit('after-leave');
        },
        setText(text) {
            this.text = text;
        }
    }
};
</script>

<style lang="scss">
    .loading-fade-enter-active {
        animation: loading-in .3s;
    }
    // .loading-fade-active {
    //     animation: loading-in .1s reverse;
    // }
    
    .loading-mask {
        position: absolute;
        background-color: transparent;
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1003;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading-text {
        color: #ff4e00;
        margin: 3px 0;
        font-size: 14px;
    }

    .loading-spinner {
        width: 100%;
        text-align: center;
    }

    .default-spinner{
        display: inline-block;
        width: 40px;
        height: 40px;
        animation: loadding-sm 1s infinite steps(13);
        // background: url(data:image/png;base64,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) 0 0 no-repeat;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABbAAAABwCAMAAAD41qaaAAADAFBMVEUAAAD0QRn6Xgz5Ww75Wg7xMiDzPRvxLyH5Wg77YAv8aQf8Zwf6XQ39agb2SxX7Ygr4Vg/5WA/8aQfxMCHzOxz3UhL1RBj7Ygr3UBL1RxbxMCH3UBL8Zwj5Vw/+bwT1Rxb8agb8Zwj9bAX4UhL0QBr+cAP8Zwf8Zgf4VBD6YAv2TBT6XQzzOh37Zgj1Rhf8Zwj5Ww30QBn3TRT9bQXyOR32TBT7ZQnzPRv9bQX8aAf8aAfyNB/4VRD1Rhf9bgT4Vg/5Vg/yNh7zOxz6YAv9bAX9bgT8aAf9bQX9bgT9bgT0Qhn6Xwv9bAX9bAX7Ywn9agb4VBD+bwT6Ww35WA7yOB3+cwLyOR38aQf8awb5WQ73URL8agb+bwT7YwnzOxzzOxz7YQvzPBv7Ygr0Phr8aAf9bQX6Ww37YAv8Zgj8Zwj3ThP9awX3ThP+bwT0Phr8aAf8Zgj7YAv3TRT9awb3UBL+bwT8ZQn6Xgz8aQb+bwT+bwT7YwnyNx70QRnzPhv1RxfzPRv8aAf8aQf8awb7YQryNx7zPBz9agb5WA73TxPzOxz9bgTzPRv8Zgj6Xgz5WA/0Pxr2TBT7ZAn+cgP7YAr4URL3ThP4Vw/7YQr0QRnxMiD4VRD7YAv+cAP4VBD6Xwv+cQP9bwT6XA39bQT+bgT1RRfzPBv9bAX4UxH+cAP1RRj7ZAn2TBT9bgTzPRv3UBLzOh31Rhf4VRDzPRv2SRX4Vg/4Vg/6XQzxMSH3ThP+cgPzOhz1Rhf1RxbxMCH4VBD1RRf5WQ7yOR36YAv9agb7Ywn3ThP9cAT+cgP1RRf2ShX8awbzPRv1RRj4Vg/2ShX4UhLxNCDwLyL8aAfxNR/5WQ79bQX8agbzOxz9bgT8aAf7Zgj6YAv2ShXyOB37ZAn3ThP7Ygr1Rhf9bwT1SBb5WA7wLyL9bAXzPRv0Pxr4Vg/0Qhj5Wg30RBj5XQ36Xwv3URL6Xgz0QRn4UxH5XA3+cgLxMSDxNB/4VRD8Zwj9cATyNx79cQT1RRjxNh/9bQQ6600gAAAA1nRSTlMABwcNAjg4ugkFHBQEkxMt8TgRdSUPF5PyOH44gQtk8v7x9Bv9kvbpJfHxP/HkunDyu7lwuh/+8t9W7LpKMhi6hPHp0MfDtevk+vKkP0Txv6olu1lTk0o48cu7hTnt0ruyLSHh29iScFJO/NJrMUBqx77i+dhHKfqnml38y51m28R6++PWW9vN/OuyqpmNPNRwWV7p6JiQ6t3NlWD276KZyaF8962BYpd3hXliUDT99I3Uwfii9dpF8a7P+O3GwLJL+PPZdHPPf3f3qn+m5v74/fTPm/k1ZRsKXgAAEtNJREFUeNrs3WtIU2Ecx/HTdl64s9VqZBdKM0eZRSVJ4UJWkFfSyiKyLBDJ0swulnaDogtERPeb0dUuZGVEQQWRVHQvukCQWInmBWGITmxQUdTznDWneaaztqeds9/3pY/04fyf+IPDOc6H0wQZ9KbNp9JXLAwLGz58YtjCFXEXNpv0hiANR2PmGdQiCA8ePHh/Gx+gdu3JPV6n1o46s3LBhg0TJlRWfiB9fU8LCQnZkhr3Ikmr1jHzQuNjXui1anjwWHvO4MnbU2m1pvTCaZ15sk7Yn77g4ydaJcnxhLQysfi49TqWXn3ouSStCh68/+Pp4MnZCxLSConVpSffsqZ8JHX2hDkCW6++PvNhQSA8eP/DM8KTrafR3joVLmpueHItmw5UfMYNxxcsCBstFjZx6PAtjifcLjD16ETfvTuXrIUHj71nhCdTLyDjUWFTk0Nzw5Nn2VPoM4YfLFzZ/5FplF7QGgxaQZ9kethz+sKw1BBxYbPyJm5xTvRdTLYWHjzWnhGeLL2Agl3Hm5ubHBv7+OiuPXmu7KxtTQe3Tb2slzrTBxdlhoVkCow8PrtnzMLU1omWxyYb4MFj6wnwZOjpMiavaWxstm/s44VT0h9luOfJr1tTT+3u7Hz+27UCQ49fH5ezddXviZbvzNXAg8fSM8KTn2dcHNHw+bO4scMfrBhsdN+T/6/5SaTj2JaSlpP6e6KJT80djuHB856ngyc3Lyh6TwOJbuzC9P0qn/v/6Q8FT4+3T7Qmdj7f8RgePHjO/Nobv6iuroG25sGpAh99Pj/IND3UPtHEyECJY3jw4DnzW4+/taeORPb1g129fPj5/KDgHDrQ8pqaIkHqGB48eM7801MXv7JY6khHFpl9/PmUX2DPBPtEY65IHcODB8+ZP3r9DllodfdnjvL95/ODkmPsE43K51jk9KTfjg8PHrxO0jD29He/fLGQbhbLY57KT30hVJzoCRPHIKdXc1EldQwPHjyXjZhcbGTp3brZ0kI39vU+cpmnHxScIE707HqOQU6vZphG8hgePHjSjb9rsUyK7sXMK9nRQvpyY5FGRvNUfsk5vzc2zzEpv/MbhAcPnlTGSRbaIg0jL3qHtYVWLK95Kr+CWPurItkcm5Kj7Df4hJc8hgcPXse09teTe58JYOMNyrNaycZ+M1lu81R+Qpw40c0co+Zk2m9wvfQxPHjw/izorvh68pFZjLxec620G0vlN0/lZ6YbO8fMsSrXfoMJ86WP4cGD1z7+kPh68pESdp6VdPWYHOep/ITp5eVZHLty7T8lnRakj+HBg9euYmsL6Ug0Q0/c1/Kcp/JLSYhTcwxLShBvcKdG+hgePHhtil5CX08eUMLUsy5ZKtd5Kr/kFI5p+fafkiI56eDBg9fa+NVW0puljL0z8p3nvyVcXjxWLDIycnl+h2O/9K7E0xs8cQUePHide5oZVtphpXpdNSr90yfy4ZH0M8jI3wAMXeft18Iz4ElkSqQ3GKuGBw9ep96xKitpnJqxF+Qj8+TIx1YSsZJ+2C8Vf0Y9EThv1h+eVD3LSTWRPDx48DrxxudVkQ2ap1eq12Vrmj4+2DXYXlosEWtivfo2v5XwpDJvLyfFp8CDB8+1xx+qIl3dp1Sv6yIam2dxjlJS6d/ZrilK4rzWTHiSJYfSv+V1QQcPHjyX3rIq2knFel0X8blRz7WWWiaKCRczOC81E55068SPfcuFBw+eKy+gtILsz7wRSvXcKKKhsQ/nSDW0zC5+Ox2s47zSTHjSCVHiRyur4MGD58IrqaioqHq9VLGeG/Wua2gLvneItnP5nDeaBM9FmxPpDc6HBw+etKd+XEEq7aFUz72FXdcOdIoHhqVwnm8SPBcF5tBvLNLAgwdP0rtXQXq9T7GeO/W2tAM/tBFtt4O9sNDguSryLPnGswXw4MGT8OgryqRxvFI9Nxe2pR3YTjyQ4vmFBs9V6sx68o0XNfDgwZPwBtaS/TmyRLHeXyzsaR/aibfNnl9o8FyWtorcYLwWHjx4Hb0eh2vJBi3VKNVzrwEtX5xgwLTKtuIJL7yPex48l2m31pMbzOLhwYPXwet3p7a2dshexXruNcDaBlSFf3KI5F9KDOY83zx4rttZT25wZxAzb20I9VTw4Pm+x5fUkjYFKtVze2G3DGoDfiTvi3eI63jO882D57qsVLKxQ83MvOWh1CuAB6/7Ht93GWkEM089ppos0OeK9dxe2NZ2oFOM0XL2DLNn53OeapxPembf8FSZZeQGs3lWnjaKertU8OB12wsszcvLu7aPmdevupps0POK9dxsZFUbMCC8qVXc2rr4g222TM8tNJ/0nvqIVxRCbvBCADMvtox4UQZ48LrtDawm3TGy8jQbqfdyhFI99xd2lRNURTQ7xOFZji/mHrDZvntuofmkt85HPFMqucEoNTMvbRXx6s3w4HXX01yqJo1h5gWWUu+oYr2/XNiNv8UJaY6vmU/bbLYTnltoPunN9hHPsLWM3GABM08QvSweHrxueuoxP6qrn11i5v1i775Dm4jiOIC/NNFEbepKW1eddW9RigsnCnXiVnCL2zqxgquKVi114lYUFIu4xY0ibnBvjbVVW01tksbYUKx14e+ymviPufDu8dL3+/7VF1o+hffje70rdxdRC7zssyXWC7iwM/3AArfYS+35qP7HX1QLlEtvKC/egNeQ2ey8GZK3SIceejK9qHjb7+yHCcw8gw28WptLrBdoamVmVvUudK3yXOLOssSdmgffgEivQFtw6Q3lxZPOkXoeZ+f1eg0ZoEYPPZlegg0abbmKlafZ7PR0JdULvLA/+YBhFUxOsXFT4s7w3q9egUixQLn06vPita/dYXZZDTuvxnwYmElq9NCT54VvskHuMfZ2lVhPRmF/8gMlMXEKcafsmtefQfxBsUC59Orz4i28NUvD0hveAQZmfln00JPnqVKtNtvdI2w9270S6wVe2Nl+oEUS+4S51+rnrrssP1IsUC69+rx44WUYe2vgO2r3RQ89eV5MktVquzKErRe/ucR6Mgo7uxjUVbCAOLKcZz27QbpLrEuv0Lj06gvrLaqd/rr2UfTQk+dFTrRarQ/Ho8d4/0i8Ldv3CPHdYtnx0rNs2t91zw7VAuXS0wvrrV+Znl77PnroyfOiYqHQJqrRY7x/JN5q8wHh2X3n9nhWjVZ57rKkWKCtufT0wnotG8DA6NFDT543Xiq00+jR8YIv7K9PtoW7F5X6eO+L/zyCXsFw6emF9bbAW43SF6GHnjwvIdZhtSahx3r/SLzDWtoXrFLd/XX4lMQMr0ixQLn09MJ60zrAwPRCDz153pBYh8Oagh7r/SNxZkcxqPMBO+113rMD4FuqBcqlpxfW69uhKD19AHroyfPSoNAcD9Cj48kqbHMxqGryYfrAMkRKu40FX4rFOvQKhktPL6w3vGFRUfoc9NCT5y2LNTtiU9FjvX8kLtcf/HDyMJFS3pTnEakW6FguPb2w3vCGb4uK1qCHnjxvU6zZHJuKHh1PVmHn+oMf1nUikHojfUWKBcqlpxfWg4F5WzQHPfTkeJ5CQ4/1/pFmRj8wE8QFjQikaYVikWaBculFC+v16wCnbAPQQ0+elyYV2lL06HiyCtvoA9bKlMRRMQQy+Hqx2J/QSlsuvWhhvWmjYWB6oYeePC/tBBTaA/ToeMEX9idJnL6tDCzCuq71ihQLlEsvWlhvi/Rm/kXooSfPu3Yi12xOQY/1/pEb/4BOscpMAokaaHKJVAuUSy9aWO92A3g9RjR66MnzSp/IzTUnocd6/8iNd35gtktc15RAGm0E8YskNqZXMFx60cJ66xfDwKxADz15ngEKLTcZPdb7R7q9e+cHusUF9QhkQwWXSLNAufSihfXGvYeB2YIeevK8iDgotIlR6DHeP9Ltpy8Yb/OIbdQEMvicU7TTK9COXHrRwno9smBgNjDzNOgp6WmYeepkKLTupdFjPC+k25+fpXxBjzh9ezh8EN51rVOkWKBcepNF9co1z8p636AeM28Cesp5qs4JzLyYFCi0M4fQYzwvpFvhH1/Q6hWr7CGQiIEWSWxFr2C49CaL6l0YnZWVtUrNzJvdHz2lPMOhMynMPNUpIzTaLvQYzwt5WljoCzqKxXmdnYeAjZJIsUC59CaL6q3YCwOzSMfM65MB3hw1etQ91TI4iR+jYeVp0ozQaMnh6LGdF3LRD4wz+4h3ogik4g4L1QLl0pssqjdOGpjbZZh5PTIAnBuDHnWvnlQwEw3MvM5GALsnoEfFC76wQbR6xEuuO3bgzZLX6RUMl95+Qb2wndLAbGDmqcHLyJodjh51LzIJCiYujZkXcRka7cQp9NjOC7n4zQ/M9RWnHyJSulpM5wmtaLn0DgjqXRgNA7O1HDNvyt4MyAT06HuqU1LBPGDmRYwxQpLQo+HJKuxvfqCf2OSY81fft+8YvYLh0msnqLc/A9Inhpk3yA7e1kroKeANM0KSVaw81SGnF4keBS/owm5m9BfhwjnlaNHjx9P1sCcmLt6iYebdtNvhAKFDTwEvqhkUTPdhzDyDERK3CT0aXvCF/Y+4nXrBoMePV27KAUg5Zt6FrXaY0A3oKeHFPJCuiaQy8yKTjZCx6DGdF3Ixxx/0Ex+fbUS9YNAT1+uamG+394hBTwlPs9oISY5h641Bj4Inq7Bz/ECP6ADx9ExCPVr0hPV0PfLz8+1TyqCniFdP+um4NGZeFHqUvOALu9u7YvHuUgOhHy16wnp7Wn3Jz09shJ4ynmqp8xwevRD1gitsr7hrGVEiWvSE9eYWwJPLxunQU8hLMEKaJaAXol4whf3TLZ6Bw4Mi0aInqtepVQFM6AX0lPIixxghKeiFqBdMYRe6xDFpRKFo0RPU0wzKyysoGKlDj77n+2+yZqXRC00v0MIe7/vsPkm8nGogSkWLnqDe4Ot5MKFTNegp5kVMNEJS0AtRL8DCHuJdGJ4WgrhkNVEuWvTE9NQj8yAj1egp52mWSX/e3RiGXmh6gSQnJ+dZtcruXP1WWPhit4EomKvoiekdWGuCAe2EnpJeRLLUMEsi0QtNL4A8y/HmmxQ4PCia3egJ6ZXfYTKZ8gaFoaeot9p5CbUaeiHq/T/DtL7iRTg8KBsDeiJ6YV1MkLUV0VPW042VGqZ7Z/RC08NgKKfdsmreVB5GAszhRxaLyTQZPaW9v+3ZsWsTYRzG8TcmBAvlKto7UAgd4lBUBKHBxUC50cnhONAhEm4NGcQxTbI0YOmQDBa6dKtIKDG2UhBTWjoIltb5lryEoBAjhaO3ZBF83yQiaFCwr+/dJc/nH/gu7/Pj4KLvKDsxRRW9YPYAfODmpS6zGyejoSeuV6eMXUcvoD0Az83s9tj7/HiPSDI/wT0lR5lDA71g9gC8pjxye+yFLhJJZh76r6fOyuplDymjm+gFswfgrakN12UvdDtG5Ihvf/Zfz8xlZfWuUU430AtmD8BTay63O0PkUPa7n7t+66kLtJSU1AutUE430QtkD8BLi47D7vWle0QO9UGX6fmst8wWn0pL6mlFyulZ9ALZA/BMZM1hXDdD5NDe9rrcSyKAuJ5OmVRSUi9ZopxlohfIHoBH5jecvkUix/y22+OLeHCBCCCuZ1GuFJXUM2ifbqAXyB6ANyqtwb2eJlIoj1yXL2JfIQII7GVLlCsZcnqRK8MLs4xeEHsA3ohvPeL3eopIMbPtcr19jQggtJe1BosvS+pdo3230AtmD8Ab8cx7Wfe68tRxXOaBgD0I7w2/sd+tKnJ6Vyh6Qe4BjLfw2rPB/83FkZPyvJfM0b6cKadnpNALcg9gnFXeO32vMlNkBB/0Zldon14Po4cewORKHz1rtRzm6T0ygj96Wp1ytp3Ko4cewIRKPC+0OMfZmCe/800v9uLWYPG3HpvooQcwgZJvnjabLe5V5jL5ja96yYXB4m19wUAPPYDJEqm8fdJk+CKOkuRXvutp5UO+eEbPlVX00AOYFJGD568bzaEnFYWcUyh/LUH+4GL59rl7kfQxXzx3WCquJtFDD2D8Xc0cFRqfmCZ3I5Mg5xZb3bGKdUMZOdStpb3CnIieahbZ4oes1Eo1jh56AGNMWSqczLXb7U8cm0M1MU1EHGw2wZrOPpzyZlr9GUseVPcKjbawnmakqP1DZ4eNvoweegDjarp8+q39YxGFfCJEiJiDzXQ6ndpd3bJKqfU7d4rrrwvWSePDqdieZi78XDyDHnoA4yuxN1zE3JsDLUKIqIPNdbgvfWdnZ1+5U0ZsT4nWddtGDz2ACbDFF9E4qiTCRJjQcuovCzzZjAvrXdTMxzZ66AGMP2V1bzOrhSNEpJCSzh9btdELnFuvzmohIpKqGSt6zUYPPQD4B9MxJW1sHhetndr1ofuFO0vVg1lFDRHxwoqGHnoA8K8ioYsxVUmko9lsNpqOK2osNEX+J/TQAwAAAAAAYb4DMqoezGzwZ0wAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: cover;
        &.min {
            width: 30px;
            height: 30px;
            animation: loadding-min 1s infinite steps(13);
        }
        &.sm {
            width: 40px;
            height: 40px;
            animation: loadding-sm 1s infinite steps(13);
        }
        &.md {
            width: 60px;
            height: 60px;
            animation: loadding-md 1s infinite steps(13);
        }
        &.lg {
            width: 80px;
            height: 80px;
            animation: loadding-lg 1s infinite steps(13);
        }
        &.max {
            width: 112px;
            height: 112px;
            animation: loadding-max 1s infinite steps(13);
        }
    }
    
    .is-fullscreen {
        position: fixed!important;
    }
    .loading-parent--relative {
        position: relative!important;
    }
    .loading-parent--overflow {
        overflow: hidden!important;
    }

    @keyframes loading-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes loadding-min {
        to { background-position: -390px 0; }
    }
    @keyframes loadding-sm {
        to { background-position: -520px 0; }
    }
    @keyframes loadding-md {
        to { background-position: -780px 0; }
    }
    @keyframes loadding-lg {
        to { background-position: -1040px 0; }
    }
    @keyframes loadding-max {
        to { background-position: -1456px 0; }
    }
</style>
