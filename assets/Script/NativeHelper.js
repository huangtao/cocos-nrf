cc.Class({
    extends: cc.Component,

    properties: {
        _callback_ui: null,
        _isCapturing: false
    },

    onLoad: function () {
    },

    init: function () {
        this.ios_api = 'AppController';
        this.android_api = 'org/tao/mjhz/Weixin';
        if (!cc.sys.isNative) {
            return;
        }
    },

    scan: function () {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.ios_api, 'login');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.android_api, 'login', '()V');
        } else {
            console.log('platform:' + cc.sys.os + "don't implement login.");
        }
    },

    onScanResp: function (code) {
        cc.log('onLoginResp called code=', code);
        var data = {
            code: code,
            bundleId: cc.tao.config.bundleId
        };
        cc.tao.net.sendXHR('/auth_wechat', data, function (ret) {
            if (ret.retCode == 0) {
                cc.sys.localStorage.setItem('wx_account', ret.account);
                cc.sys.localStorage.setItem('wx_sign', ret.sign);
            }
            cc.tao.net.onAuth(ret);
        });
        if (this._callback_ui) {
            this._callback_ui.showWaiting(true, '正在登陆服务器...');
        }
    },

    connect: function (id) {

    },
});
