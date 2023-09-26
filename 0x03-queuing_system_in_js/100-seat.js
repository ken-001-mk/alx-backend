const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');

const app = express();
const port = 1245;

// Create a Redis client and promisify Redis functions
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Initialize the number of available seats to 50
const initialAvailableSeats = 50;
let availableSeats = initialAvailableSeats;

// Initialize reservationEnabled to true
let reservationEnabled = true;

// Create a Kue queue
const queue = kue.createQueue();

// Function to reserve seats
const reserveSeat = async (number) => {
  await setAsync('available_seats', number.toString());
  availableSeats = number;
};

// Function to get the current number of available seats
const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return parseInt(seats) || 0;
};

// Middleware to ensure reservationEnabled is true
const checkReservationEnabled = (req, res, next) => {
  if (!reservationEnabled) {
    return res.json({ "status": "Reservation are blocked" });
  }
  next();
};

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ "numberOfAvailableSeats": numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', checkReservationEnabled, async (req, res) => {
  const job = queue.create('reserve_seat').save((err) => {
    if (!err) {
      res.json({ "status": "Reservation in process" });
    } else {
      res.json({ "status": "Reservation failed" });
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errorMessage) => {
    console.error(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

// Route to process the queue and update available seats
app.get('/process', async (req, res) => {
  res.json({ "status": "Queue processing" });

  const job = await queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();
    if (currentAvailableSeats === 0) {
      reservationEnabled = false;
    } else if (currentAvailableSeats >= 0) {
      try {
        await reserveSeat(currentAvailableSeats - 1);
        done();
      } catch (error) {
        done(error);
      }
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
