const bcrypt = require('bcryptjs');
const { createUserAvatarUrl } = require('../../../utils/createImagesUrl');

const hashPassword = password =>
  new Promise(resolve =>
    bcrypt.hash(password, 8, (err, hash) => resolve(hash))
  );

const ids = {
  richard: '89ba0914-9e9f-4533-9c8e-041204377b72',
  iago: 'c867f663-b071-462c-b435-065870a964f6',
  eldio: 'a3a0f0cf-3bb0-4d17-947e-8fc803406315',
  braun: '478bfd2e-130e-4719-84c2-42f70b7a979d',
  flinch: '3cdb3773-fd37-4628-b00b-566c78022e16',
  samir: '605254ea-d31d-4c96-b9ff-3948efa4d760',
  saul: '1cabad45-e256-4e3a-bfa0-eeb51a4de577',
  john: 'e2f3291c-5fab-4c73-873f-955d6264ccd3',
  autumn: '4b97df50-d0bc-4585-8667-800c073734cd',
};

exports.ids = ids;

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async function() {
      // Inserts seed entries
      await knex('users').insert([
        {
          id: ids.richard,
          username: 'richard',
          password: await hashPassword('richard'),
          name: 'Richard',
          email: 'richard@email.com',
          avatar_source_url: createUserAvatarUrl('richard@email.com'),
        },
        {
          id: ids.iago,
          username: 'iago',
          password: await hashPassword('iago'),
          name: 'iago',
          email: 'iago@email.com',
          avatar_source_url: createUserAvatarUrl('iago@email.com'),
        },
        {
          id: ids.eldio,
          username: 'eldio',
          password: await hashPassword('eldio'),
          name: 'eldio',
          email: 'eldio@email.com',
          avatar_source_url: createUserAvatarUrl('eldio@email.com'),
        },
        {
          id: ids.braun,
          username: 'braun',
          password: await hashPassword('braun'),
          name: 'braun',
          email: 'braun@email.com',
          avatar_source_url: createUserAvatarUrl('braun@email.com'),
        },
        {
          id: ids.flinch,
          username: 'flinch',
          password: await hashPassword('flinch'),
          name: 'Flinch Furious',
          email: 'Flinch@email.com',
          avatar_source_url: createUserAvatarUrl('Flinch@email.com'),
        },
        {
          id: ids.samir,
          username: 'samir',
          password: await hashPassword('samir'),
          name: 'Samir Loxley',
          email: 'samir@email.com',
          avatar_source_url: createUserAvatarUrl('samir@email.com'),
        },
        {
          id: ids.saul,
          username: 'saul',
          password: await hashPassword('saul'),
          name: 'Saul Berthold',
          email: 'saul@email.com',
          avatar_source_url: createUserAvatarUrl('saul@email.com'),
        },
        {
          id: ids.mariyah,
          username: 'john',
          password: await hashPassword('john'),
          name: 'John Sainthold',
          email: 'john@email.com',
          avatar_source_url: createUserAvatarUrl('john@email.com'),
        },
        {
          id: ids.autumn,
          username: 'autumn',
          password: await hashPassword('autumn'),
          name: 'Autumn Meyer',
          email: 'autumn@email.com',
          avatar_source_url: createUserAvatarUrl('autumn@email.com'),
        },
      ]);
    });
};
