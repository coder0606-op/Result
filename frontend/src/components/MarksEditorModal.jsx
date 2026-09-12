import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { marksService } from '../services/marksService';

const MarksEditorModal = ({ isOpen, onClose, student, onSaveSuccess }) => {
  const [scholasticMarks, setScholasticMarks] = useState([]);

  useEffect(() => {
    if (student && student.scholastic) {
      setScholasticMarks(JSON.parse(JSON.stringify(student.scholastic)));
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleChange = (idx, field, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    const updated = [...scholasticMarks];
    updated[idx][field] = num;
    setScholasticMarks(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await marksService.updateStudentMarks(student.id, scholasticMarks);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update marks', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-maroon text-white flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg">Scholastic Marks Editor</h3>
            <p className="text-xs text-gold-light font-medium">
              Student: {student.studentName} (Class {student.className}-{student.section}, Roll: {student.rollNumber})
            </p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Max limits: Test (10), Notebook (5), SEA (5), Half Yearly/Yearly Exam (80). Totals calculate automatically!</span>
          </div>

          <div className="space-y-3">
            {scholasticMarks.map((sub, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg space-y-2 hover:border-maroon/40 transition-colors">
                <div className="font-bold text-xs text-maroon uppercase flex items-center justify-between">
                  <span>{sub.subject}</span>
                  <span className="text-[10px] text-gray-500 font-normal">Subject #{idx + 1}</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-600 font-bold mb-1">T1 Per Test (10)</label>
                    <input
                      type="number"
                      max="10"
                      min="0"
                      value={sub.per1 ?? 0}
                      onChange={(e) => handleChange(idx, 'per1', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:border-maroon focus:ring-1 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 font-bold mb-1">T1 Half Yearly (80)</label>
                    <input
                      type="number"
                      max="80"
                      min="0"
                      value={sub.hy1 ?? 0}
                      onChange={(e) => handleChange(idx, 'hy1', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:border-maroon focus:ring-1 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 font-bold mb-1">T2 Per Test (10)</label>
                    <input
                      type="number"
                      max="10"
                      min="0"
                      value={sub.per2 ?? 0}
                      onChange={(e) => handleChange(idx, 'per2', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:border-maroon focus:ring-1 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 font-bold mb-1">T2 Yearly Exam (80)</label>
                    <input
                      type="number"
                      max="80"
                      min="0"
                      value={sub.yr2 ?? 0}
                      onChange={(e) => handleChange(idx, 'yr2', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:border-maroon focus:ring-1 focus:ring-maroon"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-maroon text-white rounded-lg text-xs font-semibold hover:bg-maroon-dark flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Recalculate Totals</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default MarksEditorModal;
