
const knexModule = require('knex');
const dotenv = require('dotenv');
dotenv.config();


const dbConnection = knexModule({
    client: 'mssql',
    connection: {
      server : process.env.SERVER,
      user : process.env.USER,
      password : process.env.PASSWORD,
      database : process.env.DATABASE,
    }
});

module.exports = dbConnection;