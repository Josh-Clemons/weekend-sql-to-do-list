const { Router } = require('express');
const express = require('express');
const taskRouter = express.Router();

// DB CONNECTION
const pg = require('pg');
const { mainModule } = require('process');
const Pool = pg.Pool;
const pool = new Pool({
  database: 'task_list', // name of database
  host: 'localhost', // database server
  port: 5432, // Postgres default
  max: 10, // max queries at once
  idleTimeoutMillis: 30000 // 30 seconds to try to connect before cancelling query
});

// not required, but useful for debugging:
pool.on('connect', () => {
  console.log('postgresql is connected!');
});

pool.on('error', (error) => {
  console.log('error in postgres pool.', error);
});

taskRouter.get('/', (req,res) =>{
  let queryText = `SELECT * FROM "tasks";`;

  pool.query(queryText).then((response) =>{
    console.log('get successful');
    res.send(response);
  }).catch((error) => {
    alert('error GETting', error);
    res.sendStatus(500);
  });
});



module.exports = taskRouter;