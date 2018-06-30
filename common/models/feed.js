'use strict';

module.exports = function(Feed) {
  Feed.beforeRemote('create', function(context, user, next) {
    context.args.data.ownerId = context.req.accessToken.userId;
  });
};
