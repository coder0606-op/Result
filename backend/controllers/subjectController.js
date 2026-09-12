import { Subject } from '../models/Subject.js';
import { catchAsync } from '../middleware/catchAsync.js';

export const getSubjects = catchAsync(async (req, res) => {
  const subjects = await Subject.find().sort({ id: 1 });
  return res.json(subjects);
});

export const createSubject = catchAsync(async (req, res) => {
  const { name, code } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  const lastSubject = await Subject.findOne().sort({ id: -1 });
  const newId = lastSubject && lastSubject.id ? lastSubject.id + 1 : 1;

  const newSubject = new Subject({
    id: newId,
    name: name.trim().toUpperCase(),
    code: code ? code.trim().toUpperCase() : `SUB-${newId}`
  });

  await newSubject.save();
  return res.status(201).json(newSubject);
});

export const updateSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  
  const updateFields = {};
  if (name) updateFields.name = name.trim().toUpperCase();
  if (code) updateFields.code = code.trim().toUpperCase();

  const subject = await Subject.findOneAndUpdate(
    { id: Number(id) },
    { $set: updateFields },
    { new: true }
  );

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  return res.json(subject);
});

export const deleteSubject = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const deleted = await Subject.findOneAndDelete({ id: Number(id) });
  if (!deleted) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  return res.json({ success: true, message: `Subject ${id} deleted successfully` });
});
