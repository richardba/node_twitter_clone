require('dotenv').config();

import bodyParser from 'body-parser';
import connectSessionKnex from 'connect-session-knex';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';

import auth from './auth';
import knex from './db/knex';
import schema from './graphql';
import { findUserById } from './db/actions/user';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const start = () => {
  // Start up the server
  return new Promise(async resolve => {

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors({ origin: [process.env.FRONTEND_URL, 'http://localhost:3000'], credentials: true }));
    
    /*
    / ----------------------------
    / Cookies and Session settings
    ------------------------------/
    */

    // Cookie
    const cookieSettings = {
      httpOnly: true,
      secure: IS_PRODUCTION,
    };
    
    // Session

    const sessionStore = connectSessionKnex(session);
    const store = new sessionStore({ knex });
    app.use(
      session({
        cookie: cookieSettings,
        resave: false,
        saveUninitialized: false,
        secret: 'test',
        store,
      })
    );
    
    // Authentication (based on Cookies)

    app.use(auth({ cookieSettings }));

    //--------------------
    // GraphQL
    
    /**
    / ApolloServer
    / The userID is extracted from the requested, 
    / so we can find it on the Database
    */

    const apolloServer = new ApolloServer({
      schema,
      context: async ({ req: { session } }) => ({        
        user: session.userId && (await findUserById(session.userId)),
      }),
      playground: !IS_PRODUCTION,
      debug: !IS_PRODUCTION,
    });
    
    // Disable CORS
    apolloServer.applyMiddleware({ app, cors: false });

    //--------------------
    // Turn on

    app.get('/', (req, res) => {
      res.end('Ahoy');
    });

    resolve(app);
  });
};

export default { start };
