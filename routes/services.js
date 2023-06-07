const express = require("express");
const router = express.Router();
// Import the dbhelper function and pass the db object to it
const { getServices } = require("../helpers/dbHelpers")(require("../db"));

module.exports = ({ getServices, getServicesById, addService }) => {
  // GET all services
  router.get("/", (req, res) => {
    getServices()
      .then((services) => res.json(services))
      .catch((err) =>
        res.json({
          error: err.message,
        })
      );
  });

  // Get service by id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    getServicesById(id)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });

  // Create a new service
  router.post("/", (req, res) => {
    const { name, description, image_url } = req.body;
    addService(name, description, image_url)
      .then((service) => res.status(201).json(service))
      .catch((err) => res.status(500).json(err));
  });

  return router;
};
