const express = require('express');
const tablesController = require('./tables.controller');
const router = express.Router();

router.get('/:table_id', tablesController.getTable);
router.post('/', tablesController.createTable);
router.get('/', tablesController.getAllTables);
router.put('/:table_id/seat', tablesController.seatReservation);

module.exports = router;
