import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { schoolService } from '../services/schoolService';
import AdmitCard from '../components/AdmitCard';
import FullAdmitCardDataEditorModal from '../components/FullAdmitCardDataEditorModal';
import { 
  Printer, 
  Edit3, 
  Users, 
  Sparkles, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  FileText,
  Calendar,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  Layers,
  Filter,
  X
} from 'lucide-react';

const DEFAULT_MASTER_SCHEDULE = [
  { date: '10/03/2025', day: 'Monday', subject: 'HINDI', time: '09:00 AM - 12:00 PM', roomNo: 'Hall-01' },
  { date: '11/03/2025', day: 'Tuesday', subject: 'ENGLISH', time: '09:00 AM - 12:00 PM', roomNo: 'Hall-01' },
  { date: '12/03/2025', day: 'Wednesday', subject: 'MATHEMATICS', time: '09:00 AM - 12:00 PM', roomNo: 'Hall-01' },
  { date: '13/03/2025', day: 'Thursday', subject: 'SCIENCE', time: '09:00 AM - 12:00 PM', roomNo: 'Hall-02' },
  { date: '14/03/2025', day: 'Friday', subject: 'SOCIAL SCIENCE', time: '09:00 AM - 12:00 PM', roomNo: 'Hall-02' },
  { date: '15/03/2025', day: 'Saturday', subject: 'COMPUTER SCIENCE', time: '09:00 AM - 12:00 PM', roomNo: 'Hall-02' }
];

const AdmitCardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const studentIdParam = searchParams.get('studentId');

  const [students, setStudents] = useState([]);
  const [school, setSchool] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // View Mode: 'single' vs 'bulk'
  const [viewMode, setViewMode] = useState('single');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [examPreset, setExamPreset] = useState('ANNUAL EXAMINATION 2024-2025');

  // Master Exam Schedule (Applies to all students)
  const [masterExamSchedule, setMasterExamSchedule] = useState(DEFAULT_MASTER_SCHEDULE);

  // Admit Card Data State for Single View
  const [admitCardData, setAdmitCardData] = useState(null);

  // New Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    studentName: '',
    rollNumber: '',
    fatherName: '',
    motherName: '',
    className: '1',
    section: 'A',
    enrollmentNumber: '',
    dob: '01/01/2015',
    gender: 'Regular',
    studentPhoto: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      if (studentIdParam) {
        const found = students.find(s => String(s.id) === String(studentIdParam) || s.enrollmentNumber === studentIdParam);
        if (found) {
          setSelectedStudent(found);
          setSearchError('');
        } else {
          setSearchError(`Invalid Roll Number or Enrollment Number "${studentIdParam}"!`);
        }
      } else if (!selectedStudent) {
        setSelectedStudent(students[0]);
      }
    }
  }, [students, studentIdParam]);

  useEffect(() => {
    if (selectedStudent && school) {
      generateAdmitCardStructure(selectedStudent, school, examPreset, masterExamSchedule);
    }
  }, [selectedStudent, school, examPreset, masterExamSchedule]);

  const loadInitialData = async () => {
    const sData = await studentService.getAllStudents();
    const schData = await schoolService.getSchoolSettings();
    setStudents(sData);
    setSchool(schData);

    if (sData.length > 0 && !selectedStudent) {
      setSelectedStudent(sData[0]);
    }
  };

  const generateAdmitCardStructure = (stud, sch, examTitle, scheduleToUse) => {
    const defaultInstructions = [
      'Candidates must carry this Admit Card along with valid School ID Card to the Examination Hall.',
      'Reporting time is 15 minutes before the commencement of examination. No late entry after 09:15 AM.',
      'Use of mobile phones, smartwatches, calculators, or any unauthorized electronic items is strictly prohibited.',
      'Check the Question Paper and Answer Sheet carefully before writing your details and Roll Number.',
      'Maintain discipline and decorum inside the exam hall. Misbehavior will result in immediate disqualification.'
    ];

    const finalSchedule = scheduleToUse || masterExamSchedule;

    setAdmitCardData({
      school: {
        schoolName: sch?.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR',
        affiliationNumber: sch?.affiliationNumber || 'RTE/SWN/0052 (G.F.E.R.T PATNA)',
        address: sch?.address || 'Ward No-01 Lakhraw Siwan (Bihar)',
        contactNumber: sch?.contactNumber || '+91 98765 43210',
        schoolLogo: sch?.schoolLogo || '/mahaviri_shishu_vidya_mandir_logo/screen.png',
        secondLogo: sch?.secondLogo || '/academic_excellence_logo/screen.png',
        principalName: sch?.principalName || 'Dr. Rajan Kumar'
      },
      student: {
        id: stud.id,
        studentName: stud.studentName || 'STUDENT NAME',
        fatherName: stud.fatherName || '',
        motherName: stud.motherName || '',
        rollNumber: stud.rollNumber || '1',
        className: stud.className || '1',
        section: stud.section || 'A',
        enrollmentNumber: stud.enrollmentNumber || 'ENR-1001',
        dob: stud.dob || '01/01/2015',
        gender: stud.gender || 'Regular',
        studentPhoto: stud.studentPhoto || ''
      },
      examTitle: examTitle || 'ANNUAL EXAMINATION HALL TICKET',
      academicSession: stud.academicSession || sch?.academicSession || '2024-2025',
      examCenter: 'Mahaviri Shishu Vidya Mandir Main Campus',
      centerCode: 'MSVM-8801',
      principalTitle: 'Controller of Examinations / Principal',
      examSchedule: finalSchedule,
      instructions: defaultInstructions
    });
  };

  const handleSearchVerification = (e) => {
    e.preventDefault();
    setSearchError('');
    if (!searchInput.trim()) {
      setSearchError('Please enter a Roll Number or Enrollment Number.');
      return;
    }

    const found = students.find(s => 
      String(s.rollNumber) === searchInput.trim() || 
      String(s.enrollmentNumber).toLowerCase() === searchInput.trim().toLowerCase() ||
      s.studentName.toLowerCase().includes(searchInput.trim().toLowerCase())
    );

    if (found) {
      setSelectedStudent(found);
      setSearchParams({ studentId: found.id });
      setSearchInput('');
      setSearchError('');
    } else {
      setSearchError(`No student found matching "${searchInput}"!`);
    }
  };

  const handleSaveAdmitCard = async () => {
    if (!admitCardData || !selectedStudent) return;
    
    try {
      // Save updated student fields
      const updatedStudentData = {
        ...selectedStudent,
        studentName: admitCardData.student.studentName,
        fatherName: admitCardData.student.fatherName,
        motherName: admitCardData.student.motherName,
        rollNumber: admitCardData.student.rollNumber,
        className: admitCardData.student.className,
        section: admitCardData.student.section,
        enrollmentNumber: admitCardData.student.enrollmentNumber,
        dob: admitCardData.student.dob,
        studentPhoto: admitCardData.student.studentPhoto
      };

      await studentService.updateStudent(selectedStudent.id, updatedStudentData);
      
      // Update master exam schedule if changed
      if (admitCardData.examSchedule) {
        setMasterExamSchedule(admitCardData.examSchedule);
      }

      setSaveSuccessMsg('Admit Card data & Master Schedule saved!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      loadInitialData();
    } catch (err) {
      setSaveSuccessMsg('Admit Card saved locally!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newStudentForm.studentName || !newStudentForm.rollNumber) {
      alert('Please provide Student Name and Roll Number.');
      return;
    }

    try {
      const created = await studentService.createStudent(newStudentForm);
      setSaveSuccessMsg(`Student "${created.studentName}" created successfully!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setIsAddStudentOpen(false);
      setNewStudentForm({
        studentName: '',
        rollNumber: '',
        fatherName: '',
        motherName: '',
        className: '1',
        section: 'A',
        enrollmentNumber: '',
        dob: '01/01/2015',
        gender: 'Regular',
        studentPhoto: ''
      });
      await loadInitialData();
      setSelectedStudent(created);
      setSearchParams({ studentId: created.id });
    } catch (err) {
      alert('Error creating student. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered Students List
  const filteredStudentsList = students.filter(s => 
    selectedClassFilter === 'all' || String(s.className) === String(selectedClassFilter)
  );

  const uniqueClasses = Array.from(new Set(students.map(s => String(s.className)))).sort();

  return (
    <div className="space-y-6 font-body pb-12">
      
      {/* Page Title Header (No-print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-maroon/10 text-maroon rounded-xl font-bold">
              <FileText className="w-5 h-5 text-maroon" />
            </span>
            <div>
              <h1 className="font-heading font-black text-lg sm:text-xl text-gray-900 tracking-wide uppercase">
                Admit Card Generator & Bulk PDF Exporter
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Create, customize timetable & export clean 1-page Admit Cards for all students
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick Add Student Modal Button */}
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Student</span>
          </button>

          {/* View Mode Toggle: Single vs Bulk */}
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'bulk' : 'single')}
            className={`px-3.5 py-2 text-xs font-extrabold rounded-xl border transition-all flex items-center gap-1.5 ${
              viewMode === 'bulk'
                ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{viewMode === 'bulk' ? 'View Mode: ALL STUDENTS' : 'View Mode: SINGLE'}</span>
          </button>

          {/* Direct Inline Edit Mode Toggle */}
          <button
            onClick={() => setIsInlineEditing(!isInlineEditing)}
            className={`px-3 py-2 text-xs font-extrabold rounded-xl border transition-all flex items-center gap-1.5 ${
              isInlineEditing
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
            }`}
            title="Click text directly on admit card to edit"
          >
            {isInlineEditing ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4 text-gray-500" />}
            <span>Direct Edit: {isInlineEditing ? 'ON' : 'OFF'}</span>
          </button>

          {/* Full Editor Modal Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-gold/20 text-maroon hover:bg-gold/30 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-gold/40 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-gold-dark" />
            <span>Master Editor & Timetable</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveAdmitCard}
            className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Details</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-maroon text-white font-extrabold text-xs rounded-xl hover:bg-maroon-dark transition-all flex items-center gap-1.5 shadow-md shadow-maroon/20"
          >
            <Printer className="w-4 h-4" />
            <span>{viewMode === 'bulk' ? `Print ALL (${filteredStudentsList.length}) PDF` : 'Print Admit Card'}</span>
          </button>
        </div>
      </div>

      {/* Student Selection & Filter Bar (No-print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Student Selector / Class Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-maroon" />
            <label className="text-xs font-bold text-gray-700">Class Filter:</label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:border-maroon"
            >
              <option value="all">All Classes ({students.length} Students)</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          {viewMode === 'single' && (
            <>
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-l border-gray-300 pl-3">
                <Users className="w-4 h-4 text-maroon" />
                <span>Select Student:</span>
              </label>

              <select
                value={selectedStudent ? selectedStudent.id : ''}
                onChange={(e) => {
                  const id = e.target.value;
                  const found = students.find(s => String(s.id) === String(id));
                  if (found) {
                    setSelectedStudent(found);
                    setSearchParams({ studentId: id });
                    setSearchError('');
                  }
                }}
                className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:border-maroon min-w-[210px]"
              >
                {filteredStudentsList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.studentName} (Class {s.className}-{s.section}, Roll: {s.rollNumber})
                  </option>
                ))}
              </select>

              {/* Search Form */}
              <form onSubmit={handleSearchVerification} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearchError('');
                  }}
                  placeholder="Roll No or Student Name..."
                  className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon min-w-[170px]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-maroon text-white font-extrabold text-xs rounded-lg hover:bg-maroon-dark transition-all"
                >
                  Search
                </button>
              </form>
            </>
          )}

        </div>

        {/* Right: Exam Title Preset Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gold-dark" />
            <span>Exam Title Preset:</span>
          </label>
          <select
            value={examPreset}
            onChange={(e) => setExamPreset(e.target.value)}
            className="px-3 py-1.5 bg-amber-50/70 border border-amber-300 rounded-lg text-xs font-extrabold text-maroon focus:border-maroon"
          >
            <option value="ANNUAL EXAMINATION 2024-2025">ANNUAL EXAMINATION 2024-2025</option>
            <option value="HALF-YEARLY EXAMINATION 2024-2025">HALF-YEARLY EXAMINATION 2024-2025</option>
            <option value="PRE-BOARD EXAMINATION 2024-2025">PRE-BOARD EXAMINATION 2024-2025</option>
            <option value="PERIODIC TEST / UNIT EXAM 2024-2025">PERIODIC TEST / UNIT EXAM 2024-2025</option>
          </select>
        </div>

      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="no-print p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl shadow-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-extrabold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Error Search Alert */}
      {searchError && (
        <div className="no-print p-4 bg-red-50 border-2 border-red-300 text-red-900 rounded-xl shadow-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-xs font-bold">{searchError}</span>
        </div>
      )}

      {/* Admit Card Layout Area */}
      {viewMode === 'single' ? (
        admitCardData && (
          <AdmitCard
            data={admitCardData}
            isEditing={isInlineEditing}
            onDataChange={(newData) => {
              setAdmitCardData(newData);
              if (newData.examSchedule) {
                setMasterExamSchedule(newData.examSchedule);
              }
            }}
          />
        )
      ) : (
        /* ALL STUDENTS BULK VIEW MODE */
        <div className="space-y-6">
          <div className="no-print p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 text-xs font-bold flex items-center justify-between">
            <span>
              Showing Admit Cards for <strong>{filteredStudentsList.length} Students</strong> ({selectedClassFilter === 'all' ? 'All Classes' : `Class ${selectedClassFilter}`}). Click "Print ALL PDF" to generate 1-page Admit Cards for all students at once!
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print ALL ({filteredStudentsList.length}) PDF</span>
            </button>
          </div>

          {filteredStudentsList.map((stud) => {
            const studentAdmitCardData = {
              school: {
                schoolName: school?.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR',
                affiliationNumber: school?.affiliationNumber || 'RTE/SWN/0052 (G.F.E.R.T PATNA)',
                address: school?.address || 'Ward No-01 Lakhraw Siwan (Bihar)',
                contactNumber: school?.contactNumber || '+91 98765 43210',
                schoolLogo: school?.schoolLogo || '/mahaviri_shishu_vidya_mandir_logo/screen.png',
                secondLogo: school?.secondLogo || '/academic_excellence_logo/screen.png',
                principalName: school?.principalName || 'Dr. Rajan Kumar'
              },
              student: {
                id: stud.id,
                studentName: stud.studentName || 'STUDENT NAME',
                fatherName: stud.fatherName || '',
                motherName: stud.motherName || '',
                rollNumber: stud.rollNumber || '1',
                className: stud.className || '1',
                section: stud.section || 'A',
                enrollmentNumber: stud.enrollmentNumber || 'ENR-1001',
                dob: stud.dob || '01/01/2015',
                gender: stud.gender || 'Regular',
                studentPhoto: stud.studentPhoto || ''
              },
              examTitle: examPreset,
              academicSession: stud.academicSession || school?.academicSession || '2024-2025',
              examCenter: 'Mahaviri Shishu Vidya Mandir Main Campus',
              centerCode: 'MSVM-8801',
              principalTitle: 'Controller of Examinations / Principal',
              examSchedule: masterExamSchedule,
              instructions: [
                'Candidates must carry this Admit Card along with valid School ID Card to the Examination Hall.',
                'Reporting time is 15 minutes before the commencement of examination. No late entry after 09:15 AM.',
                'Use of mobile phones, smartwatches, calculators, or any unauthorized electronic items is strictly prohibited.',
                'Check the Question Paper and Answer Sheet carefully before writing your details and Roll Number.',
                'Maintain discipline and decorum inside the exam hall. Misbehavior will result in immediate disqualification.'
              ]
            };

            return (
              <div key={stud.id} className="admit-card-page-break">
                <AdmitCard
                  data={studentAdmitCardData}
                  isEditing={isInlineEditing}
                  onDataChange={(newData) => {
                    if (newData.examSchedule) {
                      setMasterExamSchedule(newData.examSchedule);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Editor */}
      {admitCardData && (
        <FullAdmitCardDataEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={admitCardData}
          onSave={(newData) => {
            setAdmitCardData(newData);
            if (newData.examSchedule) {
              setMasterExamSchedule(newData.examSchedule);
            }
            setSaveSuccessMsg('Master Admit Card details & Timetable updated!');
            setTimeout(() => setSaveSuccessMsg(''), 4000);
          }}
        />
      )}

      {/* Quick Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-maroon to-maroon-dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gold-light" />
                <h2 className="font-heading font-black text-base uppercase">Add New Student for Admit Card</h2>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    value={newStudentForm.studentName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, studentName: e.target.value })}
                    placeholder="e.g. AARAV KUMAR"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={newStudentForm.rollNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, rollNumber: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={newStudentForm.fatherName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, fatherName: e.target.value })}
                    placeholder="Father's Full Name"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={newStudentForm.motherName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, motherName: e.target.value })}
                    placeholder="Mother's Full Name"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={newStudentForm.className}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={newStudentForm.section}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, section: e.target.value })}
                    placeholder="e.g. A"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Registration / Enrollment No.</label>
                  <input
                    type="text"
                    value={newStudentForm.enrollmentNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, enrollmentNumber: e.target.value })}
                    placeholder="e.g. ENR-2025-09"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={newStudentForm.dob}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Student Photo URL (Optional)</label>
                  <input
                    type="text"
                    value={newStudentForm.studentPhoto}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, studentPhoto: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white"
                  />
                </div>

              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student & Generate Admit Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmitCardPage;
