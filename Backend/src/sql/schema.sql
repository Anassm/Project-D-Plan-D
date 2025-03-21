-- Create the airlines table
CREATE TABLE IF NOT EXISTS airlines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code CHAR(2) UNIQUE NOT NULL -- Airline code (e.g., AA for American Airlines)
);

-- Create the flights table
CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  airline_id INT REFERENCES airlines(id) ON DELETE CASCADE,
  flight_number VARCHAR(10) NOT NULL,
  departure_airport VARCHAR(100) NOT NULL,
  arrival_airport VARCHAR(100) NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL
);

-- Create the passengers table
CREATE TABLE IF NOT EXISTS passengers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  passport_number VARCHAR(20) UNIQUE NOT NULL
);

-- Create the tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  flight_id INT REFERENCES flights(id) ON DELETE CASCADE,
  passenger_id INT REFERENCES passengers(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL
);

-- Insert sample data into the airlines table
INSERT INTO airlines (name, code) VALUES
('American Airlines', 'AA'),
('Delta Air Lines', 'DL'),
('United Airlines', 'UA')
ON CONFLICT (code) DO NOTHING;

-- Insert sample data into the flights table
INSERT INTO flights (airline_id, flight_number, departure_airport, arrival_airport, departure_time, arrival_time) VALUES
(1, 'AA101', 'JFK', 'LAX', '2023-10-15 08:00:00', '2023-10-15 11:00:00'),
(2, 'DL202', 'ATL', 'ORD', '2023-10-16 09:00:00', '2023-10-16 11:30:00'),
(3, 'UA303', 'SFO', 'DFW', '2023-10-17 10:00:00', '2023-10-17 14:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data into the passengers table
INSERT INTO passengers (first_name, last_name, passport_number) VALUES
('John', 'Doe', 'A12345678'),
('Jane', 'Smith', 'B87654321'),
('Alice', 'Johnson', 'C55555555')
ON CONFLICT (passport_number) DO NOTHING;

-- Insert sample data into the tickets table
INSERT INTO tickets (flight_id, passenger_id, seat_number) VALUES
(1, 1, '12A'),
(2, 2, '15B'),
(3, 3, '8C')
ON CONFLICT (id) DO NOTHING;