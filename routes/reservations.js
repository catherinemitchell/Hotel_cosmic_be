const express = require("express");
const router = express.Router();

module.exports = ({ getReservations, getReservationById, addReservation }) => {
  // GET all reservations
  router.get("/", (req, res) => {
    getReservations()
      .then((reservations) => res.json(reservations))
      .catch((err) =>
        res.json({
          error: err.message,
        })
      );
  });

  // Get reservation by id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    getReservationById(id)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });

  // Create a new reservation
  router.post("/", (req, res) => {
    const { checkInDate, checkOutDate, customerId, roomId, totalPrice } =
      req.body;
    addReservation(checkInDate, checkOutDate, customerId, roomId, totalPrice)
      .then((reservation) => res.status(201).json(reservation))
      .catch((err) => res.status(500).json(err));
  });

  return router;
};
