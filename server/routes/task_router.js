const { Router } = require('express');
const express = require('express');
const router = express.Router();

const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
  database: 'task_list',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
});

// not required, but useful for debugging:
pool.on('connect', () => {
  console.log('postgresql is connected!');
});

pool.on('error', (error) => {
  console.log('error in postgres pool.', error);
})

