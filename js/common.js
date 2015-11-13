/* 找logo */
/*
 * */
var findLogo = function(options){
    var opts = $.extend({}, options);

    this.elem = null;
    this.top = 0;
    this.left = 0;
    this.width = opts.width;
    this.height = opts.height;
    this.index = opts.index; // 顺序
    this.container = opts.container; // 父容器
    this.url = opts.url; // 图片url
    this.x = 0;
    this.y = 0;
    this.touch = {};
    this.init();
};

findLogo.prototype = {
    init: function(){
        this.create();
    },
    // 创建logo选题
    create: function(){
        var line = Math.floor(this.index % 2),
            column = Math.floor(this.index / 2),
            _w = this.width - 6,
            _pt = _w * 2;

        this.elem = $('<div>').addClass('puzzle-item').css({
            position: 'absolute',
            width: _w,
            height: _w,
            margin: '10px',
            border: '1px solid #eee',
            'box-sizing': 'border-box'
        });

        if(this.url){
            this.elem.css({
                'background': 'url('+ this.url +') -'+ line * _w +'px -'+ column * _w +'px no-repeat',
                'background-size': ''+ _pt +'px '+ _pt +'px'
            }).attr('data-index', this.index);
        }

        this.move(line, column);
    },
    move: function(x, y){
        var _this = this;

        this.elem.css({
            left: x * this.width,
            top: y * this.height
        });
        this.x = x;
        this.y = y;
    },
    drawing: function(){
        this.container.append(this.elem);
        return this;
    },
    event: function(options, obj){
        var _this = this;

        this.elem.on('touchstart', function(e){
            if(options.touchStart){
                options.touchStart.call(obj, e, _this);
            }
        });

        this.elem.on('touchmove', function(e){
            if(options.touchMove){
                options.touchMove.call(obj, e, _this);
            }
        });

        this.elem.on('touchend', function(e){
            if(options.touchEnd){
                options.touchEnd.call(obj, e, _this);
            }
        });

        this.elem.on('touchcancel', function(e){
            if(options.touchCancel){
                options.touchCancel.call(obj, e, _this);
            }
        });
    }

};

// 加载图像
(function($){
    // 加载图像 页面初始加载进度
    var ImageLoad = function(){
        this.images = {};
        this.imageUrls = [];
        this.imagesLoaded = 0;
        this.imagesFailedToLoad = 0;
        this.imagesIndex = 0;
        this.imageLoadingProgress = 0;
    }

    ImageLoad.prototype = {
        getImage: function(imageUrl){
            return this.images[imageUrl];
        },

        imageLoadedCallback: function(e){
            this.imagesLoaded++;
        },
        imageLoadedErrorCallback: function(e){
            this.imagesFailedToLoad++;
        },
        loadImage: function(imageUrl){
            var image = new Image(),
                self = this;

            image.src = imageUrl;

            image.addEventListener('load', function(e){
                self.imageLoadedCallback(e);
            });

            image.addEventListener('error', function(e){
                self.imageLoadedErrorCallback(e);
            });

            this.images[imageUrl] = image;
        },
        loadImages: function(){
            if(this.imagesIndex < this.imageUrls.length){
                this.loadImage(this.imageUrls[this.imagesIndex]);
                this.imagesIndex++;
            }

            return (this.imagesLoaded + this.imagesFailedToLoad) / this.imageUrls.length * 100;
        },
        queueImage: function(imageUrls){
            var self = this;

            if(Object.prototype.toString.call(imageUrls) === '[object Array]'){
                imageUrls.forEach(function(value, index, array){
                    self.imageUrls.push(value);
                });
            }else{
                this.imageUrls.push(imageUrls);
            }
            return this;
        },
        imageLoadingProgressCallback: function(progressCallback, loadAfterCallback){
            var self = this,
                interval = setInterval(function(){
                    self.imageLoadingProgress = self.loadImages();

                    if(self.imageLoadingProgress === 100){
                        clearInterval(interval);
                        setTimeout(function(){
                            loadAfterCallback.call(self);
                        }, 500);
                    }
                    progressCallback.call(self, self.imageLoadingProgress);
                }, 10);
        }
    }

    window.ImageLoad = ImageLoad;

})(Zepto);

