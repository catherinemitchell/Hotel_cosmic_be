DROP TABLE IF EXISTS invoices CASCADE;
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  reservations_id INTEGER NOT NULL,
 date_generated DATE DEFAULT CURRENT_DATE,
 description TEXT NOT NULL,
FOREIGN KEY (reservations_id) REFERENCES reservations (id) ON DELETE CASCADE 
);
