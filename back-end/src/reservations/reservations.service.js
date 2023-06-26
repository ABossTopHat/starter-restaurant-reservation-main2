const knex = require('../db/connection');

function list(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time")
      .fetchAll();
  }
  
  function searchByDate(){
    return knex("reservations")
    .select('*')
    .where({ reservation_date: date })
    .whereNot("status", "finished")
    .orderBy("reservation_time");
  }

  function searchByPhoneNumber(number){
    return knex('reservations')
    .select("*")
    .where({mobile_number: number})
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
  create
};
