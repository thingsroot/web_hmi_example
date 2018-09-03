// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //atlas: cc.SpriteAtlas,
        
        /**
         * !#en All the clips base name
         * !#zh 通过脚本可以访问并播放的 AnimationClip 列表。
         * @property _clips
         * @type {cc.String[]}
         * @private
         */
        // _clips: {
        //     default: [],
        //     type: [cc.String],
        //     visible: true
        // },
        folder: "powerImages/gifs",
        _atlas: "",

        atlas: {
            get () {
                return this._atlas;
            },
            set (value) {
                this._atlas = value;
                this.on_change_atlas(value);
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    load_clip(animation, atlas_name, play) {
        var self = this;
        cc.loader.loadRes(this.folder + "/" + atlas_name, cc.SpriteAtlas, function (err, atlas) {
            if (!atlas) {
                console.log("Loading atlas failed!", this.folder, atlas_name);
                return;
            }
            var frames = new Array();
            for (var i = 0; i < 10; i++) {
                var frame =  atlas.getSpriteFrame("p0" + i);
                if (frame) {
                    frames[i] = frame;
                }
            }
            var clip = cc.AnimationClip.createWithSpriteFrames(frames, 15);
            clip.name = atlas_name;
            clip.wrapMode = cc.WrapMode.Loop;
            clip._duration = 37/60;
                
            animation.addClip(clip);
            if (play) {
                animation.play(atlas_name);
            }
        });
    },

    onLoad () {
        // var animation = this.node.addComponent(cc.Animation);
        // var frames = new Array();
        
        // for (var i = 0; i < 10; i++) {
        //     var frame =  this.atlas.getSpriteFrame("image1_2.p0" + i);
        //     if (frame) {
        //         frames[i] = frame;
        //     }
        // }
        // var clip = cc.AnimationClip.createWithSpriteFrames(frames, 15);
        // clip.name = 'pipe_ani';
        // clip.wrapMode = cc.WrapMode.Loop;
        // clip._duration = 37/60;
        // animation.addClip(clip);
        
        var animation = this.node.addComponent(cc.Animation);
        if (this._atlas != "") {
            this.load_clip(animation, this._atlas, true);
        }
    },

    start () {
        // var animation = this.node.getComponent(cc.Animation);
        // animation.play('pipe_ani');
    },

    // update (dt) {},

    on_change_atlas(value) {
        var animation = this.node.getComponent(cc.Animation);
        animation.stop();
        var clips = animation.getClips();
        for (var i = 0; i < clips.length; i++) {
            animation.removeClip(clips[i]);
        }
        this.load_clip(animation, value, true);
    },
    play() {
        var animation = this.node.getComponent(cc.Animation);
        animation.play(this._atlas);
    },
    stop() {
        var animation = this.node.getComponent(cc.Animation);
        animation.stop();
    },
    pause() {
        var animation = this.node.getComponent(cc.Animation);
        animation.pause();
    }
});
