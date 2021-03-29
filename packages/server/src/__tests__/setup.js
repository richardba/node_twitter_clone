import knex from '../db/knex';

/*
 Test
 Run the necessary migrations and set the reference to knex
 in order to close the server during TEARDOWN
*/
module.exports = async () => {

  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();

  global.__KNEX__ = knex;
};
