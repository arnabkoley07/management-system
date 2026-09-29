import React from 'react';
import { X, Printer, Building2, User, Phone, Calendar, ShieldCheck } from 'lucide-react';
import { formatDateTime, getAvatarColor, getInitials } from '../utils/dateUtils';

export const VisitorPassModal = ({ isOpen, onClose, visitor }) => {
  if (!isOpen || !visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  const id = (visitor._id || visitor.id || '').slice(-6).toUpperCase() || 'PASS-01';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top bar with Close */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Digital Visitor Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Pass Area */}
        <div className="p-6" id="printable-pass">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-gradient-to-b from-white to-slate-50 text-center relative">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-left">
              <div>
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-indigo-600">
                  Visitor Pass
                </h3>
                <p className="text-[10px] text-slate-400">Security Clearance</p>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                #{id}
              </span>
            </div>

            {/* Avatar */}
            <div className="my-3">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-lg font-bold border-2 ${getAvatarColor(
                  visitor.name
                )} shadow-xs`}
              >
                {getInitials(visitor.name)}
              </div>
              <h4 className="mt-2 text-base font-bold text-slate-900">
                {visitor.name}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {visitor.company}
              </p>
            </div>

            {/* Status Pill */}
            <div className="my-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  visitor.status === 'In Premises'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    visitor.status === 'In Premises' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                {visitor.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-left text-xs space-y-2 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <User className="w-3.5 h-3.5" /> Person to Meet:
                </span>
                <span className="font-semibold text-slate-800">{visitor.personToMeet}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="w-3.5 h-3.5" /> Purpose:
                </span>
                <span className="font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                  {visitor.purpose}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <Phone className="w-3.5 h-3.5" /> Mobile:
                </span>
                <span className="font-mono text-slate-800">{visitor.mobile}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> Issued:
                </span>
                <span className="text-[11px] text-slate-700">{formatDateTime(visitor.checkInTime)}</span>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col items-center">
              <div className="h-6 w-48 flex justify-between items-center opacity-70">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-slate-900 h-full ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] text-slate-400 mt-1">AUTHORIZED VISITOR PASS</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
