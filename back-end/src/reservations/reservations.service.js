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
    .whereNot("status", "finished")
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

module.exports = {
  list,
  create,
  searchByPhoneNumber,
  searchByDate
};
