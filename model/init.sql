-- Country Table
CREATE TABLE country (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    alt_name VARCHAR(255),
    country_code_two CHAR(2),
    country_code_three CHAR(3),
    flag_app VARCHAR(255),
    mobile_code VARCHAR(10),
    continent_id INT,
    country_flag VARCHAR(255)
);

-- City Table
CREATE TABLE city (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    alt_name VARCHAR(255),
    country_id INT,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    lat DECIMAL(10, 8),
    long DECIMAL(11, 8),
    FOREIGN KEY (country_id) REFERENCES country(id)
);

-- Airport Table
CREATE TABLE airport (
    id INT PRIMARY KEY,
    icao_code VARCHAR(4),
    iata_code VARCHAR(3),
    name VARCHAR(255),
    type VARCHAR(50),
    city_id INT,
    country_id INT,
    continent_id INT,
    website_url VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    latitude_deg DECIMAL(10, 8),
    longitude_deg DECIMAL(11, 8),
    elevation_ft INT,
    wikipedia_link VARCHAR(255),
    FOREIGN KEY (city_id) REFERENCES city(id),
    FOREIGN KEY (country_id) REFERENCES country(id)
);
