import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const firstNamesMale = ["Liam", "Seán", "Conor", "Jack", "Oisín", "Cian", "Niall", "Ryan", "Darragh", "Finn"];
const firstNamesFemale = ["Saoirse", "Aoife", "Siobhán", "Niamh", "Caoimhe", "Róisín", "Aisling", "Clodagh", "Maeve", "Fiona"];
const lastNames = ["Murphy", "Byrne", "Kelly", "O’Sullivan", "Walsh", "Smith", "O’Brien", "Ryan", "O’Connor", "Doyle"];
const domains = ["gmail.com", "hotmail.com", "yahoo.com"];

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'TaskTracker',
    port: 3306,
};

function generatePassword() {
    return randomChoice("ABCDEFGHIJKLMNOPQRSTUVWXYZ") +
        randomChoice("abcdefghijklmnopqrstuvwxyz") +
        randomChoice("0123456789") +
        randomChoice("@£_") +
        randomString(4);
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomString(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += randomChoice(chars);
    }
    return result;
}

async function generateAndInsertUsers() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        for (let i = 0; i < 100; i++) {
            const firstName = i % 2 === 0 ? randomChoice(firstNamesMale) : randomChoice(firstNamesFemale);
            const lastName = randomChoice(lastNames);
            const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomChoice(domains)}`;
            const password = generatePassword();

            const usernameSalt = uuidv4();
            const emailSalt = uuidv4();
            const passwordSalt = uuidv4();

            const [result] = await connection.execute(
                `INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)`,
                [firstName, username, email, password]
            );

            console.log(`Inserted user ${i + 1}: ${username} (${password})`);
        }

        await connection.end();
        console.log("Finished inserting users.");
    } catch (error) {
        console.error('Error inserting users:', error);
    }
}

generateAndInsertUsers();