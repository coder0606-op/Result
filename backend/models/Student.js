import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  studentName: { type: String, required: true, uppercase: true },
  fatherName: { type: String, uppercase: true },
  motherName: { type: String, uppercase: true },
  dob: { type: String },
  enrollmentNumber: { type: String, unique: true },
  rollNumber: { type: String },
  className: { type: String },
  section: { type: String, uppercase: true },
  house: { type: String },
  address: { type: String },
  academicSession: { type: String },
  studentPhoto: { type: String },
  initials: { type: String },
  status: { type: String, default: 'Enrolled' },
  attendance: {
    t1Present: Number, t1Total: Number,
    hyPresent: Number, hyTotal: Number,
    t2Present: Number, t2Total: Number,
    annualPresent: Number, annualTotal: Number
  },
  coScholastic: [{
    id: Number,
    activity: String,
    hyGrade: String,
    annualGrade: String
  }],
  remarks: { type: String },
  resultStatus: { type: String, default: 'Promote' },
  scholastic: [{
    subject: String,
    per1: Number, nb1: Number, sea1: Number, hy1: Number,
    per2: Number, nb2: Number, sea2: Number, yr2: Number
  }]
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);
