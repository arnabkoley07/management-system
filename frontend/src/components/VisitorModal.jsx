import React, { useState, useEffect } from 'react';
import { X, User, Phone, Building2, UserCheck, Briefcase, Plus, Save } from 'lucide-react';

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

  // Prefill or reset on open
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

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !company.trim() || !personToMeet.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (mobile.trim().length < 7) {
      setError('Please enter a valid mobile number.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isEdit ? 'Edit Visitor Details' : 'Register New Visitor'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit ? 'Update existing registration record' : 'Check in an incoming guest at reception desk'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Visitor Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company / College */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company / Organization *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Infosys, Freelance, XYZ Tech"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Person To Meet */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Person to Meet (Host) *
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Anita Roy (HR), Tech Lead"
                  value={personToMeet}
                  onChange={(e) => setPersonToMeet(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Purpose of Visit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Purpose of Visit *
            </label>
            <div className="relative mb-2">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
              >
                {PURPOSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick chips for quick selection */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PURPOSES.slice(0, 5).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPurpose(item)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                    purpose === item
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isEdit ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isEdit ? 'Save Changes' : 'Check In Visitor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
