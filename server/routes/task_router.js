const { Router, query } = require('express');
const express = require('express');
const { get } = require('http');
const taskRouter = express.Router();

// DB CONNECTION
let pool;
const pg = require('pg');
const { mainModule } = require('process');
const Pool = pg.Pool;

if (process.env.DATABASE_URL) {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else{
      pool = new pg.Pool({
      database: 'weekend-to-do-app',
      host: 'localhost',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000 
  });
};

// GET/SELECT all items from tasks table
taskRouter.get('/:sortOrder', (req,res) =>{
  let sortOrder = req.params.sortOrder;
  let queryText = '';
  
  //switch statement determines query for sort order user selected
  switch (sortOrder) {
    case 'dateAsc':
      queryText = `SELECT "owner", to_char("date", 'YYYY-MM-DD') AS "f_date", "details", "is_complete", "id", to_char("completed_on", 'Mon DD, YYYY') AS "completed_on" FROM "tasks" ORDER BY "date", "owner";`;
      break;
    case 'dateDesc':
      queryText = `SELECT "owner", to_char("date", 'YYYY-MM-DD') AS "f_date", "details", "is_complete", "id", to_char("completed_on", 'Mon DD, YYYY') AS "completed_on" FROM "tasks" ORDER BY "date" DESC, "owner";`;
      break;
    case 'ownerAsc':
      queryText = `SELECT "owner", to_char("date", 'YYYY-MM-DD') AS "f_date", "details", "is_complete", "id", to_char("completed_on", 'Mon DD, YYYY') AS "completed_on" FROM "tasks" ORDER BY "owner", "date";`;
      break;
    case 'ownerDesc':
      queryText = `SELECT "owner", to_char("date", 'YYYY-MM-DD') AS "f_date", "details", "is_complete", "id", to_char("completed_on", 'Mon DD, YYYY') AS "completed_on" FROM "tasks" ORDER BY "owner" DESC, "date";`;
      break;
  };

  // query to SELECT data from DB
  pool.query(queryText).then((response) =>{
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

    pool.query(queryText, [req.body.owner, req.body.date, req.body.details, req.body.is_complete])
    .then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      alert('error POSTing', error);
      res.sendStatus(500);
    });
});

// edit mode route from client.js postTask
taskRouter.put('/edit/:id', (req, res) => {
  let taskId = req.params.id;
  let queryText = `UPDATE "tasks" SET "owner"=$1, "date"=$2, "details"=$3 WHERE "id"=$4`;
  pool.query(queryText, [req.body.owner, req.body.date, req.body.details, taskId])
    .then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      alert('error POSTing', error);
      res.sendStatus(500);
    });
});


// PUT/UPDATE for marking task complete
taskRouter.put('/complete/:id', (req, res) => {
  let taskID = req.params.id;
  // assigns isComplete opposite value of input to make change in database
  let isComplete = (req.body.isComplete === 'true' ? 'FALSE' : 'TRUE');
  let completedOn = (req.body.dateStamp);
  let queryText = `UPDATE "tasks" SET "is_complete"=$1, "completed_on"=$2 WHERE "id"=$3;`;

  pool.query(queryText, [isComplete, completedOn, taskID]).then(() => {
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