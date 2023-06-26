const service = require('./reservations.service');
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES);

function hasOnlyValidProperties(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: `Missing Data`,
    });
  }

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

function createValidation(req, res, next) {
  const errors = [];

 // ValidTime
const reservationTime = req.body.data.reservation_time;
const timeRegex = /^(0?\d|1\d|2[0-3]):([0-5]\d)$/;
if (!timeRegex.test(reservationTime)) {
  errors.push("Invalid reservation_time. Time format should be 'HH:MM' in military format.");
} else {
  const [hour, minute] = reservationTime.split(':');

  if (
    (hour < 10 || (hour === '10' && minute < '30')) ||
    (hour > 21 || (hour === '21' && minute > '30'))
  ) {
    errors.push("Reservation time must be between 10:30 and 21:30 in military format.");
  }
}


  // ValidDate
  const reservationDate = req.body.data.reservation_date;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(reservationDate)) {
    errors.push(
      "Invalid reservation_date. Date format should be 'YYYY-MM-DD'."
    );
  } else {
    const [year, month, day] = reservationDate.split("-");
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (dateObj < new Date() || dayOfWeek === 2) {
      errors.push(
        "Reservation date must be in the future and not on a Tuesday."
      );
    }
  }

  // ValidPeople
  const people = req.body.data.people;

  if (!people || typeof people !== "number" || people < 1) {
    errors.push("Invalid number of people. Must be a number greater than 0.");
  }

  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(" "),
    });
  }

  next();
}

async function create(req,res){
  res.status(201).json({data: await service.create(req.body.data)})
}

// function create(req, res) {
//   console.log('********************************************************')
//   console.log(req.body.data)
//   console.log('********************************************************')
//   service
//     .create(req.body.data)
//     .then((data) => res.status(201).json({ data }))
//     .catch(console.error);
// }

async function list(req, res) {
  try {
    const date = req.query.date;
    const reservations = await service.list(date);
    res.status(200).json({ data: reservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  create: [hasRequiredProperties, hasOnlyValidProperties, createValidation, asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
};
