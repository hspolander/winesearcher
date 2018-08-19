import config from './config';

const mysql = require('mysql2/promise');

const dbConfig = config().database;

let pool;
const getPool = () => {
  if (pool == null) {
    console.log("Get pool")
    pool = new mysql.createPool(dbConfig);
  }
  return pool;
} 

export const query = (...args) => getPool().query(...args);

export const getClient = () =>
  new Promise((resolve, reject) => {
    getPool().connect((err, client) => {
      if(err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });