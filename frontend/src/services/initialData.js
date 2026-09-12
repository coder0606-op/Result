export const calculateGrade = (score) => {
  if (score >= 91) return 'A1';
  if (score >= 81) return 'A2';
  if (score >= 71) return 'B1';
  if (score >= 61) return 'B2';
  if (score >= 51) return 'C1';
  if (score >= 41) return 'C2';
  if (score >= 33) return 'D';
  return 'E';
};

export const defaultSchool = {
  id: 1,
  schoolName: 'MAHAVIRI SHISHU VIDYA MANDIR',
  schoolLogo: '/mahaviri_shishu_vidya_mandir_logo/screen.png',
  secondLogo: '/academic_excellence_logo/screen.png',
  affiliationNumber: 'RTE/SWN/0052 (G.F.E.R.T PATNA)',
  address: 'Ward No-01 Lakhraw Siwan (Bihar)',
  contactNumber: '+91 98765 43210',
  email: 'contact@mahavirishishu.edu.in',
  principalName: 'Dr. Rajan Kumar',
  academicSession: '2024-25'
};

export const defaultSubjects = [
  { id: 1, name: 'HINDI', code: 'HIN-101' },
  { id: 2, name: 'ENGLISH', code: 'ENG-102' },
  { id: 3, name: 'MATHS', code: 'MTH-103' },
  { id: 4, name: 'GK', code: 'GK-104' },
  { id: 5, name: 'DRAWING', code: 'DRW-105' },
  { id: 6, name: 'SANSKRIT', code: 'SKT-106' },
  { id: 7, name: 'SCIENCE', code: 'SCI-107' },
  { id: 8, name: 'COMPUTER', code: 'CMP-108' }
];

