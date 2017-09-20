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
        console.log('onScanResp called device=' + device);
        if (typeof (device) !== 'string') {
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
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.ios_api, 'connect');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.android_api,
                'connect', '(Ljava/lang/String;)V',
                id);
        } else {
            console.log('platform:' + cc.sys.os + "don't implement connect.");
        }
    },

    disconnect: function () {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.ios_api, 'disconnect');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.android_api,
                'disconnect', '()V');
        } else {
            console.log('platform:' + cc.sys.os + "don't implement disconnect.");
        }        
    },

    onDeviceConnect: function (name) {
        console.log('onDeviceConnect:' + name);
        if (this._callback_ui) {
            this._callback_ui.deviceConnect(name);
        }
    },

    onDeviceDisconnect: function () {
        console.log('onDeviceDisconnect.');
        if (this._callback_ui) {
            this._callback_ui.deviceDisconnect();
        }
    },

    onDeviceMsg: function (message) {
        console.log('onDeviceMsg called message=' + message);
        if (this._callback_ui) {
            this._callback_ui.addDeviceMessage(1, message);
        }
    },

    send: function (message) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.ios_api, 'send');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.android_api,
                'send', '(Ljava/lang/String;)V',
                message);
        } else {
            console.log('platform:' + cc.sys.os + "don't implement send.");
        }
    },
});
