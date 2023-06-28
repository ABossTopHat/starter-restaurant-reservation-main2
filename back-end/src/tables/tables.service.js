const knex = require('../db/connection');

function getTableById(tableId) {
  return knex('tables').where('table_id', tableId).first();
}

function createTable(tableData) {
  return knex('tables').insert(tableData).returning('*');
}

function getAllTables() {
  return knex('tables').orderBy('table_name');
}

async function seatReservation(tableId, reservationId) {
  const updatedReservation = await knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: "seated" }, ["*"]);
  return updatedReservation[0];
}

function updateReservationStatus(reservationId){
  return knex('reservations').where('reservation_id', reservationId).update({status: 'seated'})
}

async function finishReservation(tableId, reservationId) {
  const updatedReservation = await knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: "finished" }, ["*"]);
  return updatedReservation[0];
}

function finishOccupiedTable(tableId) {
  return knex("tables")
    .where("table_id", tableId)
    .update({ reservation_id: finished });
}

  

module.exports = {
  getTableById,
  createTable,
  getAllTables,
  seatReservation,
  finishOccupiedTable,
  updateReservationStatus,
  finishReservation
};
