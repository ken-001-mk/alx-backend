#!/usr/bin/env node
import { createQueue } from 'kue';

const queue = createQueue({name: 'push_notification_code'});

const jobData = {
  phoneNumber: '+254734755259',
  message: 'Welcome to the job creator site'
};

const job = queue.create('push_notification_code', jobData);

job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
})

job.on('complete', () => {
  console.log('Notification job completed');
})

job.on('failed', () => {
  console.log('Notification job failed');
})

job.save((error) => {
  if (error) {
    console.log('Error creating job:', error);
  }
});
