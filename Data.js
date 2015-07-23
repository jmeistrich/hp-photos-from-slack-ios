'use strict';

var React = require('react-native');
var _ = require('lodash');
var DDPClient = require("ddp-client");

var ddpClient = new DDPClient({url: 'ws://hp-photos-from-slack.meteor.com/websocket'});

var batch = '2015-europe';

class Data {
    timeout: undefined;
    _data: undefined;

    init(cb) {
        this._cb = cb;
        ddpClient.connect(() => ddpClient.subscribe('photos'));

        var observer = ddpClient.observe("photos");
        observer.added = () => this._updateHandler();
    }

    _updateHandler() {
        if (!this.loaded) {
            if (this.timeout)
            {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(this._update.bind(this), 2000);
        }
        else {
            this._update();
        }
    }

    _update() {
        this.loaded = true;
        var arr = [];
        var rows = ddpClient.collections.photos;
        for (var key in rows)
        {
            if (rows.hasOwnProperty(key))
            {
                var obj = rows[key];
                var s = obj.slack;
                if (obj.batch && obj.batch === batch && s)
                {
                    arr.push({
                        id: obj._id,
                        url: obj.photo_url,
                        title: s.title,
                        timestamp: s.timestamp,
                        thumb: s.thumb_360,
                        thumbW: s.thumb_360_w,
                        thumbH: s.thumb_360_h
                    });
                }
            }
        }
        arr = arr.sort(this._arraySort);
        this._data = arr;
        this._cb(arr);
    }

    _arraySort(first, second) {
        return second.timestamp - first.timestamp;
    }
}

module.exports = new Data();