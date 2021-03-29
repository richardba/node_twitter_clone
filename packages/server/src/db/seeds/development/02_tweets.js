const faker = require('faker');
const usersId = require('./01_users').ids;

/*
 Creating random fake tweets ahoy
*/
const createRandomTweets = () => {
  let tweets = [];

  Object.keys(usersId).forEach(key => {
    const userId = usersId[key];
    const n = faker.random.number({ min: 7, max: 15 });

    for (let i = 0; i < n; i++) {
      tweets.push({
        id: faker.random.uuid(),
        userId,
        content: faker.lorem.sentence(faker.random.number({ min: 5, max: 18 })),
        created_at: faker.date.recent(20),
      });
    }
  });

  /*
   Creating random fake retweets owo
   There is a 5% chance to create retweeets
  */
  tweets.forEach(tweet => {
    if (!tweet.content) return;

    Object.keys(usersId).forEach(key => {
      const userId = usersId[key];

      if (Math.random() > 0.05) return;
      tweets.push({
        id: faker.random.uuid(),
        userId,
        created_at: faker.date.recent(20),
        retweetForTweetId: tweet.id,
      });
    });
  });

  /*
   Creating random fake likes pew
   There is a 10% chance to create likes
  */
  tweets.forEach(tweet => {
    if (!tweet.content) return;

    Object.keys(usersId).forEach(key => {
      const userId = usersId[key];

      if (Math.random() > 0.1) return;
      tweets.push({
        id: faker.random.uuid(),
        userId,
        created_at: faker.date.recent(20),
        likeForTweetId: tweet.id,
      });
    });
  });

  /*
   Creating random fake replies pew
   There is a 30% chance to create replies
  */
  tweets.forEach(tweet => {
    if (!tweet.content) return;

    Object.keys(usersId).forEach(key => {
      const userId = usersId[key];

      if (Math.random() > 0.3) return;
      tweets.push({
        id: faker.random.uuid(),
        userId,
        content: faker.lorem.sentence(faker.random.number({ min: 5, max: 18 })),
        created_at: faker.date.recent(20),
        replyForTweetId: tweet.id,
      });
    });
  });

  return tweets;
};

/*
  Export all seeds deleting all existing entries
*/
exports.seed = function(knex) {
  return knex('tweets')
    .del()
    .then(function() {
      return knex('tweets').insert([
        {
          userId: usersId.autumn,
          content: 'Hello World',
          created_at: faker.date.recent(20),
        },
        {
          userId: usersId.autumn,
          content: 'React is awesome!',
          created_at: faker.date.recent(20),
        },
        ...createRandomTweets(),
      ]);
    });
};
