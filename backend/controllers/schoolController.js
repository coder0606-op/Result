import { School } from '../models/School.js';
import { catchAsync } from '../middleware/catchAsync.js';

export const getSchool = catchAsync(async (req, res) => {
  let school = await School.findOne();
  if (!school) {
    // Return empty or default if nothing exists
    school = {};
  }
  return res.json(school);
});

export const updateSchool = catchAsync(async (req, res) => {
  const settings = req.body;
  let current = await School.findOne();
  if (!current) {
    current = new School(settings);
    await current.save();
    return res.json(current);
  }
  
  const updated = await School.findOneAndUpdate(
    { _id: current._id },
    { $set: settings },
    { new: true }
  );
  
  return res.json(updated);
});
