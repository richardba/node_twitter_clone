﻿import bcrypt from 'bcryptjs';
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
    const hashing = await hashPassword(password);
    await knex('users').insert({
      name,
      username,
      password: hashing,
      email,      
      avatar_source_url: createUserAvatarUrl(email),
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

/**
* User interactions
*/

export async function unfollowUser(userId, targetId) {
  return await knex('follows')
    .del()
    .where({ userId, followingId: targetId });
}

export async function followUser(userId, targetId) {
  if (userId === targetId)
    throw new InvalidOperation('Error, user tried to follow himself');

  return await knex('follows')
    .insert({ userId, followingId: targetId })
    .returning('id');
}

/**
* Create a list of suggestion for a user to follow
* Selecting a bunch of random users, which that user does not follow
*/
export async function getWhoToFollow(user, count, columns = ['*']) {
  const followSuggestion = await knex('users')
    .select(columns)
    .select(knex.raw('random() as ordering'))
    .whereNotIn('id', function() {
      this.select('follows.followingId')
        .from('follows')
        .where('follows.userId',
               user.id);
    })
    .whereNot('id', user.id)
    .orderBy('ordering')
    .limit(count);
  return followSuggestion;
}

export async function followsUser(user, targetUsername) {
  const target = await findUserByUsername(targetUsername, 'id');

  const follows = await knex('follows')
    .select('id')
    .where({
      followingId: target.id,
      userId: user.id,
    });

  return follows.length > 0;
}

export async function getUserFollowingIds(user) {
  const rows = await knex('follows')
    .select('followingId')
    .where({ userId: user.id });
  return rows.map(row => row.followingId);
}

export async function getUserTweetsCount(user) {
  const tweetCount = await knex('tweets')
    .count('id')
    .where({ userId: user.id });
  return Number(tweetCount[0].count);
}

export async function getUserFollowersCount(user) {
  const followersCount = await knex('follows')
    .count('id')
    .where({ followingId: user.id });
  return Number(followersCount[0].count);
}

export async function getUserFollowingCount(user) {
  const followingCount = await knex('follows')
    .count('id')
    .where({ userId: user.id });
  return Number(followingCount[0].count);
}
