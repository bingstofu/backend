import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Course } from './models/Course';

const sampleCourses = [
  {
    code: 'ITELECT4',
    title: 'Elective 4 - Web Development',
    description: 'Full-stack web development with Node.js, Express, and React.',
    units: 3,
  },
  {
    code: 'IT301',
    title: 'Database Management Systems',
    description: 'Introduction to relational databases and NoSQL concepts.',
    units: 3,
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Course.deleteMany({});
    console.log('Cleared existing courses.');

    await Course.insertMany(sampleCourses);
    console.log('Successfully seeded reference courses!');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();