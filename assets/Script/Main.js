cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        start_button_label: {
            default: null,
            type: cc.Label
        },
        start_button: {
            default: null,
            type: cc.Button
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'ThingsRoot!',
        start_button_text: 'Start!',
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        this.start_button_label.string = this.start_button_text;
        // 
        this.start_button.node.on("click", this.on_start_click, this)
    },

    // called every frame
    update: function (dt) {

    },
    on_start_click: function(event) {
        event.interactable = false;
        cc.director.loadScene("tanks");
    }
});
