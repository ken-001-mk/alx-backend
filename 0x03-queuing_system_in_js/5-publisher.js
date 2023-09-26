#!/usr/bin/env node

import { createClient } from 'redis';

const publisher = createClient();

// Connection access
publisher.on('connect', () => {
  console.log('Redis client connected to the server');  
});

// The error
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('Holberton school channel', message);
  }, time);
}

// Message call
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