export const initialStudents = [
  {
    id: 1,
    studentName: 'SUNIDHI KUMARI',
    fatherName: 'RAJAN KUMAR',
    motherName: 'NITU DEVI',
    dob: '06/01/2015',
    enrollmentNumber: '197',
    rollNumber: '4',
    className: '3',
    section: 'A',
    house: 'Red House',
    address: 'Ward No-01 Lakhraw Siwan (Bihar)',
    academicSession: '2024-25',
    studentPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    initials: 'SK',
    status: 'Enrolled',
    attendance: {
      t1Present: 54,
      t1Total: 60,
      hyPresent: 55,
      hyTotal: 60,
      t2Present: 58,
      t2Total: 60,
      annualPresent: 56,
      annualTotal: 60
    },
    coScholastic: [
      { id: 1, activity: 'Work Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 2, activity: 'Art Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 3, activity: 'Sports / Yoga / NCC', hyGrade: 'B', annualGrade: 'B' }
    ],
    remarks: 'Sunidhi shows exceptional curiosity in Science and Computer studies. Keep up the brilliant work!',
    resultStatus: 'Promote',
    scholastic: [
      { subject: 'HINDI', per1: 7, nb1: 5, sea1: 5, hy1: 65, per2: 8, nb2: 5, sea2: 4, yr2: 70 },
      { subject: 'ENGLISH', per1: 6, nb1: 4, sea1: 5, hy1: 34, per2: 7, nb2: 4, sea2: 5, yr2: 55 },
      { subject: 'MATHS', per1: 5, nb1: 4, sea1: 5, hy1: 51, per2: 8, nb2: 5, sea2: 5, yr2: 68 },
      { subject: 'GK', per1: 7, nb1: 4, sea1: 5, hy1: 41, per2: 7, nb2: 5, sea2: 5, yr2: 60 },
      { subject: 'DRAWING', per1: 7, nb1: 4, sea1: 5, hy1: 65, per2: 9, nb2: 5, sea2: 5, yr2: 75 },
      { subject: 'SANSKRIT', per1: 6, nb1: 5, sea1: 5, hy1: 54, per2: 7, nb2: 4, sea2: 5, yr2: 66 },
      { subject: 'SCIENCE', per1: 7, nb1: 5, sea1: 5, hy1: 46, per2: 8, nb2: 5, sea2: 5, yr2: 62 },
      { subject: 'COMPUTER', per1: 8, nb1: 5, sea1: 5, hy1: 73, per2: 9, nb2: 5, sea2: 5, yr2: 78 }
    ]
  },
  {
    id: 2,
    studentName: 'ELEANOR RICHARDS',
    fatherName: 'DAVID RICHARDS',
    motherName: 'CLARA RICHARDS',
    dob: '12/04/2008',
    enrollmentNumber: 'STU-2023-084',
    rollNumber: '1',
    className: '11',
    section: 'Science',
    house: 'Blue House',
    address: 'Academic Colony, Siwan',
    academicSession: '2024-25',
    studentPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    initials: 'ER',
    status: 'Enrolled',
    attendance: {
      t1Present: 58,
      t1Total: 60,
      hyPresent: 59,
      hyTotal: 60,
      t2Present: 60,
      t2Total: 60,
      annualPresent: 59,
      annualTotal: 60
    },
    coScholastic: [
      { id: 1, activity: 'Work Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 2, activity: 'Art Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 3, activity: 'Sports / Yoga / NCC', hyGrade: 'A', annualGrade: 'A' }
    ],
    remarks: 'Outstanding performance across all subjects. Top student in class!',
    resultStatus: 'Promote',
    scholastic: [
      { subject: 'HINDI', per1: 9, nb1: 5, sea1: 5, hy1: 75, per2: 9, nb2: 5, sea2: 5, yr2: 78 },
      { subject: 'ENGLISH', per1: 9, nb1: 5, sea1: 5, hy1: 76, per2: 9, nb2: 5, sea2: 5, yr2: 80 },
      { subject: 'MATHS', per1: 10, nb1: 5, sea1: 5, hy1: 78, per2: 10, nb2: 5, sea2: 5, yr2: 80 },
      { subject: 'GK', per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 9, nb2: 5, sea2: 5, yr2: 75 },
      { subject: 'DRAWING', per1: 8, nb1: 5, sea1: 5, hy1: 72, per2: 9, nb2: 5, sea2: 5, yr2: 75 },
      { subject: 'SANSKRIT', per1: 8, nb1: 5, sea1: 5, hy1: 68, per2: 9, nb2: 5, sea2: 5, yr2: 72 },
      { subject: 'SCIENCE', per1: 9, nb1: 5, sea1: 5, hy1: 74, per2: 10, nb2: 5, sea2: 5, yr2: 78 },
      { subject: 'COMPUTER', per1: 10, nb1: 5, sea1: 5, hy1: 80, per2: 10, nb2: 5, sea2: 5, yr2: 80 }
    ]
  },
  {
    id: 3,
    studentName: 'MARCUS JOHNSON',
    fatherName: 'ROBERT JOHNSON',
    motherName: 'LAURA JOHNSON',
    dob: '08/11/2009',
    enrollmentNumber: 'STU-2023-112',
    rollNumber: '2',
    className: '10',
    section: 'Arts',
    house: 'Green House',
    address: 'Station Road, Siwan',
    academicSession: '2024-25',
    studentPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    initials: 'MJ',
    status: 'Enrolled',
    attendance: {
      t1Present: 50,
      t1Total: 60,
      hyPresent: 52,
      hyTotal: 60,
      t2Present: 55,
      t2Total: 60,
      annualPresent: 54,
      annualTotal: 60
    },
    coScholastic: [
      { id: 1, activity: 'Work Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 2, activity: 'Art Education', hyGrade: 'A', annualGrade: 'A' },
      { id: 3, activity: 'Sports / Yoga / NCC', hyGrade: 'B', annualGrade: 'B' }
    ],
    remarks: 'Good progress. Needs to focus a bit more on Mathematics.',
    resultStatus: 'Promote',
    scholastic: [
      { subject: 'HINDI', per1: 8, nb1: 4, sea1: 4, hy1: 60, per2: 8, nb2: 5, sea2: 4, yr2: 65 },
      { subject: 'ENGLISH', per1: 8, nb1: 5, sea1: 5, hy1: 65, per2: 9, nb2: 5, sea2: 5, yr2: 70 },
      { subject: 'MATHS', per1: 6, nb1: 4, sea1: 4, hy1: 45, per2: 7, nb2: 4, sea2: 4, yr2: 52 },
      { subject: 'GK', per1: 7, nb1: 5, sea1: 4, hy1: 58, per2: 8, nb2: 5, sea2: 5, yr2: 62 },
      { subject: 'DRAWING', per1: 9, nb1: 5, sea1: 5, hy1: 75, per2: 10, nb2: 5, sea2: 5, yr2: 78 },
      { subject: 'SANSKRIT', per1: 7, nb1: 4, sea1: 4, hy1: 55, per2: 7, nb2: 5, sea2: 4, yr2: 58 },
      { subject: 'SCIENCE', per1: 6, nb1: 4, sea1: 4, hy1: 48, per2: 7, nb2: 4, sea2: 5, yr2: 54 },
      { subject: 'COMPUTER', per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 8, nb2: 5, sea2: 5, yr2: 72 }
    ]
  }
];

// Helper to compute calculated scores for a student
export const computeStudentTotals = (student) => {
  if (!student || !student.scholastic) return { totalGrand: 0, maxPossible: 0, percentage: 0, overallGrade: 'E' };

  let totalGrand = 0;
  const numSubjects = student.scholastic.length || 1;
  const maxPossible = numSubjects * 100;

  student.scholastic.forEach((sub) => {
    const t1 = (sub.per1 || 0) + (sub.nb1 || 0) + (sub.sea1 || 0) + (sub.hy1 || 0);
    const t2 = (sub.per2 || 0) + (sub.nb2 || 0) + (sub.sea2 || 0) + (sub.yr2 || 0);
    const grand = t2 > 0 ? (t1 + t2) / 2 : t1;
    totalGrand += grand;
  });

  const percentage = Number(((totalGrand / maxPossible) * 100).toFixed(2));
  const overallGrade = calculateGrade(percentage);

  // Compute attendance total
  let attendancePct = 0;
  if (student.attendance) {
    const pres = (student.attendance.t1Present || 0) + (student.attendance.hyPresent || 0) + (student.attendance.t2Present || 0) + (student.attendance.annualPresent || 0);
    const tot = (student.attendance.t1Total || 0) + (student.attendance.hyTotal || 0) + (student.attendance.t2Total || 0) + (student.attendance.annualTotal || 0);
    attendancePct = tot > 0 ? Number(((pres / tot) * 100).toFixed(2)) : 0;
  }

  return {
    totalGrand: Number(totalGrand.toFixed(2)),
    maxPossible,
    percentage,
    overallGrade,
    attendancePct
  };
};
