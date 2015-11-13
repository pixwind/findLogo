/**
 * Created by Terry on 15/10/22.
 */

var WxShare = function(options, config){
  var _this = this;
  this.appId = config.appId;
  //this.secret = '<?=$appsecret?>';
  this.options = $.extend({},options);
  this.config = $.extend({},config);
  this.setOriOptions();
  this.init();
};
WxShare.prototype = {
  init:function(){
    var _this = this;
    this.bindWx(config);
    // this.getToken(function(data){
    //   _this.bindWx(data);
    // });
  },
  // getToken:function(success){
  //   var _this = this;
  //   $.ajax({
  //     url:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+_this.appId+'&secret='+_this.secret,
  //     dataType:'jsonp',
  //     cache:false,
  //     success:function(data) {
  //       success.call(_this, data);
  //     }
  //   });
  // },
  // bindWx:function(data){
  bindWx:function(data){
    var _this = this;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature,// 必填，签名，见附录1
      jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function(){
      _this.onMenuShareTimeline();
      _this.onMenuShareAppMessage();
      _this.onMenuShareQQ();
      _this.onMenuShareWeibo();
    });
    //wx.error(function (res) {
      // alert(res.errMsg);
    //});

  },
  /*
   *  设置分享参数
   */
  setOriOptions:function(){
    this.timeLineOptions = $.extend(this.timeLineOptions || {},this.options);
    this.appMessageOptions = $.extend(this.appMessageOptions || {},this.options);
    this.qqOptions = $.extend(this.qqOptions || {},this.options);
    this.weiboOptions = $.extend(this.weiboOptions || {},this.options);
  },
  /*
   *  重置分享参数
   */
  setOptions:function(options){
    this.timeLineOptions = $.extend(this.timeLineOptions || {},options);
    this.appMessageOptions = $.extend(this.appMessageOptions || {},options);
    this.qqOptions = $.extend(this.qqOptions || {},options);
    this.weiboOptions = $.extend(this.weiboOptions || {},options);
  },
  /*
   *  单独设置朋友圈分享参数
   */
  setTimeLineOptions:function(options){
    this.timeLineOptions = $.extend(this.timeLineOptions,options);
  },
  /*
   *  单独设置朋友分享参数
   */
  setAppMessageOptions:function(options){
    this.appMessageOptions = $.extend(this.appMessageOptions,options);
  },
  /*
   *  单独设置qq分享参数
   */
  setQqOptions:function(options){
    this.qqOptions = $.extend(this.qqOptions,options);
  },
  /*
   *  单独设置微博分享参数
   */
  setWeiboOptions:function(options){
    this.weiboOptions = $.extend(this.weiboOptions,options);
  },
  /*
   *  分享到朋友圈
   */
  onMenuShareTimeline:function(){
    wx.onMenuShareTimeline(this.timeLineOptions);
  },
  /*
   *  分享给朋友
   */
  onMenuShareAppMessage:function(){
    wx.onMenuShareAppMessage(this.appMessageOptions);
  },
  /*
   *  分享到QQ
   */
  onMenuShareQQ:function(){
    wx.onMenuShareQQ(this.qqOptions);
  },
  /*
   * 分享到腾讯微博
   */
  onMenuShareWeibo:function(){
    wx.onMenuShareWeibo(this.weiboOptions);
  }
};

