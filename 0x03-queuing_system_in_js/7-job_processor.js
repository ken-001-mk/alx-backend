#!/usr/bin/env node

import { createQueue } from 'kue';

const queue = createAQueue();

//blacklisted nums
const blacklistedNumbers = ['4153518780', '4153518781'];
const sendNotification = (phoneNumber, message, done) => {
  job.progress(0, 100);
  if (blalistedNumbers.includes(phoneNumber)) {
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
  }
}
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.mesage, job, done);
});
