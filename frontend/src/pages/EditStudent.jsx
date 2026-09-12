import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import StudentImageUploader from '../components/StudentImageUploader';
import { Save, ArrowLeft, Camera } from 'lucide-react';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    const data = await studentService.getStudentById(id);
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentService.updateStudent(id, formData);
      navigate('/students');
    } catch (err) {
      console.error('Failed to update student', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return <div className="p-8 text-center text-xs text-gray-500 font-bold">Loading student profile...</div>;
  }

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
          <h1 className="font-heading text-2xl font-extrabold text-gray-900">Edit Student Profile</h1>
          <p className="text-xs text-gray-500">Updating credentials & photo for {formData.studentName}</p>
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
                <label className="block font-bold text-gray-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Father's Name</label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  required
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
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
                <label className="block font-bold text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
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

          {/* Section 3: Remarks & Result Status */}
          <div>
            <h3 className="font-heading font-bold text-sm text-maroon mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">
              3. Remarks & Final Evaluation Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Teacher's Remarks</label>
                <input
                  type="text"
                  value={formData.remarks || ''}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Promotion Status</label>
                <select
                  value={formData.resultStatus || 'Promote'}
                  onChange={(e) => setFormData({ ...formData, resultStatus: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon font-bold text-maroon"
                >
                  <option value="Promote">Promote to Next Class</option>
                  <option value="Detained">Detained in Same Class</option>
                  <option value="Term Pending">Term Pending / Incomplete</option>
                </select>
              </div>
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
              disabled={saving}
              className="px-6 py-2.5 bg-maroon text-white font-extrabold rounded-lg text-xs hover:bg-maroon-dark flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default EditStudent;
