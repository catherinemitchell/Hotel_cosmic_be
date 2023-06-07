const express = require("express");
const router = express.Router();
// Import the dbhelper function and pass the db object to it
const { getCustomers } = require("../helpers/dbHelpers")(require("../db"));

module.exports = ({ getCustomers, getCustomerById, addNewCustomer }) => {
  // GET all customers
  router.get("/", (req, res) => {
    //console.log(`getcustomers`, getCustomers)
    getCustomers()
      .then((customers) => {
      //console.log(`customers`, customers)
      res.json(customers)})
      
      .catch((err) => { 
        console.error(err)
        res.status(500).json(err)});  
  });

  // Get customer by id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    getCustomerById(id)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });

  // Create a new customer
  router.post("/", (req, res) => {
    const { name, email } = req.body;
    addNewCustomer(name, email)
      .then((customer) => res.status(201).json(customer))
      .catch((err) => res.status(500).json(err));
  });

  return router;
};
