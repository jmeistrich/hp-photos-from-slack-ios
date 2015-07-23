'use strict';

var React = require('react-native');
var _ = require('lodash');
var DDPClient = require("ddp-client");

var ddpClient = new DDPClient({url: 'ws://hp-photos-from-slack.meteor.com/websocket'});


class Data {
    init() {
        ddpClient.connect(() => ddpClient.subscribe('photos'));

        var observer = ddpClient.observe("photos");
        observer.added = () => this._updateHandler();
    }

    _updateHandler() {
        if (!this.loaded) {
            this.timeout = setTimeout(this._update, 4000);
        }
        else {
            this._update();
        }
    }

    _update() {
        var arr = [];
        var num = 0;
        var rows = ddpClient.collections.photos;
        for (var key in rows)
        {
            if (rows.hasOwnProperty(key))
            {
                var obj = rows[key];
                if (obj.slack && obj.slack.filetype)
                {
                    switch(obj.slack.filetype)
                    {
                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                              arr.push(obj.slack.title);
                              num ++;
                              break;
                      }
                }
            }
        }
        console.log(arr);
        console.log('num', num);
    }
}

module.exports = new Data();