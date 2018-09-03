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
        atlas: cc.SpriteAtlas,
        
        /**
         * !#en All the clips base name
         * !#zh 通过脚本可以访问并播放的 AnimationClip 列表。
         * @property _clips
         * @type {cc.String[]}
         * @private
         */
        _clips: {
            default: [],
            type: [cc.String],
            visible: true
        },

        play: {
            get () {
                return this._play;
            },
            set (value) {
                this._play = value;
                this.on_play_clip(value);
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    create_clip(clip_name) {
        var frames = new Array();
        for (var i = 0; i < 10; i++) {
            var frame =  this.atlas.getSpriteFrame(clip_name + ".p0" + i);
            if (frame) {
                frames[i] = frame;
            }
        }
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, 15);
        clip.name = clip_name;
        clip.wrapMode = cc.WrapMode.Loop;
        clip._duration = 37/60;
        return clip;
    },

    onLoad () {
        this._clips_map = {};
        var animation = this.node.addComponent(cc.Animation);
        for (var i = 0; i < this._clips.length; i++) {
            var clip = this.create_clip(this._clips[i]);
            animation.addClip(clip);
            this._clips_map[this._clips[i]] = clip;
        }

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
    },

    start () {
        // var animation = this.node.getComponent(cc.Animation);
        // animation.play('pipe_ani');

        if (this._clips.length > 0) {
            this.play = this._clips[0];
        }
    },

    // update (dt) {},

    on_play_clip(value) {
        var animation = this.node.getComponent(cc.Animation);
        if (this._clips_map[value]) {
        } else {
            var clip = this.create_clip(value);
            animation.addClip(clip);
            this._clips_map[value] = clip;
        }
        animation.play(value);
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
