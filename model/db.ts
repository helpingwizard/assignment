import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 5432,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log("Unable to connect", err);
    });
