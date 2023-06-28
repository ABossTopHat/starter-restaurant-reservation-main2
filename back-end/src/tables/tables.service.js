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

function seatReservation(tableId, reservationId) {
  return knex('tables').where('table_id', tableId).update({ reservation_id: reservationId });
}

  

module.exports = {
  getTableById,
  createTable,
  getAllTables,
  seatReservation,

};
