DROP TABLE IF EXISTS rooms CASCADE;
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  no_of_beds INT NOT NULL DEFAULT 1,
  no_of_bathrooms INT NOT NULL DEFAULT 1,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  availability BOOLEAN NOT NULL DEFAULT TRUE
);
