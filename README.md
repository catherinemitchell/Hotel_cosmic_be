# hotel_cosmic_reservation_be

The <b> hotel_cosmic_reservation_be </b> is the server that powers the Hotel Cosmic Reservations project, a collaborative effort by Ashwini Hegde, Catherine Mitchell and Jeremy Gagné-Lafleur. To interact with the server's API services, clients can utilize the Axios library for making HTTP requests in an elegant and convenient manner.

## Project Creation History

### Created the project folder

`mkdir final_project`

### Project Installation

Steps followed :

- `npx express-generator --no-view hotel_cosmic_reservation_be`
- cd final_project && npm install
- edited bin/www and change the port to 3001
- added console.log to onListening and add a start script
- created .gitignore
- ran git init on the project
- installed nodemon:

`npm install nodemon --save-dev`

- added 'dev' script to start nodemon with `npm run dev` in package.json

### Additonal useful middleware used

- dotenv

### Created the database

`createdb final_project_name -O labber`

### configured DB Connection

#### Created .env

`npm i -D dotenv`

- create `.env` file with the following

```js
DB_HOST = localhost;
DB_USER = labber;
DB_PASS = labber;
DB_NAME = final_project;
DB_PORT = 5432;
```

- install 'pg'

`npm i pg`

## Brief Descriptions of the steps followed.

### Schema creation.

- Introduced `db/schema/01_customers.sql`

```js
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

);
```

similarly created the schema for other five tables rooms, services, services_reserved, reservations,invoices.

### Seeds

- created `db/seeds/01_customers.sql`

```js
INSERT INTO customers (name, email) VALUES
('Melody Edwards', 'melody@email.com'),
('Christopher Thornton', 'christopher@email.com'),
('Hayley Vasquez', 'hayley@email.com'),
('Aron Barker', 'aron@email.com');
```

Seeds for other five tables rooms, services, services_reserved, reservations,invoices are also created.

### Added DB Reset

`npm i pg-native`

- created `db/reset`

```js
// load .env data into process.env
require("dotenv").config();

// other dependencies
const fs = require("fs");
const chalk = require("chalk");
const Client = require("pg-native");

// PG connection setup
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=disable`;
const client = new Client();

// Loads the schema files from db/schema
const runSchemaFiles = function () {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync("./db/schema");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/schema/${fn}`, "utf8");
    console.log(`\t-> Running ${chalk.green(fn)}`);
    client.querySync(sql);
  }
};

const runSeedFiles = function () {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const schemaFilenames = fs.readdirSync("./db/seeds");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/seeds/${fn}`, "utf8");
    console.log(`\t-> Running ${chalk.green(fn)}`);
    client.querySync(sql);
  }
};

