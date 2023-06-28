const tablesService = require('./tables.service');
const reservationsService = require('../reservations/reservations.service');
const hasProperties = require('../errors/hasProperties')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')


const requiredProperties = [
  "reservation_id",
]

async function getTable(req, res, next) {
  try {
    const { table_id } = req.params;
    const table = await tablesService.getTableById(table_id);

    if (!table) {
      return res.status(404).json({
        error: `Table ${table_id} not found.`,
      });
    }

    res.json({ data: table });
  } catch (error) {
    next(error);
  }
}

function isNumber(value) {
  return typeof value === 'number';
}

async function createTable(req, res, next) {
  try {
    const newTable = req.body.data;
    if (
      !newTable ||
      !newTable.table_name ||
      newTable.table_name.length <= 1 ||
      newTable.capacity === 0 ||
      !newTable.capacity ||
      isNumber(newTable.capacity) === false
    ) {
      return res.status(400).json({ error: `Invalid table_name or capacity.` });
    }

    const createdTable = await tablesService.createTable(newTable);
    res.status(201).json({ data: createdTable[0] });
  } catch (error) {
    next(error);
  }
}

async function getAllTables(req, res, next) {
  try {
    const tables = await tablesService.getAllTables();

    res.json({ data: tables });
  } catch (error) {
    next(error);
  }
}

const hasReservationId = hasProperties(requiredProperties)

async function seatReservation(req, res, next) {
  try {
    const { table_id } = req.params;
    const { reservation_id } = req.body.data;
  
    if (!reservation_id) {
      return res.status(400).json({
        error: 'reservation_id is required.',
      });
    }

    const table = await tablesService.getTableById(table_id);

    if (!table) {
      return res.status(400).json({
        error: `Table ${table_id} not found.`,
      });
    }

    if (table.reservation_id) {
      return res.status(400).json({
        error: 'Table is already occupied.',
      });
    }

    const reservation = await reservationsService.getReservationById(reservation_id);

    if (!reservation) {
      return res.status(404).json({
        error: `Reservation ${reservation_id} not found.`,
      });
    }

    if (reservation.people > table.capacity) {
      return res.status(400).json({
        error: 'Table does not have sufficient capacity.',
      });
    }

    if(reservation.people > 0){
      return res.status(400).json({
        error: 'Table is at capacity'
      })
    }

    await tablesService.seatReservation(table_id, reservation_id);

    return res.status(200);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getTable,
  createTable,
  getAllTables,
  seatReservation: [hasReservationId, asyncErrorBoundary(seatReservation)],
};
