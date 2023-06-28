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
      newTable.capacity <= 0 || 
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


function bodyHasReservationId(req,res,next){
  const {reservation_id} = req.body.data
  if(!reservation_id){
    return next({
      status: 400,
      message: `no reservation id`
    })
  }
  res.locals.reservation_id = reservation_id
  next()
}


async function hasReservationId(req,res,next){
  const reservation = await reservationsService.read(res.locals.reservation_id)
  if(!reservation){
    return next({
      status: 400,
      message: `${res.locals.reservation_id}`
    })
  }else{
    res.locals.reservation = reservation
    next()
  }
}

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

    let reservation = await reservationsService.getReservationById(reservation_id);

    if (!reservation) {
      return res.status(404).json({
        error: `Reservation ${reservation_id} not found.`,
      });
    }

    if (table.reservation_id) {
      if (reservation.id !== table.reservation_id) {
        return res.status(400).json({
          error: 'Table is already occupied.',
        });
      }

      if (reservation.people > table.capacity) {
        return res.status(400).json({
          error: 'Table does not have sufficient capacity.',
        });
      }
      if(reservation.status === 'seated'){
        return res.status(400).json({
          error: 'reservation is already seated'
        })
      }

      if(reservation.status !== 'seated'){
        let reservation = await tablesService.updateReservationStatus(reservation_id)
        console.log('reservation result', reservation)
      }
      return res.status(200).json();
    } else {
      if (reservation.people > table.capacity) {
        return res.status(400).json({
          error: 'Table does not have sufficient capacity.',
        });
      }
      
      const data = await tablesService.seatReservation(table_id, reservation_id);
      return res.status(200).json({ data });
    }
  } catch (error) {
    next(error);
  }
}

async function finishOccupiedTable(req, res, next) {
  try {
    const { table_id } = req.params;
    const table = await tablesService.getTableById(table_id);

    if (!table) {
      return res.status(404).json({
        error: `Table ${table_id} not found.`,
      });
    }

    if (!table.reservation_id) {
      return res.status(400).json({
        error: `Table ${table_id} is not occupied.`,
      });
    }

    await tablesService.finishOccupiedTable(table_id);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}



module.exports = {
  getTable,
  createTable,
  getAllTables,
  seatReservation:[
    //check body has data 
    bodyHasReservationId, 
    asyncErrorBoundary(hasReservationId),
    //check if reservation is seated?
    //check dose table exist? async wrap this() uses service.read
    // is table large enough? looks at capacity
    // is the table avalible?
    asyncErrorBoundary(seatReservation)
  ],
  finishOccupiedTable,
};
