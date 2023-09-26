#!/usr/bin/env node

import { createClient } from 'redis';

const subscriber = createClient();

// To the connection
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// To the error
subscriber.on('erroe', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Subscribe school
subscriber.subscribe('holberton school channel');

// Message recieved
subscriber.on('message', (channel, message) => {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
