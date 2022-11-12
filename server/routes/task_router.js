const { Router } = require('express');
const express = require('express');
const { get } = require('http');
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


// GET/SELECT all items from tasks table
taskRouter.get('/', (req,res) =>{
  let queryText = `SELECT * FROM "tasks" ORDER BY "date" DESC;`;

  pool.query(queryText).then((response) =>{
    console.log('get successful');
    res.send(response);
  }).catch((error) => {
    alert('error GETting', error);
    res.sendStatus(500);
  });
});

// POST/INSERT new task into table
taskRouter.post('/', (req, res) => {
  let queryText = `INSERT INTO "tasks" ("owner", "date", "details", "is_complete")
    VALUES ($1, $2, $3, $4);`;
  // console.log('req.body', req.body);
  pool.query(queryText, [req.body.owner, req.body.date, req.body.details, req.body.is_complete])
    .then((response) => {
      res.sendStatus(200);
    }).catch((error) => {
      alert('error POSTing', error);
      res.sendStatus(500);
    });
});

// PUT/UPDATE for marking task complete
taskRouter.put('/complete/:id', (req, res) => {
  let taskID = req.params.id;
  let isComplete = (req.body.isComplete === 'true' ? 'FALSE' : 'TRUE');
  let queryText = `UPDATE "tasks" SET "is_complete"=$1 WHERE "id"=$2;`;

  pool.query(queryText, [isComplete, taskID]).then(() => {
    res.sendStatus(200);
  }).catch((error) => {
    console.log('error updating complete', error);
    res.sendStatus(500);
  });
});

// DELETE task from table
taskRouter.delete('/:id', (req, res) => {
  let queryText = `DELETE FROM "tasks" WHERE "id"=$1;`;

  pool.query(queryText, [req.params.id]).then((response) => {
    res.sendStatus(200);
  }).catch((error) => {
    alert('error DELETEing', error);
    res.sendStatus(500);
  });
});

module.exports = taskRouter;