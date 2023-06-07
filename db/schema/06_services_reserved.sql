DROP TABLE IF EXISTS services_reserved CASCADE;
CREATE TABLE services_reserved(
 id SERIAL PRIMARY KEY,
reservations_id INTEGER NOT NULL,
service_id INTEGER NOT NULL,
FOREIGN KEY (reservations_id) REFERENCES reservations (id) ON DELETE CASCADE,
FOREIGN KEY (service_id ) REFERENCES services (id) ON DELETE CASCADE
);
