const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception  occured! shutting down...');

  process.exit(1);
})

const app = require('./app');

dotenv.config({ path: './config.env' });



const DB = process.env.CONN_STR;
const PORT = process.env.PORT;

mongoose.connect(DB, {
  useNewUrlParser: true
}).then((conn) =>
{
  console.log('DB Connection successful')
})

const server = app.listen(PORT, () =>
{
  console.log('Server has started');
})

process.on('unhandledERejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection occured! shutting down...');

  server.close(() => {
    process.exit(1);
  })
})