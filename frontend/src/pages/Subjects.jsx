import React, { useState, useEffect } from 'react';
import { subjectService } from '../services/subjectService';
import { Plus, BookOpen, Trash2, Edit, Save, X } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', code: '' });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const data = await subjectService.getSubjects();
    setSubjects(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSubject.name) return;
    await subjectService.addSubject(newSubject);
    setNewSubject({ name: '', code: '' });
    loadSubjects();
  };

  const handleStartEdit = (sub) => {
    setEditingId(sub.id);
    setEditForm({ name: sub.name, code: sub.code || '' });
  };

  const handleSaveEdit = async (id) => {
    await subjectService.updateSubject(id, editForm);
    setEditingId(null);
    loadSubjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete subject from catalog?')) {
      await subjectService.deleteSubject(id);
      loadSubjects();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body pb-10">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-gray-900">Subject Management</h1>
        <p className="text-xs text-gray-500">Configure curriculum subjects included in the annual evaluation table</p>
      </div>

      {/* Add Form */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="font-heading font-bold text-sm text-maroon mb-3 uppercase tracking-wider">
          Add New Curriculum Subject
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap sm:flex-nowrap gap-3 text-xs">
          <input
            type="text"
            required
            placeholder="Subject Name (e.g. ROBOTICS)"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
          <input
            type="text"
            placeholder="Subject Code (e.g. ROB-109)"
            value={newSubject.code}
            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-maroon text-white font-extrabold rounded-lg hover:bg-maroon-dark flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </form>
      </div>

      {/* Subject List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subjects.map((sub) => (
          <div key={sub.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between hover:border-maroon/40 transition-colors">
            {editingId === sub.id ? (
              <div className="flex-1 space-y-2 pr-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                />
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(sub.id)} className="p-1 bg-emerald-600 text-white rounded">
                    <Save className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 bg-gray-400 text-white rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 text-gold-dark font-extrabold flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{sub.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">{sub.code || `SUB-0${sub.id}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(sub)}
                    className="p-1 text-gray-400 hover:text-maroon rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Subjects;
