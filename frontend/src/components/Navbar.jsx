import React from 'react';
import { UserPlus, Download, LogOut, User } from 'lucide-react';

export const Navbar = ({
  onOpenRegister,
  onExportCSV,
  visitorsCount,
  todayCount,
  inPremisesCount,
  user,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Stats Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Visitor Register
          </h1>

          {/* Simple summary stats */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
              Today: <strong>{todayCount}</strong>
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
              In Premises: <strong>{inPremisesCount}</strong>
            </span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              Total: <strong>{visitorsCount}</strong>
            </span>
          </div>
        </div>

        {/* User Info & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {user && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{user.name}</span>
            </div>
          )}

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Register Visitor</span>
          </button>

          {user && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
