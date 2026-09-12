import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';
import { School } from '../models/School.js';
import { Subject } from '../models/Subject.js';
import { Student } from '../models/Student.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../data');

dotenv.config({ path: path.join(__dirname, '../.env') });

const importData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await School.deleteMany();
    await Subject.deleteMany();
    await Student.deleteMany();
    console.log('Existing DB cleared.');

    if (fs.existsSync(DATA_DIR)) {
      if (fs.existsSync(path.join(DATA_DIR, 'users.json'))) {
        const users = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'users.json'), 'utf8'));
        await User.insertMany(users);
        console.log('Users imported.');
      }
      
      if (fs.existsSync(path.join(DATA_DIR, 'school.json'))) {
        const school = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'school.json'), 'utf8'));
        await School.create(school);
        console.log('School imported.');
      }

      if (fs.existsSync(path.join(DATA_DIR, 'subjects.json'))) {
        const subjects = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'subjects.json'), 'utf8'));
        await Subject.insertMany(subjects);
        console.log('Subjects imported.');
      }

      if (fs.existsSync(path.join(DATA_DIR, 'students.json'))) {
        const students = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'students.json'), 'utf8'));
        await Student.insertMany(students);
        console.log('Students imported.');
      }
    } else {
        console.log('No data directory found to seed from.');
    }

    console.log('✅ Data Import Success');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

importData();
