import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';

/*
 * Create Types
 */

const typesArray = fileLoader(path.join(__dirname, '.'), {
  recursive: true,
  extensions: ['.graphql'],
});

const typeDefs = mergeTypes(typesArray);

/*
 * Create Resolvers
 */

// Seems like we can't import the resolvers with a blob on backpack?
const resolversArray = [
  require('./schema/feed/resolvers').default,
  require('./schema/pagination/resolvers').default,
  require('./schema/tweet/resolvers').default,
  require('./schema/user/resolvers').default,
];
const resolvers = mergeResolvers(resolversArray);

/*
 * Create Schema
 */

export default makeExecutableSchema({ typeDefs, resolvers });
