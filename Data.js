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

var SUPPORT_CACHING = true;
var SUPPORT_CACHING_BASIC = true;

class Data {
    init(cb) {
        this._cb = cb;
        this._dataById = {};
        this._data = [];
        this.timeoutMeteor = undefined;
        this.timeoutCache = undefined;

        if (SUPPORT_CACHING)
        {
            var _this = this;
            AsyncStorage.getItem(STORAGE_IDS)
                .then((value) => {
                    if (value)
                    {
                        var localData = JSON.parse(value);
                        for (var i = 0; i < localData.length; i ++)
                        {
                            var obj = localData[i];
                            _this._dataById[obj.id] = obj;
                        }

                        if (SUPPORT_CACHING_BASIC)
                        {
                            _this._data = localData;
                            _this._cb(_this._data);
                        }
                        else
                        {
                            if (localData.length > 0)
                            {
                                _this._data = localData;
                                LocalImages.imagePath(localData[0].id, (value) => {
                                    if (!value)
                                    {
                                        console.log('CLEARING');
                                        LocalImages.clear();
                                        AsyncStorage.setItem(STORAGE_IDS, '');
                                        _this._dataById = {};
                                        _this._data = [];
                                    }
                                    _this._cb(_this._data);
                                });
                            }
                        }

                    }
                })
                .catch((error) => _this._appendMessage('AsyncStorage error: ' + error.message))
                .done(() => _this._connect());
        }
        else
        {
            this._connect();
        }
    }

    getData() {
        return this._data;
    }

    indexOf(value) {
        return this._data.indexOf(value);
    }

    _connect() {
        if (navigator.onLine)
        {
            ddpClient.connect(() => ddpClient.subscribe('photos'));

            var observer = ddpClient.observe("photos");
            observer.added = () => this._updateHandler();
        }
    }

    _updateHandler() {
        // if (!this.loaded) {
            if (this.timeoutMeteor)
            {
                clearTimeout(this.timeoutMeteor);
                this.timeoutMeteor = undefined;
            }
            this.timeoutMeteor = setTimeout(this._update.bind(this), 2000);
        // }
        // else {
        //     this._update();
        // }
    }

    _isPhoto(filetype) {
        switch(filetype) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return true;
        }
        return false;
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
                if (!this._dataById[row._id] && row.batch && row.batch === batch && s && this._isPhoto(s.filetype))
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
                    if (!obj.thumb)
                    {
                        obj.thumb = obj.url;
                    }
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

            if (SUPPORT_CACHING && !SUPPORT_CACHING_BASIC)
            {
                this._cache(this._data, this._cb);
            }
        }
    }

    _cacheImage(arr, i, cb) {
        var image = arr[i];
        LocalImages.saveImage(image.thumb || image.url, image.id, (error, data) => {
            console.log('saved', i, arr[i].id);
            if (!error) {
                image.thumbCached = data;
                AsyncStorage.setItem(STORAGE_IDS, JSON.stringify(arr));
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