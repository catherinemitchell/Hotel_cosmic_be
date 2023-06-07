const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

module.exports = (db) => {
  return {
    getCustomers: () => {
      const query = {
        text: "SELECT * FROM customers",
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // get customers by email
    getCustomerById: (id) => {
      const query = {
        text: "SELECT * FROM customers WHERE id = $1",
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Add a new customer
    addNewCustomer: (name, email) => {
      const query = {
        text: "INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *",
        values: [name, email],
      };

      return db
        .query(query)

        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    // get all the invoices
    getInvoices: () => {
      const query = {
        text: "SELECT * FROM invoices",
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // get invoices by id
    getInvoicesById: (id) => {
      const query = {
        text: "SELECT * FROM invoices WHERE id = $1",
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Add a new invoice
    addInvoice: (reservations_id, description) => {
      const query = {
        text: "INSERT INTO invoices (reservations_id, description) VALUES ($1, $2) RETURNING *",
        values: [reservations_id, description],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    // get all the rooms
    getRooms: () => {
      const query = {
        text: "SELECT * FROM rooms",
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    getRoomById: (id) => {
      const query = {
        text: "SELECT * FROM rooms WHERE id = $1",
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Add new room
    addRoom: (room) => {
      const {
        type,
        no_of_beds,
        no_of_bathrooms,
        description,
        price,
        image_url,
        availability,
      } = room;
      const query = {
        text: "INSERT INTO rooms (type, no_of_beds, no_of_bathrooms, description, price, image_url, availability) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        values: [
          type,
          no_of_beds,
          no_of_bathrooms,
          description,
          price,
          image_url,
          availability,
        ],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    //get all the services
    getServices: () => {
      const query = {
        text: "SELECT * FROM services",
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Add a new service
    addService: (name, description, imageUrl) => {
      const query = {
        text: "INSERT INTO services (name, description, image_url) VALUES ($1, $2, $3) RETURNING *",
        values: [name, description, imageUrl],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    // get invoices by id
    getServicesById: (id) => {
      const query = {
        text: "SELECT * FROM services WHERE id = $1",
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Get all reservations
    getReservations: () => {
      const query = {
        text: "SELECT * FROM reservations",
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Get reservation by ID
    getReservationById: (id) => {
      const query = {
        text: "SELECT * FROM reservations WHERE id = $1",
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    // Add a new reservation
    addReservation: (
      checkInDate,
      checkOutDate,
      customerId,
      roomId,
      totalPrice
    ) => {
      const query = {
        text: "INSERT INTO reservations (check_in_date, check_out_date, customer_id, room_id, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [checkInDate, checkOutDate, customerId, roomId, totalPrice],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    //get  all serviceReserved
    getServicesReserved: () => {
      const query = {
        text: "SELECT * FROM services_reserved",
      };
      return db
        .query(query)
        .then((result) => result.rows)
        .catch((err) => err);
    },

    //get   serviceReserved by id
    getServicesReservedById: (id) => {
      const query = {
        text: "SELECT * FROM services_reserved WHERE id = $1",
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    addServiceReserved: (reservations_id, service_id) => {
      const query = {
        text: "INSERT INTO services_reserved (reservations_id, service_id) VALUES ($1, $2) RETURNING *",
        values: [reservations_id, service_id],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

   
    chargeCustomer: async (amount, currency, paymentMethod) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          automatic_payment_methods: {enabled: true},
          payment_method: paymentMethod?.id,
          confirm: false,
        });
        return paymentIntent.client_secret;
      } catch (error) {
        throw new Error('Payment intent error : ' + error.message);
      } 
    },
  };
};
