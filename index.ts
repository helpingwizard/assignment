import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { client } from './model/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



app.get('/api/airport', async (req, res) => {
    const { iata_code } = req.query;
    const iataCodeStr: string = iata_code as string;

    if (!iata_code) {
        return res.status(400).json({ error: "iata_code is required" });
    }

    try {
        const airportQuery = `
            SELECT a.id, a.icao_code, a.iata_code, a.name, a.type, a.latitude_deg, a.longitude_deg, a.elevation_ft,
                   c.id AS city_id, c.name AS city_name, c.country_id AS city_country_id, c.is_active AS city_is_active, c.lat AS city_lat, c.long AS city_long,
                   co.id AS country_id, co.name AS country_name, co.country_code_two, co.country_code_three, co.mobile_code, co.continent_id
            FROM airport a
            JOIN city c ON a.city_id = c.id
            JOIN country co ON c.country_id = co.id
            WHERE a.iata_code = $1
        `;
        
        const airportResult = await client.query(airportQuery, [iataCodeStr.toUpperCase()]);

        if (airportResult.rows.length === 0) {
            return res.status(404).json({ error: "Airport not found" });
        }

        const airport = airportResult.rows[0];

        const response = {
            airport: {
                id: airport.id,
                icao_code: airport.icao_code,
                iata_code: airport.iata_code,
                name: airport.name,
                type: airport.type,
                latitude_deg: airport.latitude_deg,
                longitude_deg: airport.longitude_deg,
                elevation_ft: airport.elevation_ft,
                address: {
                    city: {
                        id: airport.city_id,
                        name: airport.city_name,
                        country_id: airport.city_country_id,
                        is_active: airport.city_is_active,
                        lat: airport.city_lat,
                        long: airport.city_long
                    },
                    country: {
                        id: airport.country_id,
                        name: airport.country_name,
                        country_code_two: airport.country_code_two,
                        country_code_three: airport.country_code_three,
                        mobile_code: airport.mobile_code,
                        continent_id: airport.continent_id
                    }
                }
            }
        };

        res.json(response);
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
