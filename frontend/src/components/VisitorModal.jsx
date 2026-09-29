import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PURPOSES = [
  'Client Meeting',
  'Job Interview',
  'Project Discussion',
  'Delivery / Vendor',
  'Campus / College Visit',
  'Personal Visit',
  'Other',
];

export const VisitorModal = ({ isOpen, onClose, onSave, visitorToEdit }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [personToMeet, setPersonToMeet] = useState('');
  const [purpose, setPurpose] = useState('Client Meeting');
  const [error, setError] = useState('');

  // Prefill or reset
  useEffect(() => {
    if (visitorToEdit) {
      setName(visitorToEdit.name || '');
      setMobile(visitorToEdit.mobile || '');
      setCompany(visitorToEdit.company || '');
      setPersonToMeet(visitorToEdit.personToMeet || '');
      setPurpose(visitorToEdit.purpose || 'Client Meeting');
    } else {
      setName('');
      setMobile('');
      setCompany('');
      setPersonToMeet('');
      setPurpose('Client Meeting');
    }
    setError('');
  }, [visitorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !company.trim() || !personToMeet.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    onSave({
      name: name.trim(),
      mobile: mobile.trim(),
      company: company.trim(),
      personToMeet: personToMeet.trim(),
      purpose,
    });
  };

  const isEdit = Boolean(visitorToEdit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-800">
            {isEdit ? 'Edit Visitor' : 'Register New Visitor'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-sm">
          {error && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Visitor Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company / College Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Infosys / ABC College"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Person to Meet *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anita Roy (Manager)"
              value={personToMeet}
              onChange={(e) => setPersonToMeet(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purpose of Visit *
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PURPOSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              {isEdit ? 'Save Changes' : 'Register Visitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
