<?php
$appId = 'wx509c2cea8574261b';
$appsecret = 'f48ca1db846776a0fc08c0c430440109';
$timestamp = time();
$jsapi_ticket = make_ticket($appId,$appsecret);
$nonceStr = make_nonceStr();
$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$signature = make_signature($nonceStr,$timestamp,$jsapi_ticket,$url);
function make_nonceStr()
{
    $codeSet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ($i = 0; $i<16; $i++) {
        $codes[$i] = $codeSet[mt_rand(0, strlen($codeSet)-1)];
    }
    $nonceStr = implode($codes);
    return $nonceStr;
}
function make_signature($nonceStr,$timestamp,$jsapi_ticket,$url)
{
    $tmpArr = array(
    'noncestr' => $nonceStr,
    'timestamp' => $timestamp,
    'jsapi_ticket' => $jsapi_ticket,
    'url' => $url
    );
    ksort($tmpArr, SORT_STRING);
    $string1 = http_build_query( $tmpArr );
    $string1 = urldecode( $string1 );
    $signature = sha1( $string1 );
    return $signature;
}
function make_ticket($appId,$appsecret)
{
    // access_token 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("access_token.json"));
    if ($data->expire_time < time()) {
        $TOKEN_URL="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appId."&secret=".$appsecret;
        $json = file_get_contents($TOKEN_URL);
        $result = json_decode($json,true);
        $access_token = $result['access_token'];
        if ($access_token) {
            $data->expire_time = time() + 7000;
            $data->access_token = $access_token;
            $fp = fopen("access_token.json", "w");
            fwrite($fp, json_encode($data));
            fclose($fp);
        }
    }else{
        $access_token = $data->access_token;
    }
    // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("jsapi_ticket.json"));
    if ($data->expire_time < time()) {
        $ticket_URL="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$access_token."&type=jsapi";
        $json = file_get_contents($ticket_URL);
        $result = json_decode($json,true);
        $ticket = $result['ticket'];
        if ($ticket) {
            $data->expire_time = time() + 7000;
            $data->jsapi_ticket = $ticket;
            $fp = fopen("jsapi_ticket.json", "w");
            fwrite($fp, json_encode($data));
            fclose($fp);
        }
    }else{
        $ticket = $data->jsapi_ticket;
    }
    return $ticket;
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>上网多年，你瞎了吗？</title>
    <link rel="stylesheet" href="css/base.css">
</head>
<body>
<!-- 首页 -->
<div class="wrap">
    <div class="title">
        <p id="title"></p>
    </div>
    <div class="logo_lists" id="logoLists"></div>
</div>
<div class="dialog" id="dialogFail">
    <div class="dialog_box">
        <p><b id="dialogFailTitle">你个白痴！</b>竟然连<i id="logoName">苹果</i>的标志都不认识!</p>
        <div class="btn"><a href="javascript:;" id="fGoToNext">进入下一题</a></div>
    </div>
</div>
<div class="dialog" id="dialogSuccess">
    <div class="dialog_box">
        <h2><i class="icon icon-32 icon-right"></i>恭喜你，答对了！</h2>
        <div class="btn"><a href="javascript:;" id="sGoToNext">进入下一题</a></div>
    </div>
</div>
<div class="dialog" id="dialogEnd">
    <div class="dialog_box">
        <h2>Game Over !!!</h2>
        <p id="winContent"></p>
    </div>
</div>
<div class="footer">
	<img class="hide" src="http://wx.bitmain.com/img/dizzy.png">
	<p><a href="http://www.bitmain.com/" target="_blank">比特大陆</a>出品</p>
</div>

<script src="js/zepto-v1.1.4.js"></script>
<script src="js/common.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script src="js/wx.js"></script>
<script>
    var options={
        'title': '上网多年，你瞎了吗？',
        'desc': '这些大公司的Logo你能认出几个？',
        'link': 'http://wx.bitmain.com/',
        'imgUrl': 'http://wx.bitmain.com/img/dizzy.png'
    };
    var config = {
        'appId': '<?=$appId?>',
        'timestamp': <?=$timestamp?>,
        'nonceStr': '<?=$nonceStr?>',
        'signature': '<?=$signature?>'
    };
    var _wx_share = new WxShare(options, config);
    _wx_share.setTimeLineOptions({
       	'title': '上网多年，你瞎了吗？',
        'desc': '这些大公司的Logo你能认出几个？',
        'link': 'http://wx.bitmain.com/',
        'imgUrl': 'http://wx.bitmain.com/img/dizzy.png'
    });
</script>
</body>
</html>
