const knex = require('../db/connection');

function list() {
    return knex("reservations")
      .select("*")
      .orderBy("reservation_time")

  }
  
  function searchByDate(date){
    return knex("reservations")
    .select('*')
    .where({ reservation_date: date })
    .orderBy("reservation_time");
  }

  function searchByPhoneNumber(mobile_number){
    return knex('reservations')
    .select("*")
    .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

  function create(newReservation) {
    return knex("reservations")
      .insert(newReservation)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
  }
  function read(reservation_id) {
    return knex('reservations')
      .where({reservation_id: reservation_id})
      .first();
  }
  function getReservationById(reservationId) {
    return knex('reservations').where('reservation_id', reservationId).first();
  }

module.exports = {
  list,
  create,
  searchByPhoneNumber,
  searchByDate,
  read,
  getReservationById,
};
