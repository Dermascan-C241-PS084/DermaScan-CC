require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
      port: process.env.PORT || 8080,
      host: '0.0.0.0',
      routes: {
          cors: {
              origin: ['*'],
              headers: ['Authorization', 'Content-Type', 'If-None-Match'],
              additionalHeaders: ['cache-control', 'x-requested-with']
          }
      }
  });

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