(function($){
    function findLogoHandle(){
        var $logoLists = $('#logoLists'),
            $title = $('#title'),
            $dialogFail = $('#dialogFail'),
            $dialogFailTitle = $('#dialogFailTitle'),
            $logoName = $('#logoName'),
            $fGoToNext = $('#fGoToNext'),
            $dialogSuccess = $('#dialogSuccess'),
            $sGoToNext = $('#sGoToNext'),
            $dialogEnd = $('#dialogEnd'),
            $winContent = $('#winContent'),
            _width = $(window).width() / 100 * 80,
            _itemWidth = _width / 2,
            grade = 0,
            topicCount = 0,
            topicArr = [
                ['Google', 'img/google.png'],
                ['苹果', 'img/apple.png'],
                ['蚂蚁矿机', 'img/antminer.png'],
                ['微信', 'img/weixin.png'],
                ['中国移动', 'img/cmcc.png'],
                ['百度', 'img/baidu.png'],
                ['币看', 'img/btckan.png'],
                ['火币', 'img/huobi.png'],
                ['麦当劳', 'img/mcdonalds.png'],
                ['OKCoin', 'img/okcoin.png'],
                ['比特币交易网', 'img/btctrade.png'],
                ['比特币', 'img/bitcoin.png'],
                ['中国联通', 'img/cucc.png'],
                ['微软', 'img/microsoft.png'],
                ['haobtc', 'img/haobtc.png'],
                ['TSMC', 'img/tsmc.png'],
                ['QQ', 'img/qq.png'],
                ['新浪微博', 'img/weibo.png'],
                ['肯德基', 'img/kfc.png'],
                ['比特大陆', 'img/bitmain.png'],
            ],
            failTitleArr = ['你个白痴！', '你个眼盲！'];

        // 加载图片
        var imageLoad = new ImageLoad(),
            imageUrls = [];

        for(var j = 0, jLen = topicArr.length; j < jLen; j++){
            imageUrls.push(topicArr[j][1]);
        }

        imageLoad
            .queueImage(imageUrls)
            .imageLoadingProgressCallback(function(progress){}, function(){});


        topicCreate(topicCount);
        function topicCreate(count){
            var item = null,
                listOrder = [],
                itemLists = [],
                ram = Math.floor(Math.random()*2);

            $title.html((count + 1) +'.下列四个图标中，哪个是'+ '<big>' + topicArr[count][0] + '</big>' + '的标志？');
            $logoName.html(topicArr[count][0]);
            $dialogFailTitle.html(failTitleArr[ram]);
            $logoLists.html('');

            for(var i = 0; i < 4; i++){
                item = new findLogo({
                    width: _itemWidth,
                    height: _itemWidth,
                    index: i,
                    container: $logoLists,
                    url: topicArr[count][1]
                }).drawing();

                item.event({
                    touchStart: touchStart
                }, this);

                itemLists.push(item);
            }
            shuffle();

            function shuffle(){
                var size = 2;

                var order = shuffle_insert(size * size); //随机后的数组

                for(var i = 0; i < size ; i++){//矩阵
                    listOrder.push(order.slice(i * size, (i + 1) * size));
                }

                for(var i = 0,len = listOrder.length; i < len; i++){
                    for(var j = 0; j < listOrder[i].length; j++){
                        itemLists[listOrder[i][j]].move(j, i);
                    }
                }

            }
            function shuffle_insert(m){//洗牌 //插牌法优化版

                var arr = [],
                    count = 0;

                //每次生成一张最大的牌，与随机的某张牌换位子
                arr = new Array(m),
                    count = 0;

                arr[0] = 0;
                for (var i = 1; i < m; i++) {
                    var rnd = Math.floor(Math.random() * (i + 1));
                    arr[i] = arr[rnd];
                    arr[rnd] = i;
                }

                return arr;
            }

            function touchStart(e, item){
                var index = item.elem.attr('data-index'),
                    tag = '';

                topicCount++;

                if(topicCount >= 20){
                    grade += 5;

                    if(grade <= 30){
                        tag = 'Oh，no！您竟然只认识'+ '<big>' + grade + '%</big>' +'标志，好好学习，天天上网！';
                    }else if(grade > 30 && grade <= 60){
                        tag = '您只选对了'+ '<big>' + grade +'%</big>' +'的标志，世界很大，也很险恶，还是得长点心啊！';
                    }else if(grade > 60 && grade <= 80){
                        tag = '恭喜您，识别出了'+ '<big>' + grade + '%</big>' +'的标志，可以单枪匹马闯荡地球啦！';
                    }else if(grade > 80 && grade <= 99){
                        tag = '你真是太棒了！竟然认出了'+ '<big>' + grade + '%</big>' +'的标志！快去炫耀！';
                    }else{
                        tag = '你竟然答对了所有题目，这不科学！！！';
                    }

                    $winContent.html(tag);
                    $dialogEnd.show();
                    setWxShareHandle(grade/5);
                    return;
                }

                if(index == 0){
                    grade += 5;
                    $dialogSuccess.show();
                    setWxShareHandle(grade/5);
                }else{
                    $dialogFail.show();
                }

                $fGoToNext.off('touchstart');
                $fGoToNext.on('touchstart', function(){
                    $dialogFail.hide();
                    topicCreate(topicCount);
                });

                $sGoToNext.off('touchstart');
                $sGoToNext.on('touchstart', function(){
                    $dialogSuccess.hide();
                    topicCreate(topicCount);
                });
            }
        }

        function setWxShareHandle(grade){
            var grade_v = parseInt(grade)/20;
            var grade_vd = (grade_v + Math.random()/10 ) *100;
          grade_vd = grade_vd >=100 ? 99 : grade_vd;
            // 设置分享到朋友圈的
            _wx_share.setTimeLineOptions({
                //'title':'您认识'+grade_v+'%的标志，居于全国'+grade_vd+'%水平，快转发给你的朋友，看看他们瞎了没！'
                'title': '我成功认出了'+ grade +'个标志，居于全国'+(grade_vd.toFixed(1))+'%水平，已被虐的体无完肤！不服来战！'
            });

            // 设置分享给朋友的
            _wx_share.setAppMessageOptions({
                'desc': '我成功认出了'+ grade +'个标志，居于全国'+(grade_vd.toFixed(1))+'%水平，已被虐的体无完肤！不服来战！'
            });
        }


    }

    $(function(){
        findLogoHandle();
    });
})(Zepto);