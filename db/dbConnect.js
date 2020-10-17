//Import section
//import mysql from 'mysql';
//import util from 'util';
const mysql =require('mysql')
const util =require('util')

//require('dotenv').config()
//Local host
// const dbConfig = {
//     host : process.env.DBHOST,
//     user : process.env.DBUSER,
//     password : process.env.DBPASSWORD,
//     database : process.env.DATABASE,
//     multipleStatements: true
// }

const dbConfig = {
    host : process.env.DBHOST||'81.4.102.11',
    user : process.env.DBUSER ||'it_dev',
    password : process.env.DBPASSWORD||'it_dev',
    database : process.env.DATABASE||'devindices',
    multipleStatements: true,
    connectionLimit : 1000,
    connectTimeout  : 6 * 100,
    acquireTimeout  : 6 * 100,
    timeout         : 6 * 100
}




console.log(dbConfig);


// Connection pool
const dbConnectionPool = mysql.createPool(dbConfig);

// Promisify the pool to use ES8 asyn/await
dbConnectionPool.query = util.promisify(dbConnectionPool.query)

// Export db connection pool
module.exports = dbConnectionPool;