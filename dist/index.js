"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./model/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/api/airport', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iata_code } = req.query;
    const iataCodeStr = iata_code;
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
        const airportResult = yield db_1.client.query(airportQuery, [iataCodeStr.toUpperCase()]);
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
    }
    catch (err) {
        console.error("Error executing query", err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
