const express = require("express");
const router = express.Router();

module.exports = ({
  getServicesReserved,
  addServiceReserved,
  getServicesReservedById,
}) => {
  // GET all services_reserved
  router.get("/", (req, res) => {
    getServicesReserved()
      .then((servicesReserved) => {
        res.json(servicesReserved);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // GET service_reserved by id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    getServicesReservedById(id)
      .then((serviceReserved) => res.json(serviceReserved))
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // POST a new service_reserved
  router.post("/", (req, res) => {
    const { reservations_id, service_id } = req.body;
    addServiceReserved(reservations_id, service_id)
      .then((serviceReserved) => res.json(serviceReserved))
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
