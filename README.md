# Twitter Fullstack Clone

This repository is a Fullstack application featuring a Twitter clone!

It was created with Node.js, Express, using React.js, Next.js, Apollo, GraphQL, PostgreSQL and Docker.

The objective of this repository is to both serve as a challenge for my application to a job opportunity on Provi and to showcase a real-world application, which is not trivial. Also showcasing several frameworks running together.

Since Twitter is a full-fledged social network and have thousands features, only minimal functionality has been implemented.

Twitter is pretty big, so only the main functionalities have been implemented.

## Local Deployment

To get the application its first time setup, go into the client and server folder and copy the `.env-sample` files and rename them to `.env`.

To run the application you must have `docker-composer` installed on your machine. Then you must run the following command:

    make dev

This command will start the backend services as well and the client application. Once its loading is finished you can access it through the following address:

    `http://localhost:3000`.

### Migrations and Database reset

Before you can use the application's API, the migrations must be performed, and the database needs to be populated with mock data. You can achieve that through a running container with the following command:

    make reset-db    

## Technologies used in this project:

- Back-end: Node.js with Express, Apollo Server, Knex.js, PostgreSQL, GraphQL
- Front-end: React.js with Next.js, Apollo Client, styled-jsx
- Infrastructure: Docker, Heroku, Now
