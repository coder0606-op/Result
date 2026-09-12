import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import StudentImageUploader from '../components/StudentImageUploader';
import { 
  FilePlus, 
  User, 
  BookOpen, 
  Award, 
  Calendar, 
  MessageSquare, 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles,
  Calculator,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_SUBJECTS = [
  { subject: 'HINDI', per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 8, nb2: 5, sea2: 5, yr2: 72 },
  { subject: 'ENGLISH', per1: 8, nb1: 5, sea1: 5, hy1: 68, per2: 8, nb2: 5, sea2: 5, yr2: 70 },
  { subject: 'MATHS', per1: 9, nb1: 5, sea1: 5, hy1: 75, per2: 9, nb2: 5, sea2: 5, yr2: 80 },
  { subject: 'SCIENCE', per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 8, nb2: 5, sea2: 5, yr2: 74 },
  { subject: 'GK', per1: 8, nb1: 4, sea1: 5, hy1: 65, per2: 8, nb2: 5, sea2: 5, yr2: 68 },
  { subject: 'DRAWING', per1: 9, nb1: 5, sea1: 5, hy1: 80, per2: 9, nb2: 5, sea2: 5, yr2: 85 },
  { subject: 'SANSKRIT', per1: 7, nb1: 5, sea1: 5, hy1: 65, per2: 8, nb2: 5, sea2: 5, yr2: 68 },
  { subject: 'COMPUTER', per1: 9, nb1: 5, sea1: 5, hy1: 85, per2: 9, nb2: 5, sea2: 5, yr2: 88 }
];

const CreateReportCardPage = () => {
  const navigate = useNavigate();

  // Basic Info State
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '15/08/2015',
    rollNumber: '',
    enrollmentNumber: `MSVM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    className: 'V',
    section: 'A',
    house: 'Yellow House',
    address: 'Siwan, Bihar',
    academicSession: '2024-25',
    studentPhoto: '',
    remarks: 'Promising student with good academic dedication.',
    resultStatus: 'Promote'
  });

  // Scholastic Marks State
  const [scholastic, setScholastic] = useState(DEFAULT_SUBJECTS);

  // Co-Scholastic State
  const [coScholastic, setCoScholastic] = useState([
    { id: 1, activity: 'Work Education', hyGrade: 'A', annualGrade: 'A' },
    { id: 2, activity: 'Art Education', hyGrade: 'A', annualGrade: 'A' },
    { id: 3, activity: 'Sports / Yoga / NCC', hyGrade: 'A', annualGrade: 'A' }
  ]);

  // Attendance State
  const [attendance, setAttendance] = useState({
    t1Present: 54, t1Total: 60,
    hyPresent: 55, hyTotal: 60,
    t2Present: 56, t2Total: 60,
    annualPresent: 55, annualTotal: 60
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper calculation for subject grand total
  const getSubjectTotal = (s) => {
    return (Number(s.per1)||0) + (Number(s.nb1)||0) + (Number(s.sea1)||0) + (Number(s.hy1)||0) +
           (Number(s.per2)||0) + (Number(s.nb2)||0) + (Number(s.sea2)||0) + (Number(s.yr2)||0);
  };

  // Overall Total & Percentage
  const grandTotal = scholastic.reduce((sum, s) => sum + getSubjectTotal(s), 0);
  const maxTotal = scholastic.length * 200;
  const overallPercentage = maxTotal > 0 ? ((grandTotal / maxTotal) * 100).toFixed(1) : 0;

  const getOverallGrade = (pct) => {
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E (Needs Improvement)';
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScholasticChange = (index, field, value) => {
    const updated = [...scholastic];
    updated[index][field] = field === 'subject' ? value : Number(value) || 0;
    setScholastic(updated);
  };

  const handleAddSubject = () => {
    setScholastic(prev => [
      ...prev,
      { subject: `SUBJECT ${prev.length + 1}`, per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 8, nb2: 5, sea2: 5, yr2: 70 }
    ]);
  };

  const handleRemoveSubject = (index) => {
    if (scholastic.length <= 1) {
      alert('Report card must contain at least one subject!');
      return;
    }
    setScholastic(prev => prev.filter((_, i) => i !== index));
  };

  const handleCoScholasticChange = (index, field, value) => {
    const updated = [...coScholastic];
    updated[index][field] = value;
    setCoScholastic(updated);
  };

  const handleAttendanceChange = (field, value) => {
    setAttendance(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentName.trim()) {
      alert('Please enter Student Name!');
      setActiveTab('basic');
      return;
    }

    if (!formData.rollNumber.trim()) {
      alert('Please enter Roll Number!');
      setActiveTab('basic');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        scholastic,
        coScholastic,
        attendance
      };

      const newStudent = await studentService.createStudent(payload);
      showToast('New Report Card Created Successfully!');
      setTimeout(() => {
        navigate(`/report-cards?studentId=${newStudent.id}`);
      }, 1000);
    } catch (err) {
      alert('Failed to create report card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-body pb-16 max-w-6xl mx-auto">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-maroon text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-gold" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-maroon/10 text-maroon flex items-center justify-center font-bold">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
              Create New Report Card
              <span className="text-xs bg-gold/20 text-maroon font-bold px-2.5 py-0.5 rounded-full border border-gold/30">
                New Record
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Fill student details, scholastic marks & co-scholastic grades to publish a report card</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/report-cards"
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-maroon text-white hover:bg-maroon-dark font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold-light" />
            <span>{isSubmitting ? 'Generating Report Card...' : 'Save & Generate Report Card'}</span>
          </button>
        </div>
      </div>

      {/* Live Calculated Stats Summary Card */}
      <div className="bg-gradient-to-r from-maroon via-maroon-dark to-maroon text-white p-4 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 border border-maroon-light/30">
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 text-gold-light flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-300 font-semibold uppercase">Grand Total</p>
            <p className="font-heading font-extrabold text-lg text-white">{grandTotal} / {maxTotal}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 text-gold-light flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-300 font-semibold uppercase">Overall Percentage</p>
            <p className="font-heading font-extrabold text-lg text-gold-light">{overallPercentage}%</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 text-gold-light flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-300 font-semibold uppercase">Overall Grade</p>
            <p className="font-heading font-extrabold text-lg text-white">{getOverallGrade(overallPercentage)}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 text-gold-light flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-300 font-semibold uppercase">Total Subjects</p>
            <p className="font-heading font-extrabold text-lg text-white">{scholastic.length} Subjects</p>
          </div>
        </div>
      </div>

      {/* Form Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-xs flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeTab === 'basic' ? 'bg-maroon text-white shadow-sm font-extrabold' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>1. Student Basic Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('scholastic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeTab === 'scholastic' ? 'bg-maroon text-white shadow-sm font-extrabold' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Scholastic Marks</span>
        </button>

        <button
          onClick={() => setActiveTab('coscholastic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeTab === 'coscholastic' ? 'bg-maroon text-white shadow-sm font-extrabold' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>3. Co-Scholastic & Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('remarks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
            activeTab === 'remarks' ? 'bg-maroon text-white shadow-sm font-extrabold' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>4. Remarks & Status</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* TAB 1: BASIC PROFILE */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-maroon pb-2 border-b border-gray-200 flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Student Personal & Academic Information</span>
            </h3>

            {/* Photo Uploader */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-700 mb-2">Student Photo Upload</label>
              <StudentImageUploader
                currentPhoto={formData.studentPhoto}
                studentName={formData.studentName || 'Student'}
                onImageChange={(photoUrl) => setFormData(prev => ({ ...prev, studentPhoto: photoUrl }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
              <div>
                <label className="block text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="e.g. SUNIDHI KUMARI"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Father's Name *</label>
                <input
                  type="text"
                  required
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="e.g. AMIT KUMAR"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Mother's Name *</label>
                <input
                  type="text"
                  required
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="e.g. ANITA DEVI"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Date of Birth (DOB) *</label>
                <input
                  type="text"
                  required
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 4"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Enrollment / Admission No.</label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. MSVM-2024-101"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs font-bold text-maroon"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Class</label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs font-bold"
                >
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  placeholder="A"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">House</label>
                <input
                  type="text"
                  name="house"
                  value={formData.house}
                  onChange={handleInputChange}
                  placeholder="Yellow House"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Academic Session</label>
                <input
                  type="text"
                  name="academicSession"
                  value={formData.academicSession}
                  onChange={handleInputChange}
                  placeholder="2024-25"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Siwan, Bihar"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('scholastic')}
                className="px-5 py-2.5 bg-maroon text-white font-bold text-xs rounded-xl hover:bg-maroon-dark transition-all"
              >
                Next: Scholastic Marks →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOLASTIC MARKS */}
        {activeTab === 'scholastic' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-heading font-bold text-lg text-maroon flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Scholastic Subject Marks (Term 1 & Term 2)</span>
              </h3>

              <button
                type="button"
                onClick={handleAddSubject}
                className="px-3 py-1.5 bg-gold/20 text-maroon hover:bg-gold/30 font-bold text-xs rounded-lg transition-all flex items-center gap-1 border border-gold/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-gray-300">
                <thead className="bg-gray-100 font-bold text-gray-800 text-[11px] uppercase">
                  <tr>
                    <th className="border border-gray-300 p-2">Subject</th>
                    <th className="border border-gray-300 p-2 text-center" colSpan={4}>Term 1 (100)</th>
                    <th className="border border-gray-300 p-2 text-center" colSpan={4}>Term 2 (100)</th>
                    <th className="border border-gray-300 p-2 text-center">Total (200)</th>
                    <th className="border border-gray-300 p-2 text-center">Action</th>
                  </tr>
                  <tr className="bg-gray-50 text-[10px]">
                    <th className="border border-gray-300 p-1"></th>
                    <th className="border border-gray-300 p-1 text-center">PT1 (10)</th>
                    <th className="border border-gray-300 p-1 text-center">NB1 (5)</th>
                    <th className="border border-gray-300 p-1 text-center">SEA1 (5)</th>
                    <th className="border border-gray-300 p-1 text-center">HY (80)</th>
                    <th className="border border-gray-300 p-1 text-center">PT2 (10)</th>
                    <th className="border border-gray-300 p-1 text-center">NB2 (5)</th>
                    <th className="border border-gray-300 p-1 text-center">SEA2 (5)</th>
                    <th className="border border-gray-300 p-1 text-center">ANN (80)</th>
                    <th className="border border-gray-300 p-1 text-center">Sub Total</th>
                    <th className="border border-gray-300 p-1 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {scholastic.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-1.5 min-w-[120px]">
                        <input
                          type="text"
                          value={s.subject}
                          onChange={(e) => handleScholasticChange(idx, 'subject', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded font-bold uppercase text-xs"
                        />
                      </td>

                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="10" value={s.per1} onChange={(e) => handleScholasticChange(idx, 'per1', e.target.value)} className="w-12 text-center py-1 border rounded text-xs" />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="5" value={s.nb1} onChange={(e) => handleScholasticChange(idx, 'nb1', e.target.value)} className="w-12 text-center py-1 border rounded text-xs" />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="5" value={s.sea1} onChange={(e) => handleScholasticChange(idx, 'sea1', e.target.value)} className="w-12 text-center py-1 border rounded text-xs" />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="80" value={s.hy1} onChange={(e) => handleScholasticChange(idx, 'hy1', e.target.value)} className="w-14 text-center py-1 border rounded font-bold text-xs" />
                      </td>

                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="10" value={s.per2} onChange={(e) => handleScholasticChange(idx, 'per2', e.target.value)} className="w-12 text-center py-1 border rounded text-xs" />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="5" value={s.nb2} onChange={(e) => handleScholasticChange(idx, 'nb2', e.target.value)} className="w-12 text-center py-1 border rounded text-xs" />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="5" value={s.sea2} onChange={(e) => handleScholasticChange(idx, 'sea2', e.target.value)} className="w-12 text-center py-1 border rounded text-xs" />
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <input type="number" min="0" max="80" value={s.yr2} onChange={(e) => handleScholasticChange(idx, 'yr2', e.target.value)} className="w-14 text-center py-1 border rounded font-bold text-xs" />
                      </td>

                      <td className="border border-gray-300 p-1.5 text-center font-extrabold text-maroon bg-gray-50">
                        {getSubjectTotal(s)}
                      </td>

                      <td className="border border-gray-300 p-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                ← Back to Basic Profile
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('coscholastic')}
                className="px-5 py-2.5 bg-maroon text-white font-bold text-xs rounded-xl hover:bg-maroon-dark"
              >
                Next: Co-Scholastic Grades →
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CO-SCHOLASTIC & ATTENDANCE */}
        {activeTab === 'coscholastic' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-maroon pb-2 border-b border-gray-200 flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Co-Scholastic Activity Grades & Attendance Record</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Co-Scholastic Table */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-xs text-gray-800 uppercase mb-3">Co-Scholastic Activities (Graded A to E)</h4>
                <div className="space-y-3">
                  {coScholastic.map((cs, idx) => (
                    <div key={cs.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700">{cs.activity}</span>
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="text-[10px] text-gray-500 block">Term 1</label>
                          <select
                            value={cs.hyGrade}
                            onChange={(e) => handleCoScholasticChange(idx, 'hyGrade', e.target.value)}
                            className="px-2 py-1 border rounded text-xs font-bold"
                          >
                            {['A', 'B', 'C', 'D', 'E'].map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block">Term 2</label>
                          <select
                            value={cs.annualGrade}
                            onChange={(e) => handleCoScholasticChange(idx, 'annualGrade', e.target.value)}
                            className="px-2 py-1 border rounded text-xs font-bold"
                          >
                            {['A', 'B', 'C', 'D', 'E'].map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-xs text-gray-800 uppercase mb-3">Attendance Days Record</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <div>
                    <label className="text-gray-700 block mb-1">Term 1 Present</label>
                    <input
                      type="number"
                      value={attendance.t1Present}
                      onChange={(e) => handleAttendanceChange('t1Present', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 block mb-1">Term 1 Total Days</label>
                    <input
                      type="number"
                      value={attendance.t1Total}
                      onChange={(e) => handleAttendanceChange('t1Total', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 block mb-1">Term 2 Present</label>
                    <input
                      type="number"
                      value={attendance.t2Present}
                      onChange={(e) => handleAttendanceChange('t2Present', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 block mb-1">Term 2 Total Days</label>
                    <input
                      type="number"
                      value={attendance.t2Total}
                      onChange={(e) => handleAttendanceChange('t2Total', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('scholastic')}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                ← Back to Scholastic Marks
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('remarks')}
                className="px-5 py-2.5 bg-maroon text-white font-bold text-xs rounded-xl hover:bg-maroon-dark"
              >
                Next: Remarks & Status →
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: REMARKS & RESULT STATUS */}
        {activeTab === 'remarks' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-maroon pb-2 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>Class Teacher Remarks & Result Promotion Status</span>
            </h3>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-gray-700 mb-1">Teacher Remarks</label>
                <textarea
                  rows={3}
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Enter remarks e.g. Outstanding performance, promoted to higher class."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-maroon text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Result Status</label>
                <select
                  name="resultStatus"
                  value={formData.resultStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-maroon text-xs font-bold text-maroon"
                >
                  <option value="Promote">Promote / Promoted to Next Class</option>
                  <option value="Passed">Passed with Distinction</option>
                  <option value="Pass">Pass</option>
                  <option value="Detained">Detained</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('coscholastic')}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                ← Back to Co-Scholastic
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-maroon text-white font-extrabold text-xs rounded-xl hover:bg-maroon-dark transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5 text-gold-light" />
                <span>{isSubmitting ? 'Saving & Generating...' : 'Save & Generate Report Card'}</span>
              </button>
            </div>
          </div>
        )}
      </form>

    </div>
  );
};

export default CreateReportCardPage;
