DROP TABLE IF EXISTS reservations CASCADE;
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  customer_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  date_reserved DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE 
);

