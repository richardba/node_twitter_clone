import knex from 'db/knex';
import knexCleaner from 'knex-cleaner';
import { request } from '../utils';

describe('registration', () => {
  afterEach(async () => {
    await knexCleaner.clean(knex, {
      ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
    });
    await knex.seed.run();
  });

  it('Registers an user', async () => {
    const query = `
      mutation {
        registerUser(
          input: {
            email: "useruser@email.com"
            name: "New User"
            password: "userpass123"
            username: "new_user"
          }
        ) {
          username
          email
          name
        }
      }
    `;

    const result = await request(query, {});
    expect(result).toMatchSnapshot();
  });

  it('Should not allow registering this usse', async () => {
    const query = `
      mutation {
        registerUser(
          input: {
            email: "userusero@email.com"
            name: "Test User"
            password: "aaa"
            username: "test_usero"
          }
        ) {
          username
          email
          name
        }
      }
    `;

    const result = await request(query, {});
    expect(result).toMatchSnapshot();
  });

  it('Should not allow registering with same email', async () => {
    const query = `
      mutation {
        registerUser(
          input: {
            username: "test2"
            password: "aaa"
            email: "test@email.com"
            name: "Test User"
          }
        ) {
          username
          email
          name
        }
      }
    `;

    const result = await request(query, {});
    expect(result).toMatchSnapshot();
  });
});
