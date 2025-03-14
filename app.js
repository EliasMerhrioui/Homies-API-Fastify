const fastify = require('fastify')();

const authRouter = require('./src/routes/auth.js');
fastify.register(authRouter);

const adminRouter = require('./src/routes/admin.js');
fastify.register(adminRouter);

const usersRouter = require('./src/routes/users.js');
fastify.register(usersRouter);

fastify.listen({
  port: 3000,
  host: 'localhost'
}, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running at http://localhost:3000');
});