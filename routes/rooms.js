const express = require("express");
const router = express.Router();

// Import the dbhelper function and pass the db object to it
const { getInvoices } = require("../helpers/dbHelpers")(require("../db"));

module.exports = ({ getRooms, getRoomById, addRoom }) => {
  // GET all invoices
  router.get("/", (req, res) => {
    getRooms()
      .then((rooms) => res.json(rooms))
      .catch((err) =>
        res.json({
          error: err.message,
        })
      );
  });

  // GET room by ID
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    getRoomById(id)
      .then((room) => {
        if (room.length === 0) {
          res.status(404).json({
            error: "Room not found",
          });
        } else {
          res.json(room[0]);
        }
      })
      .catch((err) =>
        res.status(500).json({
          error: err.message,
        })
      );
  });

  // POST a new room
  router.post("/", (req, res) => {
    const room = req.body;
    addRoom(room)
      .then((newRoom) => res.json(newRoom))
      .catch((err) =>
        res.status(500).json({
          error: err.message,
        })
      );
  });

  return router;
};
