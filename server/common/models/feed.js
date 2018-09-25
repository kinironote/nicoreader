'use strict';

var FeedParser = require('feedparser');
var request = require('request');
var libxml = require('libxmljs');

module.exports = function(Feed) {
  Feed.beforeRemote('create', function(context, user, next) {
    context.args.data.ownerId = context.req.accessToken.userId;
    next();
  });
  Feed.requestFeed = function(id, res) {
    Feed.findById(id, function(err, instance) {
      if (instance.feedType === 'user' || instance.feedType === 'mylist') {
        var feed = function() {
          var query = instance.query;
          switch (instance.feedType) {
            case 'user':
              return 'http://www.nicovideo.jp/user/' + query + '/video?rss=2.0';
              break;
            case 'mylist':
              return 'http://www.nicovideo.jp/mylist/' + query + '/video?rss=2.0';
              break;
            default:
              break;
          }
        }();

        var req = request(feed);
        var feedparser = new FeedParser({});

        var items = [];

        req.on('response', function(res) {
          this.pipe(feedparser);
        });

        feedparser.on('meta', function(meta) {
          console.log('==== %s ====', meta.title);
        });

        feedparser.on('readable', function() {
          var item;
          while ((item = this.read())) {
            const discription = item.description;
            const response = {
              title: item.title,
              thumbnailUrl: discription.match(/src=\"(.*?)\"/)[1],
              viewCounter: '',
              contentId: item.link.replace('http://www.nicovideo.jp/watch/sm', ''),
              startTime: discription.match(/<strong class=\"nico-info-date\">(.*?)<\/strong>/)[1],
            };
            items.push(response);
          }
        });

        feedparser.on('end', function() {
          res(null, JSON.stringify(items));
        });
      } else if (instance.feedType === 'search' || instance.feedType === 'tags') {
        var apiCall = function() {
          var query = instance.query;
          console.log('get');
          switch (instance.feedType) {
            case 'search':
              return 'https://api.search.nicovideo.jp/api/v2/video/contents/search' +
                    '?q=' + encodeURIComponent(query) +
                    '&targets=title' +
                    '&fields=title,thumbnailUrl,viewCounter,contentId,startTime' +
                    '&_sort=-startTime' +
                    '&_offset=0' +
                    '&_limit=20' +
                    '&_context=nicoreader';
              break;
            case 'tags':
              return 'https://api.search.nicovideo.jp/api/v2/video/contents/search' +
                    '?q=' + encodeURIComponent(query) +
                    '&targets=tags' +
                    '&fields=title,thumbnailUrl,viewCounter,contentId,startTime' +
                    '&_sort=-startTime' +
                    '&_offset=0' +
                    '&_limit=20' +
                    '&_context=nicoreader';
              break;
            default:
              break;
          }
        }();
        request(apiCall, function(error, response, body) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          res(null, body);
        });
      } else {
        res(null, '');
      }
    });
  };
  Feed.remoteMethod(
      'requestFeed', {
        accepts: [
            {arg: 'id', type: 'number', required: true},
        ],
        http: {path: '/:id/request-feed', verb: 'get'},
        returns: {
          arg: 'response',
          type: 'string',
        },
      }
  );
};
