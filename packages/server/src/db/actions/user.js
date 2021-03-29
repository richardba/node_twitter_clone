import bcrypt from 'bcryptjs';
import knex from '../knex';

import { createUserAvatarUrl } from '../../utils/createImgURL';

import { POSTGRES_UNIQUE_VIOLATION } from '../constants';
import { UniqueViolation, InvalidOperation } from '../errors';

export async function hashPassword(password) {
  return new Promise(resolve =>
    bcrypt.hash(password, 8, (err, hash) => resolve(hash))
  );
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function findUserById(id, columns = ['*']) {
  const users = await knex('users')
    .select(columns)
    .where({ id });
  return users && users[0];
}

export async function findUserByUsername(username, columns = ['*']) {
  const users = await knex('users')
    .select(columns)
    .where({ username });
  return users && users[0];
}

/**
* User creation
*/

export async function createUser({ name, username, password, email }) {
  try {
    const hashedPassword = await hashPassword(password);
    await knex('users').insert({
      avatar_source_url: createUserAvatarUrl(email),
      email,
      name,
      password: hashedPassword,
      username,
    });
  } catch (err) {
    if (err.code === POSTGRES_UNIQUE_VIOLATION) {
      if (err.constraint.includes('username'))
        throw new UniqueViolation('This username is already in use', 'username');

      if (err.constraint.includes('email'))
        throw new UniqueViolation('This e-mail is already in use', 'email');
    }

    throw err;
  }
}