const express = require('express');
const tablesController = require('./tables.controller');
const router = express.Router();

router
  .route('/')
  .get(tablesController.getAllTables)
  .post(tablesController.createTable);

router
  .route('/:table_id')
  .get(tablesController.getTable);

router
  .route('/:table_id/seat')
  .put(tablesController.seatReservation);

module.exports = router;
