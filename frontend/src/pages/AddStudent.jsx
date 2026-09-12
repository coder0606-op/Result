import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import StudentImageUploader from '../components/StudentImageUploader';
import { Save, ArrowLeft, User, Calendar, Home, BookOpen, ShieldAlert, Camera } from 'lucide-react';

const AddStudent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '2015-01-06',
    enrollmentNumber: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
    rollNumber: '',
    className: '3',
    section: 'A',
    house: 'Red House',
    address: 'Ward No-01 Lakhraw Siwan (Bihar)',
    academicSession: '2024-25',
    studentPhoto: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.createStudent(formData);
      navigate('/students');
    } catch (err) {
      console.error('Failed to create student', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body pb-10">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-maroon hover:border-maroon transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-gray-900">Add New Student Profile</h1>
          <p className="text-xs text-gray-500">Register student credentials & profile photograph into database</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Section 0: Student Profile Photo Uploader */}
          <div>
            <h3 className="font-heading font-bold text-sm text-maroon mb-3 uppercase tracking-wider border-b border-gray-200 pb-1 flex items-center gap-2">
              <Camera className="w-4 h-4 text-gold-dark" />
              <span>Student Profile Photograph</span>
            </h3>
            <StudentImageUploader
              value={formData.studentPhoto}
              onChange={(photoUrl) => setFormData({ ...formData, studentPhoto: photoUrl })}
              studentName={formData.studentName}
            />
          </div>

          {/* Section 1: Basic Info */}
          <div>
            <h3 className="font-heading font-bold text-sm text-maroon mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">
              1. Basic Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Father's Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="e.g. Ajay Sharma"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mother's Name *</label>
                <input
                  type="text"
                  required
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="e.g. Sunita Sharma"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Info */}
          <div>
            <h3 className="font-heading font-bold text-sm text-maroon mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">
              2. Academic Details & Class Assignment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Class *</label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  placeholder="e.g. 3"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Section *</label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g. A"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. 12"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={formData.enrollmentNumber}
                  onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Additional details */}
          <div>
            <h3 className="font-heading font-bold text-sm text-maroon mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">
              3. Additional & Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">House</label>
                <select
                  value={formData.house}
                  onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                >
                  <option value="Red House">Red House</option>
                  <option value="Blue House">Blue House</option>
                  <option value="Green House">Green House</option>
                  <option value="Yellow House">Yellow House</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Academic Session</label>
                <input
                  type="text"
                  value={formData.academicSession}
                  onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                  placeholder="2024-25"
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block font-bold text-gray-700 mb-1">Residential Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon text-xs"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-maroon text-white font-extrabold rounded-lg text-xs hover:bg-maroon-dark flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Record...' : 'Save & Register Student'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddStudent;
