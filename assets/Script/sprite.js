cc.Class({
    extends: cc.Component,

    properties: {
        scanUI: cc.Node,
        deviceItem: cc.Prefab,
        messageItem: cc.Prefab,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        listMsg: {
            default: null,
            type: cc.ScrollView
        },
        spacing: 0,
        spawnCount: 0,
        _connected: false,
        _scaning: false,
        _totalDevice: 0,
        _totalMessage: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.content = this.scrollView.content;
        this.contentMsg = this.listMsg.content;
        this.deviceItems = [];
        this.initialize();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;

        if (!cc.tao) {
            cc.tao = {};
        }
        let NativeHelper = require('NativeHelper');
        cc.tao.native = new NativeHelper();
        cc.tao.native.init(this);
    },

    initialize: function () {
        for (let i = 0; i < this.spawnCount; ++i) {
            this.addDeviceItem(i.toString(), 'test', 'test');
        }
    },

    onButtonConnect: function () {
        if (this._connected) {
            cc.tao.native.disconnect();
        } else {
            this.scanUI.active = true;
            this.content.removeAllChildren();
            this.contentMsg.removeAllChildren();
            this._totalDevice = 0;
            this._totalMessage = 0;
            cc.tao.native.scan();
        }
    },

    onButtonScan: function () {
        if (this._scaning) {
            this.scanUI.active = false;
        } else {
            this._scaning = true;
            let node = cc.find('rect/scan', this.scanUI);
            let button = node.getComponent(cc.Button);
        }
    },

    // 加入扫描到的蓝牙设备
    addDeviceItem: function (name, id, rssi) {
        let listnode = cc.find('rect/list', this.scanUI);
        if (listnode == null) {
            return;
        }
        if (listnode.active == false) {
            listnode.active = true;
            let tip = cc.find('rect/tip', this.scanUI);
            tip.active = false;
        }
        let item = cc.instantiate(this.deviceItem);
        item.width = this.content.width;
        item.setPosition(0,
            -item.height * (0.5 + this._totalDevice) -
            this.spacing * (this._totalDevice + 1));
        item.getComponent('deviceItem').init(name, id, rssi);
        this.content.addChild(item);

        // 设置触摸事件
        item.on(cc.Node.EventType.TOUCH_START, function () {
            //item.color = cc.Color.BLUE;
            this.selectDevice(item.getComponent('deviceItem').getId());
        }, this);

        this.deviceItems.push(item);
        this._totalDevice++;
        let height = this._totalDevice *
            (item.height + this.spacing) + this.spacing;
        if (height > this.content.height) {
            this.content.height = height;
        }
    },

    selectDevice: function (id) {
        // now connect bluetooth device...
        cc.tao.native.connect(id);
    },

    // 连接蓝牙设备成功
    deviceConnect: function (name) {
        this._connected = true;

        // 关闭扫描UI
        this.scanUI.active = false;

        let label = cc.find('Canvas/device/info');
        if (label) {
            label.getComponent(cc.Label).string = 'Device: ' + name + ' - ready';
        }
        let node = cc.find('Canvas/action/send');
        if (node) {
            node.getComponent(cc.Button).interactable = true;
        }
        node = cc.find('Canvas/connect/Label');
        if (node) {
            node.getComponent(cc.Label).string = 'Disconnect';
        }
    },

    // 断开蓝牙设备
    deviceDisconnect: function () {
        this._connected = false;

        let label = cc.find('Canvas/device/info');
        if (label) {
            label.getComponent(cc.Label).string = 'Device: not connected';
        }
        let node = cc.find('Canvas/action/send');
        if (node) {
            node.getComponent(cc.Button).interactable = false;
        }
        node = cc.find('Canvas/connect/Label');
        if (node) {
            node.getComponent(cc.Label).string = 'Connect';
        }
    },

    // 收到蓝牙设备消息
    addDeviceMessage: function (rx, message) {
        let date = new Date();
        let currentDateTime = date.getHours() + ':' +
            date.getMinutes() + ':' + date.getMilliseconds();
        let log_msg = '[' + currentDateTime + ']';
        if (rx) {
            log_msg += ' RX:' + message;
        } else {
            log_msg += ' TX:' + message;
        }

        let item = cc.instantiate(this.messageItem);
        item.width = this.contentMsg.width;
        item.setPosition(0,
            -item.height * (0.5 + this._totalMessage) -
            this.spacing * (this._totalMessage + 1));
        item.getComponent(cc.Label).string = log_msg;
        this.contentMsg.addChild(item);

        this._totalMessage++;
        let height = this._totalMessage *
            (item.height + this.spacing) + this.spacing;
        if (height > this.contentMsg.height) {
            this.contentMsg.height = height;
        }
    },

    onButtonSend: function () {
        let node = cc.find('Canvas/action/edit');
        if (node) {
            let message = node.getComponent(cc.EditBox).string;
            if (message.length == 0) {
                // 准备发送升级文件
            } else {
                this.addDeviceMessage(0, message);
                cc.tao.native.send(message);
            }
        }
    },

    // called every frame
    update: function (dt) {

    },
});