try {
  console.log(`-> Connecting to PG using ${connectionString} ...`);
  client.connectSync(connectionString);
  runSchemaFiles();
  runSeedFiles();
  client.end();
} catch (err) {
  console.error(chalk.red(`Failed due to error: ${err}`));
  client.end();
}
```

- added `db:reset` to package.json in the scripts section

`"db:reset": "node ./db/reset.js"`

### configured routing and helpers

#### db Helpers

- Created `dbHelpers.js` in a `helpers` folder

- created `getCustomers` to get the list of the customers inside dbHelpers.

```js
//import the required code for stripe payment system.
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

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

    // get customers by id
    getCustomerById: (id) => {
      const query = {
        text: `SELECT * FROM customers WHERE id = $1`,
        values: [id],
      };
      return db
        .query(query)
        .then((result) => result.rows[0])
        .catch((err) => err);
    },

    // get customers by email
    getCustomerByEmail: (email) => {
      const query = {
        text: `SELECT * FROM customers WHERE email = $1`,
        values: [email],
      };
      return db
        .query(query)
        .then((result) => {
          return result.rows[0];
        })
        .catch((err) => err);
    },

    getCustomerByEmail: (email) => {
      const query = {
        text: "SELECT * FROM customers WHERE email = $1",
        values: [email],
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
}
```

Similarly created the require get,getById and post methods for rest of five tables along with chargeCustomer for Stripe payment.

#### app.js(server)

- Add the require at the top of the app.js

```
   var express = require("express");
   var path = require("path");
   var cookieParser = require("cookie-parser");
   var logger = require("morgan");
   var app = express();
   const db = require("./db");
   const dbHelpers = require('./helpers/dbHelpers')(db);
```

- import the router modules

```
const customersRouter = require("./routes/customers");
const roomsRouter = require("./routes/rooms");
const invoicesRouter = require("./routes/invoices");
const servicesRouter = require("./routes/services");
const reservationsRouter = require("./routes/reservations");
const servicesReservedRouter = require("./routes/servicesReserved");
const paymentsRouter = require("./routes/payments");
```

- use the following :

```
app.use("/api/customers", customersRouter(dbHelpers));
app.use("/api/rooms", roomsRouter(dbHelpers));
app.use("/api/invoices", invoicesRouter(dbHelpers));
app.use("/api/services", servicesRouter(dbHelpers));
app.use("/api/reservations", reservationsRouter(dbHelpers));
app.use("/api/servicesReserved", servicesReservedRouter(dbHelpers));
app.use("/api/payments", paymentsRouter(dbHelpers));

```

#### customers.js(Customer route)

```js
const express = require("express");
const router = express.Router();
// Import the dbhelper function and pass the db object to it
const { getCustomers, getCustomerByEmail } = require("../helpers/dbHelpers")(
  require("../db")
);

module.exports = ({
  getCustomers,
  getCustomerById,
  addNewCustomer,
  getCustomerByEmail,
}) => {
  // GET all customers

  router.get("/email", (req, res) => {
    const email = req.body;

    getCustomerByEmail(email)
      .then((customers) => res.json(customers))
      .catch((err) =>
        res.json({
          error: err.message,
        })
      );
  });

  router.get("/", (req, res) => {
    getCustomers()
      .then((customers) => res.json(customers))
      .catch((err) =>
        res.json({
          error: err.message,
        })
      );
  });

  // Get customer by id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    getCustomerById(id)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });

  // Get customer by email
  router.get("/email/:email", (req, res) => {
    const email = req.params.email;
    getCustomerByEmail(email)
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
```

Each of the route has corresponding route file with all the methods required to provide the services.

## Result

### API Services:

- Get all the customers:
  `http://localhost:3001/api/customers` <br>
  ![getCustomers](https://github.com/ashwinihegde28/hotel_cosmic_reservation_be/blob/master/document/images/getCustomers.png)

- Get customer by id :
  `http://localhost:3001/api/customers/email/aron@email.com` <br>
  ![getCustomerById](https://github.com/ashwinihegde28/hotel_cosmic_reservation_be/blob/master/document/images/getCustomerById.png) <br> <br>

- Get customer by email :
  `http://localhost:3001/api/customers/email/hayley@email.com` <br>
  ![getCustomerByEmail](https://github.com/ashwinihegde28/hotel_cosmic_reservation_be/blob/master/document/images/getCustomerByEmail.png) <br> <br>
- Create a new customer using curl command :

```
curl -X POST -H "Content-Type: application/json" -d '{
  "name": "New Customer",
  "email": "welcome@example.com"
}' http://localhost:3001/api/customers
```

![postRequestForCustomer](https://github.com/ashwinihegde28/hotel_cosmic_reservation_be/blob/master/document/images/postRequestForCustomer.png) <br>

The result is displayed only for customers here but client can access api services keeping up Server and running and final_project db in postgress.

- `http://localhost:3001/api/rooms` <br>
- `http://localhost:3001/api/reservations` <br>
- `http://localhost:3001/api/invoices` <br>
- `http://localhost:3001/api/servicesReserved` <br>
- `http://localhost:3001/api/services` <br>

## Technologies use:

- Postgress
- Express
- Node.js
- Cookie-Parser, Morgan, dotenv and others.
