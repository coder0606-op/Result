import { Student } from '../models/Student.js';
import { catchAsync } from '../middleware/catchAsync.js';

export const getStudentMarks = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOne({ id: Number(studentId) });

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json(student.scholastic || []);
});

export const updateStudentMarks = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const marksData = req.body;
  const student = await Student.findOne({ id: Number(studentId) });

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (Array.isArray(marksData)) {
    student.scholastic = marksData;
  } else if (marksData.scholastic) {
    student.scholastic = marksData.scholastic;
  }

  await student.save();
  return res.json(student.scholastic);
});
