import knex from '../knex';

/**
  Find Tweet by Id
*/
export async function findTweetById(id) {
  const tweets = await knex('tweets').where({ id });
  return tweets && tweets[0];
}

/**
  Post Tweet
  @param userId The actual user who posted the tweet
  @param content The post content
*/
export async function createTweet({ userId, content }) {
  const tweet = await knex('tweets')
    .insert({
      content,
      userId,
    })
    .returning('*');
  return tweet[0];
}

/**
  Reply to a Tweet
  @param userId The actual user who commented the tweet
  @param tweetId The tweet id
  @param content The content of the comment
*/
export async function replyTweet({ userId, tweetId, content }) {
  const tweet = await knex('tweets')
    .insert({
      content,
      replyForTweetId: tweetId,
      userId,
    })
    .returning('*');
  return tweet[0];
}

/**
  Retweeting
  @param userId The actual user who shared the tweet
  @param tweetId The original tweet id
*/
export async function toggleRetweet({ userId, tweetId }) {
  const deleteTweet = await knex('tweets')
    .del()
    .where({ userId, retweetForTweetId: tweetId })
    .returning('*');

  if (deleteTweet[0]) {
    return deleteTweet[0];
  }

  const tweets = await knex('tweets')
    .insert({
      userId,
      retweetForTweetId: tweetId,
    })
    .returning('*');

  return tweets[0];
}

/**
  Like feature
  @param userId The actual user who liked the tweet
  @param tweetId The original tweet id
*/
export async function toggleLike({ userId, tweetId }) {
  const deleteTweet = await knex('tweets')
    .del()
    .where({ userId, likeForTweetId: tweetId })
    .returning('*');

  if (deleteTweet[0]) {
    return deleteTweet[0];
  }

  const tweets = await knex('tweets')
    .insert({
      userId,
      likeForTweetId: tweetId,
    })
    .returning('*');

  return tweets[0];
}

/**
  List the tweets from a user
  @param userId The tweets author
*/
export async function getTweetsFromUser(userId, { first, after, order }) {
  order = order || 'desc'; // 
  first = Math.min(first || 10, 100); 

  const query = knex('tweets')
    .select(
      'content',
      'created_at'
      'id',
      'likeForTweetId',
      'retweetForTweetId',
      'userId',
    )
    .where({
      likeForTweetId: null,
      replyForTweetId: null,
      userId,
    });

  const tweet = await query
    .andWhere(function() {
      if (after) {
        this.where('tweets.created_at', '<', after);
      }
    })
    .orderBy('created_at', order)
    .limit(first);

  return {
    tweets: tweet,
    async hasNextPage() {
      if (tweet.length < first) {
        return false;
      }

      const lastRow = tweet[tweet.length - 1];
      const afterRows = await query
        .andWhere(function() {
          if (lastRow.created_at) {
            this.where('tweets.created_at', '<', lastRow.created_at);
          }
        })
        .orderBy('created_at', order)
        .limit(1);

      return afterRows && !!afterRows[0];
    },
  };
}

export async function getReplyCount(tweetId) {
  const tweets = await knex('tweets')
    .count('id')
    .where({ replyForTweetId: tweetId });
  return tweets[0].count;
}

export async function getRetweetCount(tweetId) {
  const tweets = await knex('tweets')
    .count('id')
    .where({ retweetForTweetId: tweetId });
  return tweets[0].count;
}

export async function getLikeCount(tweetId) {
  const tweets = await knex('tweets')
    .count('id')
    .where({ likeForTweetId: tweetId });
  return tweets[0].count;
}

export async function getReplies(tweetId, columns = ['*']) {
  const tweets = await knex('tweets')
    .select(columns)
    .where({ replyForTweetId: tweetId })
    .orderBy('created_at', 'desc');
  return tweets;
}

export async function getUserHasLiked({ userId, tweetId }) {
  const tweets = await knex('tweets')
    .first('id')
    .where({
      likeForTweetId: tweetId,
      userId,
    });
  return !!tweets;
}

export async function getUserHasRetweeted({ userId, tweetId }) {
  const tweets = await knex('tweets')
    .first('id')
    .where({
      retweetForTweetId: tweetId,
      userId,
    });
  return !!tweets;
}
