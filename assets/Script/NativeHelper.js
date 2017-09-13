cc.Class({
    extends: cc.Component,

    properties: {
        _callback_ui: null,
        _isCapturing: false
    },

    onLoad: function () {
    },

    init: function (callback) {
        this._callback_ui = callback;
        this.ios_api = 'AppController';
        this.android_api = 'org/cocos2dx/javascript/AppActivity';
        if (!cc.sys.isNative) {
            return;
        }
    },

    scan: function () {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.ios_api, 'scan');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.android_api, 'scan', '()V');
        } else {
            console.log('platform:' + cc.sys.os + "don't implement scan.");
        }
    },

    onScanResp: function (device) {
        cc.log('onScanResp called device=', device);
        if (typeof(device) !== 'string') {
            return;
        }
        let ary = device.split(',');
        if (ary.length < 3) {
            return;
        }
        let name = ary[0];
        let id = ary[1];
        let rssi = ary[2];
        if (this._callback_ui) {
            this._callback_ui.addDeviceItem(name, id, rssi);
        }
    },

    connect: function (id) {
    },
});
