'use strict';

var React = require('react-native');
var {
  AsyncStorage,
} = React;
var _ = require('lodash');
var DDPClient = require("ddp-client");
var LocalImages = require('NativeModules').LocalImages;


var ddpClient = new DDPClient({url: 'ws://hp-photos-from-slack.meteor.com/websocket'});

var batch = '2015-europe';
var STORAGE_IDS = 'imageIDs';

class Data {
    init(cb) {
        this._cb = cb;
        this._dataById = {};
        this._data = [];
        this.timeoutMeteor = undefined;
        this.timeoutCache = undefined;

        AsyncStorage.getItem(STORAGE_IDS)
            .then((value) => {
                if (value)
                {
                    var localData = JSON.parse(value);
                    for (var i = 0; i < localData.length; i ++)
                    {
                        var obj = localData[i];
                        this._dataById[obj.id] = obj;
                    }
                    this._cb(localData);
                }
            })
            .catch((error) => this._appendMessage('AsyncStorage error: ' + error.message))
            .done();

        ddpClient.connect(() => ddpClient.subscribe('photos'));

        var observer = ddpClient.observe("photos");
        observer.added = () => this._updateHandler();
    }

    _updateHandler() {
        if (!this.loaded) {
            if (this.timeoutMeteor)
            {
                clearTimeout(this.timeoutMeteor);
            }
            this.timeoutMeteor = setTimeout(this._update.bind(this), 2000);
        }
        else {
            this._update();
        }
    }

    _update() {
        console.log('update');
        this.loaded = true;
        // var arr = [];
        var ids = [];
        var rows = ddpClient.collections.photos;
        var added = false;
        for (var key in rows)
        {
            if (rows.hasOwnProperty(key))
            {
                var row = rows[key];
                var s = row.slack;
                if (!this._dataById[row._id] && row.batch && row.batch === batch && s)
                {
                    var obj = {
                        id: row._id,
                        url: row.photo_url,
                        title: s.title,
                        timestamp: s.timestamp,
                        thumb: s.thumb_360,
                        // thumbW: s.thumb_360_w,
                        // thumbH: s.thumb_360_h
                    };
                    this._data.push(obj);

                    this._dataById[row._id] = obj;

                    added = true;
                }
            }
        }

        if (added)
        {
            this._data = this._data.sort(this._arraySort);
            AsyncStorage.setItem(STORAGE_IDS, JSON.stringify(this._data));

            this._cb(this._data);
            this._cache(this._data, this._cb);
        }
    }

    _cacheImage(arr, i, cb) {
        var image = arr[i];
        LocalImages.saveImage(image.thumb || image.url, image.id, (error, data) => {
            console.log('saved', i, arr[i].id);
            if (!error) {
                image.thumbCached = data;
                AsyncStorage.setItem(STORAGE_IDS, JSON.stringify(arr));
                cb(arr);
            }
        });
    }

    _cache(arr, cb) {
        for (var i = 0; i < arr.length; i ++)
        {
            if (!this._data[i] || !this._data[i].thumbCached)
            {
                this._cacheImage(arr, i, cb);
            }
        }
    }

    _arraySort(first, second) {
        return second.timestamp - first.timestamp;
    }
}

module.exports = new Data();