import { Student } from '../models/Student.js';
import { catchAsync } from '../middleware/catchAsync.js';

export const getAllStudents = catchAsync(async (req, res) => {
  const students = await Student.find().sort({ id: -1 });
  return res.json(students);
});

export const getStudentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const student = await Student.findOne({ id: Number(id) });
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  return res.json(student);
});

export const createStudent = catchAsync(async (req, res) => {
  const studentData = req.body;
  
  const lastStudent = await Student.findOne().sort({ id: -1 });
  const newId = lastStudent && lastStudent.id ? lastStudent.id + 1 : 1;
  
  const initials = studentData.studentName
    ? studentData.studentName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ST';

  const newStudent = new Student({
    id: newId,
    studentName: (studentData.studentName || 'NEW STUDENT').toUpperCase(),
    fatherName: (studentData.fatherName || '').toUpperCase(),
    motherName: (studentData.motherName || '').toUpperCase(),
    dob: studentData.dob || '01/01/2015',
    enrollmentNumber: studentData.enrollmentNumber || `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
    rollNumber: studentData.rollNumber ? String(studentData.rollNumber) : '1',
    className: studentData.className ? String(studentData.className) : '1',
    section: (studentData.section || 'A').toUpperCase(),
    house: studentData.house || 'Yellow House',
    address: studentData.address || 'Siwan, Bihar',
    academicSession: studentData.academicSession || '2024-25',
    studentPhoto: studentData.studentPhoto || '',
    initials,
    status: studentData.status || 'Enrolled',
    attendance: studentData.attendance || {
      t1Present: 50, t1Total: 60,
      hyPresent: 52, hyTotal: 60,
      t2Present: 55, t2Total: 60,
      annualPresent: 54, annualTotal: 60
    },
    coScholastic: studentData.coScholastic || [
      { id: 1, activity: 'Work Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 2, activity: 'Art Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 3, activity: 'Sports / Yoga / NCC', hyGrade: 'A', annualGrade: 'A' }
    ],
    remarks: studentData.remarks || 'Promising student with good academic dedication.',
    resultStatus: studentData.resultStatus || 'Promote',
    scholastic: studentData.scholastic || [
      { subject: 'HINDI', per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 8, nb2: 5, sea2: 5, yr2: 72 },
      { subject: 'ENGLISH', per1: 7, nb1: 4, sea1: 5, hy1: 65, per2: 8, nb2: 5, sea2: 5, yr2: 68 },
      { subject: 'MATHS', per1: 8, nb1: 5, sea1: 5, hy1: 75, per2: 9, nb2: 5, sea2: 5, yr2: 80 },
      { subject: 'GK', per1: 8, nb1: 4, sea1: 5, hy1: 60, per2: 8, nb2: 5, sea2: 5, yr2: 65 },
      { subject: 'DRAWING', per1: 9, nb1: 5, sea1: 5, hy1: 80, per2: 9, nb2: 5, sea2: 5, yr2: 82 },
      { subject: 'SANSKRIT', per1: 7, nb1: 5, sea1: 5, hy1: 62, per2: 8, nb2: 5, sea2: 5, yr2: 66 },
      { subject: 'SCIENCE', per1: 8, nb1: 5, sea1: 5, hy1: 72, per2: 8, nb2: 5, sea2: 5, yr2: 74 },
      { subject: 'COMPUTER', per1: 9, nb1: 5, sea1: 5, hy1: 85, per2: 9, nb2: 5, sea2: 5, yr2: 88 }
    ]
  });

  await newStudent.save();
  return res.status(201).json(newStudent);
});

export const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  
  if (updateFields.studentName) {
    updateFields.studentName = updateFields.studentName.toUpperCase();
    updateFields.initials = updateFields.studentName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
  if (updateFields.fatherName) updateFields.fatherName = updateFields.fatherName.toUpperCase();
  if (updateFields.motherName) updateFields.motherName = updateFields.motherName.toUpperCase();

  const student = await Student.findOneAndUpdate(
    { id: Number(id) },
    { $set: updateFields },
    { new: true }
  );

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json(student);
});

export const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const deleted = await Student.findOneAndDelete({ id: Number(id) });
  if (!deleted) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json({ success: true, message: `Student ${id} deleted successfully` });
});
