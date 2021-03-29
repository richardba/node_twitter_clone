import knex from 'db/knex';
import knexCleaner from 'knex-cleaner';
import { request } from '../utils';

let user = null;

beforeAll(async () => {
  await knexCleaner.clean(knex, {
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  });
  await knex.seed.run();
  user = (await knex.table('users').where({ username: 'test_user' }))[0];
});

it('should like a tweet', async () => {
  const context = { user };

  const query = `
    mutation LikeQuery($input: LikeInput!) {
      like(input: $input) {
        context {
          originalTweet {
            id
            content
          }
          contextTweet {
            id
          }
          contextUser {
            id
            name
          }
        }
      }
    }
  `;

  const variables = {
    input: { tweetId: 'a1a6d5ec-59e3-5e5-a6f1-b1d6eea12992' },
  };

  const result = await request(query, { context, variables });
  expect(result).toMatchSnapshot();
});
