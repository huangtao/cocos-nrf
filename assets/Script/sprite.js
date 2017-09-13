cc.Class({
    extends: cc.Component,

    properties: {
        scanUI: cc.Node,
        deviceItem: cc.Prefab,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        spacing: 0,
        spawnCount: 0,
        _scaning: false,
        _totalDevice: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.content = this.scrollView.content;
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
        this.scanUI.active = true;
        this.content.removeAllChildren();
        cc.tao.native.scan();
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

    // called every frame
    update: function (dt) {

    },
});
