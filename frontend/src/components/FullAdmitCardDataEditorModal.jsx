import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, School, User, Calendar, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

const FullAdmitCardDataEditorModal = ({ isOpen, onClose, data, onSave }) => {
  const [activeTab, setActiveTab] = useState('school');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data)));
    }
  }, [data, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSchoolChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      school: { ...prev.school, [field]: val }
    }));
  };

  const handleStudentChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      student: { ...prev.student, [field]: val }
    }));
  };

  const handleGeneralChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleAddScheduleRow = () => {
    setFormData(prev => ({
      ...prev,
      examSchedule: [
        ...prev.examSchedule,
        {
          date: '15/03/2025',
          day: 'Saturday',
          subject: 'NEW SUBJECT',
          time: '09:00 AM - 12:00 PM',
          roomNo: 'Hall-01'
        }
      ]
    }));
  };

  const handleRemoveScheduleRow = (index) => {
    setFormData(prev => ({
      ...prev,
      examSchedule: prev.examSchedule.filter((_, idx) => idx !== index)
    }));
  };

  const handleScheduleChange = (index, field, val) => {
    setFormData(prev => {
      const updated = [...prev.examSchedule];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, examSchedule: updated };
    });
  };

  const handleAddInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        'Candidates must bring their own stationery items (pens, pencils, ruler).'
      ]
    }));
  };

  const handleRemoveInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, idx) => idx !== index)
    }));
  };

  const handleInstructionChange = (index, val) => {
    setFormData(prev => {
      const updated = [...prev.instructions];
      updated[index] = val;
      return { ...prev, instructions: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-maroon via-maroon-dark to-maroon text-white p-4 sm:p-5 flex items-center justify-between border-b border-gold/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <Sparkles className="w-5 h-5 text-gold-light" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg uppercase tracking-wide text-white">
                Edit All Admit Card Data
              </h2>
              <p className="text-[11px] text-gold-light font-medium">
                Full customization of school headers, student info, timetable & rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 flex flex-wrap gap-1 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('school')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'school'
                ? 'bg-white text-maroon border-t-2 border-maroon border-x border-gray-200 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>School & Exam</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-white text-maroon border-t-2 border-maroon border-x border-gray-200 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'timetable'
                ? 'bg-white text-maroon border-t-2 border-maroon border-x border-gray-200 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Exam Schedule ({formData.examSchedule?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-white text-maroon border-t-2 border-maroon border-x border-gray-200 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rules & Signatures</span>
          </button>
        </div>

        {/* Modal Form Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: School & Exam Details */}
          {activeTab === 'school' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={formData.school?.schoolName || ''}
                    onChange={(e) => handleSchoolChange('schoolName', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Affiliation / Reg No.</label>
                  <input
                    type="text"
                    value={formData.school?.affiliationNumber || ''}
                    onChange={(e) => handleSchoolChange('affiliationNumber', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Examination Title Header</label>
                  <input
                    type="text"
                    value={formData.examTitle || ''}
                    onChange={(e) => handleGeneralChange('examTitle', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                    placeholder="ANNUAL EXAMINATION HALL TICKET"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={formData.academicSession || ''}
                    onChange={(e) => handleGeneralChange('academicSession', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                    placeholder="2024-2025"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exam Center Name</label>
                  <input
                    type="text"
                    value={formData.examCenter || ''}
                    onChange={(e) => handleGeneralChange('examCenter', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                    placeholder="Mahaviri Shishu Vidya Mandir Main Hall"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Center Code</label>
                  <input
                    type="text"
                    value={formData.centerCode || ''}
                    onChange={(e) => handleGeneralChange('centerCode', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                    placeholder="CTR-8802"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">School Address</label>
                  <input
                    type="text"
                    value={formData.school?.address || ''}
                    onChange={(e) => handleSchoolChange('address', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={formData.school?.contactNumber || ''}
                    onChange={(e) => handleSchoolChange('contactNumber', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">School Main Logo URL</label>
                    <input
                      type="text"
                      value={formData.school?.schoolLogo || ''}
                      onChange={(e) => handleSchoolChange('schoolLogo', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Badge Logo URL</label>
                    <input
                      type="text"
                      value={formData.school?.secondLogo || ''}
                      onChange={(e) => handleSchoolChange('secondLogo', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Student Details */}
          {activeTab === 'student' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={formData.student?.studentName || ''}
                    onChange={(e) => handleStudentChange('studentName', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.student?.rollNumber || ''}
                    onChange={(e) => handleStudentChange('rollNumber', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Registration / Enrollment No.</label>
                  <input
                    type="text"
                    value={formData.student?.enrollmentNumber || ''}
                    onChange={(e) => handleStudentChange('enrollmentNumber', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={formData.student?.fatherName || ''}
                    onChange={(e) => handleStudentChange('fatherName', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.student?.motherName || ''}
                    onChange={(e) => handleStudentChange('motherName', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={formData.student?.className || ''}
                    onChange={(e) => handleStudentChange('className', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.student?.section || ''}
                    onChange={(e) => handleStudentChange('section', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={formData.student?.dob || ''}
                    onChange={(e) => handleStudentChange('dob', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category / Gender</label>
                  <input
                    type="text"
                    value={formData.student?.gender || 'Regular'}
                    onChange={(e) => handleStudentChange('gender', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Student Photo URL / Base64</label>
                  <input
                    type="text"
                    value={formData.student?.studentPhoto || ''}
                    onChange={(e) => handleStudentChange('studentPhoto', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white"
                  />
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Exam Timetable Schedule */}
          {activeTab === 'timetable' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="text-xs font-bold text-gray-800 uppercase">
                  Exam Schedule Items ({formData.examSchedule?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={handleAddScheduleRow}
                  className="px-3 py-1.5 bg-maroon text-white font-extrabold text-xs rounded-lg hover:bg-maroon-dark transition-all flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject Exam</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.examSchedule && formData.examSchedule.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Date</label>
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => handleScheduleChange(idx, 'date', e.target.value)}
                        className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Day</label>
                      <input
                        type="text"
                        value={item.day || ''}
                        onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)}
                        className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500">Subject Name</label>
                      <input
                        type="text"
                        value={item.subject || ''}
                        onChange={(e) => handleScheduleChange(idx, 'subject', e.target.value)}
                        className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold uppercase text-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Time Slot</label>
                      <input
                        type="text"
                        value={item.time || ''}
                        onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                        className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500">Room No</label>
                        <input
                          type="text"
                          value={item.roomNo || ''}
                          onChange={(e) => handleScheduleChange(idx, 'roomNo', e.target.value)}
                          className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScheduleRow(idx)}
                        className="mt-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete Exam Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Rules & Signatures */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Principal / Controller Title Label</label>
                <input
                  type="text"
                  value={formData.principalTitle || ''}
                  onChange={(e) => handleGeneralChange('principalTitle', e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon"
                  placeholder="Controller of Examinations / Principal"
                />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between pb-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase">
                    Candidate Instructions ({formData.instructions?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Rule</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.instructions && formData.instructions.map((inst, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 w-5 shrink-0">{idx + 1}.</span>
                      <input
                        type="text"
                        value={inst}
                        onChange={(e) => handleInstructionChange(idx, e.target.value)}
                        className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon text-white font-extrabold text-xs rounded-xl hover:bg-maroon-dark transition-all flex items-center gap-2 shadow-md shadow-maroon/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Admit Card Details</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default FullAdmitCardDataEditorModal;
