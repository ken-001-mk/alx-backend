#!/usr/bin/env node
// script that logs to the console "Redis client connected to the server"
import { createClient } from 'redis';

const client = createClient();
client.on('connect', () => {
 console.log('Redis client connected to the server');
});

client.on('error', (error) => {
 console.log(`Redis client not coonected to the server: ${error.message}`);
});
