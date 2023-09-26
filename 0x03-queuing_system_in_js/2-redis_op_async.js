#!/usr/bin/env node
// copy the code  (1-redis_op.js)
// Using promisify, modify the function displaySchoolValue to use
// ES6 async / await
import { createClient } from 'redis';

const client = createClient();
client.on('connect', () => {
 console.log('Redis client connected to the server');
});

client.on('error', (error) => {
 console.log(`Redis client not coonected to the server: ${error.message}`);
});

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

const setNewSchool = (schoolName, value) => {
 client.set(schoolName, value, print);
}

const displaySchoolValue = async (schoolName) => {
 const value = await getAsync(schoolName);
 console.log(value);
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
