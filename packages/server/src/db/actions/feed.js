import knex from '../knex';
import { getUserFollowingIds } from './user';

const buildQuery = ({ idCollection, order, after, first }) => {
  return knex('tweets').select(
      'content',
      'created_at',
      'id',
      'likeForTweetId',
      'retweetForTweetId',
      'userId',
    ).whereIn('userId', idCollection)
    .andWhere('replyForTweetId', null)
    .andWhere(function() {
      if (after) {
        this.where('tweets.created_at', '<', after);
      }
    }).orderBy('created_at', order)
    .limit(first);
};

/**
* Timeline
* This method is responsible for fetching all user ids, which one user follows, 
* the default order sorts from newest to oldest and limits the results to 10 entries, with max of 100
*/ 
export async function getFeedForUser(user, { first, after, order }) {  
  const followingIds = await getUserFollowingIds(user);
  const allIds = [user.id, ...followingIds];
  order = order || 'desc';
  first = Math.min(first || 10, 100);

  const tweets = await buildQuery({
    idCollection: allIds,
    order,
    after,
    first,
  });

  return {
    tweets: tweets,
    async hasNextPage() {
      if (tweets.length < first) {
        return false;
      }

      const lastRow = tweets[tweets.length - 1];

      const query = buildQuery({
        idCollection: allIds,
        order,
        after: lastRow.created_at,
        first: 1,
      });

      const afterTweets = await query;
      return afterTweets && !!afterTweets[0];
    },
  };
}
