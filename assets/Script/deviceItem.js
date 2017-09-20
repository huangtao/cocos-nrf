cc.Class({
    extends: cc.Component,

    properties: {
        labelName: {
            default: null,
            type: cc.Label
        },
        labelId: {
            default: null,
            type: cc.Label
        },
        labelRssi: {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
    },

    init: function (name, id, rssi) {
        this.labelName.string = name;
        this.labelId.string = id;
        this.labelRssi.string = rssi;
    },

    getId: function () {
        return this.labelId.string;
    },

    connect: function() {
        cc.tao.native.connect(this.labelId.string);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
